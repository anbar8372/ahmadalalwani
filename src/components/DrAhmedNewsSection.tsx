import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ChevronRight, Loader2, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  // الحصول على أحدث الأخبار
  async getLatestNews(limit: number = 3): Promise<DrAhmedNewsItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('dr_ahmed_news')
          .select('*')
          .eq('status', 'published')
          .order('date', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data || [];
      }
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews
          .filter((item: DrAhmedNewsItem) => item.status === 'published')
          .sort((a: DrAhmedNewsItem, b: DrAhmedNewsItem) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, limit);
      }
      
      return [];
    } catch (error) {
      console.error('خطأ في تحميل أخبار الدكتور أحمد:', error);
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews
          .filter((item: DrAhmedNewsItem) => item.status === 'published')
          .sort((a: DrAhmedNewsItem, b: DrAhmedNewsItem) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, limit);
      }
      
      return [];
    }
  },

  // الحصول على الأخبار المميزة
  async getFeaturedNews(limit: number = 1): Promise<DrAhmedNewsItem[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('dr_ahmed_news')
          .select('*')
          .eq('status', 'published')
          .eq('featured', true)
          .order('date', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return data || [];
      }
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews
          .filter((item: DrAhmedNewsItem) => item.status === 'published' && item.featured)
          .sort((a: DrAhmedNewsItem, b: DrAhmedNewsItem) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, limit);
      }
      
      return [];
    } catch (error) {
      console.error('خطأ في تحميل الأخبار المميزة للدكتور أحمد:', error);
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        return allNews
          .filter((item: DrAhmedNewsItem) => item.status === 'published' && item.featured)
          .sort((a: DrAhmedNewsItem, b: DrAhmedNewsItem) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, limit);
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

// مكون قسم أخبار الدكتور أحمد
const DrAhmedNewsSection = () => {
  const [news, setNews] = useState<DrAhmedNewsItem[]>([]);
  const [featuredNews, setFeaturedNews] = useState<DrAhmedNewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // تحميل الأخبار عند تحميل المكون
  useEffect(() => {
    loadNews();
  }, []);

  // تحميل الأخبار
  const loadNews = async () => {
    try {
      setIsLoading(true);

      // تحميل الأخبار المميزة
      const featuredNewsData = await drAhmedNewsService.getFeaturedNews(1);
      if (featuredNewsData.length > 0) {
        setFeaturedNews(featuredNewsData[0]);
      }

      // تحميل أحدث الأخبار
      const latestNews = await drAhmedNewsService.getLatestNews(4);
      
      // إزالة الخبر المميز من قائمة أحدث الأخبار لتجنب التكرار
      const filteredNews = featuredNewsData.length > 0
        ? latestNews.filter(item => item.id !== featuredNewsData[0].id)
        : latestNews;
      
      setNews(filteredNews);
    } catch (error) {
      console.error('خطأ في تحميل أخبار الدكتور أحمد:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  // الحصول على معلومات التصنيف
  const getCategoryInfo = (categoryId?: string) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'عام', color: 'bg-gray-100 text-gray-800' };
  };

  // زيادة عدد المشاهدات عند النقر على الخبر
  const handleNewsClick = (id: string) => {
    drAhmedNewsService.incrementViews(id);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="mr-2">جاري تحميل أخبار الدكتور أحمد العلواني...</span>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0 && !featuredNews) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            أخبار الدكتور أحمد العلواني
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* الخبر المميز */}
            {featuredNews && (
              <div className="lg:col-span-2">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden h-full">
                  <Link 
                    to={`/dr-ahmed-news/${featuredNews.id}`} 
                    className="block h-full"
                    onClick={() => handleNewsClick(featuredNews.id)}
                  >
                    <div className="relative h-full flex flex-col">
                      {/* صورة الخبر المميز */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={featuredNews.image || 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg'}
                          alt={featuredNews.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg';
                          }}
                        />
                        {/* شارة مميز */}
                        <div className="absolute top-4 right-4">
                          <span className="bg-amber-500 text-white px-3 py-1 text-xs font-bold rounded flex items-center">
                            <Star className="w-3 h-3 ml-1" />
                            مميز
                          </span>
                        </div>
                        {/* شارة التصنيف */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded text-white ${getCategoryInfo(featuredNews.category).color.replace('bg-', 'bg-').replace('text-', 'text-white')}`}>
                            {getCategoryInfo(featuredNews.category).name}
                          </span>
                        </div>
                      </div>

                      <CardContent className="p-6 flex-1 flex flex-col">
                        {/* عنوان الخبر */}
                        <h3 className="text-xl font-bold text-right leading-tight mb-3 group-hover:text-primary transition-colors">
                          {featuredNews.title}
                        </h3>

                        {/* ملخص الخبر */}
                        {featuredNews.summary ? (
                          <p className="text-gray-600 text-right line-clamp-3 mb-4">
                            {featuredNews.summary}
                          </p>
                        ) : (
                          <p className="text-gray-600 text-right line-clamp-3 mb-4">
                            {featuredNews.content}
                          </p>
                        )}

                        {/* معلومات الخبر */}
                        <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 ml-2" />
                            <span>{new Date(featuredNews.date).toLocaleDateString('ar-IQ')}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 ml-1" />
                              <span>{featuredNews.views}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="w-4 h-4 ml-1" />
                              <span>{featuredNews.author}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Link>
                </Card>
              </div>
            )}

            {/* قائمة الأخبار */}
            <div className={featuredNews ? "lg:col-span-1" : "lg:col-span-3"}>
              <div className={`grid grid-cols-1 ${featuredNews ? '' : 'md:grid-cols-3'} gap-4`}>
                {news.slice(0, featuredNews ? 3 : 6).map((newsItem) => (
                  <Card
                    key={newsItem.id}
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <Link 
                      to={`/dr-ahmed-news/${newsItem.id}`} 
                      className="block"
                      onClick={() => handleNewsClick(newsItem.id)}
                    >
                      <div className="relative">
                        {/* صورة الخبر */}
                        <div className="h-40 overflow-hidden">
                          <img
                            src={newsItem.image || 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg'}
                            alt={newsItem.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg';
                            }}
                          />
                          {/* شارة التصنيف */}
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 text-xs font-bold rounded text-white ${getCategoryInfo(newsItem.category).color.replace('bg-', 'bg-').replace('text-', 'text-white')}`}>
                              {getCategoryInfo(newsItem.category).name}
                            </span>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          {/* عنوان الخبر */}
                          <h3 className="text-base font-bold text-right line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                            {newsItem.title}
                          </h3>

                          {/* معلومات الخبر */}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 ml-1" />
                              <span>{new Date(newsItem.date).toLocaleDateString('ar-IQ')}</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="w-3 h-3 ml-1" />
                              <span>{newsItem.views}</span>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* زر عرض المزيد */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link to="/dr-ahmed-news" className="flex items-center space-x-2 space-x-reverse justify-center mx-auto">
                <span>عرض جميع أخبار الدكتور أحمد</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DrAhmedNewsSection;