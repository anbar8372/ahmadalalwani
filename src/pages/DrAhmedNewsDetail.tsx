import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Image as ImageIcon, Loader2, Eye, Star, Tag, Paperclip } from 'lucide-react';
import { DrAhmedNewsItem, drAhmedNewsService, DEFAULT_CATEGORIES } from '@/types/dr-ahmed-news';

const DrAhmedNewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState<DrAhmedNewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<DrAhmedNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories from localStorage
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('dr-ahmed-news-categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  // Load news on component mount
  useEffect(() => {
    if (id) {
      loadNewsData(id);
    }
  }, [id]);

  // Increment views when news is loaded
  useEffect(() => {
    if (id && newsItem) {
      drAhmedNewsService.incrementViews(id);
    }
  }, [id, newsItem]);

  const loadNewsData = async (newsId: string) => {
    try {
      setIsLoading(true);
      
      // Load current news
      const currentNews = await drAhmedNewsService.getNewsById(newsId);
      setNewsItem(currentNews);
      
      // Load related news if current news exists
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

  // Get category info
  const getCategoryInfo = (categoryId?: string) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'عام', color: 'bg-gray-100 text-gray-800' };
  };

  // Increment views when clicking on related news
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
              <Link to="/dr-ahmed-news" className="hover:text-primary">أخبار الدكتور أحمد</Link>
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
                  {/* Badges */}
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

                {/* Article Summary */}
                {newsItem.summary && (
                  <div className="mb-8 bg-gray-50 p-4 rounded-lg border-r-4 border-primary">
                    <p className="text-gray-700 font-medium">{newsItem.summary}</p>
                  </div>
                )}

                {/* Main Article Image */}
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

                {/* Media */}
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

                {/* Tags */}
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

                {/* Article Footer */}
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

            {/* Related News */}
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
                            {/* News Image */}
                            <div className="h-40 overflow-hidden">
                              <img 
                                src={item.image || 'https://k.top4top.io/p_3475kzsn81.jpg'} 
                                alt={item.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://k.top4top.io/p_3475kzsn81.jpg';
                                }}
                              />
                              {/* Category Badge */}
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