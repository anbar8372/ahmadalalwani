import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Search, Loader2, ArrowRight, Star, Eye, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

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
  media?: any[];
  status: 'draft' | 'published' | 'archived';
  views: number;
  featured: boolean;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

// خدمة أخبار الدكتور أحمد
const drAhmedNewsService = {
  // الحصول على جميع الأخبار
  async getAllNews(): Promise<DrAhmedNewsItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('dr_ahmed_news')
          .select('*')
          .eq('status', 'published')
          .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
      }
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews.filter((item: DrAhmedNewsItem) => item.status === 'published');
      }
      
      return [];
    } catch (error) {
      console.error('خطأ في تحميل أخبار الدكتور أحمد:', error);
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews.filter((item: DrAhmedNewsItem) => item.status === 'published');
      }
      
      return [];
    }
  },

  // البحث في الأخبار
  async searchNews(query: string): Promise<DrAhmedNewsItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('dr_ahmed_news')
          .select('*')
          .eq('status', 'published')
          .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
          .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
      }
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews
          .filter((item: DrAhmedNewsItem) => 
            item.status === 'published' && (
              item.title.toLowerCase().includes(query.toLowerCase()) || 
              item.content.toLowerCase().includes(query.toLowerCase())
            )
          );
      }
      
      return [];
    } catch (error) {
      console.error('خطأ في البحث عن أخبار الدكتور أحمد:', error);
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews
          .filter((item: DrAhmedNewsItem) => 
            item.status === 'published' && (
              item.title.toLowerCase().includes(query.toLowerCase()) || 
              item.content.toLowerCase().includes(query.toLowerCase())
            )
          );
      }
      
      return [];
    }
  },

  // زيادة عدد المشاهدات
  async incrementViews(id: string): Promise<void> {
    try {
      if (supabase) {
        await supabase.rpc('increment_dr_ahmed_news_views', { news_id: id });
      }
    } catch (error) {
      console.error('خطأ في زيادة عدد المشاهدات:', error);
    }
  }
};

