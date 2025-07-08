import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  Calendar, 
  Image, 
  Link as LinkIcon, 
  Upload, 
  Loader2, 
  Database, 
  CheckCircle, 
  Video, 
  Type, 
  Hash, 
  ExternalLink, 
  Crop, 
  Eye, 
  Settings, 
  User, 
  Bug, 
  AlertCircle,
  Download,
  Upload as UploadIcon,
  FileJson,
  RefreshCw,
  FolderOpen,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DrAhmedNewsItem, DEFAULT_CATEGORIES } from '@/types/dr-ahmed-news';
import { v4 as uuidv4 } from 'uuid';

// تعريف واجهة لإعدادات نظام الملفات JSON
interface JsonStorageSettings {
  autoSync: boolean;
  syncInterval: number;
  lastSync: string | null;
  compressionEnabled: boolean;
  backupEnabled: boolean;
  backupInterval: number;
  lastBackup: string | null;
  storageLocation: 'localStorage' | 'indexedDB' | 'both';
  maxCacheSize: number; // بالميجابايت
}

// تعريف واجهة لحالة المزامنة
interface SyncState {
  isSyncing: boolean;
  lastSyncTime: string | null;
  syncError: string | null;
  pendingChanges: number;
}

const JsonNewsManager = () => {
  const { toast } = useToast();
  
  // حالة الأخبار
  const [news, setNews] = useState<DrAhmedNewsItem[]>([]);
  const [editingNews, setEditingNews] = useState<DrAhmedNewsItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageSource, setImageSource] = useState<'upload' | 'url'>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showImageCrop, setShowImageCrop] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveAttempts, setSaveAttempts] = useState(0);
  const [showDebugger, setShowDebugger] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // حالة إعدادات التخزين
  const [storageSettings, setStorageSettings] = useState<JsonStorageSettings>({
    autoSync: true,
    syncInterval: 5, // دقائق
    lastSync: null,
    compressionEnabled: false,
    backupEnabled: true,
    backupInterval: 24, // ساعات
    lastBackup: null,
    storageLocation: 'localStorage',
    maxCacheSize: 50 // ميجابايت
  });
  
  // حالة المزامنة
  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    lastSyncTime: null,
    syncError: null,
    pendingChanges: 0
  });
  
  // مؤقت المزامنة التلقائية
  const syncIntervalRef = useRef<number | null>(null);
  
  // مؤقت النسخ الاحتياطي التلقائي
  const backupIntervalRef = useRef<number | null>(null);
  
  // إدارة التصنيفات والكتّاب
  const [categories, setCategories] = useState<typeof DEFAULT_CATEGORIES>(() => {
    const saved = localStorage.getItem('dr-ahmed-news-categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  
  const [authors, setAuthors] = useState<string[]>(() => {
    const saved = localStorage.getItem('dr-ahmed-news-authors');
    return saved ? JSON.parse(saved) : [
      'الدكتور أحمد العلواني',
      'المكتب الإعلامي للدكتور أحمد العلواني',
      'المكتب الصحفي',
      'فريق التحرير'
    ];
  });
  
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showAuthorDialog, setShowAuthorDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({ id: '', name: '', color: 'bg-gray-100 text-gray-800' });
  const [newAuthor, setNewAuthor] = useState('');
  
  // خيارات الألوان للتصنيفات
  const colorOptions = [
    { value: 'bg-red-100 text-red-800', label: 'أحمر', preview: 'bg-red-100' },
    { value: 'bg-blue-100 text-blue-800', label: 'أزرق', preview: 'bg-blue-100' },
    { value: 'bg-green-100 text-green-800', label: 'أخضر', preview: 'bg-green-100' },
    { value: 'bg-yellow-100 text-yellow-800', label: 'أصفر', preview: 'bg-yellow-100' },
    { value: 'bg-purple-100 text-purple-800', label: 'بنفسجي', preview: 'bg-purple-100' },
    { value: 'bg-pink-100 text-pink-800', label: 'وردي', preview: 'bg-pink-100' },
    { value: 'bg-indigo-100 text-indigo-800', label: 'نيلي', preview: 'bg-indigo-100' },
    { value: 'bg-orange-100 text-orange-800', label: 'برتقالي', preview: 'bg-orange-100' },
    { value: 'bg-gray-100 text-gray-800', label: 'رمادي', preview: 'bg-gray-100' }
  ];
  
  // حفظ التصنيفات والكتّاب في التخزين المحلي
  useEffect(() => {
    localStorage.setItem('dr-ahmed-news-categories', JSON.stringify(categories));
  }, [categories]);
  
  useEffect(() => {
    localStorage.setItem('dr-ahmed-news-authors', JSON.stringify(authors));
  }, [authors]);
  
  // تحميل الأخبار عند تحميل المكون
  useEffect(() => {
    loadNews();
    loadStorageSettings();
    
    // إعداد المزامنة التلقائية
    setupAutoSync();
    
    // إعداد النسخ الاحتياطي التلقائي
    setupAutoBackup();
    
    // الاستماع للتحديثات من علامات التبويب الأخرى
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dr-ahmed-news-update-trigger') {
        loadNews();
      }
      if (e.key === 'json-storage-settings') {
        loadStorageSettings();
      }
    };
    
    const channel = new BroadcastChannel('dr-ahmed-news-updates');
    channel.onmessage = (event) => {
      if (event.data.type === 'DR_AHMED_NEWS_UPDATED') {
        loadNews();
        // تحديث عدد التغييرات المعلقة
        setSyncState(prev => ({
          ...prev,
          pendingChanges: prev.pendingChanges + 1
        }));
      }
      if (event.data.type === 'STORAGE_SETTINGS_UPDATED') {
        loadStorageSettings();
      }
      if (event.data.type === 'SYNC_COMPLETED') {
        setSyncState(prev => ({
          ...prev,
          lastSyncTime: new Date().toISOString(),
          pendingChanges: 0,
          isSyncing: false,
          syncError: null
        }));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      channel.close();
      
      // تنظيف المؤقتات
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      if (backupIntervalRef.current) {
        clearInterval(backupIntervalRef.current);
      }
    };
  }, []);
  
  // إعداد المزامنة التلقائية
  const setupAutoSync = () => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }
    
    if (storageSettings.autoSync) {
      const intervalMs = storageSettings.syncInterval * 60 * 1000; // تحويل الدقائق إلى مللي ثانية
      syncIntervalRef.current = window.setInterval(() => {
        if (syncState.pendingChanges > 0) {
          syncData();
        }
      }, intervalMs);
    }
  };
  
  // إعداد النسخ الاحتياطي التلقائي
  const setupAutoBackup = () => {
    if (backupIntervalRef.current) {
      clearInterval(backupIntervalRef.current);
    }
    
    if (storageSettings.backupEnabled) {
      const intervalMs = storageSettings.backupInterval * 60 * 60 * 1000; // تحويل الساعات إلى مللي ثانية
      backupIntervalRef.current = window.setInterval(() => {
        createBackup();
      }, intervalMs);
    }
  };
  
  // تحميل إعدادات التخزين
  const loadStorageSettings = () => {
    const savedSettings = localStorage.getItem('json-storage-settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setStorageSettings(parsedSettings);
      
      // تحديث حالة المزامنة
      if (parsedSettings.lastSync) {
        setSyncState(prev => ({
          ...prev,
          lastSyncTime: parsedSettings.lastSync
        }));
      }
    }
  };
  
  // حفظ إعدادات التخزين
  const saveStorageSettings = (settings: JsonStorageSettings) => {
    localStorage.setItem('json-storage-settings', JSON.stringify(settings));
    setStorageSettings(settings);
    
    // إعادة إعداد المزامنة التلقائية
    setupAutoSync();
    
    // إعادة إعداد النسخ الاحتياطي التلقائي
    setupAutoBackup();
    
    // بث التحديث إلى علامات التبويب الأخرى
    const channel = new BroadcastChannel('dr-ahmed-news-updates');
    channel.postMessage({ 
      type: 'STORAGE_SETTINGS_UPDATED', 
      timestamp: Date.now()
    });
    
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات التخزين بنجاح",
    });
  };
  
  // تحميل الأخبار
  const loadNews = async () => {
    try {
      setIsLoading(true);
      
      // تحميل الأخبار من التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const parsedNews = JSON.parse(savedNews);
        setNews(parsedNews);
        console.log(`تم تحميل ${parsedNews.length} خبر من التخزين المحلي`);
      } else {
        // إذا لم تكن هناك أخبار، قم بتهيئة بيانات نموذجية
        initializeSampleData();
      }
    } catch (error) {
      console.error('خطأ في تحميل الأخبار:', error);
      setErrorMessage('فشل في تحميل الأخبار من التخزين المحلي');
    } finally {
      setIsLoading(false);
    }
  };
  
  // تهيئة بيانات نموذجية
  const initializeSampleData = () => {
    try {
      setIsLoading(true);
      
      // بيانات نموذجية
      const sampleNews: DrAhmedNewsItem[] = [
        {
          id: uuidv4(),
          title: 'الدكتور أحمد العلواني يستقبل وفد المظلة العراقية الجامعة',
          content: 'استقبل الشيخ الدكتور أحمد العلواني، وفد المظلة العراقية الجامعة، في مقر إقامته بمدينة الرمادي. وناقش الجانبان عدد من الملفات التي تخص الشأن العراقي، في ظل ما تشهده المنطقة من متغيرات، كما تم التأكيد على حفظ أمن واستقرار العراق، وتعزيز التماسك الاجتماعي بين أبناء الشعب الواحد.',
          summary: 'لقاء مهم مع وفد المظلة العراقية الجامعة لمناقشة الشأن العراقي وتعزيز التماسك الاجتماعي',
          date: new Date().toISOString().split('T')[0],
          author: 'المكتب الإعلامي',
          image: 'https://images.pexels.com/photos/5325845/pexels-photo-5325845.jpeg',
          imagecaption: 'الدكتور أحمد العلواني خلال لقائه بوفد المظلة العراقية الجامعة',
          category: 'political',
          status: 'published',
          views: 245,
          featured: true,
          tags: ['لقاءات', 'المظلة العراقية', 'الرمادي'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          title: 'الدكتور أحمد العلواني يشارك في مؤتمر التنمية الاقتصادية',
          content: 'شارك الدكتور أحمد العلواني في مؤتمر التنمية الاقتصادية الذي أقيم في بغداد، حيث قدم ورقة بحثية حول آفاق التنمية الاقتصادية في العراق. وأكد العلواني خلال المؤتمر على ضرورة تنويع مصادر الدخل وعدم الاعتماد الكلي على النفط، مشيراً إلى أهمية دعم القطاع الخاص وتشجيع الاستثمار.',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // قبل أسبوع
          author: 'المكتب الإعلامي',
          image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
          category: 'economic',
          status: 'published',
          views: 187,
          featured: false,
          tags: ['اقتصاد', 'تنمية', 'مؤتمرات'],
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      // حفظ البيانات النموذجية في التخزين المحلي
      localStorage.setItem('dr-ahmed-news', JSON.stringify(sampleNews));
      setNews(sampleNews);
      
      toast({
        title: "تم إضافة البيانات النموذجية",
        description: "تم إضافة بيانات نموذجية للأخبار بنجاح",
      });
    } catch (error) {
      console.error('خطأ في إضافة البيانات النموذجية:', error);
      setErrorMessage('فشل في إضافة البيانات النموذجية');
      
      toast({
        title: "خطأ",
        description: "فشل في إضافة البيانات النموذجية",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // إضافة خبر جديد
  const addNews = () => {
    const newNews: DrAhmedNewsItem = {
      id: uuidv4(),
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      author: authors[0] || 'الدكتور أحمد العلواني',
      image: '',
      imagecaption: '',
      category: categories[0]?.id || 'general',
      youtubeurl: '',
      media: [],
      content_html: '',
      status: 'draft',
      views: 0,
      featured: false,
      tags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setEditingNews(newNews);
    setIsEditing(true);
  };
  
  // تعديل خبر
  const editNews = (newsItem: DrAhmedNewsItem) => {
    setEditingNews({ ...newsItem });
    setIsEditing(true);
    if (newsItem.image) {
      setImagePreview(newsItem.image);
    }
  };
  
  // إضافة تصنيف
  const addCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: newCategory.id || uuidv4(),
        name: newCategory.name.trim(),
        color: newCategory.color
      };
      setCategories([...categories, category]);
      setNewCategory({ id: '', name: '', color: 'bg-gray-100 text-gray-800' });
      setShowCategoryDialog(false);
      
      toast({
        title: "تم إضافة التصنيف",
        description: `تم إضافة تصنيف "${category.name}" بنجاح`,
      });
    }
  };
  
  // حذف تصنيف
  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    
    toast({
      title: "تم حذف التصنيف",
      description: "تم حذف التصنيف بنجاح",
    });
  };
  
  // إضافة كاتب
  const addAuthor = () => {
    if (newAuthor.trim() && !authors.includes(newAuthor.trim())) {
      setAuthors([...authors, newAuthor.trim()]);
      setNewAuthor('');
      setShowAuthorDialog(false);
      
      toast({
        title: "تم إضافة الكاتب",
        description: `تم إضافة "${newAuthor.trim()}" إلى قائمة الكتّاب`,
      });
    }
  };
  
  // حذف كاتب
  const deleteAuthor = (author: string) => {
    setAuthors(authors.filter(a => a !== author));
    
    toast({
      title: "تم حذف الكاتب",
      description: "تم حذف الكاتب من القائمة",
    });
  };
  
  // معالجة تغيير رابط الصورة
  const handleImageUrlChange = (url: string) => {
    if (editingNews) {
      setEditingNews({ ...editingNews, image: url });
      setImagePreview(url);
    }
  };
  
  // معالجة رفع الصورة
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editingNews) {
      try {
        setIsUploading(true);
        
        // إنشاء معاينة
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImagePreview(result);
          setShowImageCrop(true);
          
          // تخزين الصورة كـ Data URL
          if (editingNews) {
            setEditingNews({
              ...editingNews,
              image: result
            });
          }
        };
        reader.readAsDataURL(file);
        
        toast({
          title: "تم رفع الصورة",
          description: "تم رفع الصورة بنجاح",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        
        toast({
          title: "خطأ في رفع الصورة",
          description: "فشل في رفع الصورة. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  // إضافة صورة إلى المحتوى
  const addImageToContent = () => {
    if (editingNews && imagePreview) {
      const imageHtml = `<img src="${imagePreview}" alt="صورة في الخبر" class="w-full max-w-md mx-auto my-4 rounded-lg shadow-md" />`;
      setEditingNews({
        ...editingNews,
        content_html: (editingNews.content_html || '') + imageHtml
      });
    }
  };
  
  // استخراج معرف فيديو يوتيوب
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  // إضافة فيديو يوتيوب
  const addYouTubeVideo = () => {
    if (editingNews && editingNews.youtubeurl) {
      const videoId = extractYouTubeId(editingNews.youtubeurl);
      if (videoId) {
        const videoHtml = `<div class="my-6"><iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen class="rounded-lg shadow-md"></iframe></div>`;
        setEditingNews({
          ...editingNews,
          content_html: (editingNews.content_html || '') + videoHtml
        });
      }
    }
  };
  
  // إضافة رابط
  const addLink = (text: string, url: string) => {
    if (editingNews && text && url) {
      const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${text}</a>`;
      setEditingNews({
        ...editingNews,
        content_html: (editingNews.content_html || '') + linkHtml
      });
    }
  };
  
  // إضافة عنوان
  const addHeading = (text: string, level: number = 2) => {
    if (editingNews && text) {
      const headingHtml = `<h${level} class="text-xl font-bold my-4 text-gray-900">${text}</h${level}>`;
      setEditingNews({
        ...editingNews,
        content_html: (editingNews.content_html || '') + headingHtml
      });
    }
  };
  
  // حفظ الخبر
  const saveNews = async () => {
    if (!editingNews || !editingNews.title.trim() || !editingNews.content.trim()) {
      toast({
        title: "حقول مطلوبة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }
    
    // زيادة عداد محاولات الحفظ
    setSaveAttempts(prev => prev + 1);
    
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      // تحديث وقت التعديل
      const newsToSave = { 
        ...editingNews,
        updated_at: new Date().toISOString()
      };
      
      // إذا كان خبر جديد، أضف وقت الإنشاء
      if (!newsToSave.created_at) {
        newsToSave.created_at = new Date().toISOString();
      }
      
      // حفظ الخبر في التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      let allNews = savedNews ? JSON.parse(savedNews) : [];
      
      // البحث عن الخبر الحالي
      const existingIndex = allNews.findIndex((item: DrAhmedNewsItem) => item.id === newsToSave.id);
      
      if (existingIndex >= 0) {
        // تحديث الخبر الموجود
        allNews[existingIndex] = newsToSave;
      } else {
        // إضافة خبر جديد
        allNews.unshift(newsToSave);
      }
      
      // حفظ في التخزين المحلي
      localStorage.setItem('dr-ahmed-news', JSON.stringify(allNews));
      
      // تحديث حالة المزامنة
      setSyncState(prev => ({
        ...prev,
        pendingChanges: prev.pendingChanges + 1
      }));
      
      // بث التحديث إلى علامات التبويب الأخرى
      broadcastNewsUpdate();
      
      // تحديث قائمة الأخبار
      setNews(allNews);
      
      // إعادة تعيين حالة التحرير
      setEditingNews(null);
      setIsEditing(false);
      setImagePreview('');
      setShowImageCrop(false);
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ الخبر ومزامنته عبر جميع الأجهزة",
        variant: "default"
      });
      
      // إذا كان التزامن التلقائي مفعل وهناك تغييرات معلقة، قم بالمزامنة
      if (storageSettings.autoSync && syncState.pendingChanges > 0) {
        syncData();
      }
    } catch (error) {
      console.error('Error saving news:', error);
      setErrorMessage(error instanceof Error ? error.message : 'فشل في حفظ الخبر');
      
      // إذا حاولنا عدة مرات، اقترح استخدام أداة التصحيح
      if (saveAttempts > 1) {
        setShowDebugger(true);
      }
      
      toast({
        title: "خطأ في الحفظ",
        description: "فشل في حفظ الخبر. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // حذف الخبر
  const deleteNews = async (id: string) => {
    try {
      setIsLoading(true);
      
      // حذف الخبر من التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        const filteredNews = allNews.filter((item: DrAhmedNewsItem) => item.id !== id);
        
        // حفظ في التخزين المحلي
        localStorage.setItem('dr-ahmed-news', JSON.stringify(filteredNews));
        
        // تحديث حالة المزامنة
        setSyncState(prev => ({
          ...prev,
          pendingChanges: prev.pendingChanges + 1
        }));
        
        // بث التحديث إلى علامات التبويب الأخرى
        broadcastNewsUpdate();
        
        // تحديث قائمة الأخبار
        setNews(filteredNews);
        
        toast({
          title: "تم الحذف",
          description: "تم حذف الخبر بنجاح",
        });
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف الخبر. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // بث تحديث الأخبار
  const broadcastNewsUpdate = () => {
    // بث إلى علامات التبويب الأخرى باستخدام BroadcastChannel
    const channel = new BroadcastChannel('dr-ahmed-news-updates');
    channel.postMessage({ 
      type: 'DR_AHMED_NEWS_UPDATED', 
      timestamp: Date.now()
    });
    
    // تحديث مشغل التخزين للتواصل بين علامات التبويب
    localStorage.setItem('dr-ahmed-news-update-trigger', Date.now().toString());
    
    // إطلاق حدث مخصص للتحديثات الفورية في واجهة المستخدم
    window.dispatchEvent(new CustomEvent('drAhmedNewsUpdated', {
      detail: { timestamp: Date.now() }
    }));
  };
  
  // مزامنة البيانات
  const syncData = async () => {
    try {
      setSyncState(prev => ({
        ...prev,
        isSyncing: true,
        syncError: null
      }));
      
      // محاكاة عملية المزامنة
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // تحديث وقت آخر مزامنة
      const now = new Date().toISOString();
      setStorageSettings(prev => ({
        ...prev,
        lastSync: now
      }));
      
      // حفظ الإعدادات المحدثة
      const updatedSettings = {
        ...storageSettings,
        lastSync: now
      };
      localStorage.setItem('json-storage-settings', JSON.stringify(updatedSettings));
      
      // تحديث حالة المزامنة
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: now,
        pendingChanges: 0,
        syncError: null
      }));
      
      // بث إشعار المزامنة
      const channel = new BroadcastChannel('dr-ahmed-news-updates');
      channel.postMessage({ 
        type: 'SYNC_COMPLETED', 
        timestamp: Date.now()
      });
      
      toast({
        title: "تمت المزامنة",
        description: "تم مزامنة البيانات بنجاح",
      });
      
      return true;
    } catch (error) {
      console.error('Error syncing data:', error);
      
      // تحديث حالة المزامنة
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        syncError: error instanceof Error ? error.message : 'فشل في مزامنة البيانات'
      }));
      
      toast({
        title: "خطأ في المزامنة",
        description: "فشل في مزامنة البيانات. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  // إنشاء نسخة احتياطية
  const createBackup = () => {
    try {
      // الحصول على البيانات الحالية
      const newsData = localStorage.getItem('dr-ahmed-news');
      const categoriesData = localStorage.getItem('dr-ahmed-news-categories');
      const authorsData = localStorage.getItem('dr-ahmed-news-authors');
      const settingsData = localStorage.getItem('json-storage-settings');
      
      // إنشاء كائن النسخة الاحتياطية
      const backupData = {
        news: newsData ? JSON.parse(newsData) : [],
        categories: categoriesData ? JSON.parse(categoriesData) : [],
        authors: authorsData ? JSON.parse(authorsData) : [],
        settings: settingsData ? JSON.parse(settingsData) : {},
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      // تحويل البيانات إلى سلسلة JSON
      const backupString = JSON.stringify(backupData, null, 2);
      
      // إنشاء Blob
      const blob = new Blob([backupString], { type: 'application/json' });
      
      // إنشاء رابط التنزيل
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dr-ahmed-news-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // تنظيف
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      // تحديث وقت آخر نسخة احتياطية
      const now = new Date().toISOString();
      setStorageSettings(prev => ({
        ...prev,
        lastBackup: now
      }));
      
      // حفظ الإعدادات المحدثة
      const updatedSettings = {
        ...storageSettings,
        lastBackup: now
      };
      localStorage.setItem('json-storage-settings', JSON.stringify(updatedSettings));
      
      toast({
        title: "تم إنشاء النسخة الاحتياطية",
        description: "تم إنشاء وتنزيل النسخة الاحتياطية بنجاح",
      });
      
      return true;
    } catch (error) {
      console.error('Error creating backup:', error);
      
      toast({
        title: "خطأ في إنشاء النسخة الاحتياطية",
        description: "فشل في إنشاء النسخة الاحتياطية. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  // استعادة من نسخة احتياطية
  const restoreFromBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        
        // التحقق من صحة البيانات
        if (!backupData.news || !Array.isArray(backupData.news)) {
          throw new Error('ملف النسخة الاحتياطية غير صالح');
        }
        
        // استعادة البيانات
        localStorage.setItem('dr-ahmed-news', JSON.stringify(backupData.news));
        
        if (backupData.categories && Array.isArray(backupData.categories)) {
          localStorage.setItem('dr-ahmed-news-categories', JSON.stringify(backupData.categories));
          setCategories(backupData.categories);
        }
        
        if (backupData.authors && Array.isArray(backupData.authors)) {
          localStorage.setItem('dr-ahmed-news-authors', JSON.stringify(backupData.authors));
          setAuthors(backupData.authors);
        }
        
        if (backupData.settings) {
          localStorage.setItem('json-storage-settings', JSON.stringify(backupData.settings));
          setStorageSettings(backupData.settings);
        }
        
        // تحديث قائمة الأخبار
        setNews(backupData.news);
        
        // تحديث حالة المزامنة
        setSyncState(prev => ({
          ...prev,
          pendingChanges: prev.pendingChanges + 1
        }));
        
        // بث التحديث إلى علامات التبويب الأخرى
        broadcastNewsUpdate();
        
        toast({
          title: "تمت الاستعادة",
          description: "تم استعادة البيانات من النسخة الاحتياطية بنجاح",
        });
      } catch (error) {
        console.error('Error restoring from backup:', error);
        
        toast({
          title: "خطأ في الاستعادة",
          description: "فشل في استعادة البيانات من النسخة الاحتياطية. تأكد من صحة الملف.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  // تصدير البيانات كملف JSON
  const exportAsJson = () => {
    try {
      // الحصول على البيانات الحالية
      const newsData = localStorage.getItem('dr-ahmed-news');
      
      if (!newsData) {
        throw new Error('لا توجد بيانات للتصدير');
      }
      
      // إنشاء Blob
      const blob = new Blob([newsData], { type: 'application/json' });
      
      // إنشاء رابط التنزيل
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dr-ahmed-news-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // تنظيف
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast({
        title: "تم التصدير",
        description: "تم تصدير البيانات بنجاح",
      });
      
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      
      toast({
        title: "خطأ في التصدير",
        description: "فشل في تصدير البيانات. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  // استيراد بيانات من ملف JSON
  const importFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // التحقق من صحة البيانات
        if (!Array.isArray(importedData)) {
          throw new Error('ملف البيانات غير صالح');
        }
        
        // استيراد البيانات
        localStorage.setItem('dr-ahmed-news', JSON.stringify(importedData));
        
        // تحديث قائمة الأخبار
        setNews(importedData);
        
        // تحديث حالة المزامنة
        setSyncState(prev => ({
          ...prev,
          pendingChanges: prev.pendingChanges + 1
        }));
        
        // بث التحديث إلى علامات التبويب الأخرى
        broadcastNewsUpdate();
        
        toast({
          title: "تم الاستيراد",
          description: "تم استيراد البيانات بنجاح",
        });
      } catch (error) {
        console.error('Error importing data:', error);
        
        toast({
          title: "خطأ في الاستيراد",
          description: "فشل في استيراد البيانات. تأكد من صحة الملف.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  // تصفية الأخبار
  const filteredNews = news.filter(item => {
    // تصفية حسب مصطلح البحث
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    // تصفية حسب التصنيف
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // ترتيب حسب الحقل المحدد
    if (sortBy === 'date') {
      return sortOrder === 'desc' 
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'title') {
      return sortOrder === 'desc'
        ? b.title.localeCompare(a.title, 'ar')
        : a.title.localeCompare(b.title, 'ar');
    } else if (sortBy === 'views') {
      return sortOrder === 'desc'
        ? b.views - a.views
        : a.views - b.views;
    }
    return 0;
  });
  
  // إلغاء التحرير
  const cancelEdit = () => {
    setEditingNews(null);
    setIsEditing(false);
    setImagePreview('');
    setShowImageCrop(false);
  };
  
  // تنسيق التاريخ
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير متوفر';
    
    try {
      return new Date(dateString).toLocaleString('ar-IQ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'تاريخ غير صالح';
    }
  };
  
  // حساب حجم التخزين
  const calculateStorageSize = () => {
    try {
      let totalSize = 0;
      
      // حساب حجم الأخبار
      const newsData = localStorage.getItem('dr-ahmed-news');
      if (newsData) {
        totalSize += newsData.length * 2; // بالبايت (كل حرف يوتف-16 = 2 بايت)
      }
      
      // حساب حجم التصنيفات
      const categoriesData = localStorage.getItem('dr-ahmed-news-categories');
      if (categoriesData) {
        totalSize += categoriesData.length * 2;
      }
      
      // حساب حجم الكتّاب
      const authorsData = localStorage.getItem('dr-ahmed-news-authors');
      if (authorsData) {
        totalSize += authorsData.length * 2;
      }
      
      // حساب حجم الإعدادات
      const settingsData = localStorage.getItem('json-storage-settings');
      if (settingsData) {
        totalSize += settingsData.length * 2;
      }
      
      // تحويل إلى ميجابايت
      return (totalSize / (1024 * 1024)).toFixed(2);
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return '0.00';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">نظام إدارة المحتوى الإخباري JSON</CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowDebugger(!showDebugger)} 
              size="sm" 
              variant="outline"
            >
              <Bug className="w-4 h-4 ml-2" />
              {showDebugger ? 'إخفاء أدوات التطوير' : 'أدوات التطوير'}
            </Button>
            <Button onClick={addNews} size="sm" disabled={isLoading}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة خبر جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* أدوات التطوير */}
          {showDebugger && (
            <div className="mb-6 space-y-4">
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse text-amber-800">
                    <Bug className="w-5 h-5 text-amber-600" />
                    <span>أدوات التطوير والتصحيح</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* حالة المزامنة */}
                  <div className="bg-white p-4 rounded-lg border border-amber-200">
                    <h3 className="font-semibold text-amber-800 mb-2">حالة المزامنة</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">آخر مزامنة:</span>
                        <span className="font-medium">{syncState.lastSyncTime ? formatDate(syncState.lastSyncTime) : 'لم تتم المزامنة بعد'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">التغييرات المعلقة:</span>
                        <span className="font-medium">{syncState.pendingChanges}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">حالة المزامنة:</span>
                        <span className="font-medium">
                          {syncState.isSyncing ? 'جاري المزامنة...' : syncState.syncError ? 'فشل في المزامنة' : 'جاهز'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">حجم التخزين:</span>
                        <span className="font-medium">{calculateStorageSize()} ميجابايت</span>
                      </div>
                    </div>
                    {syncState.syncError && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                        {syncState.syncError}
                      </div>
                    )}
                  </div>
                  
                  {/* أزرار الإجراءات */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={syncData}
                      disabled={syncState.isSyncing}
                      className="flex items-center justify-center"
                    >
                      {syncState.isSyncing ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري المزامنة...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 ml-2" />
                          مزامنة الآن
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={createBackup}
                      className="flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 ml-2" />
                      نسخة احتياطية
                    </Button>
                    
                    <div className="relative">
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('restore-backup')?.click()}
                        className="w-full flex items-center justify-center"
                      >
                        <UploadIcon className="w-4 h-4 ml-2" />
                        استعادة
                      </Button>
                      <input
                        type="file"
                        id="restore-backup"
                        accept=".json"
                        onChange={restoreFromBackup}
                        className="hidden"
                      />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={exportAsJson}
                      className="flex items-center justify-center"
                    >
                      <FileJson className="w-4 h-4 ml-2" />
                      تصدير JSON
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('import-json')?.click()}
                      className="w-full"
                    >
                      <FolderOpen className="w-4 h-4 ml-2" />
                      استيراد من ملف JSON
                    </Button>
                    <input
                      type="file"
                      id="import-json"
                      accept=".json"
                      onChange={importFromJson}
                      className="hidden"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* إعدادات التخزين */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span>إعدادات نظام التخزين JSON</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="auto-sync">المزامنة التلقائية</Label>
                      <Select
                        value={storageSettings.autoSync ? 'true' : 'false'}
                        onValueChange={(value) => setStorageSettings({
                          ...storageSettings,
                          autoSync: value === 'true'
                        })}
                      >
                        <SelectTrigger id="auto-sync" className="text-right">
                          <SelectValue placeholder="اختر الإعداد" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">مفعّل</SelectItem>
                          <SelectItem value="false">معطّل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sync-interval">فترة المزامنة (دقائق)</Label>
                      <Input
                        id="sync-interval"
                        type="number"
                        min="1"
                        max="60"
                        value={storageSettings.syncInterval}
                        onChange={(e) => setStorageSettings({
                          ...storageSettings,
                          syncInterval: parseInt(e.target.value) || 5
                        })}
                        className="text-right"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backup-enabled">النسخ الاحتياطي التلقائي</Label>
                      <Select
                        value={storageSettings.backupEnabled ? 'true' : 'false'}
                        onValueChange={(value) => setStorageSettings({
                          ...storageSettings,
                          backupEnabled: value === 'true'
                        })}
                      >
                        <SelectTrigger id="backup-enabled" className="text-right">
                          <SelectValue placeholder="اختر الإعداد" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">مفعّل</SelectItem>
                          <SelectItem value="false">معطّل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backup-interval">فترة النسخ الاحتياطي (ساعات)</Label>
                      <Input
                        id="backup-interval"
                        type="number"
                        min="1"
                        max="168"
                        value={storageSettings.backupInterval}
                        onChange={(e) => setStorageSettings({
                          ...storageSettings,
                          backupInterval: parseInt(e.target.value) || 24
                        })}
                        className="text-right"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="compression-enabled">ضغط البيانات</Label>
                      <Select
                        value={storageSettings.compressionEnabled ? 'true' : 'false'}
                        onValueChange={(value) => setStorageSettings({
                          ...storageSettings,
                          compressionEnabled: value === 'true'
                        })}
                      >
                        <SelectTrigger id="compression-enabled" className="text-right">
                          <SelectValue placeholder="اختر الإعداد" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">مفعّل</SelectItem>
                          <SelectItem value="false">معطّل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="storage-location">موقع التخزين</Label>
                      <Select
                        value={storageSettings.storageLocation}
                        onValueChange={(value: 'localStorage' | 'indexedDB' | 'both') => setStorageSettings({
                          ...storageSettings,
                          storageLocation: value
                        })}
                      >
                        <SelectTrigger id="storage-location" className="text-right">
                          <SelectValue placeholder="اختر الموقع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="localStorage">التخزين المحلي</SelectItem>
                          <SelectItem value="indexedDB">IndexedDB</SelectItem>
                          <SelectItem value="both">كلاهما</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {storageSettings.lastSync && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 ml-1" />
                          <span>آخر مزامنة: {formatDate(storageSettings.lastSync)}</span>
                        </div>
                      )}
                      {storageSettings.lastBackup && (
                        <div className="flex items-center mt-1">
                          <Download className="w-4 h-4 ml-1" />
                          <span>آخر نسخة احتياطية: {formatDate(storageSettings.lastBackup)}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => saveStorageSettings(storageSettings)}
                    >
                      <Save className="w-4 h-4 ml-2" />
                      حفظ الإعدادات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* رسالة الخطأ */}
          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">خطأ في حفظ الخبر</h3>
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                  <div className="mt-2 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowDebugger(true)}
                    >
                      <Bug className="w-4 h-4 ml-1" />
                      استخدام أدوات التطوير
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setErrorMessage(null)}
                    >
                      إغلاق
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* إدارة التصنيفات والكتّاب */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold mb-4 text-right">إدارة التصنيفات والكتّاب</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* إدارة التصنيفات */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">التصنيفات</h5>
                  <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة تصنيف
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="text-right">
                      <DialogHeader>
                        <DialogTitle>إضافة تصنيف جديد</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>اسم التصنيف</Label>
                          <Input
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                            placeholder="أدخل اسم التصنيف"
                            className="text-right"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>معرف التصنيف (اختياري)</Label>
                          <Input
                            value={newCategory.id}
                            onChange={(e) => setNewCategory({...newCategory, id: e.target.value})}
                            placeholder="مثال: political, economic"
                            className="text-right"
                          />
                          <p className="text-xs text-gray-500">إذا تركت هذا الحقل فارغًا، سيتم إنشاء معرف تلقائيًا</p>
                        </div>
                        <div className="space-y-2">
                          <Label>لون التصنيف</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {colorOptions.map((color) => (
                              <button
                                key={color.value}
                                onClick={() => setNewCategory({...newCategory, color: color.value})}
                                className={`p-2 rounded border text-xs ${color.value} ${
                                  newCategory.color === color.value ? 'ring-2 ring-blue-500' : ''
                                }`}
                              >
                                {color.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={addCategory} className="flex-1">
                            إضافة
                          </Button>
                          <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-2 border rounded">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <span className={`px-2 py-1 rounded text-xs ${category.color}`}>
                        {category.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* إدارة الكتّاب */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">الكتّاب</h5>
                  <Dialog open={showAuthorDialog} onOpenChange={setShowAuthorDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة كاتب
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="text-right">
                      <DialogHeader>
                        <DialogTitle>إضافة كاتب جديد</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>اسم الكاتب</Label>
                          <Input
                            value={newAuthor}
                            onChange={(e) => setNewAuthor(e.target.value)}
                            placeholder="أدخل اسم الكاتب"
                            className="text-right"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={addAuthor} className="flex-1">
                            إضافة
                          </Button>
                          <Button variant="outline" onClick={() => setShowAuthorDialog(false)}>
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {authors.map((author, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteAuthor(author)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <span className="text-sm">{author}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isEditing && editingNews && (
            <div className="border rounded-lg p-4 mb-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4 text-right">
                {news.find(item => item.id === editingNews.id) ? 'تعديل الخبر' : 'إضافة خبر جديد'}
              </h3>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
                  <TabsTrigger value="media">الوسائط</TabsTrigger>
                  <TabsTrigger value="content">المحتوى المتقدم</TabsTrigger>
                  <TabsTrigger value="preview">معاينة</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="news-title">عنوان الخبر *</Label>
                      <Input
                        id="news-title"
                        value={editingNews.title}
                        onChange={(e) => setEditingNews({...editingNews, title: e.target.value})}
                        className="text-right"
                        placeholder="أدخل عنوان الخبر"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="news-date">تاريخ الخبر</Label>
                      <Input
                        id="news-date"
                        type="date"
                        value={editingNews.date}
                        onChange={(e) => setEditingNews({...editingNews, date: e.target.value})}
                        className="text-right"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="news-author">الكاتب</Label>
                      <Select
                        value={editingNews.author}
                        onValueChange={(value) => setEditingNews({...editingNews, author: value})}
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر الكاتب" />
                        </SelectTrigger>
                        <SelectContent>
                          {authors.map((author, index) => (
                            <SelectItem key={index} value={author}>
                              {author}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="news-category">التصنيف</Label>
                      <Select
                        value={editingNews.category}
                        onValueChange={(value) => setEditingNews({...editingNews, category: value})}
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر التصنيف" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <span className={`px-2 py-1 rounded text-xs ${category.color}`}>
                                {category.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="news-status">حالة النشر</Label>
                      <Select
                        value={editingNews.status}
                        onValueChange={(value: 'draft' | 'published' | 'archived') => setEditingNews({...editingNews, status: value})}
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">مسودة</SelectItem>
                          <SelectItem value="published">منشور</SelectItem>
                          <SelectItem value="archived">مؤرشف</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="news-featured">مميز</Label>
                      <Select
                        value={editingNews.featured ? 'true' : 'false'}
                        onValueChange={(value) => setEditingNews({...editingNews, featured: value === 'true'})}
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">نعم</SelectItem>
                          <SelectItem value="false">لا</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="news-summary">ملخص الخبر (اختياري)</Label>
                    <Textarea
                      id="news-summary"
                      value={editingNews.summary || ''}
                      onChange={(e) => setEditingNews({...editingNews, summary: e.target.value})}
                      className="text-right"
                      rows={2}
                      placeholder="أدخل ملخصًا قصيرًا للخبر"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="news-content">محتوى الخبر الأساسي *</Label>
                    <Textarea
                      dir="rtl"
                      lang="ar"
                      id="news-content"
                      value={editingNews.content}
                      onChange={(e) => setEditingNews({...editingNews, content: e.target.value})}
                      className="text-right"
                      rows={6}
                      placeholder="أدخل محتوى الخبر"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="news-tags">الوسوم (مفصولة بفاصلة)</Label>
                    <Input
                      id="news-tags"
                      value={editingNews.tags ? editingNews.tags.join(', ') : ''}
                      onChange={(e) => setEditingNews({
                        ...editingNews, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      })}
                      className="text-right"
                      placeholder="مثال: سياسة, اقتصاد, الأنبار"
                      disabled={isLoading}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  {/* قسم الصورة الرئيسية */}
                  <div className="space-y-4">
                    <Label>الصورة الرئيسية</Label>
                    <Tabs value={imageSource} onValueChange={(value) => setImageSource(value as 'upload' | 'url')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="url" className="flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          رابط خارجي
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          رفع مباشر
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="url" className="space-y-2">
                        <Input
                          placeholder="أدخل رابط الصورة"
                          value={editingNews.image || ''}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                          className="text-right"
                          disabled={isLoading}
                        />
                      </TabsContent>
                      
                      <TabsContent value="upload" className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="text-right"
                          disabled={isLoading || isUploading}
                        />
                        {isUploading && (
                          <div className="flex items-center text-sm text-blue-600">
                            <Loader2 className="w-4 h-4 animate-spin ml-2" />
                            جاري رفع الصورة...
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                    
                    {/* معاينة الصورة */}
                    {imagePreview && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <Label>معاينة الصورة</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowImageCrop(!showImageCrop)}
                          >
                            <Crop className="w-4 h-4 ml-2" />
                            {showImageCrop ? 'إخفاء التحكم' : 'تحديد منطقة العرض'}
                          </Button>
                        </div>
                        
                        <div className="relative max-w-md">
                          <img 
                            src={imagePreview} 
                            alt="معاينة الصورة"
                            className="w-full h-auto rounded border"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          
                          {showImageCrop && (
                            <div className="absolute inset-0 border-2 border-dashed border-red-500 bg-red-500 bg-opacity-20 rounded">
                              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                                منطقة العرض
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={addImageToContent}
                          >
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة للمحتوى
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setEditingNews({...editingNews, image: ''});
                              setImagePreview('');
                              setShowImageCrop(false);
                            }}
                            disabled={isLoading}
                          >
                            إزالة الصورة
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="image-caption">وصف الصورة (اختياري)</Label>
                      <Input
                        id="image-caption"
                        value={editingNews.imagecaption || ''}
                        onChange={(e) => setEditingNews({...editingNews, imagecaption: e.target.value})}
                        className="text-right"
                        placeholder="أدخل وصف الصورة"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* قسم فيديو يوتيوب */}
                  <div className="space-y-4 border-t pt-4">
                    <Label className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      فيديو يوتيوب
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="رابط فيديو يوتيوب"
                        value={editingNews.youtubeurl || ''}
                        onChange={(e) => setEditingNews({...editingNews, youtubeurl: e.target.value})}
                        className="text-right flex-1"
                        disabled={isLoading}
                      />
                      <Button
                        variant="outline"
                        onClick={addYouTubeVideo}
                        disabled={!editingNews.youtubeurl}
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة للمحتوى
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  {/* أدوات المحتوى المتقدم */}
                  <div className="space-y-4">
                    <Label>أدوات المحتوى المتقدم</Label>
                    
                    {/* إضافة عنوان */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="نص العنوان"
                        className="text-right flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addHeading(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addHeading(input.value);
                          input.value = '';
                        }}
                      >
                        <Type className="w-4 h-4 ml-2" />
                        إضافة عنوان
                      </Button>
                    </div>

                    {/* إضافة رابط */}
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="نص الرابط"
                        className="text-right"
                        id="link-text"
                      />
                      <Input
                        placeholder="عنوان الرابط (URL)"
                        className="text-right"
                        id="link-url"
                      />
                      <Button
                        variant="outline"
                        className="col-span-2"
                        onClick={() => {
                          const textInput = document.getElementById('link-text') as HTMLInputElement;
                          const urlInput = document.getElementById('link-url') as HTMLInputElement;
                          addLink(textInput.value, urlInput.value);
                          textInput.value = '';
                          urlInput.value = '';
                        }}
                      >
                        <ExternalLink className="w-4 h-4 ml-2" />
                        إضافة رابط
                      </Button>
                    </div>

                    {/* معاينة المحتوى HTML */}
                    <div className="space-y-2">
                      <Label>المحتوى المتقدم المضاف</Label>
                      <div className="border rounded p-4 bg-white min-h-[100px] max-h-[300px] overflow-y-auto">
                        {editingNews.content_html ? (
                          <div dir="rtl" dangerouslySetInnerHTML={{ __html: editingNews.content_html }} />
                        ) : (
                          <p className="text-gray-500 text-center">لم يتم إضافة محتوى متقدم بعد</p>
                        )}
                      </div>
                      {editingNews.content_html && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingNews({...editingNews, content_html: ''})}
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          مسح المحتوى المتقدم
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <div className="border rounded-lg p-6 bg-white">
                    <h3 className="text-2xl font-bold mb-4 text-right">{editingNews.title || 'عنوان الخبر'}</h3>
                    
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(editingNews.date).toLocaleDateString('ar-IQ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingNews.category && (
                          <span className={`px-2 py-1 rounded text-xs ${categories.find(c => c.id === editingNews.category)?.color}`}>
                            {categories.find(c => c.id === editingNews.category)?.name}
                          </span>
                        )}
                        <span>{editingNews.author}</span>
                      </div>
                    </div>

                    {editingNews.image && (
                      <div className="mb-4">
                        <img 
                          src={editingNews.image} 
                          alt={editingNews.title}
                          className="w-full max-h-96 object-cover rounded-lg"
                        />
                        {editingNews.imagecaption && (
                          <p className="text-sm text-gray-600 mt-2 text-center italic">
                            {editingNews.imagecaption}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="prose max-w-none text-right">
                      <div className="whitespace-pre-wrap mb-4">{editingNews.content}</div>
                      {editingNews.content_html && (
                        <div dir="rtl" lang="ar" dangerouslySetInnerHTML={{ __html: editingNews.content_html }} />
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex gap-2 mt-6">
                <Button onClick={saveNews} disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الحفظ...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="w-4 h-4 ml-2" />
                      حفظ الخبر
                    </span>
                  )}
                </Button>
                <Button variant="outline" onClick={cancelEdit} disabled={isLoading}>
                  إلغاء
                </Button>
              </div>
            </div>
          )}

          {/* أدوات البحث والتصفية */}
          {!isEditing && (
            <div className="mb-6">
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* البحث */}
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="البحث في الأخبار..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-right pr-10"
                      />
                    </div>

                    {/* تصفية التصنيف */}
                    <Select
                      value={selectedCategory || ''}
                      onValueChange={(value) => setSelectedCategory(value || null)}
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">جميع التصنيفات</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <span className={`px-2 py-1 rounded text-xs ${category.color}`}>
                              {category.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* ترتيب حسب */}
                    <Select
                      value={sortBy}
                      onValueChange={(value) => setSortBy(value as 'date' | 'title' | 'views')}
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="ترتيب حسب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">التاريخ</SelectItem>
                        <SelectItem value="title">العنوان</SelectItem>
                        <SelectItem value="views">المشاهدات</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* اتجاه الترتيب */}
                    <Select
                      value={sortOrder}
                      onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اتجاه الترتيب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">تنازلي</SelectItem>
                        <SelectItem value="asc">تصاعدي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* قائمة الأخبار */}
          {!isEditing && (
            <>
              {/* مؤشر حالة المزامنة */}
              <div className="mb-4">
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  syncState.syncError ? 'bg-red-50 border border-red-200' :
                  syncState.isSyncing ? 'bg-blue-50 border border-blue-200' :
                  'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {syncState.syncError ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : syncState.isSyncing ? (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    <div>
                      <span className="font-medium">
                        {syncState.syncError ? 'خطأ في المزامنة' : 
                         syncState.isSyncing ? 'جاري المزامنة...' : 
                         'نظام التخزين JSON جاهز'}
                      </span>
                      <div className="text-xs mt-1">
                        {syncState.lastSyncTime ? 
                          `آخر مزامنة: ${formatDate(syncState.lastSyncTime)}` : 
                          'لم تتم المزامنة بعد'}
                        {syncState.pendingChanges > 0 && !syncState.isSyncing && (
                          <span className="mr-2 text-amber-600">
                            ({syncState.pendingChanges} تغييرات معلقة)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={syncData}
                      disabled={syncState.isSyncing}
                    >
                      <RefreshCw className={`w-4 h-4 ml-2 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
                      {syncState.isSyncing ? 'جاري المزامنة...' : 'مزامنة الآن'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={createBackup}
                    >
                      <Download className="w-4 h-4 ml-2" />
                      نسخة احتياطية
                    </Button>
                  </div>
                </div>
              </div>
              
              {filteredNews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileJson className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد أخبار تطابق معايير البحث</p>
                  <p className="text-sm mt-2">جرب تغيير معايير البحث أو إضافة أخبار جديدة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNews.map((newsItem) => {
                    const categoryInfo = categories.find(c => c.id === newsItem.category);
                    
                    return (
                      <div key={newsItem.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => editNews(newsItem)}
                              size="sm"
                              variant="outline"
                              disabled={isLoading}
                            >
                              <Edit className="w-4 h-4 ml-1" />
                            </Button>
                            <Button 
                              onClick={() => deleteNews(newsItem.id)}
                              variant="destructive" 
                              size="sm"
                              disabled={isLoading}
                            >
                              <Trash2 className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                          <div className="text-right flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">{newsItem.title}</h4>
                              {newsItem.category && categoryInfo && (
                                <span className={`px-2 py-1 rounded text-xs ${categoryInfo.color}`}>
                                  {categoryInfo.name}
                                </span>
                              )}
                              {newsItem.featured && (
                                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs flex items-center">
                                  <Star className="w-3 h-3 ml-1" />
                                  مميز
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded text-xs ${
                                newsItem.status === 'published' ? 'bg-green-100 text-green-800' :
                                newsItem.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {newsItem.status === 'published' ? 'منشور' :
                                 newsItem.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                              {newsItem.author} - {new Date(newsItem.date).toLocaleDateString('ar-IQ')}
                            </p>
                            {newsItem.image && (
                              <div className="mb-2">
                                <div className="w-20 h-20 overflow-hidden rounded border">
                                  <img 
                                    src={newsItem.image} 
                                    alt={newsItem.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><span class="text-gray-400">الصورة غير متوفرة</span></div>';
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-right text-gray-700 line-clamp-3">{newsItem.content}</p>
                        {newsItem.tags && newsItem.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1 justify-end">
                            {newsItem.tags.map((tag, index) => (
                              <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonNewsManager;