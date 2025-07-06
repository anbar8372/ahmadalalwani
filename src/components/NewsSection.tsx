import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ChevronRight, Loader2, ChevronDown } from 'lucide-react';
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
      
      // Try to load from localStorage first
      const savedNews = localStorage.getItem('website-news');
      if (savedNews) {
        const parsedNews = JSON.parse(savedNews);
        setNews(parsedNews.slice(0, 5)); // Get 5 news items
        setIsLoading(false);
        return;
      }

      // Fallback to Supabase
      const latestNews = await newsService.getLatestNews(5);
      setNews(latestNews);
    } catch (error) {
      console.error('خطأ في تحميل الأخبار:', error);
      
      // If both fail, create sample news
      const sampleNews = [
        {
          id: '1',
          title: 'فيديوهات حماس في أول ظهور منذ انتهاء الحرب في إسرائيل',
          content: 'محتوى الخبر الأول...',
          date: '2024-12-15',
          author: 'الدكتور أحمد العلواني',
          image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg'
        },
        {
          id: '2',
          title: 'نتنياهو يعلن رفض إسرائيل "تعديلات حماس" على مقترح غزة',
          content: 'محتوى الخبر الثاني...',
          date: '2024-12-14',
          author: 'الدكتور أحمد العلواني',
          image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg'
        },
        {
          id: '3',
          title: '"كلمات قاسية" من مهدي تشلسي للجمهور.. ماذا قال؟',
          content: 'محتوى الخبر الثالث...',
          date: '2024-12-13',
          author: 'الدكتور أحمد العلواني',
          image: 'https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg'
        },
        {
          id: '4',
          title: 'رئيس أميركي يهتم لمواطنيه من حزبين قتل نهما ريد مليون شخص',
          content: 'محتوى الخبر الرابع...',
          date: '2024-12-12',
          author: 'الدكتور أحمد العلواني',
          image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg'
        },
        {
          id: '5',
          title: 'هدنة غزة.. تحرك إسرائيلي مرتقب وبيان من حماس',
          content: 'محتوى الخبر الخامس...',
          date: '2024-12-11',
          author: 'الدكتور أحمد العلواني',
          image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg'
        }
      ];
      setNews(sampleNews);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="mr-2">جاري تحميل الأخبار...</span>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }


          {/* Right Side - News Grid */}
          <div className="lg:col-span-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-right">
              آخر الأخبار الخاصة بالدكتور أحمد العلواني
            </h2>
            
            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((newsItem, index) => (
                <Card 
                  key={newsItem.id} 
                  className={`group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                    index === 0 ? 'md:col-span-2 md:row-span-1' : ''
                  }`}
                  style={{ height: index === 0 ? '300px' : '250px' }}
                >
                  <Link to={`/news/${newsItem.id}`} className="block h-full">
                    <div className="relative h-full">
                      {/* News Image */}
                      <div className="absolute inset-0">
                        <img 
                          src={newsItem.image || 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg'} 
                          alt={newsItem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg';
                          }}
                        />
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                      </div>
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                        {/* Category Badge */}
                        <div className="flex justify-end">
                          <span className={`px-3 py-1 text-xs font-bold rounded ${
                            index === 0 ? 'bg-red-600' : 
                            index === 1 ? 'bg-red-600' : 
                            index === 2 ? 'bg-green-600' :
                            index === 3 ? 'bg-red-600' :
                            'bg-red-600'
                          }`}>
                            {index === 0 ? 'لقاءات  خاصة' : 
                             index === 1 ? 'لقاءات خاصة' : 
                             index === 2 ? 'لقاءات  خاصة' :
                             index === 3 ? 'لقاءات  خاصة' :
                             'خبر أساسي'}
                          </span>
                        </div>
                        
                        {/* News Title */}
                        <div>
                          <h3 className={`font-bold text-right leading-tight mb-2 ${
                            index === 0 ? 'text-xl md:text-2xl' : 'text-lg'
                          }`}>
                            {newsItem.title}
                          </h3>
                          
                          {/* Date */}
                          <div className="flex items-center justify-end text-sm opacity-90">
                            <span>{new Date(newsItem.date).toLocaleDateString('ar-IQ')}</span>
                            <Calendar className="w-4 h-4 mr-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
            
            {/* View More Button */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link to="/news" className="flex items-center space-x-2 space-x-reverse">
                  <span>عرض جميع الأخبار</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Arrow */}
        <div className="text-center mt-12">
          <ChevronDown className="w-8 h-8 text-gray-400 mx-auto animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default NewsSection;