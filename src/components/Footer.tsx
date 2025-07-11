import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Settings, Facebook, Instagram, Youtube, Twitter, Send, Music, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const Footer = () => {
  // Load social media from localStorage with real-time updates
  const [socialLinks, setSocialLinks] = useState(() => {
    const saved = localStorage.getItem('social-media');
    const defaultLinks = [{
      platform: 'فيسبوك',
      url: 'https://facebook.com/ahmedalalwanicom',
      icon: 'facebook',
      color: '#1877F2'
    }, {
      platform: 'انستغرام',
      url: 'https://instagram.com/ahmedalalwanicom',
      icon: 'instagram',
      color: '#E4405F'
    }, {
      platform: 'تليغرام',
      url: 'https://t.me/ahmedalalwanicom',
      icon: 'send',
      color: '#0088CC'
    }, {
      platform: 'تيكتوك',
      url: 'https://tiktok.com/@ahmedalalwanicom',
      icon: 'music',
      color: '#000000'
    }, {
      platform: 'يوتيوب',
      url: 'https://youtube.com/@ahmedalalwanicom',
      icon: 'youtube',
      color: '#FF0000'
    }, {
      platform: 'منصة X',
      url: 'https://x.com/ahmedalalwanicom',
      icon: 'twitter',
      color: '#000000'
    }, {
      platform: 'قناة واتساب',
      url: 'https://whatsapp.com/channel/0029VbB1kbuFCCoYtMnmHH1z',
      icon: 'message-circle',
      color: '#25D366'
    }];
    
    return saved ? JSON.parse(saved).filter((link: any) => link.url) : defaultLinks.filter(link => link.url);
  });

  const [contactInfo, setContactInfo] = useState(() => {
    const saved = localStorage.getItem('contact-info');
    return saved ? JSON.parse(saved) : {
      email: 'info@ahmedalalwani.com',
      phone: '0096477XXXXXX',
      address: 'الرمادي، محافظة الأنبار، العراق'
    };
  });

  // Listen for real-time updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'social-media-update-trigger') {
        const saved = localStorage.getItem('social-media');
        if (saved) {
          setSocialLinks(JSON.parse(saved).filter((link: any) => link.url));
        }
      }
      if (e.key === 'contact-info-update-trigger') {
        const saved = localStorage.getItem('contact-info');
        if (saved) {
          setContactInfo(JSON.parse(saved));
        }
      }
    };

    const channel = new BroadcastChannel('admin-updates');
    channel.onmessage = (event) => {
      if (event.data.type === 'DATA_UPDATED') {
        if (event.data.key === 'social-media') {
          setSocialLinks(event.data.data.filter((link: any) => link.url));
        }
        if (event.data.key === 'contact-info') {
          setContactInfo(event.data.data);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      channel.close();
    };
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'facebook':
        return Facebook;
      case 'instagram':
        return Instagram;
      case 'send':
        return Send;
      case 'music':
        return Music;
      case 'youtube':
        return Youtube;
      case 'twitter':
        return Twitter;
      case 'message-circle':
        return MessageCircle;
      default:
        return MessageCircle;
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-r from-iraqi-red to-iraqi-green rounded-full flex items-center justify-center">
                <span className="text-white font-bold">ع</span>
              </div>
              <h3 className="text-lg font-semibold">الدكتور أحمد العلواني</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">نائب سابق في البرلمان العراقي (2005-2014) ورئيس سابق للجنة الاقتصادية في البرلمان، عمل من أجل خدمة الشعب العراقي وتحقيق التنمية والازدهار.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/biography" className="text-gray-300 hover:text-white transition-colors text-sm">
                  السيرة الذاتية
                </Link>
              </li>
              <li>
                <Link to="/political-career" className="text-gray-300 hover:text-white transition-colors text-sm">
                  المسيرة السياسية
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="text-gray-300 hover:text-white transition-colors text-sm">
                  الإنجازات
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  اتصل بي
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">معلومات التواصل</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <MapPin className="w-5 h-5 text-iraqi-green" />
                <span className="text-gray-300 text-sm">{contactInfo.address}</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="w-5 h-5 text-iraqi-green" />
                <span className="text-gray-300 text-sm">{contactInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="w-5 h-5 text-iraqi-green" />
                <span className="text-gray-300 text-sm">{contactInfo.phone}</span>
              </div>
              {/* Social Media Links */}
              {socialLinks.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-3">تابعني على</h4>
                  <div className="flex space-x-3 space-x-reverse">
                    {socialLinks.map((social, index) => {
                      const IconComponent = getIcon(social.icon);
                      return (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                          style={{
                            backgroundColor: social.color + '20',
                            border: `1px solid ${social.color}40`
                          }}
                          title={social.platform}
                        >
                          <IconComponent
                            className="w-4 h-4"
                            style={{
                              color: social.color
                            }}
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 الدكتور أحمد العلواني -جميع الحقوق محفوظة.</p>
            <div className="flex items-center mt-4 md:mt-0 space-x-4 space-x-reverse">
              <p className="text-gray-400 text-sm">
                تم التطوير بواسطة فريق متخصص
              </p>
              <Button variant="outline" size="sm" className="text-gray-400 border-gray-600 hover:text-white hover:border-white" asChild>
                <Link to="/admin">
                  <Settings className="w-4 h-4 ml-2" />
                  لوحة التحكم
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;