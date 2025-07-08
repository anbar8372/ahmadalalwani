import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Image as ImageIcon, Loader2, Eye, Star, Tag } from 'lucide-react';
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
  media?: MediaItem[];
  status: 'draft' | 'published' | 'archived';
  views: number;
  featured: boolean;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'file';
  url: string;
  caption?: string;
  thumbnail?: string;
  size?: number;
  order: number;
}

// خدمة أخبار الدكتور أحمد
const drAhmedNewsService = {
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

  // الحصول على أخبار ذات صلة
  async getRelatedNews(excludeId: string, categoryId?: string, limit: number = 3): Promise<DrAhmedNewsItem[]> {
    try {
      if (supabase) {
        let query = supabase
          .from('dr_ahmed_news')
          .select('*')
          .eq('status', 'published')
          .neq('id', excludeId)
          .order('date', { ascending: false })
          .limit(limit);
          
        if (categoryId) {
          query = query.eq('category', categoryId);
        }
        
        const { data, error } = await query;

        if (error) throw error;
        return data || [];
      }
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        let filtered = allNews.filter((item: DrAhmedNewsItem) => 
          item.status === 'published' && item.id !== excludeId
        );
        
        if (categoryId) {
          filtered = filtered.filter((item: DrAhmedNewsItem) => item.category === categoryId);
        }
        
        return filtered.slice(0, limit);
      }
      
      return [];
    } catch (error) {
      console.error('خطأ في تحميل الأخبار ذات الصلة:', error);
      
      // الاحتياط باستخدام التخزين المحلي
      const savedNews = localStorage.getItem('dr-ahmed-news');
      if (savedNews) {
        const allNews = JSON.parse(savedNews);
        let filtered = allNews.filter((item: DrAhmedNewsItem) => 
          item.status === 'published' && item.id !== excludeId
        );
        
        if (categoryId) {
          filtered = filtered.filter((item: DrAhmedNewsItem) => item.category === categoryId);
        }
        
        return filtered.slice(0, limit);
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

// صفحة تفاصيل خبر الدكتور أحمد
const DrAhmedNewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState<DrAhmedNewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<DrAhmedNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // تحميل الخبر عند تحميل المكون
  useEffect(() => {
    if (id) {
      loadNewsData(id);
    }
  }, [id]);

  // زيادة عدد المشاهدات عند تحميل الخبر
  useEffect(() => {
    if (id && newsItem) {
      drAhmedNewsService.incrementViews(id);
    }
  }, [id, newsItem]);

  // تحميل بيانات الخبر
  const loadNewsData = async (newsId: string) => {
    try {
      setIsLoading(true);
      
      // تحميل الخبر الحالي
      const currentNews = await drAhmedNewsService.getNewsById(newsId);
      setNewsItem(currentNews);
      
      // تحميل الأخبار ذات الصلة إذا وجد الخبر الحالي
      if (currentNews) {
        const related = await drAhmedNewsService.getRelatedNews(newsId, currentNews.category, 3);
        setRelatedNews(related);
      }
    } catch (error) {
      console.error('خطأ في تحميل الخبر:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // الحصول على معلومات التصنيف
  const getCategoryInfo = (categoryId?: string) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'عام', color: 'bg-gray-100 text-gray-800' };
  };

  // زيادة عدد المشاهدات عند النقر على خبر ذي صلة
  const handleRelatedNewsClick = (newsId: string) => {
    drAhmedNewsService.incrementViews(newsId);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-lg">جاري تحميل الخبر...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!newsItem) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">الخبر غير موجود</h1>
            <Button asChild>
              <Link to="/dr-ahmed-news">العودة لصفحة الأخبار</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const categoryInfo = getCategoryInfo(newsItem.category);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* مسار التنقل */}
        <section className="py-4 bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <Link to="/" className="hover:text-primary">الرئيسية</Link>
              <ArrowRight className="w-4 h-4" />
              <Link to="/dr-ahmed-news" className="hover:text-primary">أخبار الدكتور أحمد</Link>
              <ArrowRight className="w-4 h-4" />
              <span className="text-gray-900 truncate">{newsItem.title}</span>
            </nav>
          </div>
        </section>

        {/* محتوى المقال */}
        <article className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="p-8">
                {/* رأس المقال */}
                <header className="mb-8">
                  {/* شارات */}
                  <div className="flex flex-wrap gap-2 mb-4 justify-end">
                    {newsItem.featured && (
                      <Badge className="bg-amber-500 text-white">
                        <Star className="w-3 h-3 ml-1" />
                        مميز
                      </Badge>
                    )}
                    {newsItem.category && (
                      <Badge className={categoryInfo.color}>
                        {categoryInfo.name}
                      </Badge>
                    )}
                    <Badge variant="outline" className="flex items-center">
                      <Eye className="w-3 h-3 ml-1" />
                      {newsItem.views}
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-right leading-tight">
                    {newsItem.title}
                  </h1>
                  
                  <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-gray-200">
                    <div className="flex items-center text-gray-600 space-x-2 space-x-reverse">
                      <Calendar className="w-5 h-5 ml-2" />
                      <span>{new Date(newsItem.date).toLocaleDateString('ar-IQ')}</span>
                    </div>
                    <div className="flex items-center text-gray-600 space-x-2 space-x-reverse">
                      <User className="w-5 h-5 ml-2" />
                      <span>{newsItem.author}</span>
                    </div>
                  </div>
                </header>

                {/* ملخص الخبر */}
                {newsItem.summary && (
                  <div className="mb-8 bg-gray-50 p-4 rounded-lg border-r-4 border-primary">
                    <p className="text-gray-700 font-medium">{newsItem.summary}</p>
                  </div>
                )}

                {/* صورة المقال الرئيسية */}
                {newsItem.image && (
                  <div className="mb-8">
                    <div className="rounded-lg overflow-hidden shadow-lg">
                      <img 
                        src={newsItem.image} 
                        alt={newsItem.title}
                        className="w-full max-h-[600px] object-contain bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <div className="hidden w-full h-64 md:h-96 bg-gray-200 items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    {newsItem.imagecaption && (
                      <p className="text-sm text-gray-600 mt-3 text-center italic bg-gray-50 p-2 rounded">
                        {newsItem.imagecaption}
                      </p>
                    )}
                  </div>
                )}

                {/* محتوى المقال */}
                <div className="prose prose-lg max-w-none text-right">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg mb-6">
                    {newsItem.content}
                  </div>
                  
                  {/* المحتوى HTML المحسن */}
                  {newsItem.content_html && (
                    <div 
                      className="enhanced-content text-gray-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: newsItem.content_html }}
                    />
                  )}
                </div>

                {/* الوسائط المتعددة */}
                {newsItem.media && newsItem.media.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-right">الوسائط المرفقة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {newsItem.media.map((mediaItem) => (
                        <div key={mediaItem.id} className="border rounded-lg overflow-hidden">
                          {mediaItem.type === 'image' && (
                            <div>
                              <img 
                                src={mediaItem.url} 
                                alt={mediaItem.caption || 'صورة'}
                                className="w-full h-48 object-cover"
                              />
                              {mediaItem.caption && (
                                <div className="p-2 text-sm text-gray-600 text-center">
                                  {mediaItem.caption}
                                </div>
                              )}
                            </div>
                          )}
                          {mediaItem.type === 'video' && (
                            <div>
                              <video 
                                src={mediaItem.url} 
                                controls
                                className="w-full h-48 object-cover"
                              />
                              {mediaItem.caption && (
                                <div className="p-2 text-sm text-gray-600 text-center">
                                  {mediaItem.caption}
                                </div>
                              )}
                            </div>
                          )}
                          {mediaItem.type === 'file' && (
                            <div className="p-4">
                              <a 
                                href={mediaItem.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800"
                              >
                                <Paperclip className="w-4 h-4 ml-2" />
                                {mediaItem.caption || 'تنزيل الملف المرفق'}
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* الوسوم */}
                {newsItem.tags && newsItem.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4 text-gray-500" />
                      {newsItem.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* تذييل المقال */}
                <footer className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>تم النشر في: {new Date(newsItem.date).toLocaleDateString('ar-IQ')}</span>
                    {newsItem.updated_at && (
                      <span>آخر تحديث: {new Date(newsItem.updated_at).toLocaleDateString('ar-IQ')}</span>
                    )}
                  </div>
                </footer>
              </CardContent>
            </Card>

            {/* أخبار ذات صلة */}
            {relatedNews.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">أخبار ذات صلة</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedNews.map((item) => {
                    const relatedCategoryInfo = getCategoryInfo(item.category);
                    
                    return (
                      <Card key={item.id} className="hover:shadow-lg transition-shadow">
                        <Link 
                          to={`/dr-ahmed-news/${item.id}`} 
                          onClick={() => handleRelatedNewsClick(item.id)}
                        >
                          <div className="relative">
                            {/* صورة الخبر */}
                            <div className="h-40 overflow-hidden">
                              <img 
                                src={item.image || 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg'} 
                                alt={item.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg';
                                }}
                              />
                              {/* شارة التصنيف */}
                              <div className="absolute top-2 right-2">
                                <span className={`px-2 py-1 text-xs font-bold rounded text-white ${relatedCategoryInfo.color.replace('bg-', 'bg-').replace('text-', 'text-white')}`}>
                                  {relatedCategoryInfo.name}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <CardContent className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 text-right line-clamp-2">
                              {item.title}
                            </h3>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 ml-1" />
                                <span>{new Date(item.date).toLocaleDateString('ar-IQ')}</span>
                              </div>
                              <div className="flex items-center">
                                <Eye className="w-4 h-4 ml-1" />
                                <span>{item.views}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
                
                <div className="text-center mt-8">
                  <Button asChild>
                    <Link to="/dr-ahmed-news">
                      عرض جميع أخبار الدكتور أحمد
                    </Link>
                  </Button>
                </div>
              </section>
            )}
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default DrAhmedNewsDetail;