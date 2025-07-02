import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  color: string;
  visible: boolean;
}

const SocialLinksSettings = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: '1',
      platform: 'فيسبوك',
      url: 'https://facebook.com/ahmedalalwanicom',
      icon: 'facebook',
      color: '#1877F2',
      visible: true
    },
    {
      id: '2',
      platform: 'انستغرام',
      url: 'https://instagram.com/ahmedalalwanicom',
      icon: 'instagram',
      color: '#E4405F',
      visible: true
    },
    {
      id: '3',
      platform: 'تليغرام',
      url: 'https://t.me/ahmedalalwanicom',
      icon: 'send',
      color: '#0088CC',
      visible: true
    },
    {
      id: '4',
      platform: 'تيكتوك',
      url: 'https://tiktok.com/@ahmedalalwanicom',
      icon: 'music',
      color: '#000000',
      visible: true
    },
    {
      id: '5',
      platform: 'يوتيوب',
      url: 'https://youtube.com/@ahmedalalwanicom',
      icon: 'youtube',
      color: '#FF0000',
      visible: true
    },
    {
      id: '6',
      platform: 'منصة X',
      url: 'https://x.com/ahmedalalwanicom',
      icon: 'twitter',
      color: '#000000',
      visible: true
    },
    {
      id: '7',
      platform: 'قناة واتساب',
      url: 'https://whatsapp.com/channel/0029VaKvmzSKPbHtTJJJJJ',
      icon: 'message-circle',
      color: '#25D366',
      visible: true
    }
  ]);

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: '',
      url: '',
      icon: '',
      color: '#000000',
      visible: true
    };
    setSocialLinks([...socialLinks, newLink]);
  };

  const updateSocialLink = (id: string, field: keyof SocialLink, value: string | boolean) => {
    setSocialLinks(links => 
      links.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const deleteSocialLink = (id: string) => {
    setSocialLinks(links => links.filter(link => link.id !== id));
  };

  return (
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
              <div className="flex items-center space-x-4 space-x-reverse">
                <h3 className="text-lg font-semibold">{link.platform || `رابط #${link.id}`}</h3>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch 
                    checked={link.visible}
                    onCheckedChange={(checked) => updateSocialLink(link.id, 'visible', checked)}
                  />
                  <Label className="text-sm">
                    {link.visible ? 'مرئي' : 'مخفي'}
                  </Label>
                </div>
              </div>
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
  );
};

export default SocialLinksSettings;