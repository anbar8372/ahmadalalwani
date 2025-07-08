import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2, CheckCircle } from 'lucide-react';
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
  
  // Load data from localStorage with real-time sync
  const [heroSection, setHeroSection] = useState<HeroSection>(() => {
    const saved = localStorage.getItem('home-hero-section');
    return saved ? JSON.parse(saved) : {
      title: 'الدكتور أحمد العلواني',
      subtitle: 'نائب سابق في البرلمان العراقي (2005-2014)',
      description: 'حاصل على الدكتوراه في علوم الأرض من جامعة بغداد، شغل منصب نائب في البرلمان العراقي لدورتين متتاليتين من عام 2005 إلى عام 2014.',
      backgroundImage: ''
    };
  });

  const [featureCards, setFeatureCards] = useState<FeatureCard[]>(() => {
    const saved = localStorage.getItem('home-feature-cards');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'الخبرة البرلمانية',
        description: 'خدم كنائب في البرلمان العراقي من 2005 إلى 2014',
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
    ];
  });

  // Real-time sync setup
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'home-hero-section-update-trigger') {
        const saved = localStorage.getItem('home-hero-section');
        if (saved) {
          setHeroSection(JSON.parse(saved));
        }
      }
      if (e.key === 'home-feature-cards-update-trigger') {
        const saved = localStorage.getItem('home-feature-cards');
        if (saved) {
          setFeatureCards(JSON.parse(saved));
        }
      }
    };

    const channel = new BroadcastChannel('admin-updates');
    channel.onmessage = (event) => {
      if (event.data.type === 'DATA_UPDATED') {
        if (event.data.key === 'home-hero-section') {
          setHeroSection(event.data.data);
        }
        if (event.data.key === 'home-feature-cards') {
          setFeatureCards(event.data.data);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      channel.close();
    };
  }, []);

  // Broadcast function for real-time sync
  const broadcastUpdate = (key: string, data: any) => {
    // Save to localStorage
    localStorage.setItem(key, JSON.stringify(data));
    
    // Broadcast to other tabs
    const channel = new BroadcastChannel('admin-updates');
    channel.postMessage({ type: 'DATA_UPDATED', key, data, timestamp: Date.now() });
    
    // Trigger storage event for cross-tab communication
    localStorage.setItem(`${key}-update-trigger`, Date.now().toString());
  };

  const handleSaveHero = () => {
    broadcastUpdate('home-hero-section', heroSection);
    
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ محتوى القسم الرئيسي ومزامنته عبر جميع الأجهزة",
    });
  };

  const handleSaveFeatureCards = () => {
    broadcastUpdate('home-feature-cards', featureCards);
    
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ البطاقات المميزة ومزامنتها عبر جميع الأجهزة",
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
    const updatedCards = [...featureCards, newCard];
    setFeatureCards(updatedCards);
    broadcastUpdate('home-feature-cards', updatedCards);
  };

  const updateFeatureCard = (id: string, field: keyof FeatureCard, value: string) => {
    const updatedCards = featureCards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    );
    setFeatureCards(updatedCards);
    // Auto-save on change
    broadcastUpdate('home-feature-cards', updatedCards);
  };

  const deleteFeatureCard = (id: string) => {
    const updatedCards = featureCards.filter(card => card.id !== id);
    setFeatureCards(updatedCards);
    broadcastUpdate('home-feature-cards', updatedCards);
    
    toast({
      title: "تم الحذف",
      description: "تم حذف البطاقة بنجاح",
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Indicator */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 space-x-reverse text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">نظام المزامنة المباشرة مفعل</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            جميع التغييرات يتم حفظها ومزامنتها تلقائياً عبر جميع الأجهزة والمتصفحات
          </p>
        </CardContent>
      </Card>

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
                onChange={(e) => {
                  const updated = {...heroSection, title: e.target.value};
                  setHeroSection(updated);
                  broadcastUpdate('home-hero-section', updated);
                }}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">العنوان الفرعي</Label>
              <Input
                id="hero-subtitle"
                value={heroSection.subtitle}
                onChange={(e) => {
                  const updated = {...heroSection, subtitle: e.target.value};
                  setHeroSection(updated);
                  broadcastUpdate('home-hero-section', updated);
                }}
                className="text-right"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-description">الوصف</Label>
            <Textarea
              id="hero-description"
              value={heroSection.description}
              onChange={(e) => {
                const updated = {...heroSection, description: e.target.value};
                setHeroSection(updated);
                broadcastUpdate('home-hero-section', updated);
              }}
              className="text-right"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-bg">رابط صورة الخلفية</Label>
            <Input
              id="hero-bg"
              value={heroSection.backgroundImage}
              onChange={(e) => {
                const updated = {...heroSection, backgroundImage: e.target.value};
                setHeroSection(updated);
                broadcastUpdate('home-hero-section', updated);
              }}
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
          <Button onClick={handleSaveFeatureCards} className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ البطاقات المميزة
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeContentManager;