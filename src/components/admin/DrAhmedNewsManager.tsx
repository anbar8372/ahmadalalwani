import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  Calendar, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Upload, 
  Loader2, 
  CheckCircle, 
  Video, 
  Type, 
  Hash, 
  ExternalLink, 
  Crop, 
  Eye, 
  Settings, 
  User, 
  AlertCircle,
  FileText,
  Star,
  Clock,
  Tag,
  Search,
  RefreshCw,
  ArrowUpDown,
  Filter,
  MoreHorizontal,
  Copy,
  Paperclip,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  ImageOff,
  Palette,
  FileImage,
  Maximize2,
  Minimize2,
  RotateCw,
  Layers
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

// تعريف واجهة بيانات الخبر
interface DrAhmedNewsItem {
  id: string;
  title: string;
  content: string;
  content_html?: string;
  summary?: string;
  date: string;
  author: string;
  image?: string;
  imagecaption?: string;
  category?: string;
  youtubeurl?: string;
  media?: MediaItem[];
  status: 'draft' | 'published' | 'archived';
  views: number;
  featured: boolean;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

// واجهة عنصر الوسائط
interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'file';
  url: string;
  caption?: string;
  thumbnail?: string;
  size?: number;
  order: number;
}

// واجهة التصنيف
interface Category {
  id: string;
  name: string;
  color: string;
}

// واجهة الوسم
interface Tag {
  id: string;
  name: string;
}

