
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HeroSection {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
}

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
}

const HomeContentManager = () => {
  const { toast } = useToast();
  const [heroSection, setHeroSection] = useState<HeroSection>({
    title: 'الدكتور أحمد العلواني',
    subtitle: 'نائب سابق في البرلمان العراقي (2010-2013)',
    description: 'رئيس اللجنة الاقتصادية، عمل من أجل خدمة الشعب العراقي وتحقيق التنمية والازدهار',
    backgroundImage: ''
  });

  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([
    {
      id: '1',
      title: 'الخبرة البرلمانية',
      description: 'خدم كنائب في البرلمان العراقي من 2010 إلى 2013',
      icon: 'briefcase',
      image: ''
    },
    {
      id: '2',
      title: 'القيادة الاقتصادية',
      description: 'ترأس اللجنة الاقتصادية في البرلمان العراقي',
      icon: 'award',
      image: ''
    }
  ]);

  const handleSaveHero = () => {
    // هنا سيتم حفظ البيانات في قاعدة البيانات
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ محتوى القسم الرئيسي",
    });
  };

  const addFeatureCard = () => {
    const newCard: FeatureCard = {
      id: Date.now().toString(),
      title: '',
      description: '',
      icon: 'star',
      image: ''
    };
    setFeatureCards([...featureCards, newCard]);
  };

  const updateFeatureCard = (id: string, field: keyof FeatureCard, value: string) => {
    setFeatureCards(cards => 
      cards.map(card => 
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  const deleteFeatureCard = (id: string) => {
    setFeatureCards(cards => cards.filter(card => card.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">القسم الرئيسي (Hero)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hero-title">العنوان الرئيسي</Label>
              <Input
                id="hero-title"
                value={heroSection.title}
                onChange={(e) => setHeroSection({...heroSection, title: e.target.value})}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">العنوان الفرعي</Label>
              <Input
                id="hero-subtitle"
                value={heroSection.subtitle}
                onChange={(e) => setHeroSection({...heroSection, subtitle: e.target.value})}
                className="text-right"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-description">الوصف</Label>
            <Textarea
              id="hero-description"
              value={heroSection.description}
              onChange={(e) => setHeroSection({...heroSection, description: e.target.value})}
              className="text-right"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-bg">رابط صورة الخلفية</Label>
            <Input
              id="hero-bg"
              value={heroSection.backgroundImage}
              onChange={(e) => setHeroSection({...heroSection, backgroundImage: e.target.value})}
              placeholder="https://example.com/image.jpg"
              className="text-right"
            />
          </div>
          <Button onClick={handleSaveHero} className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ القسم الرئيسي
          </Button>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">البطاقات المميزة</CardTitle>
          <Button onClick={addFeatureCard} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة بطاقة
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {featureCards.map((card) => (
            <div key={card.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">بطاقة #{card.id}</h3>
                <Button 
                  onClick={() => deleteFeatureCard(card.id)}
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>العنوان</Label>
                  <Input
                    value={card.title}
                    onChange={(e) => updateFeatureCard(card.id, 'title', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الأيقونة</Label>
                  <Input
                    value={card.icon}
                    onChange={(e) => updateFeatureCard(card.id, 'icon', e.target.value)}
                    placeholder="briefcase, award, star"
                    className="text-right"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={card.description}
                  onChange={(e) => updateFeatureCard(card.id, 'description', e.target.value)}
                  className="text-right"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>رابط الصورة</Label>
                <Input
                  value={card.image}
                  onChange={(e) => updateFeatureCard(card.id, 'image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="text-right"
                />
              </div>
            </div>
          ))}
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ البطاقات المميزة
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeContentManager;
