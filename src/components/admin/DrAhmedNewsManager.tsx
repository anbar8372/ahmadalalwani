import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Save, 
  Plus, 
  Trash2, 
  Star, 
  Calendar, 
  Image as ImageIcon, 
  Youtube, 
  Tag, 
  CheckCircle, 
  Eye, 
  Search,
  Filter,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DrAhmedNewsItem, drAhmedNewsService, DEFAULT_CATEGORIES } from '@/types/dr-ahmed-news';
import { v4 as uuidv4 } from 'uuid';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import ConnectionErrorHandler from './ConnectionErrorHandler';

interface NewsCategory {
  id: string;
  name: string;
  color: string;
}

interface NewsMedia {
  id: string;
  type: 'image' | 'video' | 'file';
  url: string;
  caption?: string;
  thumbnail?: string;
  order: number;
}

const DrAhmedNewsManager = () => {
  const { toast } = useToast();
  
  // News items state
  const [news, setNews] = useState<DrAhmedNewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<DrAhmedNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Categories state
  const [categories, setCategories] = useState<NewsCategory[]>(() => {
    const saved = localStorage.getItem('dr-ahmed-news-categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  
  // Current news item being edited
  const [currentNews, setCurrentNews] = useState<DrAhmedNewsItem | null>(null);
  
  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // UI state
  const [activeTab, setActiveTab] = useState('list');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<string | null>(null);
  
  // Media state for the current news item
  const [mediaItems, setMediaItems] = useState<NewsMedia[]>([]);
  
  // Load news on component mount
  useEffect(() => {
    loadNews();
    
    // Set up event listener for updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dr-ahmed-news-update-trigger') {
        loadNews();
      }
    };

    const channel = new BroadcastChannel('dr-ahmed-news-updates');
    channel.onmessage = (event) => {
      if (event.data.type === 'DR_AHMED_NEWS_UPDATED') {
        loadNews();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('drAhmedNewsUpdated', loadNews);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('drAhmedNewsUpdated', loadNews);
      channel.close();
    };
  }, []);

  // Filter news when search term, status filter, category filter, or sort options change
  useEffect(() => {
    filterNews();
  }, [news, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  // Load news from service
  const loadNews = async () => {
    try {
      setIsLoading(true);
      setConnectionError(null);
      
      const newsData = await drAhmedNewsService.getAllNews();
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
      setConnectionError(error instanceof Error ? error.message : 'حدث خطأ غير معروف');
    } finally {
      setIsLoading(false);
    }
  };

  // Retry loading news
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await loadNews();
    } finally {
      setIsRetrying(false);
    }
  };

  // Filter and sort news
  const filterNews = () => {
    let filtered = [...news];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    // Sort
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
  };

  // Create a new news item
  const createNewNews = () => {
    const newNews: DrAhmedNewsItem = {
      id: uuidv4(),
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      author: 'المكتب الإعلامي',
      status: 'draft',
      views: 0,
      featured: false,
      tags: []
    };
    
    setCurrentNews(newNews);
    setMediaItems([]);
    setActiveTab('edit');
  };

  // Edit an existing news item
  const editNews = (newsItem: DrAhmedNewsItem) => {
    setCurrentNews({...newsItem});
    
    // Set media items
    if (newsItem.media && Array.isArray(newsItem.media)) {
      setMediaItems(newsItem.media);
    } else {
      setMediaItems([]);
    }
    
    setActiveTab('edit');
  };

  // Save news item
  const saveNews = async () => {
    if (!currentNews) return;
    
    try {
      // Validate required fields
      if (!currentNews.title.trim()) {
        toast({
          title: "خطأ في الحفظ",
          description: "يرجى إدخال عنوان الخبر",
          variant: "destructive"
        });
        return;
      }
      
      if (!currentNews.content.trim()) {
        toast({
          title: "خطأ في الحفظ",
          description: "يرجى إدخال محتوى الخبر",
          variant: "destructive"
        });
        return;
      }
      
      if (!currentNews.date) {
        toast({
          title: "خطأ في الحفظ",
          description: "يرجى إدخال تاريخ الخبر",
          variant: "destructive"
        });
        return;
      }
      
      // Add media items to news
      const newsToSave = {
        ...currentNews,
        media: mediaItems
      };
      
      // Save to service
      await drAhmedNewsService.upsertNews(newsToSave);
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ الخبر بنجاح"
      });
      
      // Reload news and go back to list
      await loadNews();
      setActiveTab('list');
    } catch (error) {
      console.error('Error saving news:', error);
      toast({
        title: "خطأ في الحفظ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء حفظ الخبر",
        variant: "destructive"
      });
    }
  };

  // Delete news item
  const deleteNews = async (id: string) => {
    try {
      await drAhmedNewsService.deleteNews(id);
      
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف الخبر بنجاح"
      });
      
      // Reload news
      await loadNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      toast({
        title: "خطأ في الحذف",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء حذف الخبر",
        variant: "destructive"
      });
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (newsToDelete) {
      deleteNews(newsToDelete);
      setNewsToDelete(null);
    }
    setShowDeleteDialog(false);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (id: string) => {
    setNewsToDelete(id);
    setShowDeleteDialog(true);
  };

  // Add media item
  const addMediaItem = () => {
    const newMedia: NewsMedia = {
      id: uuidv4(),
      type: 'image',
      url: '',
      order: mediaItems.length
    };
    
    setMediaItems([...mediaItems, newMedia]);
  };

  // Update media item
  const updateMediaItem = (id: string, field: keyof NewsMedia, value: string | number) => {
    setMediaItems(mediaItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Delete media item
  const deleteMediaItem = (id: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };

  // Add category
  const addCategory = () => {
    const newCategory: NewsCategory = {
      id: uuidv4(),
      name: '',
      color: 'bg-gray-100 text-gray-800'
    };
    
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('dr-ahmed-news-categories', JSON.stringify(updatedCategories));
  };

  // Update category
  const updateCategory = (id: string, field: keyof NewsCategory, value: string) => {
    const updatedCategories = categories.map(category => 
      category.id === id ? { ...category, [field]: value } : category
    );
    
    setCategories(updatedCategories);
    localStorage.setItem('dr-ahmed-news-categories', JSON.stringify(updatedCategories));
  };

  // Delete category
  const deleteCategory = (id: string) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
    localStorage.setItem('dr-ahmed-news-categories', JSON.stringify(updatedCategories));
  };

  // Get category info
  const getCategoryInfo = (categoryId?: string) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'عام', color: 'bg-gray-100 text-gray-800' };
  };

  // Toggle featured status
  const toggleFeatured = async (newsItem: DrAhmedNewsItem) => {
    try {
      const updatedNews = {
        ...newsItem,
        featured: !newsItem.featured
      };
      
      await drAhmedNewsService.upsertNews(updatedNews);
      
      toast({
        title: updatedNews.featured ? "تم تمييز الخبر" : "تم إلغاء تمييز الخبر",
        description: updatedNews.featured ? "تم تمييز الخبر بنجاح" : "تم إلغاء تمييز الخبر بنجاح"
      });
      
      // Reload news
      await loadNews();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: "خطأ في تحديث الخبر",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تحديث الخبر",
        variant: "destructive"
      });
    }
  };

  // Update news status
  const updateNewsStatus = async (newsItem: DrAhmedNewsItem, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      const updatedNews = {
        ...newsItem,
        status: newStatus
      };
      
      await drAhmedNewsService.upsertNews(updatedNews);
      
      toast({
        title: "تم تحديث حالة الخبر",
        description: `تم تغيير حالة الخبر إلى "${
          newStatus === 'published' ? 'منشور' : 
          newStatus === 'draft' ? 'مسودة' : 'مؤرشف'
        }"`
      });
      
      // Reload news
      await loadNews();
    } catch (error) {
      console.error('Error updating news status:', error);
      toast({
        title: "خطأ في تحديث الخبر",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تحديث الخبر",
        variant: "destructive"
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ar-IQ');
    } catch (error) {
      return dateString;
    }
  };

  // Render news list
  const renderNewsList = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل الأخبار...</p>
          </div>
        </div>
      );
    }

    if (connectionError) {
      return (
        <ConnectionErrorHandler 
          error={connectionError}
          onRetry={handleRetry}
          isRetrying={isRetrying}
        />
      );
    }

    if (filteredNews.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">لا توجد أخبار</p>
          <p className="text-gray-500 text-sm mb-4">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
              ? 'لا توجد أخبار تطابق معايير البحث' 
              : 'قم بإضافة أخبار جديدة للبدء'}
          </p>
          <Button onClick={createNewNews}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة خبر جديد
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {filteredNews.map((newsItem) => {
          const categoryInfo = getCategoryInfo(newsItem.category);
          
          return (
            <Card key={newsItem.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* News Image */}
                <div className="w-full md:w-48 h-48 bg-gray-100 flex-shrink-0">
                  {newsItem.image ? (
                    <img 
                      src={newsItem.image} 
                      alt={newsItem.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </div>
                
                {/* News Content */}
                <div className="flex-1 p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {/* Status Badge */}
                    <Badge className={
                      newsItem.status === 'published' ? 'bg-green-100 text-green-800' :
                      newsItem.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {newsItem.status === 'published' ? 'منشور' :
                       newsItem.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                    </Badge>
                    
                    {/* Category Badge */}
                    {newsItem.category && (
                      <Badge className={categoryInfo.color}>
                        {categoryInfo.name}
                      </Badge>
                    )}
                    
                    {/* Featured Badge */}
                    {newsItem.featured && (
                      <Badge className="bg-amber-100 text-amber-800">
                        <Star className="w-3 h-3 ml-1" />
                        مميز
                      </Badge>
                    )}
                    
                    {/* Views Badge */}
                    <Badge variant="outline" className="flex items-center">
                      <Eye className="w-3 h-3 ml-1" />
                      {newsItem.views}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-right">{newsItem.title}</h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 ml-2" />
                      <span>{formatDate(newsItem.date)}</span>
                    </div>
                    <div>
                      {newsItem.author}
                    </div>
                  </div>
                  
                  {newsItem.summary ? (
                    <p className="text-gray-600 text-sm mb-4 text-right line-clamp-2">
                      {newsItem.summary}
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm mb-4 text-right line-clamp-2">
                      {newsItem.content}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => editNews(newsItem)}
                    >
                      تعديل
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleFeatured(newsItem)}
                    >
                      {newsItem.featured ? 'إلغاء التمييز' : 'تمييز'}
                    </Button>
                    
                    <Select
                      value={newsItem.status}
                      onValueChange={(value) => updateNewsStatus(
                        newsItem, 
                        value as 'draft' | 'published' | 'archived'
                      )}
                    >
                      <SelectTrigger className="h-9 w-32">
                        <SelectValue placeholder="تغيير الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">مسودة</SelectItem>
                        <SelectItem value="published">منشور</SelectItem>
                        <SelectItem value="archived">مؤرشف</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => openDeleteDialog(newsItem.id)}
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  // Render news editor
  const renderNewsEditor = () => {
    if (!currentNews) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">
              {currentNews.id ? 'تعديل خبر' : 'إضافة خبر جديد'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الخبر</Label>
              <Input
                id="title"
                value={currentNews.title}
                onChange={(e) => setCurrentNews({...currentNews, title: e.target.value})}
                className="text-right"
                placeholder="أدخل عنوان الخبر"
              />
            </div>
            
            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">ملخص الخبر (اختياري)</Label>
              <Textarea
                id="summary"
                value={currentNews.summary || ''}
                onChange={(e) => setCurrentNews({...currentNews, summary: e.target.value})}
                className="text-right"
                placeholder="أدخل ملخص الخبر"
                rows={2}
              />
            </div>
            
            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">محتوى الخبر</Label>
              <Textarea
                id="content"
                value={currentNews.content}
                onChange={(e) => setCurrentNews({...currentNews, content: e.target.value})}
                className="text-right"
                placeholder="أدخل محتوى الخبر"
                rows={10}
              />
            </div>
            
            {/* HTML Content (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="content_html">محتوى HTML (اختياري)</Label>
              <Textarea
                id="content_html"
                value={currentNews.content_html || ''}
                onChange={(e) => setCurrentNews({...currentNews, content_html: e.target.value})}
                className="text-right font-mono text-sm"
                placeholder="أدخل محتوى HTML (اختياري)"
                rows={5}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">تاريخ الخبر</Label>
                <Input
                  id="date"
                  type="date"
                  value={currentNews.date}
                  onChange={(e) => setCurrentNews({...currentNews, date: e.target.value})}
                  className="text-right"
                />
              </div>
              
              {/* Author */}
              <div className="space-y-2">
                <Label htmlFor="author">الكاتب</Label>
                <Input
                  id="author"
                  value={currentNews.author}
                  onChange={(e) => setCurrentNews({...currentNews, author: e.target.value})}
                  className="text-right"
                  placeholder="أدخل اسم الكاتب"
                />
              </div>
              
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">التصنيف</Label>
                <Select
                  value={currentNews.category || ''}
                  onValueChange={(value) => setCurrentNews({...currentNews, category: value})}
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
            
            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">رابط الصورة</Label>
              <Input
                id="image"
                value={currentNews.image || ''}
                onChange={(e) => setCurrentNews({...currentNews, image: e.target.value})}
                className="text-right"
                placeholder="أدخل رابط الصورة"
              />
            </div>
            
            {/* Image Caption */}
            <div className="space-y-2">
              <Label htmlFor="imageCaption">وصف الصورة</Label>
              <Input
                id="imageCaption"
                value={currentNews.imagecaption || ''}
                onChange={(e) => setCurrentNews({...currentNews, imagecaption: e.target.value})}
                className="text-right"
                placeholder="أدخل وصف الصورة"
              />
            </div>
            
            {/* YouTube URL */}
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">رابط يوتيوب (اختياري)</Label>
              <Input
                id="youtubeUrl"
                value={currentNews.youtubeurl || ''}
                onChange={(e) => setCurrentNews({...currentNews, youtubeurl: e.target.value})}
                className="text-right"
                placeholder="أدخل رابط فيديو يوتيوب"
              />
            </div>
            
            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">الوسوم (مفصولة بفاصلة)</Label>
              <Input
                id="tags"
                value={currentNews.tags ? currentNews.tags.join(', ') : ''}
                onChange={(e) => setCurrentNews({
                  ...currentNews, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                className="text-right"
                placeholder="أدخل الوسوم مفصولة بفاصلة"
              />
            </div>
            
            {/* Status and Featured */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select
                  value={currentNews.status}
                  onValueChange={(value) => setCurrentNews({
                    ...currentNews, 
                    status: value as 'draft' | 'published' | 'archived'
                  })}
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
                <Label>تمييز الخبر</Label>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button
                    type="button"
                    variant={currentNews.featured ? "default" : "outline"}
                    onClick={() => setCurrentNews({...currentNews, featured: true})}
                    className="flex-1"
                  >
                    <Star className="w-4 h-4 ml-2" />
                    مميز
                  </Button>
                  <Button
                    type="button"
                    variant={!currentNews.featured ? "default" : "outline"}
                    onClick={() => setCurrentNews({...currentNews, featured: false})}
                    className="flex-1"
                  >
                    غير مميز
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Media Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>الوسائط المرفقة</Label>
                <Button type="button" size="sm" onClick={addMediaItem}>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة وسائط
                </Button>
              </div>
              
              {mediaItems.length === 0 ? (
                <div className="text-center py-4 border rounded-md bg-gray-50">
                  <p className="text-gray-500">لا توجد وسائط مرفقة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mediaItems.map((media, index) => (
                    <div key={media.id} className="border rounded-md p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">وسائط #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMediaItem(media.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>نوع الوسائط</Label>
                          <Select
                            value={media.type}
                            onValueChange={(value) => updateMediaItem(
                              media.id, 
                              'type', 
                              value as 'image' | 'video' | 'file'
                            )}
                          >
                            <SelectTrigger className="text-right">
                              <SelectValue placeholder="اختر النوع" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="image">صورة</SelectItem>
                              <SelectItem value="video">فيديو</SelectItem>
                              <SelectItem value="file">ملف</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>الترتيب</Label>
                          <Input
                            type="number"
                            value={media.order}
                            onChange={(e) => updateMediaItem(media.id, 'order', parseInt(e.target.value))}
                            className="text-right"
                            min={0}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>الرابط</Label>
                        <Input
                          value={media.url}
                          onChange={(e) => updateMediaItem(media.id, 'url', e.target.value)}
                          className="text-right"
                          placeholder={
                            media.type === 'image' ? 'أدخل رابط الصورة' :
                            media.type === 'video' ? 'أدخل رابط الفيديو' :
                            'أدخل رابط الملف'
                          }
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>الوصف</Label>
                        <Input
                          value={media.caption || ''}
                          onChange={(e) => updateMediaItem(media.id, 'caption', e.target.value)}
                          className="text-right"
                          placeholder="أدخل وصف الوسائط"
                        />
                      </div>
                      
                      {media.type === 'video' && (
                        <div className="space-y-2">
                          <Label>صورة مصغرة (اختياري)</Label>
                          <Input
                            value={media.thumbnail || ''}
                            onChange={(e) => updateMediaItem(media.id, 'thumbnail', e.target.value)}
                            className="text-right"
                            placeholder="أدخل رابط الصورة المصغرة"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button onClick={saveNews} className="flex-1">
                <Save className="w-4 h-4 ml-2" />
                حفظ الخبر
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveTab('list')}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render categories manager
  const renderCategoriesManager = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-right">تصنيفات الأخبار</CardTitle>
            <Button onClick={addCategory} size="sm">
              <Plus className="w-4 h-4 ml-2" />
              إضافة تصنيف
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {categories.length === 0 ? (
              <div className="text-center py-4 border rounded-md bg-gray-50">
                <p className="text-gray-500">لا توجد تصنيفات</p>
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">تصنيف #{category.id.substring(0, 4)}</h3>
                    <Button 
                      onClick={() => deleteCategory(category.id)}
                      variant="destructive" 
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>اسم التصنيف</Label>
                      <Input
                        value={category.name}
                        onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>لون التصنيف</Label>
                      <Input
                        value={category.color}
                        onChange={(e) => updateCategory(category.id, 'color', e.target.value)}
                        className="text-right"
                        placeholder="bg-red-100 text-red-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>معاينة</Label>
                      <div className="h-10 flex items-center">
                        <Badge className={category.color}>
                          {category.name || 'تصنيف جديد'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">ملاحظات حول التصنيفات:</h4>
              <ul className="space-y-1 text-blue-800 text-sm">
                <li>• يمكنك إضافة تصنيفات جديدة حسب الحاجة</li>
                <li>• لتعيين لون التصنيف، استخدم صيغة Tailwind CSS مثل: bg-red-100 text-red-800</li>
                <li>• التصنيفات تساعد في تنظيم الأخبار وتسهيل البحث عنها</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Success Indicator */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 space-x-reverse text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">نظام إدارة أخبار الدكتور أحمد العلواني</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            يمكنك إضافة وتعديل وحذف الأخبار الخاصة بالدكتور أحمد العلواني
          </p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">قائمة الأخبار</TabsTrigger>
          <TabsTrigger value="edit" disabled={activeTab !== 'edit'}>
            {currentNews?.id ? 'تعديل خبر' : 'إضافة خبر'}
          </TabsTrigger>
          <TabsTrigger value="categories">إدارة التصنيفات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="البحث في الأخبار..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-right pr-10"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="فلترة حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="published">منشور</SelectItem>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="archived">مؤرشف</SelectItem>
                  </SelectContent>
                </Select>

                {/* Category Filter */}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="فلترة حسب التصنيف" />
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

                {/* Sort */}
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
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
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    title={sortOrder === 'asc' ? 'ترتيب تنازلي' : 'ترتيب تصاعدي'}
                  >
                    <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Add News Button */}
          <div className="flex justify-between items-center">
            <Button onClick={createNewNews}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة خبر جديد
            </Button>
            
            <div className="text-sm text-gray-500">
              إجمالي الأخبار: {news.length} | تم العثور على: {filteredNews.length}
            </div>
          </div>
          
          {/* News List */}
          {renderNewsList()}
        </TabsContent>
        
        <TabsContent value="edit">
          {renderNewsEditor()}
        </TabsContent>
        
        <TabsContent value="categories">
          {renderCategoriesManager()}
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا الخبر؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الخبر نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              <Trash2 className="w-4 h-4 ml-2" />
              تأكيد الحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DrAhmedNewsManager;