// صفحة أخبار الدكتور أحمد
const DrAhmedNews = () => {
  const [news, setNews] = useState<DrAhmedNewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<DrAhmedNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const newsPerPage = 9;

  // تحميل التصنيفات من التخزين المحلي
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('dr-ahmed-news-categories');
    const defaultCategories = [
      { id: 'political', name: 'سياسي', color: 'bg-red-100 text-red-800' },
      { id: 'economic', name: 'اقتصادي', color: 'bg-blue-100 text-blue-800' },
      { id: 'social', name: 'اجتماعي', color: 'bg-green-100 text-green-800' },
      { id: 'cultural', name: 'ثقافي', color: 'bg-purple-100 text-purple-800' },
      { id: 'educational', name: 'تعليمي', color: 'bg-yellow-100 text-yellow-800' },
      { id: 'general', name: 'عام', color: 'bg-gray-100 text-gray-800' }
    ];
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  // إضافة خيار "الكل" للتصنيفات
  const filterCategories = [
    { id: 'all', name: 'جميع الأخبار', color: 'bg-gray-100 text-gray-800' },
    ...categories
  ];

  // تحميل الأخبار عند تحميل المكون
  useEffect(() => {
    loadNews();
  }, []);

  // تصفية الأخبار عند تغيير معايير البحث
  useEffect(() => {
    filterNews();
  }, [news, searchTerm, selectedCategory, sortBy, sortOrder]);

  // تحميل الأخبار
  const loadNews = async () => {
    try {
      setIsLoading(true);
      const newsData = await drAhmedNewsService.getAllNews();
      setNews(newsData);
    } catch (error) {
      console.error('خطأ في تحميل أخبار الدكتور أحمد:', error);
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

  // الحصول على معلومات التصنيف
  const getCategoryInfo = (categoryId?: string) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'عام', color: 'bg-gray-100 text-gray-800' };
  };

  // زيادة عدد المشاهدات عند النقر على الخبر
  const handleNewsClick = (id: string) => {
    drAhmedNewsService.incrementViews(id);
  };

  // حساب الصفحات للتصفح
  const totalPages = Math.ceil(filteredNews.length / newsPerPage);
  const startIndex = (currentPage - 1) * newsPerPage;
  const endIndex = startIndex + newsPerPage;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-lg">جاري تحميل أخبار الدكتور أحمد العلواني...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* رأس الصفحة */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* مسار التنقل */}
            <nav className="flex items-center space-x-2 space-x-reverse text-sm mb-6 opacity-90">
              <Link to="/" className="hover:text-white">الرئيسية</Link>
              <ArrowRight className="w-4 h-4" />
              <span>أخبار الدكتور أحمد العلواني</span>
            </nav>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">أخبار الدكتور أحمد العلواني</h1>
              <p className="text-xl opacity-90">
                تابع آخر الأخبار والتطورات الخاصة بالدكتور أحمد العلواني
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* أدوات البحث والتصفية */}
          <Card className="mb-8">
            <CardContent className="p-6">
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
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <span className={`px-2 py-1 rounded text-xs ${category.color}`}>
                          {category.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* الترتيب */}
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'title' | 'views')}>
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
                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
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

          {/* عرض الأخبار */}
          {currentNews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">لا توجد أخبار تطابق البحث</p>
                <p className="text-sm">جرب تغيير معايير البحث أو التصنيف</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentNews.map((newsItem) => {
                  const categoryInfo = getCategoryInfo(newsItem.category);
                  
                  return (
                    <Card
                      key={newsItem.id}
                      className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      <Link 
                        to={`/dr-ahmed-news/${newsItem.id}`} 
                        className="block h-full"
                        onClick={() => handleNewsClick(newsItem.id)}
                      >
                        <div className="relative">
                          {/* صورة الخبر */}
                          <div className="h-48 overflow-hidden">
                            <img
                              src={newsItem.image || 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg'}
                              alt={newsItem.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg';
                              }}
                            />
                            {/* شارة مميز */}
                            {newsItem.featured && (
                              <div className="absolute top-4 right-4">
                                <span className="bg-amber-500 text-white px-2 py-1 text-xs font-bold rounded flex items-center">
                                  <Star className="w-3 h-3 ml-1" />
                                  مميز
                                </span>
                              </div>
                            )}
                            {/* شارة التصنيف */}
                            <div className="absolute top-4 left-4">
                              <span className={`px-2 py-1 text-xs font-bold rounded text-white ${categoryInfo.color.replace('bg-', 'bg-').replace('text-', 'text-white')}`}>
                                {categoryInfo.name}
                              </span>
                            </div>
                          </div>

                          <CardContent className="p-6">
                            {/* عنوان الخبر */}
                            <h3 className="text-lg font-bold text-gray-900 mb-3 text-right line-clamp-2 group-hover:text-primary transition-colors">
                              {newsItem.title}
                            </h3>

                            {/* ملخص الخبر */}
                            {newsItem.summary ? (
                              <p className="text-gray-600 text-right line-clamp-3 mb-4 text-sm">
                                {newsItem.summary}
                              </p>
                            ) : (
                              <p className="text-gray-600 text-right line-clamp-3 mb-4 text-sm">
                                {newsItem.content}
                              </p>
                            )}

                            {/* معلومات الخبر */}
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 ml-2" />
                                <span>{new Date(newsItem.date).toLocaleDateString('ar-IQ')}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center">
                                  <Eye className="w-4 h-4 ml-1" />
                                  <span>{newsItem.views}</span>
                                </div>
                                <div className="flex items-center">
                                  <User className="w-4 h-4 ml-1" />
                                  <span>{newsItem.author}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Link>
                    </Card>
                  );
                })}
              </div>

              {/* التصفح */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 space-x-reverse">
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
        </div>
      </div>
    </Layout>
  );
};

export default DrAhmedNews;