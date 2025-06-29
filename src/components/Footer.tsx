
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
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
            <p className="text-gray-300 text-sm leading-relaxed">
              نائب سابق في البرلمان العراقي (2010-2013) ورئيس اللجنة الاقتصادية، عمل من أجل خدمة الشعب العراقي وتحقيق التنمية والازدهار.
            </p>
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
                <span className="text-gray-300 text-sm">الرمادي، محافظة الأنبار، العراق</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="w-5 h-5 text-iraqi-green" />
                <span className="text-gray-300 text-sm">info@ahmedalalwani.com</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="w-5 h-5 text-iraqi-green" />
                <span className="text-gray-300 text-sm">+964 XXX XXX XXXX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 الدكتور أحمد العلواني - ahmedalalwani.com. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center mt-4 md:mt-0 space-x-4 space-x-reverse">
              <p className="text-gray-400 text-sm">
                تم التطوير بواسطة فريق متخصص
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-400 border-gray-600 hover:text-white hover:border-white"
              >
                <Settings className="w-4 h-4 ml-2" />
                لوحة التحكم
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
