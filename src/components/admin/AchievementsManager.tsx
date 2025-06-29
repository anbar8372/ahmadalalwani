
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  impact: string;
  image: string;
}

interface AchievementCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

const AchievementsManager = () => {
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<AchievementCategory[]>([
    {
      id: '1',
      name: 'الإنجازات الاقتصادية',
      description: 'الإنجازات المتعلقة بالعمل الاقتصادي والتنمية',
      color: 'iraqi-green'
    },
    {
      id: '2',
      name: 'الإنجازات التشريعية',
      description: 'القوانين والتشريعات التي ساهم في وضعها',
      color: 'iraqi-red'
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'قيادة اللجنة الاقتصادية',
      category: '1',
      date: '2010-2013',
      description: 'ترأس اللجنة الاقتصادية في البرلمان العراقي وساهم في وضع السياسات الاقتصادية',
      impact: 'تحسين الوضع الاقتصادي وجذب الاستثمارات',
      image: ''
    }
  ]);

  const [achievementsOverview, setAchievementsOverview] = useState('');

  const addCategory = () => {
    const newCategory: AchievementCategory = {
      id: Date.now().toString(),
      name: '',
      description: '',
      color: 'blue'
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, field: keyof AchievementCategory, value: string) => {
    setCategories(categories => 
      categories.map(category => 
        category.id === id ? { ...category, [field]: value } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(categories => categories.filter(category => category.id !== id));
  };

  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: '',
      category: categories[0]?.id || '1',
      date: '',
      description: '',
      impact: '',
      image: ''
    };
    setAchievements([...achievements, newAchievement]);
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    setAchievements(achievements => 
      achievements.map(achievement => 
        achievement.id === id ? { ...achievement, [field]: value } : achievement
      )
    );
  };

  const deleteAchievement = (id: string) => {
    setAchievements(achievements => achievements.filter(achievement => achievement.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Achievements Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">نظرة عامة على الإنجازات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="achievements-overview">النص التعريفي</Label>
            <Textarea
              id="achievements-overview"
              value={achievementsOverview}
              onChange={(e) => setAchievementsOverview(e.target.value)}
              className="text-right min-h-[150px]"
              placeholder="اكتب نبذة عن الإنجازات..."
            />
          </div>
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ النظرة العامة
          </Button>
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">فئات الإنجازات</CardTitle>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم الفئة</Label>
                  <Input
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>اللون</Label>
                  <Input
                    value={category.color}
                    onChange={(e) => updateCategory(category.id, 'color', e.target.value)}
                    className="text-right"
                    placeholder="blue, red, green, iraqi-green"
                  />
                </div>
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
          ))}
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ فئات الإنجازات
          </Button>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">الإنجازات</CardTitle>
          <Button onClick={addAchievement} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة إنجاز
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">إنجاز #{achievement.id}</h3>
                <Button 
                  onClick={() => deleteAchievement(achievement.id)}
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>عنوان الإنجاز</Label>
                  <Input
                    value={achievement.title}
                    onChange={(e) => updateAchievement(achievement.id, 'title', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الفئة</Label>
                  <select
                    value={achievement.category}
                    onChange={(e) => updateAchievement(achievement.id, 'category', e.target.value)}
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
                  <Label>التاريخ</Label>
                  <Input
                    value={achievement.date}
                    onChange={(e) => updateAchievement(achievement.id, 'date', e.target.value)}
                    className="text-right"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={achievement.description}
                  onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
                  className="text-right"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>التأثير</Label>
                <Textarea
                  value={achievement.impact}
                  onChange={(e) => updateAchievement(achievement.id, 'impact', e.target.value)}
                  className="text-right"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>رابط الصورة</Label>
                <Input
                  value={achievement.image}
                  onChange={(e) => updateAchievement(achievement.id, 'image', e.target.value)}
                  className="text-right"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          ))}
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ الإنجازات
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementsManager;
