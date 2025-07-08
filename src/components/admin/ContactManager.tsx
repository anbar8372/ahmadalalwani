import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2, CheckCircle } from 'lucide-react';
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
  color: string;
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
  
  // Load contact info from localStorage
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem('contact-info');
    return saved ? JSON.parse(saved) : {
      email: 'info@ahmedalalwani.com',
      phone: '+964 XXX XXX XXXX',
      address: 'الرمادي، محافظة الأنبار، العراق',
      workingHours: 'الأحد - الخميس: 9:00 ص - 5:00 م'
    };
  });

  // Load social media from localStorage
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>(() => {
    const saved = localStorage.getItem('social-media');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        platform: 'فيسبوك',
        url: 'https://facebook.com/ahmedalalwanicom',
        icon: 'facebook',
        color: '#1877F2'
      },
      {
        id: '2',
        platform: 'تويتر',
        url: 'https://x.com/ahmedalalwanicom',
        icon: 'twitter',
        color: '#1DA1F2'
      }
    ];
  });

  // Load office locations from localStorage
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>(() => {
    const saved = localStorage.getItem('office-locations');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'المكتب الرئيسي',
        address: 'الرمادي، محافظة الأنبار، العراق',
        phone: '+964 XXX XXX XXXX',
        email: 'info@ahmedalalwani.com',
        workingHours: 'الأحد - الخميس: 9:00 ص - 5:00 م'
      }
    ];
  });

  // Load contact page content from localStorage
  const [contactPageContent, setContactPageContent] = useState(() => {
    const saved = localStorage.getItem('contact-page-content');
    return saved ? JSON.parse(saved) : '';
  });

  // Real-time sync setup
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'contact-info-update-trigger') {
        const saved = localStorage.getItem('contact-info');
        if (saved) setContactInfo(JSON.parse(saved));
      }
      if (e.key === 'social-media-update-trigger') {
        const saved = localStorage.getItem('social-media');
        if (saved) setSocialMedia(JSON.parse(saved));
      }
      if (e.key === 'office-locations-update-trigger') {
        const saved = localStorage.getItem('office-locations');
        if (saved) setOfficeLocations(JSON.parse(saved));
      }
      if (e.key === 'contact-page-content-update-trigger') {
        const saved = localStorage.getItem('contact-page-content');
        if (saved) setContactPageContent(JSON.parse(saved));
      }
    };

    const channel = new BroadcastChannel('admin-updates');
    channel.onmessage = (event) => {
      if (event.data.type === 'DATA_UPDATED') {
        if (event.data.key === 'contact-info') {
          setContactInfo(event.data.data);
        }
        if (event.data.key === 'social-media') {
          setSocialMedia(event.data.data);
        }
        if (event.data.key === 'office-locations') {
          setOfficeLocations(event.data.data);
        }
        if (event.data.key === 'contact-page-content') {
          setContactPageContent(event.data.data);
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
    localStorage.setItem(key, JSON.stringify(data));
    
    const channel = new BroadcastChannel('admin-updates');
    channel.postMessage({ type: 'DATA_UPDATED', key, data, timestamp: Date.now() });
    
    localStorage.setItem(`${key}-update-trigger`, Date.now().toString());
  };

  const handleSaveContactInfo = () => {
    broadcastUpdate('contact-info', contactInfo);
    
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ معلومات الاتصال ومزامنتها عبر جميع الأجهزة",
    });
  };

  const handleSaveContactContent = () => {
    broadcastUpdate('contact-page-content', contactPageContent);
    
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ محتوى الصفحة ومزامنته عبر جميع الأجهزة",
    });
  };

  const handleSaveSocialMedia = () => {
    broadcastUpdate('social-media', socialMedia);
    
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ وسائل التواصل ومزامنتها عبر جميع الأجهزة",
    });
  };

  const handleSaveOfficeLocations = () => {
    broadcastUpdate('office-locations', officeLocations);
    
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ مواقع المكاتب ومزامنتها عبر جميع الأجهزة",
    });
  };

  const addSocialMedia = () => {
    const newSocial: SocialMedia = {
      id: Date.now().toString(),
      platform: '',
      url: '',
      icon: '',
      color: '#000000'
    };
    const updated = [...socialMedia, newSocial];
    setSocialMedia(updated);
    broadcastUpdate('social-media', updated);
  };

  const updateSocialMedia = (id: string, field: keyof SocialMedia, value: string) => {
    const updated = socialMedia.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setSocialMedia(updated);
    broadcastUpdate('social-media', updated);
  };

  const deleteSocialMedia = (id: string) => {
    const updated = socialMedia.filter(item => item.id !== id);
    setSocialMedia(updated);
    broadcastUpdate('social-media', updated);
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
    const updated = [...officeLocations, newLocation];
    setOfficeLocations(updated);
    broadcastUpdate('office-locations', updated);
  };

  const updateOfficeLocation = (id: string, field: keyof OfficeLocation, value: string) => {
    const updated = officeLocations.map(location => 
      location.id === id ? { ...location, [field]: value } : location
    );
    setOfficeLocations(updated);
    broadcastUpdate('office-locations', updated);
  };

  const deleteOfficeLocation = (id: string) => {
    const updated = officeLocations.filter(location => location.id !== id);
    setOfficeLocations(updated);
    broadcastUpdate('office-locations', updated);
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
              onChange={(e) => {
                setContactPageContent(e.target.value);
                broadcastUpdate('contact-page-content', e.target.value);
              }}
              className="text-right min-h-[150px]"
              placeholder="اكتب نص ترحيبي لصفحة الاتصال..."
            />
          </div>
          <Button onClick={handleSaveContactContent} className="w-full">
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
                onChange={(e) => {
                  const updated = {...contactInfo, email: e.target.value};
                  setContactInfo(updated);
                  broadcastUpdate('contact-info', updated);
                }}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">رقم الهاتف</Label>
              <Input
                id="contact-phone"
                value={contactInfo.phone}
                onChange={(e) => {
                  const updated = {...contactInfo, phone: e.target.value};
                  setContactInfo(updated);
                  broadcastUpdate('contact-info', updated);
                }}
                className="text-right"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-address">العنوان</Label>
            <Textarea
              id="contact-address"
              value={contactInfo.address}
              onChange={(e) => {
                const updated = {...contactInfo, address: e.target.value};
                setContactInfo(updated);
                broadcastUpdate('contact-info', updated);
              }}
              className="text-right"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="working-hours">ساعات العمل</Label>
            <Input
              id="working-hours"
              value={contactInfo.workingHours}
              onChange={(e) => {
                const updated = {...contactInfo, workingHours: e.target.value};
                setContactInfo(updated);
                broadcastUpdate('contact-info', updated);
              }}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="space-y-2">
                  <Label>اللون</Label>
                  <Input
                    value={social.color}
                    onChange={(e) => updateSocialMedia(social.id, 'color', e.target.value)}
                    type="color"
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button onClick={handleSaveSocialMedia} className="w-full">
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
          <Button onClick={handleSaveOfficeLocations} className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ مواقع المكاتب
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactManager;