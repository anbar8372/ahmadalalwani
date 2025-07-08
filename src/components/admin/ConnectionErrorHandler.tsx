import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Wifi, Database, Server } from 'lucide-react';
import { newsService } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
  useEffect(() => {
    // Recopilar información de diagnóstico
    collectDiagnosticInfo();
  }, [error]);
  
  const collectDiagnosticInfo = async () => {
    try {
      const info = {
        browser: navigator.userAgent,
        online: navigator.onLine,
        language: navigator.language,
        timestamp: new Date().toISOString(),
        localStorage: {
          hasRealtimeSyncStatus: !!localStorage.getItem('realtime-sync-status'),
          hasNewsData: !!localStorage.getItem('website-news'),
          lastUpdated: localStorage.getItem('website-news-last-updated') || 'N/A'
        },
        error: {
          message: error,
          type: getErrorType(error)
        }
      };
      
      setDiagnosticInfo(info);
    } catch (e) {
      console.error('Error collecting diagnostic info:', e);
    }
  };
  
  const getErrorType = (errorMsg: string): string => {
    if (errorMsg.includes('network') || errorMsg.includes('شبكة') || !navigator.onLine) {
      return 'network';
    } else if (errorMsg.includes('timeout') || errorMsg.includes('مهلة')) {
      return 'timeout';
    } else if (errorMsg.includes('auth') || errorMsg.includes('مصادقة')) {
      return 'auth';
    } else if (errorMsg.includes('database') || errorMsg.includes('قاعدة بيانات')) {
      return 'database';
    } else if (errorMsg.includes('desconocido') || errorMsg.includes('غير معروف')) {
      return 'unknown';
    }
    return 'server';
  };
  
  const getErrorIcon = () => {
    const errorType = diagnosticInfo?.error?.type || 'unknown';
    
    switch (errorType) {
      case 'network':
        return <Wifi className="w-6 h-6 text-red-600" />;
      case 'database':
        return <Database className="w-6 h-6 text-red-600" />;
      case 'server':
        return <Server className="w-6 h-6 text-red-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-red-600" />;
    }
  };
  
  const getErrorTitle = () => {
    const errorType = diagnosticInfo?.error?.type || 'unknown';
    
    switch (errorType) {
      case 'network':
        return 'خطأ في الاتصال بالشبكة';
      case 'timeout':
        return 'انتهت مهلة الاتصال';
      case 'auth':
        return 'خطأ في المصادقة';
      case 'database':
        return 'خطأ في قاعدة البيانات';
      case 'server':
        return 'خطأ في الخادم';
      default:
        return 'خطأ في الاتصال';
    }
  };
  
  const getErrorSolution = () => {
    const errorType = diagnosticInfo?.error?.type || 'unknown';
    
    switch (errorType) {
      case 'network':
        return 'تأكد من اتصالك بالإنترنت وحاول مرة أخرى';
      case 'timeout':
        return 'قد تكون الشبكة بطيئة أو الخادم مشغول. حاول مرة أخرى بعد قليل';
      case 'auth':
        return 'قد تكون جلستك قد انتهت. حاول تسجيل الخروج وإعادة تسجيل الدخول';
      case 'database':
        return 'هناك مشكلة في قاعدة البيانات. يرجى الاتصال بمسؤول النظام';
      case 'server':
        return 'هناك مشكلة في الخادم. يرجى المحاولة مرة أخرى لاحقًا';
      default:
        return 'حاول إعادة الاتصال أو تحديث الصفحة';
    }
  };
  
  const handleCopyDiagnostics = () => {
    if (diagnosticInfo) {
      const diagText = JSON.stringify(diagnosticInfo, null, 2);
      navigator.clipboard.writeText(diagText);
      toast({
        title: "تم النسخ",
        description: "تم نسخ معلومات التشخيص إلى الحافظة"
      });
    }
  };
  
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse text-red-800">
          {getErrorIcon()}
          <span>{getErrorTitle()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-red-700">
          {error}
        </p>
        
        <div className="bg-white p-3 rounded border border-red-200">
          <h4 className="font-medium text-red-800 mb-2">الحل المقترح:</h4>
          <p className="text-sm text-gray-700">{getErrorSolution()}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={onRetry}
            disabled={isRetrying}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'جاري إعادة الاتصال...' : 'إعادة الاتصال'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="flex-1"
          >
            {showDiagnostics ? 'إخفاء التشخيص' : 'عرض التشخيص'}
          </Button>
        </div>
        
        {showDiagnostics && diagnosticInfo && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-sm text-gray-700">معلومات التشخيص:</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopyDiagnostics}
              >
                نسخ
              </Button>
            </div>
            <div className="p-2 bg-gray-50 rounded border text-xs font-mono text-gray-700 max-h-40 overflow-y-auto">
              <p>نوع المتصفح: {diagnosticInfo.browser}</p>
              <p>متصل بالإنترنت: {diagnosticInfo.online ? 'نعم' : 'لا'}</p>
              <p>اللغة: {diagnosticInfo.language}</p>
              <p>التاريخ: {diagnosticInfo.timestamp}</p>
              <p>نوع الخطأ: {diagnosticInfo.error.type}</p>
              <p>رسالة الخطأ: {diagnosticInfo.error.message}</p>
              <p>بيانات محلية: {diagnosticInfo.localStorage.hasNewsData ? 'موجودة' : 'غير موجودة'}</p>
              <p>آخر تحديث: {diagnosticInfo.localStorage.lastUpdated}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectionErrorHandler;