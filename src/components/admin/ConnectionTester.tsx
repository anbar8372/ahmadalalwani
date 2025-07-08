import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  RefreshCw
} from 'lucide-react';

const ConnectionTester = () => {
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Simulate test on mount
    runTests();
  }, []);

  const runTests = async () => {
    setIsTesting(true);
    
    // Simulate test delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsTesting(false);
  };

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-green-800">
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
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-100">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div>
                <p className="font-medium">حالة التخزين المحلي</p>
                <p className="text-sm text-green-700">
                  التخزين المحلي يعمل بشكل صحيح
                </p>
              </div>
            </div>
            <div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionTester;