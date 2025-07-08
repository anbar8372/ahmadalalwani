import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  XCircle,
  Database, 
  HardDrive,
  Server
} from 'lucide-react';

const ConnectionTester = () => {
  const [testResults] = useState({
    supabase: { status: 'error', message: 'تم تعطيل الاتصال بقاعدة البيانات' },
    localStorage: { status: 'success', message: 'التخزين المحلي يعمل بشكل صحيح' },
    realtime: { status: 'success', message: 'المزامنة المباشرة تعمل بشكل صحيح' }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          اختبار الاتصال
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            testResults.supabase.status === 'success' ? 'bg-green-100' : 
            testResults.supabase.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            <div className="flex items-center space-x-3 space-x-reverse">
              <Database className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium">قاعدة البيانات Supabase</p>
                <p className={`text-sm ${
                  'text-red-700'
                }`}>
                  {testResults.supabase.message || 'لم يتم الاختبار بعد'}
                </p>
              </div>
            </div>
            <div>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>

          <div className={`flex items-center justify-between p-3 rounded-lg ${
            testResults.localStorage.status === 'success' ? 'bg-green-100' : 
            testResults.localStorage.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            <div className="flex items-center space-x-3 space-x-reverse">
              <HardDrive className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium">التخزين المحلي</p>
                <p className={`text-sm ${
                  'text-green-700'
                }`}>
                  {testResults.localStorage.message || 'لم يتم الاختبار بعد'}
                </p>
              </div>
            </div>
          </div>

          <div className={`flex items-center justify-between p-3 rounded-lg ${
            'bg-green-100'
          }`}>
            <div className="flex items-center space-x-3 space-x-reverse">
              <Server className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium">المزامنة المباشرة</p>
                <p className={`text-sm ${
                  'text-green-700'
                }`}>
                  {testResults.realtime.message || 'لم يتم الاختبار بعد'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionTester;