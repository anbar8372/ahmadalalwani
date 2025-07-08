import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertTriangle
} from 'lucide-react';
import { useSyncStatus } from '@/hooks/useSyncStatus';

const SyncStatusIndicator = () => {
  const { syncStatus } = useSyncStatus();
};

  return (
    <Card className="bg-yellow-50 border-yellow-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 space-x-reverse">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <div>
            <span className="font-medium text-yellow-800">
              تم تعطيل الاتصال بقاعدة البيانات
            </span>
            <div className="text-xs text-gray-600 mt-1">
              الموقع يعمل بدون قاعدة بيانات حالياً
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
export default SyncStatusIndicator;