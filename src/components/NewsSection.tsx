import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsService, NewsItem } from '@/lib/supabaseClient';

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLatestNews();
  }, []);

  const loadLatestNews = async () => {
    try {
      setIsLoading(true);
      const latestNews = await newsService.getLatestNews(3);
      setNews(latestNews);
    } catch (error) {
      console.error('خطأ في تحميل الأخبار:', error);
      // Fallback to localStorage if Supabase fails
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        try {
          const parsedNews = JSON.parse(savedNews);
          setNews(parsedNews.slice(0, 3));
        } catch (localError) {
          console.error('خطأ في تحميل الأخبار من التخزين المحلي:', localError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">آخر الأخبار</h2>
            <p className="text-lg md:text-xl text-gray-600 px-4">
              تابع آخر الأخبار والتطورات
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="mr-2">جاري تحميل الأخبار...</span>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null; // Don't show the section if there are no news
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">آخر الأخبار</h2>
          <p className="text-lg md:text-xl text-gray-600 px-4">
            تابع آخر الأخبار والتطورات
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {news.map((newsItem) => (
            <Card key={newsItem.id} className="hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                {/* News Image */}
                {newsItem.image && (
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={newsItem.image} 
                      alt={newsItem.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 ml-2" />
                  <span>{new Date(newsItem.date).toLocaleDateString('ar-IQ')}</span>
                  <span className="mx-2">•</span>
                  <User className="w-4 h-4 ml-1" />
                  <span>{newsItem.author}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-right group-hover:text-primary transition-colors">
                  {newsItem.title}
                </h3>
                
                <p className="text-gray-600 text-right leading-relaxed mb-4 line-clamp-3">
                  {newsItem.content}
                </p>
                
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary-foreground hover:bg-primary p-0 h-auto font-normal" asChild>
                  <Link to={`/news/${newsItem.id}`}>
                    <span>اقرأ المزيد</span>
                    <ChevronRight className="w-4 h-4 mr-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;