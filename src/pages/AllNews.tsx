import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Search, Filter, Loader2, ArrowRight } from 'lucide-react';
import { newsService, NewsItem } from '@/lib/supabaseClient';

interface EnhancedNewsItem extends NewsItem {
  category?: string;
}

const AllNews = () => {
  const [news, setNews] = useState<EnhancedNewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<EnhancedNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const newsPerPage = 9;

  // Load categories from localStorage
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('news-categories');
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

  // Add "all" option to categories for filtering
  const filterCategories = [
    { id: 'all', name: 'جميع الأخبار', color: 'bg-gray-100 text-gray-800' },
    ...categories
  ];

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchTerm, selectedCategory, sortBy]);

  // Listen for real-time updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'news-update-trigger') {
        loadNews();
      }
      if (e.key === 'news-categories') {
        const newCategories = e.newValue ? JSON.parse(e.newValue) : [];
        setCategories(newCategories);
      }
    };

    const channel = new BroadcastChannel('news-updates');
    channel.onmessage = (event) => {
      if (event.data.type === 'NEWS_UPDATED') {
        loadNews();
      }
    };

    // Listen for custom events for immediate updates
    const handleNewsUpdated = () => {
      loadNews();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('newsUpdated', handleNewsUpdated);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('newsUpdated', handleNewsUpdated);
      channel.close();
    };
  }, []);

  const loadNews = async () => {
    try {
      setIsLoading(true);
      const newsData = await newsService.getAllNews();
      setNews(newsData);
    } catch (error) {
      console.error('خطأ في تحميل الأخبار:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = [...news];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return a.title.localeCompare(b.title, 'ar');
      }
    });

    setFilteredNews(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / newsPerPage);
  const startIndex = (currentPage - 1) * newsPerPage;
  const endIndex = startIndex + newsPerPage;
  const currentNews = filteredNews.slice(startIndex, endIndex);

  const getCategoryInfo = (categoryId?: string) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'عام', color: 'bg-gray-100 text-gray-800' };
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-lg">جاري تحميل الأخبار...</p>
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
              <span>جميع الأخبار</span>
            </nav>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">جميع الأخبار</h1>
              <p className="text-xl opacity-90">
                تابع آخر الأخبار والتطورات الخاصة بالدكتور أحمد العلواني
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Search */}
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

                {/* Sort */}
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'title')}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">التاريخ (الأحدث أولاً)</SelectItem>
                    <SelectItem value="title">العنوان (أبجدياً)</SelectItem>
                  </SelectContent>
                </Select>

                {/* Results Count */}
                <div className="flex items-center justify-center bg-gray-50 rounded-md px-4 py-2">
                  <span className="text-sm text-gray-600">
                    {filteredNews.length} خبر
                  </span>
                </div>
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
                {currentNews.map((newsItem, index) => {
                  const categoryInfo = getCategoryInfo(newsItem.category);
                  
                  return (
                    <Card
                      key={newsItem.id}
                      className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      <Link to={`/news/${newsItem.id}`} className="block h-full">
                        <div className="relative">
                          {/* News Image */}
                          {newsItem.image ? (
                            <div className="h-48 overflow-hidden">
                              <img
                                src={newsItem.image}
                                alt={newsItem.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <Calendar className="w-12 h-12 text-gray-400" />
                            </div>
                          )}

                          {/* Category Badge */}
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 text-xs font-bold rounded ${categoryInfo.color}`}>
                              {categoryInfo.name}
                            </span>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          {/* Date and Author */}
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <div className="flex items-center">
                              <User className="w-4 h-4 ml-2" />
                              <span>{newsItem.author}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 ml-2" />
                              <span>{new Date(newsItem.date).toLocaleDateString('ar-IQ')}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-gray-900 mb-3 text-right line-clamp-2 group-hover:text-primary transition-colors">
                            {newsItem.title}
                          </h3>

                          {/* Content Preview */}
                          <p className="text-gray-600 text-right line-clamp-3 text-sm leading-relaxed">
                            {newsItem.content}
                          </p>

                          {/* Read More */}
                          <div className="mt-4 flex justify-end">
                            <span className="text-primary text-sm font-medium group-hover:underline">
                              اقرأ المزيد ←
                            </span>
                          </div>
                        </CardContent>
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

export default AllNews;