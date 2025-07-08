import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  Clock
} from 'lucide-react';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { newsService } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

const SyncStatusIndicator = () => {
  const { syncStatus, isSyncing, syncNow } = useSyncStatus();
  const { toast } = useToast();
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

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
          <p className="text-sm text-red-700 mt-2">
            {syncStatus.error || 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SyncStatusIndicator;