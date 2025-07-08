import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, Plus, Trash2, Edit, Calendar, Image, Link as LinkIcon, Upload, Loader2, Database, CheckCircle, Video, Type, Hash, ExternalLink, Crop, Eye, Settings, User, Bug, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { newsService, NewsItem, sampleNewsData } from '@/lib/supabaseClient';
import NewsDebugger from './NewsDebugger';

// Enhanced NewsItem interface with new fields
interface EnhancedNewsItem extends NewsItem {
  category?: string;
  youtubeurl?: string;
  images?: string[];
  content_html?: string;
}

// Default categories and authors
const DEFAULT_CATEGORIES = [
  { id: 'political', name: 'سياسي', color: 'bg-red-100 text-red-800' },
  { id: 'economic', name: 'اقتصادي', color: 'bg-blue-100 text-blue-800' },
  { id: 'social', name: 'اجتماعي', color: 'bg-green-100 text-green-800' },
  { id: 'cultural', name: 'ثقافي', color: 'bg-purple-100 text-purple-800' },
  { id: 'educational', name: 'تعليمي', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'general', name: 'عام', color: 'bg-gray-100 text-gray-800' }
];

const DEFAULT_AUTHORS = [
  'الدكتور أحمد العلواني',
  'المكتب الإعلامي للدكتور أحمد العلواني',
  'المكتب الصحفي',
  'فريق التحرير'
];

interface Category {
  id: string;
  name: string;
  color: string;
}

