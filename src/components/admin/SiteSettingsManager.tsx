
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2 } from 'lucide-react';
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

interface FooterSettings {
  companyName: string;
  companyDescription: string;
  copyright: string;
  developedBy: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  color: string;
}

interface ColorTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const SiteSettingsManager = () => {
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

  const [footerSettings, setFooterSettings] = useState<FooterSettings>({
    companyName: 'الدكتور أحمد العلواني',
    companyDescription: 'نائب سابق في البرلمان العراقي (2010-2013) ورئيس اللجنة الاقتصادية، عمل من أجل خدمة الشعب العراقي وتحقيق التنمية والازدهار.',
    copyright: '© 2025 الدكتور أحمد العلواني - ahmedalalwani.com. جميع الحقوق محفوظة.',
    developedBy: 'تم التطوير بواسطة فريق متخصص'
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: '1',
      platform: 'فيسبوك',
      url: '',
      icon: 'facebook',
      color: '#1877F2'
    },
    {
      id: '2',
      platform: 'تويتر',
      url: '',
      icon: 'twitter',
      color: '#1DA1F2'
    }
  ]);

  const [colorThemes, setColorThemes] = useState<ColorTheme[]>([
    {
      id: '1',
      name: 'الألوان العراقية',
      primaryColor: '#CE1126',
      secondaryColor: '#FFFFFF', 
      accentColor: '#007A3D'
    },
    {
      id: '2',
      name: 'الأزرق الكلاسيكي',
      primaryColor: '#2563EB',
      secondaryColor: '#F8FAFC',
      accentColor: '#10B981'
    }
  ]);

  const [selectedTheme, setSelectedTheme] = useState('1');

  const handleSaveSiteSettings = () => {
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ إعدادات الموقع",
    });
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: '',
      url: '',
      icon: '',
      color: '#000000'
    };
    setSocialLinks([...socialLinks, newLink]);
  };

  const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
    setSocialLinks(links => 
      links.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const deleteSocialLink = (id: string) => {
    setSocialLinks(links => links.filter(link => link.id !== id));
  };

  const addColorTheme = () => {
    const newTheme: ColorTheme = {
      id: Date.now().toString(),
      name: '',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
      accentColor: '#888888'
    };
    setColorThemes([...colorThemes, newTheme]);
  };

  const updateColorTheme = (id: string, field: keyof ColorTheme, value: string) => {
    setColorThemes(themes => 
      themes.map(theme => 
        theme.id === id ? { ...theme, [field]: value } : theme
      )
    );
  };

  const deleteColorTheme = (id: string) => {
    setColorThemes(themes => themes.filter(theme => theme.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Site Settings */}
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

      {/* Footer Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">إعدادات التذييل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">اسم الشركة/الشخص</Label>
              <Input
                id="company-name"
                value={footerSettings.companyName}
                onChange={(e) => setFooterSettings({...footerSettings, companyName: e.target.value})}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="developed-by">تم التطوير بواسطة</Label>
              <Input
                id="developed-by"
                value={footerSettings.developedBy}
                onChange={(e) => setFooterSettings({...footerSettings, developedBy: e.target.value})}
                className="text-right"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-description">وصف الشركة/الشخص</Label>
            <Textarea
              id="company-description"
              value={footerSettings.companyDescription}
              onChange={(e) => setFooterSettings({...footerSettings, companyDescription: e.target.value})}
              className="text-right"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="copyright">نص حقوق الطبع والنشر</Label>
            <Input
              id="copyright"
              value={footerSettings.copyright}
              onChange={(e) => setFooterSettings({...footerSettings, copyright: e.target.value})}
              className="text-right"
            />
          </div>
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ إعدادات التذييل
          </Button>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">روابط وسائل التواصل الاجتماعي</CardTitle>
          <Button onClick={addSocialLink} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة رابط
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {socialLinks.map((link) => (
            <div key={link.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">رابط #{link.id}</h3>
                <Button 
                  onClick={() => deleteSocialLink(link.id)}
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>اسم المنصة</Label>
                  <Input
                    value={link.platform}
                    onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الرابط</Label>
                  <Input
                    value={link.url}
                    onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                    className="text-right"
                    placeholder="https://facebook.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الأيقونة</Label>
                  <Input
                    value={link.icon}
                    onChange={(e) => updateSocialLink(link.id, 'icon', e.target.value)}
                    className="text-right"
                    placeholder="facebook, twitter"
                  />
                </div>
                <div className="space-y-2">
                  <Label>اللون</Label>
                  <Input
                    value={link.color}
                    onChange={(e) => updateSocialLink(link.id, 'color', e.target.value)}
                    type="color"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ روابط التواصل الاجتماعي
          </Button>
        </CardContent>
      </Card>

      {/* Color Themes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">قوالب الألوان</CardTitle>
          <Button onClick={addColorTheme} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة قالب
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>القالب النشط</Label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full p-2 border rounded text-right"
            >
              {colorThemes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
          
          {colorThemes.map((theme) => (
            <div key={theme.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">قالب #{theme.id}</h3>
                <Button 
                  onClick={() => deleteColorTheme(theme.id)}
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>اسم القالب</Label>
                  <Input
                    value={theme.name}
                    onChange={(e) => updateColorTheme(theme.id, 'name', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>اللون الأساسي</Label>
                  <Input
                    value={theme.primaryColor}
                    onChange={(e) => updateColorTheme(theme.id, 'primaryColor', e.target.value)}
                    type="color"
                  />
                </div>
                <div className="space-y-2">
                  <Label>اللون الثانوي</Label>
                  <Input
                    value={theme.secondaryColor}
                    onChange={(e) => updateColorTheme(theme.id, 'secondaryColor', e.target.value)}
                    type="color"
                  />
                </div>
                <div className="space-y-2">
                  <Label>لون التمييز</Label>
                  <Input
                    value={theme.accentColor}
                    onChange={(e) => updateColorTheme(theme.id, 'accentColor', e.target.value)}
                    type="color"
                  />
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: theme.primaryColor }}
                ></div>
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: theme.secondaryColor }}
                ></div>
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: theme.accentColor }}
                ></div>
              </div>
            </div>
          ))}
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ قوالب الألوان
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettingsManager;
