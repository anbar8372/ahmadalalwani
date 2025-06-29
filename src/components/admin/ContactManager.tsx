
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  workingHours: string;
}

interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

interface OfficeLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}

const ContactManager = () => {
  const { toast } = useToast();
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'info@ahmedalalwani.com',
    phone: '+964 XXX XXX XXXX',
    address: 'الرمادي، محافظة الأنبار، العراق',
    workingHours: 'الأحد - الخميس: 9:00 ص - 5:00 م'
  });

  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([
    {
      id: '1',
      platform: 'فيسبوك',
      url: '',
      icon: 'facebook'
    },
    {
      id: '2',
      platform: 'تويتر',
      url: '',
      icon: 'twitter'
    }
  ]);

  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([
    {
      id: '1',
      name: 'المكتب الرئيسي',
      address: 'الرمادي، محافظة الأنبار، العراق',
      phone: '+964 XXX XXX XXXX',
      email: 'info@ahmedalalwani.com',
      workingHours: 'الأحد - الخميس: 9:00 ص - 5:00 م'
    }
  ]);

  const [contactPageContent, setContactPageContent] = useState('');

  const handleSaveContactInfo = () => {
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ معلومات الاتصال",
    });
  };

  const addSocialMedia = () => {
    const newSocial: SocialMedia = {
      id: Date.now().toString(),
      platform: '',
      url: '',
      icon: ''
    };
    setSocialMedia([...socialMedia, newSocial]);
  };

  const updateSocialMedia = (id: string, field: keyof SocialMedia, value: string) => {
    setSocialMedia(social => 
      social.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteSocialMedia = (id: string) => {
    setSocialMedia(social => social.filter(item => item.id !== id));
  };

  const addOfficeLocation = () => {
    const newLocation: OfficeLocation = {
      id: Date.now().toString(),
      name: '',
      address: '',
      phone: '',
      email: '',
      workingHours: ''
    };
    setOfficeLocations([...officeLocations, newLocation]);
  };

  const updateOfficeLocation = (id: string, field: keyof OfficeLocation, value: string) => {
    setOfficeLocations(locations => 
      locations.map(location => 
        location.id === id ? { ...location, [field]: value } : location
      )
    );
  };

  const deleteOfficeLocation = (id: string) => {
    setOfficeLocations(locations => locations.filter(location => location.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Contact Page Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">محتوى صفحة الاتصال</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-content">النص التعريفي</Label>
            <Textarea
              id="contact-content"
              value={contactPageContent}
              onChange={(e) => setContactPageContent(e.target.value)}
              className="text-right min-h-[150px]"
              placeholder="اكتب نص ترحيبي لصفحة الاتصال..."
            />
          </div>
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ محتوى الصفحة
          </Button>
        </CardContent>
      </Card>

      {/* Main Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">معلومات الاتصال الرئيسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-email">البريد الإلكتروني</Label>
              <Input
                id="contact-email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">رقم الهاتف</Label>
              <Input
                id="contact-phone"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                className="text-right"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-address">العنوان</Label>
            <Textarea
              id="contact-address"
              value={contactInfo.address}
              onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
              className="text-right"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="working-hours">ساعات العمل</Label>
            <Input
              id="working-hours"
              value={contactInfo.workingHours}
              onChange={(e) => setContactInfo({...contactInfo, workingHours: e.target.value})}
              className="text-right"
            />
          </div>
          <Button onClick={handleSaveContactInfo} className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ معلومات الاتصال
          </Button>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">وسائل التواصل الاجتماعي</CardTitle>
          <Button onClick={addSocialMedia} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة وسيلة تواصل
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {socialMedia.map((social) => (
            <div key={social.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">وسيلة تواصل #{social.id}</h3>
                <Button 
                  onClick={() => deleteSocialMedia(social.id)}
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>اسم المنصة</Label>
                  <Input
                    value={social.platform}
                    onChange={(e) => updateSocialMedia(social.id, 'platform', e.target.value)}
                    className="text-right"
                    placeholder="فيسبوك، تويتر، إنستغرام"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الرابط</Label>
                  <Input
                    value={social.url}
                    onChange={(e) => updateSocialMedia(social.id, 'url', e.target.value)}
                    className="text-right"
                    placeholder="https://facebook.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الأيقونة</Label>
                  <Input
                    value={social.icon}
                    onChange={(e) => updateSocialMedia(social.id, 'icon', e.target.value)}
                    className="text-right"
                    placeholder="facebook, twitter, instagram"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ وسائل التواصل
          </Button>
        </CardContent>
      </Card>

      {/* Office Locations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">مواقع المكاتب</CardTitle>
          <Button onClick={addOfficeLocation} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة مكتب
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {officeLocations.map((location) => (
            <div key={location.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">مكتب #{location.id}</h3>
                <Button 
                  onClick={() => deleteOfficeLocation(location.id)}
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم المكتب</Label>
                  <Input
                    value={location.name}
                    onChange={(e) => updateOfficeLocation(location.id, 'name', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <Input
                    value={location.phone}
                    onChange={(e) => updateOfficeLocation(location.id, 'phone', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    value={location.email}
                    onChange={(e) => updateOfficeLocation(location.id, 'email', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ساعات العمل</Label>
                  <Input
                    value={location.workingHours}
                    onChange={(e) => updateOfficeLocation(location.id, 'workingHours', e.target.value)}
                    className="text-right"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>العنوان</Label>
                <Textarea
                  value={location.address}
                  onChange={(e) => updateOfficeLocation(location.id, 'address', e.target.value)}
                  className="text-right"
                  rows={2}
                />
              </div>
            </div>
          ))}
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ مواقع المكاتب
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactManager;
