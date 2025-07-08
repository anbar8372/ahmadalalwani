import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  RefreshCw
} from 'lucide-react';
import { newsService } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

const SyncStatusIndicator = () => {
  const { toast } = useToast();
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Update last sync time
    updateLastSyncTime();
    
    // Set up interval to update time
    const interval = setInterval(updateLastSyncTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const updateLastSyncTime = () => {
    const now = new Date();
    setLastSyncTime(formatDate(now));
  };

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
    setIsSyncing(true);
    
    toast({
      title: "جاري المزامنة...",
      description: "يتم الآن مزامنة البيانات محلياً"
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Broadcast update
      newsService.broadcastNewsUpdate();
      
      toast({
        title: "تمت المزامنة بنجاح",
        description: "تم تحديث البيانات محلياً"
      });
      
      updateLastSyncTime();
    } catch (error) {
      toast({
        title: "خطأ في المزامنة",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <span className="font-medium text-green-800">
                وضع التخزين المحلي مفعل
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