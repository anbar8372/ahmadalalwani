import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

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
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse text-green-800">
          <AlertCircle className="w-6 h-6 text-green-600" />
          <span>تم التحويل إلى وضع التخزين المحلي</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-green-700">
          تم إزالة الاعتماد على قاعدة البيانات بنجاح. يعمل الموقع الآن باستخدام التخزين المحلي فقط.
        </p>
        
        <div className="bg-white p-3 rounded border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">ملاحظة:</h4>
          <p className="text-sm text-gray-700">جميع البيانات محفوظة محلياً في متصفحك. يمكنك الاستمرار في استخدام الموقع بشكل طبيعي.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={onRetry}
            disabled={isRetrying}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'جاري التحديث...' : 'تحديث الصفحة'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="flex-1"
          >
            {showDiagnostics ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
          </Button>
        </div>
        
        {showDiagnostics && (
          <div className="mt-3">
            <div className="p-2 bg-gray-50 rounded border text-xs font-mono text-gray-700 max-h-40 overflow-y-auto">
              <p>وضع التشغيل: التخزين المحلي</p>
              <p>حالة البيانات: محفوظة محلياً</p>
              <p>قاعدة البيانات: غير متصلة (تم إزالتها)</p>
              <p>التاريخ: {new Date().toLocaleString('ar-IQ')}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectionErrorHandler;