import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Search, Loader2, ArrowRight, Star, Eye, Filter } from 'lucide-react';
import { DrAhmedNewsItem, drAhmedNewsService, DEFAULT_CATEGORIES } from '@/types/dr-ahmed-news';

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

  // Load categories from localStorage
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('dr-ahmed-news-categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  // Add "all" option to categories for filtering
  const filterCategories = [
    { id: 'all', name: 'جميع الأخبار', color: 'bg-gray-100 text-gray-800' },
    ...categories
  ];

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

  // Filter news when search term, category, or sort options change
  useEffect(() => {
    filterNews();
  }, [news, searchTerm, selectedCategory, sortBy, sortOrder]);

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

  const filterNews = () => {
    let filtered = [...news];

    // Filter by status (only show published)
    filtered = filtered.filter(item => item.status === 'published');

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
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
    setCurrentPage(1);
  };

  // Get category info
  const getCategoryInfo = (categoryId?: string) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'عام', color: 'bg-gray-100 text-gray-800' };
  };

  // Increment views when clicking on news
  const handleNewsClick = (id: string) => {
    drAhmedNewsService.incrementViews(id);
  };

  // Pagination
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
        {/* Header */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
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
          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
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

                {/* Category Filter */}
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

                {/* Sort By */}
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

                {/* Sort Order */}
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

          {/* News Grid */}
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
                          {/* News Image */}
                          <div className="h-48 overflow-hidden">
                            <img
                              src={newsItem.image || 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg'}
                              alt={newsItem.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg';
                              }}
                            />
                            {/* Featured Badge */}
                            {newsItem.featured && (
                              <div className="absolute top-4 right-4">
                                <span className="bg-amber-500 text-white px-2 py-1 text-xs font-bold rounded flex items-center">
                                  <Star className="w-3 h-3 ml-1" />
                                  مميز
                                </span>
                              </div>
                            )}
                            {/* Category Badge */}
                            <div className="absolute top-4 left-4">
                              <span className={`px-2 py-1 text-xs font-bold rounded text-white ${categoryInfo.color.replace('bg-', 'bg-').replace('text-', 'text-white')}`}>
                                {categoryInfo.name}
                              </span>
                            </div>
                          </div>

                          <CardContent className="p-6">
                            {/* News Title */}
                            <h3 className="text-lg font-bold text-gray-900 mb-3 text-right line-clamp-2 group-hover:text-primary transition-colors">
                              {newsItem.title}
                            </h3>

                            {/* News Summary */}
                            {newsItem.summary ? (
                              <p className="text-gray-600 text-right line-clamp-3 mb-4 text-sm">
                                {newsItem.summary}
                              </p>
                            ) : (
                              <p className="text-gray-600 text-right line-clamp-3 mb-4 text-sm">
                                {newsItem.content}
                              </p>
                            )}

                            {/* News Info */}
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

              {/* Pagination */}
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