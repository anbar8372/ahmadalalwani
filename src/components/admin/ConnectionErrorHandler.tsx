import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Database, HardDrive } from 'lucide-react';

interface ConnectionErrorHandlerProps {
  error: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

const ConnectionErrorHandler = ({ 
  error, 
  onRetry, 
  isRetrying = false 
}: ConnectionErrorHandlerProps) => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse text-red-800">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <span>خطأ في الاتصال</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-red-700">
          حدث خطأ أثناء الاتصال بقاعدة البيانات. يرجى تطبيق ملف الترحيل (migration) كما هو موضح في ملف MIGRATION_INSTRUCTIONS.md
        </p>
        
        <div className="bg-white p-3 rounded border border-red-200">
          <h4 className="font-medium text-red-800 mb-2">رسالة الخطأ:</h4>
          <p className="text-sm text-gray-700">{error}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={onRetry}
            disabled={isRetrying}
            className="flex-1"
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'جاري إعادة الاتصال...' : 'إعادة المحاولة'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="flex-1"
          >
            {showDiagnostics ? 'إخفاء التشخيص' : 'عرض التشخيص'}
          </Button>
        </div>
        
        {showDiagnostics && (
          )
          }
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-100">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Database className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium">حالة قاعدة البيانات</p>
                  <p className="text-sm text-red-700">
                    غير متصل
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-100">
              <div className="flex items-center space-x-3 space-x-reverse">
                <HardDrive className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">حالة التخزين المحلي</p>
                  <p className="text-sm text-green-700">
                    متصل ويعمل بشكل صحيح
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-2 bg-gray-50 rounded border text-xs font-mono text-gray-700 max-h-40 overflow-y-auto">
              <p>وقت الخطأ: {new Date().toLocaleString('ar-IQ')}</p>
              <p>نوع الخطأ: خطأ اتصال بقاعدة البيانات</p>
              <p>الوضع الحالي: غير متصل - جدول dr_ahmed_news غير موجود</p>
              <p>الإجراء المقترح: تطبيق ملف الترحيل (migration) على مشروع Supabase</p>
            <p>الإجراء المقترح: تطبيق ملف الترحيل (migration) على مشروع Supabase</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectionErrorHandler;
  )
}