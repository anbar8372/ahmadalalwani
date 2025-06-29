
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

interface FooterSettings {
  companyName: string;
  companyDescription: string;
  copyright: string;
  developedBy: string;
}

const FooterSettings = () => {
  const [footerSettings, setFooterSettings] = useState<FooterSettings>({
    companyName: 'الدكتور أحمد العلواني',
    companyDescription: 'نائب سابق في البرلمان العراقي (2010-2013) ورئيس اللجنة الاقتصادية، عمل من أجل خدمة الشعب العراقي وتحقيق التنمية والازدهار.',
    copyright: '© 2025 الدكتور أحمد العلواني - ahmedalalwani.com. جميع الحقوق محفوظة.',
    developedBy: 'تم التطوير بواسطة فريق متخصص'
  });

  return (
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
  );
};

export default FooterSettings;
