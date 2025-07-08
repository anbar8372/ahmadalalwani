import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  RefreshCw, 
  XCircle, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { useToast } from '@/hooks/use-toast';

const SyncStatusIndicator = () => {
  const { toast } = useToast();
  const { syncStatus, isSyncing, syncNow } = useSyncStatus();
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  useEffect(() => {
    // Update last sync time when status changes
    if (syncStatus.lastSynced) {
      setLastSyncTime(formatDate(syncStatus.lastSynced));
    }
  }, [syncStatus]);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('ar-IQ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleManualSync = async () => {
    toast({
      title: "جاري المزامنة...",
      description: "يتم الآن مزامنة البيانات مع قاعدة البيانات"
    });

    const result = await syncNow();
    
    if (result.success) {
      toast({
        title: "تمت المزامنة بنجاح",
        description: "تم تحديث البيانات ومزامنتها عبر جميع الأجهزة"
      });
    } else {
      toast({
        title: "خطأ في المزامنة",
        description: result.error || "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    }
  };

  // Render based on sync status
  if (syncStatus.status === 'error') {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <span className="font-medium text-red-800">
                  خطأ في الاتصال بقاعدة البيانات
                </span>
                <div className="text-xs text-gray-600 mt-1">
                  {syncStatus.error || 'حدث خطأ غير متوقع'}
                </div>
              </div>
            </div>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleManualSync}
              disabled={isSyncing}
            >
              <RefreshCw className={`w-4 h-4 ml-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'جاري المحاولة...' : 'إعادة المحاولة'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (syncStatus.status === 'syncing' || isSyncing) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <span className="font-medium text-blue-800">
                  جاري مزامنة البيانات...
                </span>
                <div className="text-xs text-gray-600 mt-1">
                  يرجى الانتظار حتى اكتمال المزامنة
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (syncStatus.status === 'disconnected') {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <span className="font-medium text-yellow-800">
                  غير متصل بقاعدة البيانات
                </span>
                <div className="text-xs text-gray-600 mt-1">
                  البيانات محفوظة محلياً فقط
                </div>
              </div>
            </div>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleManualSync}
              disabled={isSyncing}
            >
              <RefreshCw className={`w-4 h-4 ml-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'جاري الاتصال...' : 'الاتصال بقاعدة البيانات'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default: Connected
  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <span className="font-medium text-green-800">
                متصل بقاعدة البيانات
              </span>
              
              {lastSyncTime && (
                <div className="text-xs text-gray-600 mt-1">
                  آخر مزامنة: {lastSyncTime}
                </div>
              )}
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleManualSync}
            disabled={isSyncing}
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'جاري المزامنة...' : 'مزامنة البيانات'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SyncStatusIndicator;