const NewsManager = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<EnhancedNewsItem[]>([]);
  const [editingNews, setEditingNews] = useState<EnhancedNewsItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageSource, setImageSource] = useState<'upload' | 'url'>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [showImageCrop, setShowImageCrop] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveAttempts, setSaveAttempts] = useState(0);
  const [showDebugger, setShowDebugger] = useState(false);

  // Categories and Authors management
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('news-categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  
  const [authors, setAuthors] = useState<string[]>(() => {
    const saved = localStorage.getItem('news-authors');
    return saved ? JSON.parse(saved) : DEFAULT_AUTHORS;
  });

  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showAuthorDialog, setShowAuthorDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: 'bg-gray-100 text-gray-800' });
  const [newAuthor, setNewAuthor] = useState('');

  // Color options for categories
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

  // Save categories and authors to localStorage
  useEffect(() => {
    localStorage.setItem('news-categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('news-authors', JSON.stringify(authors));
  }, [authors]);

  // Load news from storage on component mount
  useEffect(() => {
    loadNews();
    
    // Set up realtime subscription
    const subscription = newsService.initializeRealtimeSync();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadNews = async () => {
    try {
      setIsLoading(true);
      const newsData = await newsService.getAllNews();
      setNews(newsData);
      console.log('Loaded news:', newsData.length, 'items');
    } catch (error) {
      console.error('خطأ في تحميل الأخبار:', error);
      toast({
        title: "تحذير",
        description: "تم تحميل الأخبار من التخزين المحلي",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSampleData = async () => {
    try {
      setIsLoading(true);
      await newsService.initializeSampleData();
      await loadNews();
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الأخبار النموذجية بنجاح",
      });
    } catch (error) {
      console.error('خطأ في إضافة البيانات النموذجية:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة البيانات النموذجية",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNews = () => {
    const newNews: EnhancedNewsItem = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      author: authors[0] || 'الدكتور أحمد العلواني',
      image: '',
     imagecaption: '',
      category: categories[0]?.id || 'general',
     youtubeurl: '',
      images: [],
      content_html: ''
    };
    setEditingNews(newNews);
    setIsEditing(true);
  };

  const editNews = (newsItem: EnhancedNewsItem) => {
    setEditingNews({ ...newsItem });
    setIsEditing(true);
    if (newsItem.image) {
      setImagePreview(newsItem.image);
    }
  };

  // Category management functions
  const addCategory = () => {
    if (newCategory.name.trim()) {
      const category: Category = {
        id: crypto.randomUUID(),
        name: newCategory.name.trim(),
        color: newCategory.color
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', color: 'bg-gray-100 text-gray-800' });
      setShowCategoryDialog(false);
      toast({
        title: "تم إضافة التصنيف",
        description: `تم إضافة تصنيف "${category.name}" بنجاح`,
      });
    }
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast({
      title: "تم حذف التصنيف",
      description: "تم حذف التصنيف بنجاح",
    });
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, ...updates } : cat
    ));
  };

  // Author management functions
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

  const deleteAuthor = (author: string) => {
    setAuthors(authors.filter(a => a !== author));
    toast({
      title: "تم حذف الكاتب",
      description: "تم حذف الكاتب من القائمة",
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editingNews) {
      try {
        setIsUploading(true);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImagePreview(result);
          setShowImageCrop(true);
        };
        reader.readAsDataURL(file);
        
        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        
        // Upload to Supabase Storage
        const imageUrl = await newsService.uploadImage(file, fileName);
        
        setEditingNews({
          ...editingNews,
          image: imageUrl
        });

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

  const handleImageUrlChange = (url: string) => {
    if (editingNews) {
      setEditingNews({ ...editingNews, image: url });
      setImagePreview(url);
    }
  };

  const addImageToContent = () => {
    if (editingNews && imagePreview) {
      const imageHtml = `<img src="${imagePreview}" alt="صورة في الخبر" class="w-full max-w-md mx-auto my-4 rounded-lg shadow-md" />`;
      setEditingNews({
        ...editingNews,
        content_html: (editingNews.content_html || '') + imageHtml
      });
    }
  };

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

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const addLink = (text: string, url: string) => {
    if (editingNews && text && url) {
      const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${text}</a>`;
      setEditingNews({
        ...editingNews,
        content_html: (editingNews.content_html || '') + linkHtml
      });
    }
  };

  const addHeading = (text: string, level: number = 2) => {
    if (editingNews && text) {
      const headingHtml = `<h${level} class="text-xl font-bold my-4 text-gray-900">${text}</h${level}>`;
      setEditingNews({
        ...editingNews,
        content_html: (editingNews.content_html || '') + headingHtml
      });
    }
  };

  const saveNews = async () => {
    if (!editingNews || !editingNews.title.trim() || !editingNews.content.trim()) {
      toast({
        title: "حقول مطلوبة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // Increment save attempts counter
    setSaveAttempts(prev => prev + 1);

    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      // Combine regular content with HTML content
      // Don't combine them - keep them separate
      const newsToSave = { ...editingNews };
      
      // Save news item
      await newsService.upsertNews(newsToSave);
      
      // Broadcast update to other tabs/devices
      newsService.broadcastNewsUpdate();
      
      // Reload news from storage
      await loadNews();
      
      setEditingNews(null);
      setIsEditing(false);
      setImagePreview('');
      setShowImageCrop(false);

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ الخبر ومزامنته عبر جميع الأجهزة",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving news:', error);
      setErrorMessage(error instanceof Error ? error.message : 'فشل في حفظ الخبر');
      
      // If we've tried multiple times, suggest using the debugger
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

  const deleteNews = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Delete news item
      await newsService.deleteNews(id);
      
      // Broadcast update to other tabs/devices
      newsService.broadcastNewsUpdate();
      
      // Reload news from storage
      await loadNews();

      toast({
        title: "تم الحذف",
        description: "تم حذف الخبر بنجاح",
      });
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

  // Listen for updates from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'news-update-trigger') {
        loadNews();
      }
    };

    const channel = new BroadcastChannel('news-updates');
    channel.onmessage = (event) => {
      if (event.data.type === 'NEWS_UPDATED') {
        loadNews();
      }
    };

    // Listen for custom events for immediate updates
    const handleNewsUpdated = () => {
      loadNews();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('newsUpdated', handleNewsUpdated);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('newsUpdated', handleNewsUpdated);
      channel.close();
    };
  }, []);

  const cancelEdit = () => {
    setEditingNews(null);
    setIsEditing(false);
    setImagePreview('');
    setShowImageCrop(false);
  };

  if (isLoading && news.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="mr-2">جاري تحميل الأخبار...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">إدارة الأخبار المتقدمة</CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowDebugger(!showDebugger)} 
              size="sm" 
              variant="outline"
            >
              <Bug className="w-4 h-4 ml-2" />
              {showDebugger ? 'إخفاء أداة التصحيح' : 'أداة التصحيح'}
            </Button>
            {news.length === 0 && (
              <Button onClick={initializeSampleData} size="sm" variant="outline" disabled={isLoading}>
                <Database className="w-4 h-4 ml-2" />
                إضافة أخبار نموذجية
              </Button>
            )}
            <Button onClick={addNews} size="sm" disabled={isLoading}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة خبر جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Debug Tool */}
          {showDebugger && (
            <div className="mb-6">
              <NewsDebugger />
            </div>
          )}
          
          {/* Error Message */}
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
                      استخدام أداة التصحيح
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
          
          {/* Categories and Authors Management */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold mb-4 text-right">إدارة التصنيفات والكتّاب</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Categories Management */}
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

              {/* Authors Management */}
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
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  {/* Main Image Section */}
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
                    
                    {/* Image Preview and Crop */}
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

                  {/* YouTube Video Section */}
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
                  {/* Rich Content Tools */}
                  <div className="space-y-4">
                    <Label>أدوات المحتوى المتقدم</Label>
                    
                    {/* Add Heading */}
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

                    {/* Add Link */}
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

                    {/* Content HTML Preview */}
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

          {news.length === 0 && !isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد أخبار حالياً</p>
              <p className="text-sm">اضغط على "إضافة أخبار نموذجية" لإضافة أخبار تجريبية أو "إضافة خبر جديد" لإضافة خبر مخصص</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
              {/* Success indicator */}
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center text-green-800">
                  <CheckCircle className="w-5 h-5 ml-2" />
                  <span>تم تحميل {news.length} خبر بنجاح</span>
                </div>
                <Button onClick={loadNews} variant="outline" size="sm" disabled={isLoading}>
                  تحديث
                </Button>
              </div>

              {news.map((newsItem) => (
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
                        {newsItem.category && (
                          <span className={`px-2 py-1 rounded text-xs ${categories.find(c => c.id === newsItem.category)?.color}`}>
                            {categories.find(c => c.id === newsItem.category)?.name}
                          </span>
                        )}
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
                </div>
              ))}
            </div>
            
            {/* Pagination placeholder for future implementation */}
            {news.length > 10 && (
              <div className="flex justify-center mt-6">
                <Button variant="outline" size="sm" disabled>
                  الصفحة 1 من {Math.ceil(news.length / 10)}
                </Button>
              </div>
            )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsManager;