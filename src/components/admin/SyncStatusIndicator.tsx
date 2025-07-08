import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  RefreshCw,
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

  // Default: Connected
  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <span className="font-medium text-green-800 flex items-center">
                البيانات محفوظة محلياً
              </span>
              
              {lastSyncTime && (
                <div className="text-xs text-gray-600 mt-1">
                  آخر تحديث: {lastSyncTime}
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
            {isSyncing ? 'جاري التحديث...' : 'تحديث البيانات'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SyncStatusIndicator;