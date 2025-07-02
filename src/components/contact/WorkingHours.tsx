
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const WorkingHours = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse text-xl">
          <Clock className="w-5 h-5 text-primary" />
          <span>أوقات العمل</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-900">الأحد - الخميس</span>
            <span className="text-gray-600">9:00 ص - 5:00 م</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-900">الجمعة</span>
            <span className="text-gray-600">مغلق</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-900">السبت</span>
            <span className="text-red-600">مغلق</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkingHours;
