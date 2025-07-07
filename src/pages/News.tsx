import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Image as ImageIcon, Loader2 } from 'lucide-react';
import { newsService, NewsItem } from '@/lib/supabaseClient';

// News categories
const NEWS_CATEGORIES = [
  { id: 'political', name: 'سياسي', color: 'bg-red-100 text-red-800' },
  { id: 'economic', name: 'اقتصادي', color: 'bg-blue-100 text-blue-800' },
  { id: 'social', name: 'اجتماعي', color: 'bg-green-100 text-green-800' },
  { id: 'cultural', name: 'ثقافي', color: 'bg-purple-100 text-purple-800' },
  { id: 'educational', name: 'تعليمي', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'general', name: 'عام', color: 'bg-gray-100 text-gray-800' }
];

interface EnhancedNewsItem extends NewsItem {
  category?: string;
  youtubeUrl?: string;
  images?: string[];
  content_html?: string;
}

const News = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState<EnhancedNewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<EnhancedNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadNewsData(id);
    }
  }, [id]);

  const loadNewsData = async (newsId: string) => {
    try {
      setIsLoading(true);
      
      // Load current news item
      const currentNews = await newsService.getNewsById(newsId);
      setNewsItem(currentNews);
      
      // Load related news if current news exists
      if (currentNews) {
        const related = await newsService.getRelatedNews(newsId, 3);
        setRelatedNews(related);
      }
    } catch (error) {
      console.error('خطأ في تحميل الخبر:', error);
      
      // Fallback to localStorage if Supabase fails
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        try {
          const allNews = JSON.parse(savedNews);
          const currentNews = allNews.find((item: EnhancedNewsItem) => item.id === newsId);
          setNewsItem(currentNews);
          
          // Get related news (exclude current news)
          const related = allNews.filter((item: EnhancedNewsItem) => item.id !== newsId).slice(0, 3);
          setRelatedNews(related);
        } catch (localError) {
          console.error('خطأ في تحميل الخبر من التخزين المحلي:', localError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryInfo = (categoryId?: string) => {
    return NEWS_CATEGORIES.find(cat => cat.id === categoryId) || NEWS_CATEGORIES[5];
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
              <Link to="/">العودة للصفحة الرئيسية</Link>
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
        {/* Breadcrumb */}
        <section className="py-4 bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <Link to="/" className="hover:text-primary">الرئيسية</Link>
              <ArrowRight className="w-4 h-4" />
              <Link to="/all-news" className="hover:text-primary">الأخبار</Link>
              <ArrowRight className="w-4 h-4" />
              <span className="text-gray-900 truncate">{newsItem.title}</span>
            </nav>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="p-8">
                {/* Article Header */}
                <header className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-right leading-tight">
                    {newsItem.title}
                  </h1>
                  
                  <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-gray-200">
                    <div className="flex items-center text-gray-600 space-x-2 space-x-reverse">
                      <Calendar className="w-5 h-5 ml-2" />
                      <span>{new Date(newsItem.date).toLocaleDateString('ar-IQ')}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-gray-600 space-x-2 space-x-reverse">
                        <User className="w-5 h-5 ml-2" />
                        <span>{newsItem.author}</span>
                      </div>
                      {newsItem.category && (
                        <span className={`px-3 py-1 rounded text-sm font-medium ${categoryInfo.color}`}>
                          {categoryInfo.name}
                        </span>
                      )}
                    </div>
                  </div>
                </header>

                {/* Article Image - Full Display */}
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
                    {newsItem.imageCaption && (
                      <p className="text-sm text-gray-600 mt-3 text-center italic bg-gray-50 p-2 rounded">
                        {newsItem.imageCaption}
                      </p>
                    )}
                  </div>
                )}

                {/* Article Content */}
                <div className="prose prose-lg max-w-none text-right">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg mb-6">
                    {newsItem.content}
                  </div>
                  
                  {/* Enhanced HTML Content */}
                  {newsItem.content_html && (
                    <div 
                      className="enhanced-content text-gray-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: newsItem.content_html }}
                    />
                  )}
                </div>

                {/* Article Footer */}
                <footer className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>تم النشر في: {new Date(newsItem.date).toLocaleDateString('ar-IQ')}</span>
                    {newsItem.created_at && (
                      <span>تم الإنشاء: {new Date(newsItem.created_at).toLocaleDateString('ar-IQ')}</span>
                    )}
                  </div>
                </footer>
              </CardContent>
            </Card>

            {/* Related News */}
            {relatedNews.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">أخبار ذات صلة</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedNews.map((item) => {
                    const relatedCategoryInfo = getCategoryInfo(item.category);
                    
                    return (
                      <Card key={item.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          {/* Related News Image */}
                          {item.image && (
                            <div className="mb-4 overflow-hidden rounded-lg">
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 ml-2" />
                              <span>{new Date(item.date).toLocaleDateString('ar-IQ')}</span>
                            </div>
                            {item.category && (
                              <span className={`px-2 py-1 rounded text-xs ${relatedCategoryInfo.color}`}>
                                {relatedCategoryInfo.name}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-3 text-right line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-right line-clamp-3 mb-4">
                            {item.content}
                          </p>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/news/${item.id}`}>
                              اقرأ المزيد
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default News;