// خدمة إدارة أخبار الدكتور أحمد
const drAhmedNewsService = {
  // الحصول على جميع الأخبار
  async getAllNews(): Promise<DrAhmedNewsItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('dr_ahmed_news')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
      }
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        return JSON.parse(savedNews);
      }
      
      return [];
    } catch (error) {
      console.error('خطأ في تحميل أخبار الدكتور أحمد:', error);
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        return JSON.parse(savedNews);
      }
      
      return [];
    }
  },

  // الحصول على خبر بواسطة المعرف
  async getNewsById(id: string): Promise<DrAhmedNewsItem | null> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('dr_ahmed_news')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      }
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews.find((item: DrAhmedNewsItem) => item.id === id) || null;
      }
      
      return null;
    } catch (error) {
      console.error('خطأ في تحميل خبر الدكتور أحمد:', error);
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews.find((item: DrAhmedNewsItem) => item.id === id) || null;
      }
      
      return null;
    }
  },

  // حفظ أو تحديث خبر
  async upsertNews(newsItem: DrAhmedNewsItem): Promise<DrAhmedNewsItem> {
    try {
      // حفظ في التخزين المحلي أولاً
      const savedNews = localStorage.getItem('dr-ahmed-news');
      let allNews = savedNews ? JSON.parse(savedNews) : [];

      // تحديث أو إضافة الخبر
      const existingIndex = allNews.findIndex((item: DrAhmedNewsItem) => item.id === newsItem.id);
      const updatedItem = {
        ...newsItem,
        created_at: existingIndex >= 0 && allNews[existingIndex].created_at 
          ? allNews[existingIndex].created_at 
          : new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        allNews[existingIndex] = { ...allNews[existingIndex], ...updatedItem };
      } else {
        allNews.unshift(updatedItem);
      }

      // حفظ في التخزين المحلي
      localStorage.setItem('dr-ahmed-news', JSON.stringify(allNews));

      // محاولة الحفظ في Supabase إذا كان متاحاً
      if (supabase) {
        const { data, error } = await supabase
          .from('dr_ahmed_news')
          .upsert(updatedItem)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
      
      return updatedItem;
    } catch (error) {
      console.error('خطأ في حفظ خبر الدكتور أحمد:', error);
      throw error;
    }
  },

  // حذف خبر
  async deleteNews(id: string): Promise<void> {
    try {
      // حذف من التخزين المحلي أولاً
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        const filteredNews = allNews.filter((item: DrAhmedNewsItem) => item.id !== id);
        localStorage.setItem('dr-ahmed-news', JSON.stringify(filteredNews));
      }

      // محاولة الحذف من Supabase إذا كان متاحاً
      if (supabase) {
        const { error } = await supabase
          .from('dr_ahmed_news')
          .delete()
          .eq('id', id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('خطأ في حذف خبر الدكتور أحمد:', error);
      throw error;
    }
  },

  // رفع صورة
  async uploadImage(file: File, fileName: string): Promise<string> {
    try {
      if (!supabase) {
        throw new Error('Supabase غير متاح');
      }
      
      const { data, error } = await supabase.storage
        .from('dr-ahmed-news-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('dr-ahmed-news-media')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('خطأ في رفع الصورة:', error);
      
      // الاحتياط باستخدام URL محلي
      return URL.createObjectURL(file);
    }
  },

  // رفع ملف وسائط
  async uploadMedia(file: File, fileName: string, type: 'image' | 'video' | 'file'): Promise<MediaItem> {
    try {
      if (!supabase) {
        throw new Error('Supabase غير متاح');
      }
      
      const { data, error } = await supabase.storage
        .from('dr-ahmed-news-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('dr-ahmed-news-media')
        .getPublicUrl(data.path);

      // إنشاء عنصر وسائط جديد
      const newMediaItem: MediaItem = {
        id: crypto.randomUUID(),
        type,
        url: publicUrl,
        caption: '',
        size: file.size,
        order: Date.now()
      };

      // إذا كان الملف فيديو، إنشاء صورة مصغرة
      if (type === 'video') {
        newMediaItem.thumbnail = ''; // يمكن إضافة منطق لإنشاء صورة مصغرة للفيديو
      }

      return newMediaItem;
    } catch (error) {
      console.error('خطأ في رفع الوسائط:', error);
      
      // الاحتياط باستخدام URL محلي
      return {
        id: crypto.randomUUID(),
        type,
        url: URL.createObjectURL(file),
        size: file.size,
        order: Date.now()
      };
    }
  },

  // حذف ملف وسائط
  async deleteMedia(url: string): Promise<void> {
    try {
      if (!supabase || !url) return;
      
      const path = url.split('/').pop();
      
      if (path) {
        const { error } = await supabase.storage
          .from('dr-ahmed-news-media')
          .remove([path]);

        if (error) throw error;
      }
    } catch (error) {
      console.error('خطأ في حذف الوسائط:', error);
    }
  },

  // زيادة عدد المشاهدات
  async incrementViews(id: string): Promise<void> {
    try {
      if (supabase) {
        const { error } = await supabase.rpc('increment_dr_ahmed_news_views', { news_id: id });
        if (error) throw error;
      }
    } catch (error) {
      console.error('خطأ في زيادة عدد المشاهدات:', error);
    }
  },

  // البحث في الأخبار
  async searchNews(query: string): Promise<DrAhmedNewsItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('dr_ahmed_news')
          .select('*')
          .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
          .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
      }
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews.filter((item: DrAhmedNewsItem) => 
          item.title.toLowerCase().includes(query.toLowerCase()) || 
          item.content.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      return [];
    } catch (error) {
      console.error('خطأ في البحث عن أخبار الدكتور أحمد:', error);
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews.filter((item: DrAhmedNewsItem) => 
          item.title.toLowerCase().includes(query.toLowerCase()) || 
          item.content.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      return [];
    }
  }
};

// مكون إدارة أخبار الدكتور أحمد
const DrAhmedNewsManager = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<DrAhmedNewsItem[]>([]);
  const [editingNews, setEditingNews] = useState<DrAhmedNewsItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showImageCrop, setShowImageCrop] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNews, setFilteredNews] = useState<DrAhmedNewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const newsPerPage = 10;

  // التصنيفات الافتراضية
  const [categories, setCategories] = useState<Category[]>([
    { id: 'political', name: 'سياسي', color: 'bg-red-100 text-red-800' },
    { id: 'economic', name: 'اقتصادي', color: 'bg-blue-100 text-blue-800' },
    { id: 'social', name: 'اجتماعي', color: 'bg-green-100 text-green-800' },
    { id: 'cultural', name: 'ثقافي', color: 'bg-purple-100 text-purple-800' },
    { id: 'educational', name: 'تعليمي', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'general', name: 'عام', color: 'bg-gray-100 text-gray-800' }
  ]);

  // الوسوم الافتراضية
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', name: 'مهم' },
    { id: '2', name: 'عاجل' },
    { id: '3', name: 'حصري' },
    { id: '4', name: 'تحليل' },
    { id: '5', name: 'رأي' }
  ]);

  // المؤلفون الافتراضيون
  const [authors, setAuthors] = useState<string[]>([
    'الدكتور أحمد العلواني',
    'المكتب الإعلامي للدكتور أحمد العلواني',
    'المكتب الصحفي',
    'فريق التحرير'
  ]);

  // حالات النشر
  const statusOptions = [
    { id: 'draft', name: 'مسودة', color: 'bg-gray-100 text-gray-800' },
    { id: 'published', name: 'منشور', color: 'bg-green-100 text-green-800' },
    { id: 'archived', name: 'مؤرشف', color: 'bg-amber-100 text-amber-800' }
  ];

  // تحميل الأخبار عند تحميل المكون
  useEffect(() => {
    loadNews();
  }, []);

  // تصفية الأخبار عند تغيير معايير البحث
  useEffect(() => {
    filterNews();
  }, [news, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  // تحميل الأخبار
  const loadNews = async () => {
    try {
      setIsLoading(true);
      const newsData = await drAhmedNewsService.getAllNews();
      setNews(newsData);
    } catch (error) {
      console.error('خطأ في تحميل أخبار الدكتور أحمد:', error);
      toast({
        title: "تحذير",
        description: "تم تحميل الأخبار من التخزين المحلي",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // تصفية الأخبار
  const filterNews = () => {
    let filtered = [...news];

    // تصفية حسب مصطلح البحث
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // تصفية حسب التصنيف
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // تصفية حسب الحالة
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    // ترتيب
    filtered.sort((a, b) => {
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

    setFilteredNews(filtered);
    setCurrentPage(1);
  };

  // إضافة خبر جديد
  const addNews = () => {
    const newNews: DrAhmedNewsItem = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      content_html: '',
      summary: '',
      date: new Date().toISOString().split('T')[0],
      author: authors[0] || 'الدكتور أحمد العلواني',
      image: '',
      imagecaption: '',
      category: categories[0]?.id || 'general',
      youtubeurl: '',
      media: [],
      status: 'draft',
      views: 0,
      featured: false,
      tags: []
    };
    setEditingNews(newNews);
    setIsEditing(true);
    setIsFullscreen(false);
  };

  // تحرير خبر
  const editNews = (newsItem: DrAhmedNewsItem) => {
    setEditingNews({ ...newsItem });
    setIsEditing(true);
    setIsFullscreen(false);
    if (newsItem.image) {
      setImagePreview(newsItem.image);
    }
  };

  // معالجة رفع الصورة
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        };
        reader.readAsDataURL(file);
        
        // إنشاء اسم ملف فريد
        const fileExtension = file.name.split('.').pop();
        const fileName = `dr-ahmed-${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        
        // رفع إلى Supabase Storage
        const imageUrl = await drAhmedNewsService.uploadImage(file, fileName);
        
        setEditingNews({
          ...editingNews,
          image: imageUrl
        });

        toast({
          title: "تم رفع الصورة",
          description: "تم رفع الصورة بنجاح",
        });
      } catch (error) {
        console.error('خطأ في رفع الصورة:', error);
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

  // معالجة رفع وسائط متعددة
  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && editingNews) {
      try {
        setIsUploading(true);
        
        const newMediaItems: MediaItem[] = [];
        const currentMedia = editingNews.media || [];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileExtension = file.name.split('.').pop();
          const fileName = `dr-ahmed-media-${Date.now()}-${i}-${crypto.randomUUID()}.${fileExtension}`;
          
          // تحديد نوع الوسائط
          let mediaType: 'image' | 'video' | 'file' = 'file';
          if (file.type.startsWith('image/')) {
            mediaType = 'image';
          } else if (file.type.startsWith('video/')) {
            mediaType = 'video';
          }
          
          // رفع الوسائط
          const mediaItem = await drAhmedNewsService.uploadMedia(file, fileName, mediaType);
          newMediaItems.push(mediaItem);
        }
        
        // تحديث الخبر بالوسائط الجديدة
        setEditingNews({
          ...editingNews,
          media: [...currentMedia, ...newMediaItems]
        });

        toast({
          title: "تم رفع الوسائط",
          description: `تم رفع ${newMediaItems.length} ملف بنجاح`,
        });
      } catch (error) {
        console.error('خطأ في رفع الوسائط:', error);
        toast({
          title: "خطأ في رفع الوسائط",
          description: "فشل في رفع الوسائط. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  // حذف وسائط
  const deleteMediaItem = async (mediaId: string) => {
    if (editingNews && editingNews.media) {
      try {
        const mediaItem = editingNews.media.find(item => item.id === mediaId);
        
        if (mediaItem) {
          // حذف الملف من التخزين
          await drAhmedNewsService.deleteMedia(mediaItem.url);
          
          // تحديث قائمة الوسائط
          const updatedMedia = editingNews.media.filter(item => item.id !== mediaId);
          setEditingNews({
            ...editingNews,
            media: updatedMedia
          });
          
          toast({
            title: "تم الحذف",
            description: "تم حذف الوسائط بنجاح",
          });
        }
      } catch (error) {
        console.error('خطأ في حذف الوسائط:', error);
        toast({
          title: "خطأ في حذف الوسائط",
          description: "فشل في حذف الوسائط. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
      }
    }
  };

  // تغيير ترتيب الوسائط
  const reorderMedia = (mediaId: string, direction: 'up' | 'down') => {
    if (editingNews && editingNews.media) {
      const media = [...editingNews.media];
      const index = media.findIndex(item => item.id === mediaId);
      
      if (index === -1) return;
      
      if (direction === 'up' && index > 0) {
        // تبديل مع العنصر السابق
        [media[index], media[index - 1]] = [media[index - 1], media[index]];
      } else if (direction === 'down' && index < media.length - 1) {
        // تبديل مع العنصر التالي
        [media[index], media[index + 1]] = [media[index + 1], media[index]];
      }
      
      // تحديث الترتيب
      const updatedMedia = media.map((item, i) => ({
        ...item,
        order: i
      }));
      
      setEditingNews({
        ...editingNews,
        media: updatedMedia
      });
    }
  };

  // تحديث تسمية توضيحية للوسائط
  const updateMediaCaption = (mediaId: string, caption: string) => {
    if (editingNews && editingNews.media) {
      const updatedMedia = editingNews.media.map(item => 
        item.id === mediaId ? { ...item, caption } : item
      );
      
      setEditingNews({
        ...editingNews,
        media: updatedMedia
      });
    }
  };

  // إضافة وسم
  const addTag = (tagName: string) => {
    if (editingNews) {
      const currentTags = editingNews.tags || [];
      
      // التحقق من عدم وجود الوسم مسبقاً
      if (!currentTags.includes(tagName)) {
        setEditingNews({
          ...editingNews,
          tags: [...currentTags, tagName]
        });
      }
    }
  };

  // حذف وسم
  const removeTag = (tagName: string) => {
    if (editingNews && editingNews.tags) {
      setEditingNews({
        ...editingNews,
        tags: editingNews.tags.filter(tag => tag !== tagName)
      });
    }
  };

  // إضافة تصنيف جديد
  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      color
    };
    
    setCategories([...categories, newCategory]);
    
    // حفظ التصنيفات في التخزين المحلي
    localStorage.setItem('dr-ahmed-news-categories', JSON.stringify([...categories, newCategory]));
  };

  // إضافة وسم جديد
  const addNewTag = (name: string) => {
    const newTag: Tag = {
      id: crypto.randomUUID(),
      name
    };
    
    setTags([...tags, newTag]);
    
    // حفظ الوسوم في التخزين المحلي
    localStorage.setItem('dr-ahmed-news-tags', JSON.stringify([...tags, newTag]));
    
    // إضافة الوسم للخبر الحالي
    if (editingNews) {
      const currentTags = editingNews.tags || [];
      setEditingNews({
        ...editingNews,
        tags: [...currentTags, name]
      });
    }
  };

  // تطبيق تنسيق النص
  const applyFormatting = (format: string) => {
    if (!editorRef.current) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText) return;
    
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'h1':
        formattedText = `<h1 class="text-3xl font-bold my-4">${selectedText}</h1>`;
        break;
      case 'h2':
        formattedText = `<h2 class="text-2xl font-bold my-3">${selectedText}</h2>`;
        break;
      case 'h3':
        formattedText = `<h3 class="text-xl font-bold my-2">${selectedText}</h3>`;
        break;
      case 'align-right':
        formattedText = `<div class="text-right">${selectedText}</div>`;
        break;
      case 'align-center':
        formattedText = `<div class="text-center">${selectedText}</div>`;
        break;
      case 'align-left':
        formattedText = `<div class="text-left">${selectedText}</div>`;
        break;
      case 'list-ul':
        formattedText = `<ul class="list-disc mr-6 my-4 space-y-2">
          ${selectedText.split('\n').map(item => `<li>${item}</li>`).join('')}
        </ul>`;
        break;
      case 'list-ol':
        formattedText = `<ol class="list-decimal mr-6 my-4 space-y-2">
          ${selectedText.split('\n').map(item => `<li>${item}</li>`).join('')}
        </ol>`;
        break;
      default:
        return;
    }
    
    // إدراج النص المنسق
    document.execCommand('insertHTML', false, formattedText);
    
    // تحديث المحتوى HTML
    if (editingNews && editorRef.current) {
      setEditingNews({
        ...editingNews,
        content_html: editorRef.current.innerHTML
      });
    }
  };

  // إضافة رابط
  const addLink = (text: string, url: string) => {
    if (editingNews && text && url) {
      const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${text}</a>`;
      
      if (editorRef.current) {
        // إدراج الرابط في المحرر
        document.execCommand('insertHTML', false, linkHtml);
        
        // تحديث المحتوى HTML
        setEditingNews({
          ...editingNews,
          content_html: editorRef.current.innerHTML
        });
      }
    }
  };

  // إضافة صورة من الوسائط إلى المحتوى
  const addMediaToContent = (mediaItem: MediaItem) => {
    if (!editorRef.current || !editingNews) return;
    
    let htmlToInsert = '';
    
    if (mediaItem.type === 'image') {
      htmlToInsert = `
        <figure class="my-4">
          <img src="${mediaItem.url}" alt="${mediaItem.caption || 'صورة'}" class="w-full max-w-2xl mx-auto rounded-lg shadow-md" />
          ${mediaItem.caption ? `<figcaption class="text-center text-sm text-gray-600 mt-2">${mediaItem.caption}</figcaption>` : ''}
        </figure>
      `;
    } else if (mediaItem.type === 'video') {
      htmlToInsert = `
        <figure class="my-4">
          <video src="${mediaItem.url}" controls class="w-full max-w-2xl mx-auto rounded-lg shadow-md"></video>
          ${mediaItem.caption ? `<figcaption class="text-center text-sm text-gray-600 mt-2">${mediaItem.caption}</figcaption>` : ''}
        </figure>
      `;
    } else {
      htmlToInsert = `
        <div class="my-4 p-4 border rounded-lg bg-gray-50">
          <a href="${mediaItem.url}" target="_blank" rel="noopener noreferrer" class="flex items-center text-blue-600 hover:text-blue-800">
            <Paperclip className="w-4 h-4 ml-2" />
            ${mediaItem.caption || 'تنزيل الملف المرفق'}
          </a>
        </div>
      `;
    }
    
    // إدراج HTML في المحرر
    document.execCommand('insertHTML', false, htmlToInsert);
    
    // تحديث المحتوى HTML
    setEditingNews({
      ...editingNews,
      content_html: editorRef.current.innerHTML
    });
  };

  // إضافة فيديو يوتيوب
  const addYouTubeVideo = () => {
    if (editingNews && editingNews.youtubeurl && editorRef.current) {
      const videoId = extractYouTubeId(editingNews.youtubeurl);
      if (videoId) {
        const videoHtml = `
          <div class="my-6">
            <iframe 
              width="100%" 
              height="400" 
              src="https://www.youtube.com/embed/${videoId}" 
              frameborder="0" 
              allowfullscreen 
              class="rounded-lg shadow-md mx-auto max-w-2xl"
            ></iframe>
          </div>
        `;
        
        // إدراج HTML في المحرر
        document.execCommand('insertHTML', false, videoHtml);
        
        // تحديث المحتوى HTML
        setEditingNews({
          ...editingNews,
          content_html: editorRef.current.innerHTML
        });
      }
    }
  };

  // استخراج معرف فيديو يوتيوب
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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

    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      // حفظ الخبر
      await drAhmedNewsService.upsertNews(editingNews);
      
      // إعادة تحميل الأخبار
      await loadNews();
      
      setEditingNews(null);
      setIsEditing(false);
      setImagePreview('');
      setShowImageCrop(false);
      setIsFullscreen(false);

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ خبر الدكتور أحمد بنجاح",
        variant: "default"
      });
    } catch (error) {
      console.error('خطأ في حفظ الخبر:', error);
      setErrorMessage(error instanceof Error ? error.message : 'فشل في حفظ الخبر');
      
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
      
      // حذف الخبر
      await drAhmedNewsService.deleteNews(id);
      
      // إعادة تحميل الأخبار
      await loadNews();

      toast({
        title: "تم الحذف",
        description: "تم حذف الخبر بنجاح",
      });
    } catch (error) {
      console.error('خطأ في حذف الخبر:', error);
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف الخبر. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // إلغاء التحرير
  const cancelEdit = () => {
    setEditingNews(null);
    setIsEditing(false);
    setImagePreview('');
    setShowImageCrop(false);
    setIsFullscreen(false);
  };

  // تبديل وضع ملء الشاشة
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // الحصول على معلومات التصنيف
  const getCategoryInfo = (categoryId?: string) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'عام', color: 'bg-gray-100 text-gray-800' };
  };

  // الحصول على معلومات الحالة
  const getStatusInfo = (statusId?: string) => {
    return statusOptions.find(status => status.id === statusId) || { name: 'مسودة', color: 'bg-gray-100 text-gray-800' };
  };

  // حساب الصفحات للتصفح
  const totalPages = Math.ceil(filteredNews.length / newsPerPage);
  const startIndex = (currentPage - 1) * newsPerPage;
  const endIndex = startIndex + newsPerPage;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  // تحميل
  if (isLoading && news.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="mr-2">جاري تحميل أخبار الدكتور أحمد...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4 overflow-auto' : ''}`}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right flex items-center">
            <FileText className="w-6 h-6 ml-2 text-primary" />
            <span>إدارة أخبار الدكتور أحمد العلواني</span>
          </CardTitle>
          <div className="flex gap-2">
            {isFullscreen && (
              <Button 
                onClick={toggleFullscreen} 
                size="sm" 
                variant="outline"
              >
                <Minimize2 className="w-4 h-4 ml-2" />
                إغلاق وضع ملء الشاشة
              </Button>
            )}
            <Button onClick={addNews} size="sm" disabled={isLoading}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة خبر جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* رسالة الخطأ */}
          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">خطأ في حفظ الخبر</h3>
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setErrorMessage(null)}
                    className="mt-2"
                  >
                    إغلاق
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {isEditing && editingNews && (
            <div className={`border rounded-lg p-4 mb-6 bg-gray-50 ${isFullscreen ? 'h-full overflow-auto' : ''}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-right">
                  {news.find(item => item.id === editingNews.id) ? 'تعديل خبر' : 'إضافة خبر جديد'}
                </h3>
                <Button 
                  onClick={toggleFullscreen} 
                  size="sm" 
                  variant="outline"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4 ml-2" />
                  ) : (
                    <Maximize2 className="w-4 h-4 ml-2" />
                  )}
                  {isFullscreen ? 'إغلاق وضع ملء الشاشة' : 'وضع ملء الشاشة'}
                </Button>
              </div>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
                  <TabsTrigger value="content">المحتوى المتقدم</TabsTrigger>
                  <TabsTrigger value="media">الوسائط</TabsTrigger>
                  <TabsTrigger value="settings">الإعدادات</TabsTrigger>
                  <TabsTrigger value="preview">معاينة</TabsTrigger>
                </TabsList>
                
                {/* المعلومات الأساسية */}
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

                  <div className="space-y-2">
                    <Label htmlFor="news-summary">ملخص الخبر</Label>
                    <Textarea
                      id="news-summary"
                      value={editingNews.summary || ''}
                      onChange={(e) => setEditingNews({...editingNews, summary: e.target.value})}
                      className="text-right"
                      rows={2}
                      placeholder="أدخل ملخصاً قصيراً للخبر (اختياري)"
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
                      rows={10}
                      placeholder="أدخل محتوى الخبر"
                      disabled={isLoading}
                    />
                  </div>
                </TabsContent>

                {/* المحتوى المتقدم */}
                <TabsContent value="content" className="space-y-4">
                  <div className="bg-white p-2 rounded-lg border shadow-sm">
                    <div className="flex flex-wrap gap-1 mb-2 border-b pb-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => applyFormatting('bold')}
                        title="غامق"
                      >
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => applyFormatting('italic')}
                        title="مائل"
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => applyFormatting('underline')}
                        title="تسطير"
                      >
                        <Underline className="w-4 h-4" />
                      </Button>
                      <div className="h-6 border-r mx-1"></div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => applyFormatting('h1')}
                        title="عنوان 1"
                      >
                        <Heading1 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => applyFormatting('h2')}
                        title="عنوان 2"
                      >
                        <Heading2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => applyFormatting('h3')}
                        title="عنوان 3"
                      >
                        <Heading3 className="w-4 h-4" />
                      </Button>
                      <div className="h-6 border-r mx-1"></div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => applyFormatting('align-right')}
                        title="محاذاة لليمين"
                      >
                        <AlignRight className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => applyFormatting('align-center')}
                        title="توسيط"
                      >
                        <AlignCenter className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => applyFormatting('align-left')}
                        title="محاذاة لليسار"
                      >
                        <AlignLeft className="w-4 h-4" />
                      </Button>
                      <div className="h-6 border-r mx-1"></div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => applyFormatting('list-ul')}
                        title="قائمة نقطية"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => applyFormatting('list-ol')}
                        title="قائمة رقمية"
                      >
                        <ListOrdered className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-2 border-b pb-2">
                      {/* إضافة رابط */}
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder="نص الرابط"
                          className="text-right w-32"
                          id="link-text"
                        />
                        <Input
                          placeholder="عنوان URL"
                          className="text-right w-40"
                          id="link-url"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const textInput = document.getElementById('link-text') as HTMLInputElement;
                            const urlInput = document.getElementById('link-url') as HTMLInputElement;
                            addLink(textInput.value, urlInput.value);
                            textInput.value = '';
                            urlInput.value = '';
                          }}
                        >
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                      
                      {/* إضافة فيديو يوتيوب */}
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder="رابط فيديو يوتيوب"
                          value={editingNews.youtubeurl || ''}
                          onChange={(e) => setEditingNews({...editingNews, youtubeurl: e.target.value})}
                          className="text-right w-40"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addYouTubeVideo}
                          disabled={!editingNews.youtubeurl}
                        >
                          <Video className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* محرر المحتوى المتقدم */}
                    <div 
                      ref={editorRef}
                      className="min-h-[400px] border rounded p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      contentEditable
                      dangerouslySetInnerHTML={{ __html: editingNews.content_html || '' }}
                      onInput={(e) => {
                        setEditingNews({
                          ...editingNews,
                          content_html: e.currentTarget.innerHTML
                        });
                      }}
                      dir="rtl"
                    />
                  </div>
                </TabsContent>

                {/* الوسائط */}
                <TabsContent value="media" className="space-y-4">
                  {/* الصورة الرئيسية */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right text-lg">الصورة الرئيسية</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>رفع صورة</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="text-right"
                            disabled={isLoading || isUploading}
                          />
                          {isUploading && (
                            <div className="flex items-center text-sm text-blue-600 mt-2">
                              <Loader2 className="w-4 h-4 animate-spin ml-2" />
                              جاري رفع الصورة...
                            </div>
                          )}
                        </div>
                        <div>
                          <Label>رابط الصورة</Label>
                          <Input
                            value={editingNews.image || ''}
                            onChange={(e) => setEditingNews({...editingNews, image: e.target.value})}
                            className="text-right"
                            placeholder="https://example.com/image.jpg"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      
                      {/* معاينة الصورة */}
                      {editingNews.image && (
                        <div className="space-y-2">
                          <Label>معاينة الصورة</Label>
                          <div className="relative max-w-md">
                            <img 
                              src={editingNews.image} 
                              alt="معاينة الصورة"
                              className="w-full h-auto rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                          
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
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setEditingNews({...editingNews, image: ''});
                                setImagePreview('');
                              }}
                              disabled={isLoading}
                            >
                              <ImageOff className="w-4 h-4 ml-2" />
                              إزالة الصورة
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* وسائط متعددة */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right text-lg flex items-center justify-between">
                        <span>الوسائط المتعددة</span>
                        <Button size="sm" variant="outline">
                          <Input
                            type="file"
                            multiple
                            onChange={handleMediaUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={isLoading || isUploading}
                          />
                          <Upload className="w-4 h-4 ml-2" />
                          رفع وسائط
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isUploading && (
                        <div className="flex items-center justify-center text-sm text-blue-600 mb-4">
                          <Loader2 className="w-4 h-4 animate-spin ml-2" />
                          جاري رفع الوسائط...
                        </div>
                      )}
                      
                      {(!editingNews.media || editingNews.media.length === 0) ? (
                        <div className="text-center py-8 text-gray-500 border rounded-lg">
                          <FileImage className="w-12 h-12 mx-auto mb-2 opacity-30" />
                          <p>لا توجد وسائط مرفقة</p>
                          <p className="text-sm">اضغط على "رفع وسائط" لإضافة صور أو فيديوهات أو ملفات</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {editingNews.media.map((mediaItem, index) => (
                            <div key={mediaItem.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => reorderMedia(mediaItem.id, 'up')}
                                    disabled={index === 0}
                                  >
                                    ↑
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => reorderMedia(mediaItem.id, 'down')}
                                    disabled={index === editingNews.media!.length - 1}
                                  >
                                    ↓
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => addMediaToContent(mediaItem)}
                                  >
                                    <Plus className="w-4 h-4 ml-1" />
                                    إضافة للمحتوى
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => deleteMediaItem(mediaItem.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                <Badge>
                                  {mediaItem.type === 'image' ? 'صورة' : 
                                   mediaItem.type === 'video' ? 'فيديو' : 'ملف'}
                                </Badge>
                              </div>
                              
                              {mediaItem.type === 'image' && (
                                <div className="mb-2">
                                  <img 
                                    src={mediaItem.url} 
                                    alt={mediaItem.caption || 'صورة'}
                                    className="w-full max-h-40 object-contain rounded border"
                                  />
                                </div>
                              )}
                              
                              {mediaItem.type === 'video' && (
                                <div className="mb-2">
                                  <video 
                                    src={mediaItem.url} 
                                    className="w-full max-h-40 rounded border"
                                    controls
                                  />
                                </div>
                              )}
                              
                              {mediaItem.type === 'file' && (
                                <div className="mb-2 p-2 bg-gray-50 rounded border">
                                  <a 
                                    href={mediaItem.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center text-blue-600"
                                  >
                                    <Paperclip className="w-4 h-4 ml-2" />
                                    {mediaItem.url.split('/').pop() || 'ملف مرفق'}
                                  </a>
                                </div>
                              )}
                              
                              <div className="flex gap-2 items-center">
                                <Label className="whitespace-nowrap">وصف:</Label>
                                <Input
                                  value={mediaItem.caption || ''}
                                  onChange={(e) => updateMediaCaption(mediaItem.id, e.target.value)}
                                  className="text-right flex-1"
                                  placeholder="أدخل وصفاً للوسائط"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* الإعدادات */}
                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right text-lg">إعدادات النشر</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>حالة النشر</Label>
                          <Select
                            value={editingNews.status}
                            onValueChange={(value) => setEditingNews({
                              ...editingNews, 
                              status: value as 'draft' | 'published' | 'archived'
                            })}
                          >
                            <SelectTrigger className="text-right">
                              <SelectValue placeholder="اختر حالة النشر" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status.id} value={status.id}>
                                  <span className={`px-2 py-1 rounded text-xs ${status.color}`}>
                                    {status.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="block mb-2">خبر مميز</Label>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Switch
                              checked={editingNews.featured}
                              onCheckedChange={(checked) => setEditingNews({...editingNews, featured: checked})}
                            />
                            <Label>
                              {editingNews.featured ? 'مميز' : 'غير مميز'}
                            </Label>
                          </div>
                        </div>
                      </div>
                      
                      {/* الوسوم */}
                      <div className="space-y-2">
                        <Label>الوسوم</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {editingNews.tags && editingNews.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => removeTag(tag)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(value) => addTag(value)}
                          >
                            <SelectTrigger className="text-right">
                              <SelectValue placeholder="اختر وسماً" />
                            </SelectTrigger>
                            <SelectContent>
                              {tags.map((tag) => (
                                <SelectItem key={tag.id} value={tag.name}>
                                  {tag.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline">
                                <Plus className="w-4 h-4 ml-2" />
                                وسم جديد
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="text-right">
                              <DialogHeader>
                                <DialogTitle>إضافة وسم جديد</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>اسم الوسم</Label>
                                  <Input
                                    id="new-tag"
                                    className="text-right"
                                    placeholder="أدخل اسم الوسم"
                                  />
                                </div>
                                <Button
                                  onClick={() => {
                                    const input = document.getElementById('new-tag') as HTMLInputElement;
                                    if (input.value.trim()) {
                                      addNewTag(input.value.trim());
                                    }
                                  }}
                                >
                                  إضافة
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      
                      {/* معلومات إضافية */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                          <Info className="w-4 h-4 ml-2" />
                          معلومات إضافية
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">معرف الخبر:</p>
                            <p className="font-mono text-xs bg-white p-1 rounded border mt-1">{editingNews.id}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">عدد المشاهدات:</p>
                            <p className="font-mono">{editingNews.views}</p>
                          </div>
                          {editingNews.created_at && (
                            <div>
                              <p className="text-gray-600">تاريخ الإنشاء:</p>
                              <p className="font-mono">{new Date(editingNews.created_at).toLocaleString('ar-IQ')}</p>
                            </div>
                          )}
                          {editingNews.updated_at && (
                            <div>
                              <p className="text-gray-600">آخر تحديث:</p>
                              <p className="font-mono">{new Date(editingNews.updated_at).toLocaleString('ar-IQ')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* المعاينة */}
                <TabsContent value="preview" className="space-y-4">
                  <div className="border rounded-lg p-6 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        {editingNews.featured && (
                          <Badge className="bg-amber-500">
                            <Star className="w-3 h-3 ml-1" />
                            مميز
                          </Badge>
                        )}
                        <Badge className={getStatusInfo(editingNews.status).color}>
                          {getStatusInfo(editingNews.status).name}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center">
                          <Eye className="w-3 h-3 ml-1" />
                          {editingNews.views}
                        </Badge>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-right">{editingNews.title || 'عنوان الخبر'}</h3>
                    
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(editingNews.date).toLocaleDateString('ar-IQ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingNews.category && (
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryInfo(editingNews.category).color}`}>
                            {getCategoryInfo(editingNews.category).name}
                          </span>
                        )}
                        <span>{editingNews.author}</span>
                      </div>
                    </div>

                    {/* الوسوم */}
                    {editingNews.tags && editingNews.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4 justify-end">
                        {editingNews.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* الصورة الرئيسية */}
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

                    {/* ملخص الخبر */}
                    {editingNews.summary && (
                      <div className="mb-4 bg-gray-50 p-4 rounded-lg border-r-4 border-primary">
                        <p className="text-gray-700 font-medium">{editingNews.summary}</p>
                      </div>
                    )}

                    {/* المحتوى */}
                    <div className="prose max-w-none text-right">
                      <div className="whitespace-pre-wrap mb-4">{editingNews.content}</div>
                      {editingNews.content_html && (
                        <div 
                          dir="rtl" 
                          lang="ar" 
                          dangerouslySetInnerHTML={{ __html: editingNews.content_html }} 
                          className="enhanced-content"
                        />
                      )}
                    </div>
                    
                    {/* الوسائط المتعددة */}
                    {editingNews.media && editingNews.media.length > 0 && (
                      <div className="mt-6 border-t pt-4">
                        <h4 className="text-lg font-bold mb-4">الوسائط المرفقة</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {editingNews.media.map((mediaItem) => (
                            <div key={mediaItem.id} className="border rounded-lg overflow-hidden">
                              {mediaItem.type === 'image' && (
                                <img 
                                  src={mediaItem.url} 
                                  alt={mediaItem.caption || 'صورة'}
                                  className="w-full h-40 object-cover"
                                />
                              )}
                              {mediaItem.type === 'video' && (
                                <video 
                                  src={mediaItem.url} 
                                  className="w-full h-40 object-cover"
                                  controls
                                />
                              )}
                              {mediaItem.type === 'file' && (
                                <div className="h-40 flex items-center justify-center bg-gray-50">
                                  <Paperclip className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                              {mediaItem.caption && (
                                <div className="p-2 text-sm text-gray-600 text-center">
                                  {mediaItem.caption}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

          {/* قائمة الأخبار */}
          {!isEditing && (
            <>
              {/* أدوات البحث والتصفية */}
              <div className="mb-6">
                <Card>
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
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="جميع التصنيفات" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع التصنيفات</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <span className={`px-2 py-1 rounded text-xs ${category.color}`}>
                                {category.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* تصفية الحالة */}
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="جميع الحالات" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع الحالات</SelectItem>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.id} value={status.id}>
                              <span className={`px-2 py-1 rounded text-xs ${status.color}`}>
                                {status.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* الترتيب */}
                      <div className="flex gap-2">
                        <Select 
                          value={sortBy} 
                          onValueChange={(value) => setSortBy(value as 'date' | 'title' | 'views')}
                        >
                          <SelectTrigger className="text-right flex-1">
                            <SelectValue placeholder="ترتيب حسب" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="date">التاريخ</SelectItem>
                            <SelectItem value="title">العنوان</SelectItem>
                            <SelectItem value="views">المشاهدات</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                          title={sortOrder === 'desc' ? 'تنازلي' : 'تصاعدي'}
                        >
                          <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* عرض الأخبار */}
              {filteredNews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <div className="text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">لا توجد أخبار للدكتور أحمد</p>
                    <p className="text-sm mb-4">يمكنك إضافة أخبار جديدة بالضغط على زر "إضافة خبر جديد"</p>
                    <Button onClick={addNews}>
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة خبر جديد
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {/* مؤشر النجاح */}
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center text-green-800">
                        <CheckCircle className="w-5 h-5 ml-2" />
                        <span>تم تحميل {filteredNews.length} خبر بنجاح</span>
                      </div>
                      <Button onClick={loadNews} variant="outline" size="sm" disabled={isLoading}>
                        <RefreshCw className={`w-4 h-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
                        تحديث
                      </Button>
                    </div>

                    {/* جدول الأخبار */}
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 text-gray-700">
                            <tr>
                              <th className="px-4 py-3 text-right">العنوان</th>
                              <th className="px-4 py-3 text-right">التاريخ</th>
                              <th className="px-4 py-3 text-right">التصنيف</th>
                              <th className="px-4 py-3 text-right">الحالة</th>
                              <th className="px-4 py-3 text-right">المشاهدات</th>
                              <th className="px-4 py-3 text-center">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {currentNews.map((newsItem) => {
                              const categoryInfo = getCategoryInfo(newsItem.category);
                              const statusInfo = getStatusInfo(newsItem.status);
                              
                              return (
                                <tr key={newsItem.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <div className="flex items-start gap-3">
                                      {newsItem.image ? (
                                        <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                          <img 
                                            src={newsItem.image} 
                                            alt={newsItem.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.style.display = 'none';
                                              e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><ImageIcon class="w-4 h-4 text-gray-400" /></div>';
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                          <FileText className="w-6 h-6 text-gray-400" />
                                        </div>
                                      )}
                                      <div>
                                        <div className="font-medium text-gray-900 line-clamp-1">
                                          {newsItem.title}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {newsItem.author}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {new Date(newsItem.date).toLocaleDateString('ar-IQ')}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs ${categoryInfo.color}`}>
                                      {categoryInfo.name}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs ${statusInfo.color}`}>
                                      {statusInfo.name}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <div className="flex items-center">
                                      <Eye className="w-4 h-4 ml-1 text-gray-400" />
                                      {newsItem.views}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex justify-center gap-2">
                                      <Button 
                                        onClick={() => editNews(newsItem)}
                                        size="sm"
                                        variant="outline"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button 
                                        onClick={() => {
                                          if (window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
                                            deleteNews(newsItem.id);
                                          }
                                        }}
                                        variant="destructive" 
                                        size="sm"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  {/* التصفح */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 space-x-reverse mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        السابق
                      </Button>
                      
                      <div className="flex space-x-1 space-x-reverse">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-10"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        التالي
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DrAhmedNewsManager;