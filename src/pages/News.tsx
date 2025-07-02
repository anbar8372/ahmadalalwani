
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Image as ImageIcon } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  image?: string;
  imageCaption?: string;
}

const News = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const savedNews = localStorage.getItem('website-news');
    if (savedNews) {
      try {
        const allNews = JSON.parse(savedNews);
        const currentNews = allNews.find((item: NewsItem) => item.id === id);
        setNewsItem(currentNews);
        
        // Get related news (exclude current news)
        const related = allNews.filter((item: NewsItem) => item.id !== id).slice(0, 3);
        setRelatedNews(related);
      } catch (error) {
        console.error('خطأ في تحميل الخبر:', error);
      }
    }
  }, [id]);

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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <section className="py-4 bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <Link to="/" className="hover:text-primary">الرئيسية</Link>
              <ArrowRight className="w-4 h-4" />
              <span>الأخبار</span>
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
                    <div className="flex items-center text-gray-600 space-x-2 space-x-reverse">
                      <User className="w-5 h-5 ml-2" />
                      <span>{newsItem.author}</span>
                    </div>
                  </div>
                </header>

                {/* Article Image */}
                {newsItem.image && (
                  <div className="mb-8">
                    <div className="rounded-lg overflow-hidden shadow-lg">
                      <img 
                        src={newsItem.image} 
                        alt={newsItem.title}
                        className="w-full h-64 md:h-96 object-cover"
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
                      <p className="text-sm text-gray-600 mt-2 text-center italic">
                        {newsItem.imageCaption}
                      </p>
                    )}
                  </div>
                )}

                {/* Article Content */}
                <div className="prose prose-lg max-w-none text-right">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {newsItem.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related News */}
            {relatedNews.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">أخبار ذات صلة</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedNews.map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="w-4 h-4 ml-2" />
                          <span>{new Date(item.date).toLocaleDateString('ar-IQ')}</span>
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
                  ))}
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
