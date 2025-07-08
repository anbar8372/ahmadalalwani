import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ChevronRight, Loader2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsService, NewsItem } from '@/lib/supabaseClient';

interface EnhancedNewsItem extends NewsItem {
  category?: string;
}

const NewsSection = () => {
  const [news, setNews] = useState<EnhancedNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories from localStorage
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('news-categories');
    const defaultCategories = [
      { id: 'political', name: 'سياسي', color: 'bg-red-600' },
      { id: 'economic', name: 'اقتصادي', color: 'bg-blue-600' },
      { id: 'social', name: 'اجتماعي', color: 'bg-green-600' },
      { id: 'cultural', name: 'ثقافي', color: 'bg-purple-600' },
      { id: 'educational', name: 'تعليمي', color: 'bg-yellow-600' },
      { id: 'general', name: 'عام', color: 'bg-gray-600' }
    ];
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  useEffect(() => {
    loadLatestNews();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'news-update-trigger') {
        loadLatestNews();
      }
      if (e.key === 'news-categories') {
        const newCategories = e.newValue ? JSON.parse(e.newValue) : [];
        setCategories(newCategories);
      }
    };

    const channel = new BroadcastChannel('news-updates');
    channel.onmessage = (event) => {
      if (event.data.type === 'NEWS_UPDATED') {
        loadLatestNews();
      }
    };

    // Listen for custom events for immediate updates
    const handleNewsUpdated = () => {
      loadLatestNews();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('newsUpdated', handleNewsUpdated);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('newsUpdated', handleNewsUpdated);
      channel.close();
    };
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
          title: 'الشيخ الدكتور أحمد العلواني يستقبل عضو مجلس محافظة الأنبار حميد دحام العلواني',
          content: 'استقبل الشيخ الدكتور أحمد العلواني، وفد المظلة العراقية الجامعة، في مقر إقامته بمدينة الرمادي. وناقش الجانبان عدد من الملفات التي تخص الشأن العراقي، في ظل ما تشهده المنطقة من متغيرات، كما تم التأكيد على حفظ أمن واستقرار العراق، وتعزيز التماسك الاجتماعي بين أبناء الشعب الواحد.',
          date: '2025-06-14',
          author: 'المكتب الإعلامي',
          image: 'https://scontent-sof1-1.xx.fbcdn.net/v/t39.30808-6/505787034_122120178950851058_7790142878532884553_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=uTbyxBh-MG0Q7kNvwFuGxEm&_nc_oc=AdnwNvpZ-SwrTGUWcAOp66mD-_VTh8o7i3l4rVENVE6YbbtJw-hCycO2VgwefQSc6Yc&_nc_zt=23&_nc_ht=scontent-sof1-1.xx&_nc_gid=iV4ovw2Q_Qbutd0HKaMYhw&oh=00_AfTQyIhE-OiCrY82Y85cjwMJtUBBewyqIwmIJfNqNF6MaQ&oe=686F9FD7',
          category: 'political'
        },
        {
          id: '2',
          title: 'الدكتور أحمد العلواني يستقبل وفد المظلة العراقية الجامعة',
          content: 'استقبل الشيخ الدكتور أحمد العلواني، وفد المظلة العراقية الجامعة، في مقر إقامته بمدينة الرمادي. وناقش الجانبان عدد من الملفات التي تخص الشأن العراقي، في ظل ما تشهده المنطقة من متغيرات، كما تم التأكيد على حفظ أمن واستقرار العراق، وتعزيز التماسك الاجتماعي بين أبناء الشعب الواحد.',
          date: '2025-06-12',
          author: 'المكتب الإعلامي',
          image: 'https://scontent-sof1-2.xx.fbcdn.net/v/t39.30808-6/505893615_122119700126851058_8234419387102767012_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=QJOM_BN2cE0Q7kNvwH_3SPN&_nc_oc=AdmL95M7_ws5cNsmkTJAc7bb298Ff9gGvWbNDM1wGKySFnibNUJvCcyv5VyyyPjlxWo&_nc_zt=23&_nc_ht=scontent-sof1-2.xx&_nc_gid=ofZuuoZUXhq5ZSse1Z0m_A&oh=00_AfTXgJkQmbjrv4BkHFXc2uOijPR3SftUZiRaaGUcY3Fspg&oe=686F84D5',
          category: 'political'
        },
        {
          id: '3',
          title: 'لقاء الدكتور أحمد العلواني مع الشيخ رعد عبد الجبار العلي سليمان',
          content: 'محتوى الخبر الثالث...',
          date: '2024-12-13',
          author: 'الدكتور أحمد العلواني',
          image: 'https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg',
          category: 'social'
        }
      ];
      setNews(sampleNews);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryInfo = (categoryId?: string) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'عام', color: 'bg-gray-600' };
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

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered News Grid */}
        <div className="w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            آخر الأخبار الخاصة بالدكتور أحمد العلواني
          </h2>

          {/* News Grid - Centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
            {news.map((newsItem, index) => {
              const categoryInfo = getCategoryInfo(newsItem.category);
              
              return (
                <Card
                  key={newsItem.id}
                  className={`group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden mx-auto`}
                  style={{ width: '100%', maxWidth: '400px', height: index === 0 ? '300px' : '250px' }}
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
                          <span className={`px-3 py-1 text-xs font-bold rounded text-white ${categoryInfo.color}`}>
                            {categoryInfo.name}
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
              );
            })}
          </div>

          {/* View More Button - Centered */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link to="/all-news" className="flex items-center space-x-2 space-x-reverse justify-center mx-auto">
                <span>عرض جميع الأخبار</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom Arrow - Centered */}
        <div className="text-center mt-12">
          <ChevronDown className="w-8 h-8 text-gray-400 mx-auto animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default NewsSection;