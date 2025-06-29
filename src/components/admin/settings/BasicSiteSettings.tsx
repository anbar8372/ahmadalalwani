
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  logoUrl: string;
  faviconUrl: string;
  headerTitle: string;
  headerSubtitle: string;
}

const BasicSiteSettings = () => {
  const { toast } = useToast();
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'الدكتور أحمد العلواني',
    siteDescription: 'نائب سابق في البرلمان العراقي ورئيس اللجنة الاقتصادية',
    siteKeywords: 'أحمد العلواني، البرلمان العراقي، اللجنة الاقتصادية، العراق، الأنبار',
    logoUrl: '',
    faviconUrl: '',
    headerTitle: 'الدكتور أحمد العلواني',
    headerSubtitle: 'نائب سابق في البرلمان العراقي (2010-2013)'
  });

  const handleSaveSiteSettings = () => {
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ إعدادات الموقع",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">إعدادات الموقع الأساسية</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">اسم الموقع</Label>
            <Input
              id="site-name"
              value={siteSettings.siteName}
              onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
              className="text-right"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="header-title">عنوان الرأس</Label>
            <Input
              id="header-title"
              value={siteSettings.headerTitle}
              onChange={(e) => setSiteSettings({...siteSettings, headerTitle: e.target.value})}
              className="text-right"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="header-subtitle">العنوان الفرعي للرأس</Label>
          <Input
            id="header-subtitle"
            value={siteSettings.headerSubtitle}
            onChange={(e) => setSiteSettings({...siteSettings, headerSubtitle: e.target.value})}
            className="text-right"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="site-description">وصف الموقع</Label>
          <Textarea
            id="site-description"
            value={siteSettings.siteDescription}
            onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
            className="text-right"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="site-keywords">الكلمات المفتاحية (مفصولة بفاصلة)</Label>
          <Input
            id="site-keywords"
            value={siteSettings.siteKeywords}
            onChange={(e) => setSiteSettings({...siteSettings, siteKeywords: e.target.value})}
            className="text-right"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="logo-url">رابط الشعار</Label>
            <Input
              id="logo-url"
              value={siteSettings.logoUrl}
              onChange={(e) => setSiteSettings({...siteSettings, logoUrl: e.target.value})}
              className="text-right"
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="favicon-url">رابط أيقونة الموقع (Favicon)</Label>
            <Input
              id="favicon-url"
              value={siteSettings.faviconUrl}
              onChange={(e) => setSiteSettings({...siteSettings, faviconUrl: e.target.value})}
              className="text-right"
              placeholder="https://example.com/favicon.ico"
            />
          </div>
        </div>
        <Button onClick={handleSaveSiteSettings} className="w-full">
          <Save className="w-4 h-4 ml-2" />
          حفظ إعدادات الموقع
        </Button>
      </CardContent>
    </Card>
  );
};

export default BasicSiteSettings;
