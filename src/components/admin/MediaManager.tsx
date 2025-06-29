
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'article' | 'interview';
  url: string;
  thumbnail: string;
  description: string;
  date: string;
  source: string;
}

interface MediaCategory {
  id: string;
  name: string;
  description: string;
}

const MediaManager = () => {
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<MediaCategory[]>([
    {
      id: '1',
      name: 'المقابلات التلفزيونية',
      description: 'المقابلات والحوارات التلفزيونية'
    },
    {
      id: '2',
      name: 'المقالات الصحفية',
      description: 'المقالات والتقارير الصحفية'
    },
    {
      id: '3',
      name: 'الصور الرسمية',
      description: 'الصور الرسمية والفعاليات'
    }
  ]);

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      title: 'مقابلة حول الوضع الاقتصادي',
      type: 'interview',
      url: '',
      thumbnail: '',
      description: 'مقابلة تلفزيونية حول الوضع الاقتصادي في العراق',
      date: '2012',
      source: 'قناة الجزيرة'
    }
  ]);

  const [mediaOverview, setMediaOverview] = useState('');

  const addCategory = () => {
    const newCategory: MediaCategory = {
      id: Date.now().toString(),
      name: '',
      description: ''
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, field: keyof MediaCategory, value: string) => {
    setCategories(categories => 
      categories.map(category => 
        category.id === id ? { ...category, [field]: value } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(categories => categories.filter(category => category.id !== id));
  };

  const addMediaItem = () => {
    const newItem: MediaItem = {
      id: Date.now().toString(),
      title: '',
      type: 'image',
      url: '',
      thumbnail: '',
      description: '',
      date: '',
      source: ''
    };
    setMediaItems([...mediaItems, newItem]);
  };

  const updateMediaItem = (id: string, field: keyof MediaItem, value: string) => {
    setMediaItems(items => 
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Media Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">نظرة عامة على وسائل الإعلام</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="media-overview">النص التعريفي</Label>
            <Textarea
              id="media-overview"
              value={mediaOverview}
              onChange={(e) => setMediaOverview(e.target.value)}
              className="text-right min-h-[150px]"
              placeholder="اكتب نبذة عن التغطية الإعلامية..."
            />
          </div>
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ النظرة العامة
          </Button>
        </CardContent>
      </Card>

      {/* Media Categories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">فئات المحتوى الإعلامي</CardTitle>
          <Button onClick={addCategory} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة فئة
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">فئة #{category.id}</h3>
                <Button 
                  onClick={() => deleteCategory(category.id)}
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>اسم الفئة</Label>
                  <Input
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الوصف</Label>
                  <Textarea
                    value={category.description}
                    onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                    className="text-right"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ فئات المحتوى
          </Button>
        </CardContent>
      </Card>

      {/* Media Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">المحتوى الإعلامي</CardTitle>
          <Button onClick={addMediaItem} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة محتوى
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {mediaItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">محتوى #{item.id}</h3>
                <Button 
                  onClick={() => deleteMediaItem(item.id)}
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>العنوان</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateMediaItem(item.id, 'title', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>النوع</Label>
                  <select
                    value={item.type}
                    onChange={(e) => updateMediaItem(item.id, 'type', e.target.value as MediaItem['type'])}
                    className="w-full p-2 border rounded text-right"
                  >
                    <option value="image">صورة</option>
                    <option value="video">فيديو</option>
                    <option value="article">مقال</option>
                    <option value="interview">مقابلة</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>التاريخ</Label>
                  <Input
                    value={item.date}
                    onChange={(e) => updateMediaItem(item.id, 'date', e.target.value)}
                    className="text-right"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رابط المحتوى</Label>
                  <Input
                    value={item.url}
                    onChange={(e) => updateMediaItem(item.id, 'url', e.target.value)}
                    className="text-right"
                    placeholder="https://example.com/content"
                  />
                </div>
                <div className="space-y-2">
                  <Label>صورة مصغرة</Label>
                  <Input
                    value={item.thumbnail}
                    onChange={(e) => updateMediaItem(item.id, 'thumbnail', e.target.value)}
                    className="text-right"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>المصدر</Label>
                <Input
                  value={item.source}
                  onChange={(e) => updateMediaItem(item.id, 'source', e.target.value)}
                  className="text-right"
                  placeholder="اسم القناة أو الصحيفة"
                />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateMediaItem(item.id, 'description', e.target.value)}
                  className="text-right"
                  rows={3}
                />
              </div>
            </div>
          ))}
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ المحتوى الإعلامي
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaManager;
