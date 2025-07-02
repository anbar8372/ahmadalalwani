
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Plus, Trash2, Edit, Calendar, Image, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  image?: string;
  imageCaption?: string;
}

const NewsManager = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageSource, setImageSource] = useState<'upload' | 'url'>('url');

  // Load news from localStorage on component mount
  useEffect(() => {
    const savedNews = localStorage.getItem('website-news');
    if (savedNews) {
      try {
        setNews(JSON.parse(savedNews));
      } catch (error) {
        console.error('خطأ في تحميل الأخبار:', error);
      }
    }
  }, []);

  // Save news to localStorage
  const saveNewsToStorage = (newsData: NewsItem[]) => {
    localStorage.setItem('website-news', JSON.stringify(newsData));
  };

  const addNews = () => {
    const newNews: NewsItem = {
      id: Date.now().toString(),
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      author: 'الدكتور أحمد العلواني',
      image: '',
      imageCaption: ''
    };
    setEditingNews(newNews);
    setIsEditing(true);
  };

  const editNews = (newsItem: NewsItem) => {
    setEditingNews({ ...newsItem });
    setIsEditing(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editingNews) {
      // Convert file to base64 for local storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setEditingNews({
          ...editingNews,
          image: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveNews = () => {
    if (!editingNews || !editingNews.title.trim() || !editingNews.content.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    let updatedNews;
    if (news.find(item => item.id === editingNews.id)) {
      // Update existing news
      updatedNews = news.map(item => 
        item.id === editingNews.id ? editingNews : item
      );
    } else {
      // Add new news
      updatedNews = [editingNews, ...news];
    }

    setNews(updatedNews);
    saveNewsToStorage(updatedNews);
    setEditingNews(null);
    setIsEditing(false);

    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ الخبر بنجاح",
    });
  };

  const deleteNews = (id: string) => {
    const updatedNews = news.filter(item => item.id !== id);
    setNews(updatedNews);
    saveNewsToStorage(updatedNews);

    toast({
      title: "تم الحذف",
      description: "تم حذف الخبر بنجاح",
    });
  };

  const cancelEdit = () => {
    setEditingNews(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">إدارة الأخبار</CardTitle>
          <Button onClick={addNews} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة خبر جديد
          </Button>
        </CardHeader>
        <CardContent>
          {isEditing && editingNews && (
            <div className="border rounded-lg p-4 mb-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4 text-right">
                {news.find(item => item.id === editingNews.id) ? 'تعديل الخبر' : 'إضافة خبر جديد'}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="news-title">عنوان الخبر *</Label>
                    <Input
                      id="news-title"
                      value={editingNews.title}
                      onChange={(e) => setEditingNews({...editingNews, title: e.target.value})}
                      className="text-right"
                      placeholder="أدخل عنوان الخبر"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="news-date">تاريخ الخبر</Label>
                    <Input
                      id="news-date"
                      type="date"
                      value={editingNews.date}
                      onChange={(e) => setEditingNews({...editingNews, date: e.target.value})}
                      className="text-right"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="news-author">الكاتب</Label>
                  <Input
                    id="news-author"
                    value={editingNews.author}
                    onChange={(e) => setEditingNews({...editingNews, author: e.target.value})}
                    className="text-right"
                    placeholder="اسم الكاتب"
                  />
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <Label>صورة الخبر</Label>
                  <Tabs value={imageSource} onValueChange={(value) => setImageSource(value as 'upload' | 'url')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="url" className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        رابط خارجي
                      </TabsTrigger>
                      <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        رفع مباشر
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="url" className="space-y-2">
                      <Input
                        placeholder="أدخل رابط الصورة"
                        value={editingNews.image || ''}
                        onChange={(e) => setEditingNews({...editingNews, image: e.target.value})}
                        className="text-right"
                      />
                    </TabsContent>
                    
                    <TabsContent value="upload" className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-right"
                      />
                    </TabsContent>
                  </Tabs>
                  
                  {editingNews.image && (
                    <div className="mt-2">
                      <img 
                        src={editingNews.image} 
                        alt="معاينة الصورة"
                        className="w-32 h-32 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setEditingNews({...editingNews, image: ''})}
                      >
                        إزالة الصورة
                      </Button>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="image-caption">وصف الصورة (اختياري)</Label>
                    <Input
                      id="image-caption"
                      value={editingNews.imageCaption || ''}
                      onChange={(e) => setEditingNews({...editingNews, imageCaption: e.target.value})}
                      className="text-right"
                      placeholder="أدخل وصف الصورة"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="news-content">محتوى الخبر *</Label>
                  <Textarea
                    id="news-content"
                    value={editingNews.content}
                    onChange={(e) => setEditingNews({...editingNews, content: e.target.value})}
                    className="text-right"
                    rows={6}
                    placeholder="أدخل محتوى الخبر"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={saveNews}>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ الخبر
                  </Button>
                  <Button variant="outline" onClick={cancelEdit}>
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          )}

          {news.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد أخبار حالياً</p>
              <p className="text-sm">اضغط على "إضافة خبر جديد" لإضافة أول خبر</p>
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((newsItem) => (
                <div key={newsItem.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => editNews(newsItem)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => deleteNews(newsItem.id)}
                        variant="destructive" 
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-right flex-1">
                      <h4 className="font-semibold text-lg">{newsItem.title}</h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {newsItem.author} - {new Date(newsItem.date).toLocaleDateString('ar-IQ')}
                      </p>
                      {newsItem.image && (
                        <div className="mb-2">
                          <img 
                            src={newsItem.image} 
                            alt={newsItem.title}
                            className="w-20 h-20 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-right text-gray-700 line-clamp-3">{newsItem.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsManager;
