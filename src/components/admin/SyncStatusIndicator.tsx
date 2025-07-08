import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  Clock,
  Info
} from 'lucide-react';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { newsService } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

const SyncStatusIndicator = () => {
  const { syncStatus, isSyncing, syncNow } = useSyncStatus();
  const { toast } = useToast();
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    // Inicializar sincronización en tiempo real
    const subscription = newsService.initializeRealtimeSync();
    
    // Actualizar tiempo de última sincronización
    updateLastSyncTime();
    
    // Limpiar suscripción al desmontar
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (syncStatus.lastSynced) {
      updateLastSyncTime();
    }
  }, [syncStatus.lastSynced]);

  const updateLastSyncTime = () => {
    const savedStatus = localStorage.getItem('realtime-sync-status');
    if (savedStatus) {
      try {
        const status = JSON.parse(savedStatus);
        if (status.lastSynced) {
          const date = new Date(status.lastSynced);
          setLastSyncTime(formatDate(date));
        }
      } catch (e) {
        console.error('Error parsing sync status:', e);
      }
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('ar-IQ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const handleManualSync = async () => {
    toast({
      title: "جاري المزامنة...",
      description: "يتم الآن مزامنة البيانات مع الخادم"
    });

    try {
      const result = await newsService.syncWithServer();
      
      if (result.success) {
        toast({
          title: "تمت المزامنة بنجاح",
          description: result.message
        });
        updateLastSyncTime();
      } else {
        toast({
          title: "فشل في المزامنة",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في المزامنة",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    }
  };

  // Función para reconectar y resolver el error de conexión
  const handleReconnect = async () => {
    setIsReconnecting(true);
    
    try {
      // Intentar restablecer la conexión
      await newsService.checkSyncStatus();
      
      // Intentar inicializar la sincronización en tiempo real nuevamente
      const subscription = newsService.initializeRealtimeSync();
      
      // Intentar sincronizar datos
      const result = await newsService.syncWithServer();
      
      if (result.success) {
        toast({
          title: "تم إعادة الاتصال بنجاح",
          description: "تم استعادة الاتصال بالخادم وتمت مزامنة البيانات"
        });
        updateLastSyncTime();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al reconectar:', error);
      toast({
        title: "فشل في إعادة الاتصال",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    } finally {
      setIsReconnecting(false);
    }
  };

  return (
    <Card className={`
      ${syncStatus.status === 'connected' ? 'bg-green-50 border-green-200' : 
        syncStatus.status === 'syncing' ? 'bg-blue-50 border-blue-200' : 
        syncStatus.status === 'error' ? 'bg-red-50 border-red-200' : 
        'bg-yellow-50 border-yellow-200'}
    `}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            {syncStatus.status === 'connected' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : syncStatus.status === 'syncing' ? (
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            ) : syncStatus.status === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-yellow-600" />
            )}
            
            <div>
              <span className={`font-medium ${
                syncStatus.status === 'connected' ? 'text-green-800' : 
                syncStatus.status === 'syncing' ? 'text-blue-800' : 
                syncStatus.status === 'error' ? 'text-red-800' : 
                'text-yellow-800'
              }`}>
                {syncStatus.status === 'connected' ? 'متصل بالخادم' : 
                 syncStatus.status === 'syncing' ? 'جاري المزامنة...' : 
                 syncStatus.status === 'error' ? 'خطأ في الاتصال' : 
                 'غير متصل'}
              </span>
              
              {lastSyncTime && (
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  <Clock className="w-3 h-3 ml-1" />
                  <span>آخر مزامنة: {lastSyncTime}</span>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant={syncStatus.status === 'connected' ? "outline" : "default"}
            onClick={handleManualSync}
            disabled={isSyncing}
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'جاري المزامنة...' : 'مزامنة الآن'}
          </Button>
        </div>
        
        {syncStatus.status === 'error' && (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-red-700">
              {syncStatus.error || 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.'}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                size="sm" 
                onClick={handleReconnect}
                disabled={isReconnecting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <RefreshCw className={`w-4 h-4 ml-2 ${isReconnecting ? 'animate-spin' : ''}`} />
                {isReconnecting ? 'جاري إعادة الاتصال...' : 'إعادة الاتصال'}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Info className="w-4 h-4 ml-2" />
                {showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
              </Button>
            </div>
            
            {showDetails && (
              <div className="mt-3 p-3 bg-white rounded border text-xs font-mono text-gray-700 max-h-32 overflow-y-auto">
                <p className="mb-1 font-semibold">معلومات الخطأ:</p>
                <p>نوع الخطأ: {syncStatus.error?.includes('desconocido') ? 'خطأ غير معروف' : syncStatus.error}</p>
                <p>حالة الاتصال: {syncStatus.connected ? 'متصل' : 'غير متصل'}</p>
                <p>آخر محاولة: {lastSyncTime || 'غير متوفر'}</p>
                <p>معرف الجلسة: {Math.random().toString(36).substring(2, 10)}</p>
                <p className="mt-2 text-xs text-gray-500">
                  يمكنك محاولة إعادة تحميل الصفحة أو الاتصال بمسؤول النظام إذا استمرت المشكلة
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SyncStatusIndicator;