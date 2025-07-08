import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Wifi, 
  Database, 
  Server,
  Globe
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  timestamp: Date;
}

const ConnectionTester = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'success' | 'error' | 'pending'>('pending');

  useEffect(() => {
    // Ejecutar pruebas automáticamente al montar el componente
    runTests();
  }, []);

  // Determinar estado general basado en resultados individuales
  useEffect(() => {
    if (results.length === 0) {
      setOverallStatus('pending');
      return;
    }
    
    const hasErrors = results.some(result => result.status === 'error');
    setOverallStatus(hasErrors ? 'error' : 'success');
  }, [results]);

  const runTests = async () => {
    setIsTesting(true);
    setResults([]);
    
    // Prueba 1: Conexión a Internet
    await testInternetConnection();
    
    // Prueba 2: Resolución DNS
    await testDNSResolution();
    
    // Prueba 3: Conexión a Supabase
    await testSupabaseConnection();
    
    // Prueba 4: Acceso a la base de datos
    await testDatabaseAccess();
    
    setIsTesting(false);
  };

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const testInternetConnection = async () => {
    try {
      const result: TestResult = {
        name: 'اختبار الاتصال بالإنترنت',
        status: 'pending',
        message: 'جاري الاختبار...',
        timestamp: new Date()
      };
      
      addResult(result);
      
      // Comprobar si el navegador está en línea
      if (!navigator.onLine) {
        throw new Error('لا يوجد اتصال بالإنترنت');
      }
      
      // Intentar acceder a un servicio externo confiable
      const response = await fetch('https://www.google.com', { 
        mode: 'no-cors',
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      // Actualizar resultado
      setResults(prev => prev.map(r => 
        r.name === result.name 
          ? { ...r, status: 'success', message: 'متصل بالإنترنت' } 
          : r
      ));
    } catch (error) {
      // Actualizar resultado con error
      setResults(prev => prev.map(r => 
        r.name === 'اختبار الاتصال بالإنترنت' 
          ? { 
              ...r, 
              status: 'error', 
              message: error instanceof Error 
                ? error.message 
                : 'فشل الاتصال بالإنترنت' 
            } 
          : r
      ));
    }
  };

  const testDNSResolution = async () => {
    try {
      const result: TestResult = {
        name: 'اختبار تحليل DNS',
        status: 'pending',
        message: 'جاري الاختبار...',
        timestamp: new Date()
      };
      
      addResult(result);
      
      // Intentar resolver el dominio de Supabase
      const supabaseUrl = new URL(import.meta.env.VITE_SUPABASE_URL || 'https://osjlfrnnbuzbfyepjsve.supabase.co');
      
      // Hacer una solicitud simple para verificar que el dominio se resuelve
      const response = await fetch(`${supabaseUrl.origin}/ping`, { 
        mode: 'no-cors',
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      // Actualizar resultado
      setResults(prev => prev.map(r => 
        r.name === result.name 
          ? { ...r, status: 'success', message: 'تم تحليل DNS بنجاح' } 
          : r
      ));
    } catch (error) {
      // Actualizar resultado con error
      setResults(prev => prev.map(r => 
        r.name === 'اختبار تحليل DNS' 
          ? { 
              ...r, 
              status: 'error', 
              message: error instanceof Error 
                ? error.message 
                : 'فشل في تحليل DNS' 
            } 
          : r
      ));
    }
  };

  const testSupabaseConnection = async () => {
    try {
      const result: TestResult = {
        name: 'اختبار الاتصال بـ Supabase',
        status: 'pending',
        message: 'جاري الاختبار...',
        timestamp: new Date()
      };
      
      addResult(result);
      
      if (!supabase) {
        throw new Error('عميل Supabase غير متوفر');
      }
      
      // Intentar una operación simple para verificar la conexión
      const { data, error } = await supabase.from('news').select('count').limit(1);
      
      if (error) {
        throw error;
      }
      
      // Actualizar resultado
      setResults(prev => prev.map(r => 
        r.name === result.name 
          ? { ...r, status: 'success', message: 'متصل بـ Supabase' } 
          : r
      ));
    } catch (error) {
      // Actualizar resultado con error
      setResults(prev => prev.map(r => 
        r.name === 'اختبار الاتصال بـ Supabase' 
          ? { 
              ...r, 
              status: 'error', 
              message: error instanceof Error 
                ? error.message 
                : 'فشل الاتصال بـ Supabase' 
            } 
          : r
      ));
    }
  };

  const testDatabaseAccess = async () => {
    try {
      const result: TestResult = {
        name: 'اختبار الوصول لقاعدة البيانات',
        status: 'pending',
        message: 'جاري الاختبار...',
        timestamp: new Date()
      };
      
      addResult(result);
      
      if (!supabase) {
        throw new Error('عميل Supabase غير متوفر');
      }
      
      // Intentar acceder a la tabla de noticias
      const { data, error } = await supabase.from('news').select('id').limit(1);
      
      if (error) {
        throw error;
      }
      
      // Intentar acceder a la tabla de configuración de sincronización
      const { data: syncData, error: syncError } = await supabase
        .from('sync_settings')
        .select('key')
        .limit(1);
      
      if (syncError) {
        // Si la tabla no existe, es posible que la migración no se haya aplicado
        if (syncError.code === 'PGRST116') {
          throw new Error('جدول sync_settings غير موجود. يرجى تطبيق ملف الترحيل');
        }
        throw syncError;
      }
      
      // Actualizar resultado
      setResults(prev => prev.map(r => 
        r.name === result.name 
          ? { ...r, status: 'success', message: 'تم الوصول لقاعدة البيانات بنجاح' } 
          : r
      ));
    } catch (error) {
      // Actualizar resultado con error
      setResults(prev => prev.map(r => 
        r.name === 'اختبار الوصول لقاعدة البيانات' 
          ? { 
              ...r, 
              status: 'error', 
              message: error instanceof Error 
                ? error.message 
                : 'فشل الوصول لقاعدة البيانات' 
            } 
          : r
      ));
    }
  };

  const getStatusIcon = (status: 'success' | 'error' | 'pending') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
    }
  };

  const getTestIcon = (name: string) => {
    if (name.includes('إنترنت')) {
      return <Wifi className="w-5 h-5" />;
    } else if (name.includes('DNS')) {
      return <Globe className="w-5 h-5" />;
    } else if (name.includes('Supabase')) {
      return <Server className="w-5 h-5" />;
    } else if (name.includes('قاعدة البيانات')) {
      return <Database className="w-5 h-5" />;
    }
    return <RefreshCw className="w-5 h-5" />;
  };

  return (
    <Card className={`
      ${overallStatus === 'success' ? 'bg-green-50 border-green-200' : 
        overallStatus === 'error' ? 'bg-red-50 border-red-200' : 
        'bg-blue-50 border-blue-200'}
    `}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className={`
            ${overallStatus === 'success' ? 'text-green-800' : 
              overallStatus === 'error' ? 'text-red-800' : 
              'text-blue-800'}
          `}>
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
          {results.length === 0 ? (
            <div className="text-center py-4">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-blue-800">جاري اختبار الاتصال...</p>
            </div>
          ) : (
            results.map((result, index) => (
              <div 
                key={index} 
                className={`
                  flex items-center justify-between p-3 rounded-lg
                  ${result.status === 'success' ? 'bg-green-100' : 
                    result.status === 'error' ? 'bg-red-100' : 
                    'bg-blue-100'}
                `}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  {getTestIcon(result.name)}
                  <div>
                    <p className="font-medium">{result.name}</p>
                    <p className={`text-sm ${
                      result.status === 'success' ? 'text-green-700' : 
                      result.status === 'error' ? 'text-red-700' : 
                      'text-blue-700'
                    }`}>
                      {result.message}
                    </p>
                  </div>
                </div>
                <div>
                  {getStatusIcon(result.status)}
                </div>
              </div>
            ))
          )}
          
          {overallStatus === 'error' && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
              <h4 className="font-medium text-red-800 mb-2">إجراءات مقترحة:</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>تأكد من اتصالك بالإنترنت</li>
                <li>تحقق من إعدادات الاتصال بقاعدة البيانات</li>
                <li>تأكد من تطبيق ملفات الترحيل في Supabase</li>
                <li>تحقق من صحة مفاتيح API في ملف .env</li>
                <li>حاول تسجيل الخروج وإعادة تسجيل الدخول</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionTester;