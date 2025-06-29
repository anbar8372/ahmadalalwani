
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  uploadDate: string;
}

interface ImageCategory {
  id: string;
  name: string;
  description: string;
}

const ImageGalleryManager = () => {
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<ImageCategory[]>([
    {
      id: '1',
      name: 'الفعاليات الرسمية',
      description: 'صور الفعاليات والمناسبات الرسمية'
    },
    {
      id: '2',
      name: 'الاجتماعات البرلمانية',
      description: 'صور الجلسات والاجتماعات البرلمانية'
    },
    {
      id: '3',
      name: 'اللقاءات الشعبية',
      description: 'صور اللقاءات مع المواطنين'
    }
  ]);

  const [images, setImages] = useState<GalleryImage[]>([
    {
      id: '1',
      title: 'اجتماع اللجنة الاقتصادية',
      url: '',
      description: 'صورة من اجتماع اللجنة الاقتصادية في البرلمان العراقي',
      category: '2',
      tags: ['برلمان', 'اقتصاد', 'لجنة'],
      uploadDate: '2023-01-01'
    }
  ]);

  const [gallerySettings, setGallerySettings] = useState({
    pageTitle: 'معرض الصور',
    pageDescription: 'مجموعة من الصور التي توثق المسيرة السياسية والاجتماعية',
    imagesPerPage: '12'
  });

  const addCategory = () => {
    const newCategory: ImageCategory = {
      id: Date.now().toString(),
      name: '',
      description: ''
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, field: keyof ImageCategory, value: string) => {
    setCategories(categories => 
      categories.map(category => 
        category.id === id ? { ...category, [field]: value } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(categories => categories.filter(category => category.id !== id));
  };

  const addImage = () => {
    const newImage: GalleryImage = {
      id: Date.now().toString(),
      title: '',
      url: '',
      description: '',
      category: categories[0]?.id || '1',
      tags: [],
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setImages([...images, newImage]);
  };

  const updateImage = (id: string, field: keyof Omit<GalleryImage, 'tags'>, value: string) => {
    setImages(images => 
      images.map(image => 
        image.id === id ? { ...image, [field]: value } : image
      )
    );
  };

  const updateImageTags = (id: string, tags: string[]) => {
    setImages(images => 
      images.map(image => 
        image.id === id ? { ...image, tags } : image
      )
    );
  };

  const deleteImage = (id: string) => {
    setImages(images => images.filter(image => image.id !== id));
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "تم النسخ",
      description: "تم نسخ رابط الصورة",
    });
  };

  return (
    <div className="space-y-6">
      {/* Gallery Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">إعدادات المعرض</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gallery-title">عنوان الصفحة</Label>
              <Input
                id="gallery-title"
                value={gallerySettings.pageTitle}
                onChange={(e) => setGallerySettings({...gallerySettings, pageTitle: e.target.value})}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="images-per-page">عدد الصور في الصفحة</Label>
              <Input
                id="images-per-page"
                value={gallerySettings.imagesPerPage}
                onChange={(e) => setGallerySettings({...gallerySettings, imagesPerPage: e.target.value})}
                className="text-right"
                type="number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gallery-description">وصف المعرض</Label>
            <Textarea
              id="gallery-description"
              value={gallerySettings.pageDescription}
              onChange={(e) => setGallerySettings({...gallerySettings, pageDescription: e.target.value})}
              className="text-right"
              rows={3}
            />
          </div>
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ إعدادات المعرض
          </Button>
        </CardContent>
      </Card>

      {/* Image Categories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">فئات الصور</CardTitle>
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
            حفظ فئات الصور
          </Button>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">الصور</CardTitle>
          <Button onClick={addImage} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة صورة
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {images.map((image) => (
            <div key={image.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">صورة #{image.id}</h3>
                <div className="flex space-x-2 space-x-reverse">
                  <Button 
                    onClick={() => copyImageUrl(image.url)}
                    variant="outline" 
                    size="sm"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => deleteImage(image.id)}
                    variant="destructive" 
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>عنوان الصورة</Label>
                  <Input
                    value={image.title}
                    onChange={(e) => updateImage(image.id, 'title', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الفئة</Label>
                  <select
                    value={image.category}
                    onChange={(e) => updateImage(image.id, 'category', e.target.value)}
                    className="w-full p-2 border rounded text-right"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>تاريخ الرفع</Label>
                  <Input
                    value={image.uploadDate}
                    onChange={(e) => updateImage(image.id, 'uploadDate', e.target.value)}
                    className="text-right"
                    type="date"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>رابط الصورة</Label>
                <div className="flex space-x-2 space-x-reverse">
                  <Input
                    value={image.url}
                    onChange={(e) => updateImage(image.id, 'url', e.target.value)}
                    className="text-right flex-1"
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button 
                    onClick={() => copyImageUrl(image.url)}
                    variant="outline"
                    size="sm"
                  >
                    نسخ
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={image.description}
                  onChange={(e) => updateImage(image.id, 'description', e.target.value)}
                  className="text-right"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>الكلمات المفتاحية (مفصولة بفاصلة)</Label>
                <Input
                  value={image.tags.join(', ')}
                  onChange={(e) => updateImageTags(image.id, e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                  className="text-right"
                  placeholder="برلمان, اقتصاد, لجنة"
                />
              </div>
              {image.url && (
                <div className="space-y-2">
                  <Label>معاينة الصورة</Label>
                  <img 
                    src={image.url} 
                    alt={image.title} 
                    className="w-full max-w-xs h-32 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          ))}
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ الصور
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageGalleryManager;
