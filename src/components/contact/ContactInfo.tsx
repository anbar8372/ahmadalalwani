import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactInfo = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">معلومات التواصل</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-iraqi-red rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">العنوان</h3>
              <p className="text-gray-600">
                الرمادي، محافظة الأنبار<br />
                العراق
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-iraqi-green rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">البريد الإلكتروني</h3>
              <p className="text-gray-600">info@ahmedalalwani.com</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">رقم الهاتف</h3>
              <p className="text-gray-600">+964 XXX XXX XXXX</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;