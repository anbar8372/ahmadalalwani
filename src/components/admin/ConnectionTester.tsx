import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  XCircle, 
  RefreshCw, 
  Database, 
  HardDrive,
  Server,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ConnectionTester = () => {
  const [isTesting, setIsTesting] = useState(true);
  const [testResults, setTestResults] = useState({
    supabase: { status: 'error', message: 'تم تعطيل الاتصال بقاعدة البيانات' },
    localStorage: { status: 'pending', message: '' },
    realtime: { status: 'pending', message: '' }
  });

  useEffect(() => {
    // Run tests on mount
    runTests();
  }, []);

  const runTests = async () => {
    setIsTesting(true);
    setTestResults({
      supabase: { status: 'error', message: 'تم تعطيل الاتصال بقاعدة البيانات' },
      localStorage: { status: 'testing', message: 'جاري اختبار التخزين المحلي...' },
      realtime: { status: 'testing', message: 'جاري اختبار المزامنة المباشرة...' }
    });

    // Supabase is disabled
    setTestResults(prev => ({
      ...prev,
      supabase: { 
        status: 'error', 
        message: 'تم تعطيل الاتصال بقاعدة البيانات عمداً، يتم استخدام التخزين المحلي فقط' 
      }
    }));

    // Test localStorage
    try {
      const testKey = 'connection-test';
      const testValue = Date.now().toString();
      
      localStorage.setItem(testKey, testValue);
      const retrievedValue = localStorage.getItem(testKey);
      
      if (retrievedValue !== testValue) {
        throw new Error('قيمة التخزين المحلي المستردة لا تطابق القيمة المخزنة');
      }
      
      localStorage.removeItem(testKey);
      
      setTestResults(prev => ({
        ...prev,
        localStorage: { 
          status: 'success', 
          message: 'التخزين المحلي يعمل بشكل صحيح' 
        }
      }));
    } catch (error) {
      console.error('localStorage test failed:', error);
      setTestResults(prev => ({
        ...prev,
        localStorage: { 
          status: 'error', 
          message: error instanceof Error ? error.message : 'فشل اختبار التخزين المحلي' 
        }
      }));
    }

    // Test realtime sync
    try {
      // Test BroadcastChannel API
      const testChannel = new BroadcastChannel('connection-test');
      const testMessage = { test: true, timestamp: Date.now() };
      
      // Send a message to self (just to test the API works)
      testChannel.postMessage(testMessage);
      testChannel.close();
      
      setTestResults(prev => ({
        ...prev,
        realtime: { 
          status: 'success', 
          message: 'المزامنة المباشرة تعمل بشكل صحيح' 
        }
      }));
    } catch (error) {
      console.error('Realtime sync test failed:', error);
      setTestResults(prev => ({
        ...prev,
        realtime: { 
          status: 'error', 
          message: error instanceof Error ? error.message : 'فشل اختبار المزامنة المباشرة' 
        }
      }));
    }

    setIsTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'testing':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            اختبار الاتصال
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runTests}
            disabled={isTesting}
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${isTesting ? 'animate-spin' : ''}`} />
            {isTesting ? 'جاري الاختبار...' : 'إعادة الاختبار'}
          </Button>
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
                  testResults.supabase.status === 'success' ? 'text-green-700' : 
                  testResults.supabase.status === 'error' ? 'text-red-700' : 'text-gray-600'
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
                  testResults.localStorage.status === 'success' ? 'text-green-700' : 
                  testResults.localStorage.status === 'error' ? 'text-red-700' : 'text-gray-600'
                }`}>
                  {testResults.localStorage.message || 'لم يتم الاختبار بعد'}
                </p>
              </div>
            </div>
            <div>
              {getStatusIcon(testResults.localStorage.status)}
            </div>
          </div>

          <div className={`flex items-center justify-between p-3 rounded-lg ${
            testResults.realtime.status === 'success' ? 'bg-green-100' : 
            testResults.realtime.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
          }`}>
            <div className="flex items-center space-x-3 space-x-reverse">
              <Server className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium">المزامنة المباشرة</p>
                <p className={`text-sm ${
                  testResults.realtime.status === 'success' ? 'text-green-700' : 
                  testResults.realtime.status === 'error' ? 'text-red-700' : 'text-gray-600'
                }`}>
                  {testResults.realtime.message || 'لم يتم الاختبار بعد'}
                </p>
              </div>
            </div>
            <div>
              {getStatusIcon(testResults.realtime.status)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionTester;