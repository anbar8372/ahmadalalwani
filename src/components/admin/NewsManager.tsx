import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Plus, Trash2, Edit, Calendar, Image, Link as LinkIcon, Upload, Loader2, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { newsService, NewsItem, sampleNewsData } from '@/lib/supabaseClient';

const NewsManager = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageSource, setImageSource] = useState<'upload' | 'url'>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load news from Supabase on component mount
  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setIsLoading(true);
      const newsData = await newsService.getAllNews();
      setNews(newsData);
    } catch (error) {
      console.error('خطأ في تحميل الأخبار:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الأخبار من قاعدة البيانات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSampleData = async () => {
    try {
      setIsLoading(true);
      await newsService.initializeSampleData();
      await loadNews();
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الأخبار النموذجية بنجاح",
      });
    } catch (error) {
      console.error('خطأ في إضافة البيانات النموذجية:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة البيانات النموذجية",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNews = () => {
    const newNews: NewsItem = {
      id: crypto.randomUUID(),
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editingNews) {
      try {
        setIsUploading(true);
        
        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        
        // Upload to Supabase Storage
        const imageUrl = await newsService.uploadImage(file, fileName);
        
        setEditingNews({
          ...editingNews,
          image: imageUrl
        });

        toast({
          title: "تم رفع الصورة",
          description: "تم رفع الصورة بنجاح",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "خطأ في رفع الصورة",
          description: "فشل في رفع الصورة. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const saveNews = async () => {
    if (!editingNews || !editingNews.title.trim() || !editingNews.content.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Save to Supabase
      await newsService.upsertNews(editingNews);
      
      // Reload news from database
      await loadNews();
      
      setEditingNews(null);
      setIsEditing(false);

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ الخبر بنجاح في قاعدة البيانات",
      });
    } catch (error) {
      console.error('Error saving news:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "فشل في حفظ الخبر. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNews = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Delete from Supabase
      await newsService.deleteNews(id);
      
      // Reload news from database
      await loadNews();

      toast({
        title: "تم الحذف",
        description: "تم حذف الخبر بنجاح من قاعدة البيانات",
      });
    } catch (error) {
      console.error('Error deleting news:', error);
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف الخبر. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingNews(null);
    setIsEditing(false);
  };

  if (isLoading && news.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="mr-2">جاري تحميل الأخبار...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">إدارة الأخبار</CardTitle>
          <div className="flex gap-2">
            {news.length === 0 && (
              <Button onClick={initializeSampleData} size="sm" variant="outline" disabled={isLoading}>
                <Database className="w-4 h-4 ml-2" />
                إضافة أخبار نموذجية
              </Button>
            )}
            <Button onClick={addNews} size="sm" disabled={isLoading}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة خبر جديد
            </Button>
          </div>
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                    disabled={isLoading}
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
                        <Upload className="w-4 h-4" />
                        رفع مباشر
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="url" className="space-y-2">
                      <Input
                        placeholder="أدخل رابط الصورة"
                        value={editingNews.image || ''}
                        onChange={(e) => setEditingNews({...editingNews, image: e.target.value})}
                        className="text-right"
                        disabled={isLoading}
                      />
                    </TabsContent>
                    
                    <TabsContent value="upload" className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-right"
                        disabled={isLoading || isUploading}
                      />
                      {isUploading && (
                        <div className="flex items-center text-sm text-blue-600">
                          <Loader2 className="w-4 h-4 animate-spin ml-2" />
                          جاري رفع الصورة...
                        </div>
                      )}
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
                        disabled={isLoading}
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
                      disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={saveNews} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 ml-2" />
                        حفظ الخبر
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={cancelEdit} disabled={isLoading}>
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          )}

          {news.length === 0 && !isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد أخبار حالياً</p>
              <p className="text-sm">اضغط على "إضافة أخبار نموذجية" لإضافة أخبار تجريبية أو "إضافة خبر جديد" لإضافة خبر مخصص</p>
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
                        disabled={isLoading}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => deleteNews(newsItem.id)}
                        variant="destructive" 
                        size="sm"
                        disabled={isLoading}
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