import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bug, 
  Database, 
  Save, 
  Trash2, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

const NewsDebugger = () => {
  const { toast } = useToast();
  const [localStorageData, setLocalStorageData] = useState<string>('');
  const [supabaseData, setSupabaseData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadLocalStorageData = () => {
    try {
      const data = localStorage.getItem('website-news');
      setLocalStorageData(data ? JSON.stringify(JSON.parse(data), null, 2) : '');
      setError(null);
      setSuccess('تم تحميل بيانات التخزين المحلي بنجاح');
      
      toast({
        title: "تم التحميل",
        description: "تم تحميل بيانات التخزين المحلي بنجاح",
      });
    } catch (err) {
      setError('فشل في تحميل بيانات التخزين المحلي');
      console.error('Error loading localStorage data:', err);
      
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات التخزين المحلي",
        variant: "destructive"
      });
    }
  };

  const loadSupabaseData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      setSupabaseData(data ? JSON.stringify(data, null, 2) : '');
      setError(null);
      setSuccess('تم تحميل بيانات Supabase بنجاح');
      
      toast({
        title: "تم التحميل",
        description: "تم تحميل بيانات Supabase بنجاح",
      });
    } catch (err) {
      setError('فشل في تحميل بيانات Supabase');
      console.error('Error loading Supabase data:', err);
      
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات Supabase",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveLocalStorageData = () => {
    try {
      if (!localStorageData.trim()) {
        setError('لا يمكن حفظ بيانات فارغة');
        return;
      }
      
      const parsedData = JSON.parse(localStorageData);
      localStorage.setItem('website-news', JSON.stringify(parsedData));
      setError(null);
      setSuccess('تم حفظ بيانات التخزين المحلي بنجاح');
      
      // Broadcast update
      const channel = new BroadcastChannel('news-updates');
      channel.postMessage({ 
        type: 'NEWS_UPDATED', 
        timestamp: Date.now(),
        source: 'debugger'
      });
      
      localStorage.setItem('news-update-trigger', Date.now().toString());
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ بيانات التخزين المحلي بنجاح",
      });
    } catch (err) {
      setError('فشل في حفظ بيانات التخزين المحلي. تأكد من صحة تنسيق JSON');
      console.error('Error saving localStorage data:', err);
      
      toast({
        title: "خطأ",
        description: "فشل في حفظ بيانات التخزين المحلي. تأكد من صحة تنسيق JSON",
        variant: "destructive"
      });
    }
  };

  const clearLocalStorageData = () => {
    try {
      localStorage.removeItem('website-news');
      setLocalStorageData('');
      setError(null);
      setSuccess('تم مسح بيانات التخزين المحلي بنجاح');
      
      toast({
        title: "تم المسح",
        description: "تم مسح بيانات التخزين المحلي بنجاح",
      });
    } catch (err) {
      setError('فشل في مسح بيانات التخزين المحلي');
      console.error('Error clearing localStorage data:', err);
      
      toast({
        title: "خطأ",
        description: "فشل في مسح بيانات التخزين المحلي",
        variant: "destructive"
      });
    }
  };

  const syncToSupabase = async () => {
    setIsLoading(true);
    try {
      if (!localStorageData.trim()) {
        setError('لا يمكن مزامنة بيانات فارغة');
        return;
      }
      
      const parsedData = JSON.parse(localStorageData);
      
      // Confirm with user if there are many items
      if (parsedData.length > 5) {
        const confirmed = window.confirm(`هل أنت متأكد من رغبتك في مزامنة ${parsedData.length} خبر إلى Supabase؟`);
        if (!confirmed) {
          setIsLoading(false);
          return;
        }
      }
      
      // Process each news item
      for (const item of parsedData) {
        const { error } = await supabase
          .from('news')
          .upsert({
            id: item.id,
            title: item.title,
            content: item.content,
            date: item.date,
            author: item.author,
            image: item.image || null,
            imageCaption: item.imageCaption || null,
            category: item.category || null,
            youtubeUrl: item.youtubeUrl || null,
            content_html: item.content_html || null,
            created_at: item.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (error) throw error;
      }
      
      setError(null);
      setSuccess(`تم مزامنة ${parsedData.length} خبر إلى Supabase بنجاح`);
      
      // Reload Supabase data to confirm sync
      await loadSupabaseData();
      
      toast({
        title: "تمت المزامنة",
        description: `تم مزامنة ${parsedData.length} خبر إلى Supabase بنجاح`,
      });
    } catch (err) {
      setError('فشل في مزامنة البيانات إلى Supabase');
      console.error('Error syncing to Supabase:', err);
      
      toast({
        title: "خطأ",
        description: "فشل في مزامنة البيانات إلى Supabase",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncFromSupabase = async () => {
    setIsLoading(true);
    try {
      if (!supabaseData.trim()) {
        setError('لا يمكن مزامنة بيانات فارغة');
        return;
      }
      
      const parsedData = JSON.parse(supabaseData);
      
      // Confirm with user
      const confirmed = window.confirm(`هل أنت متأكد من رغبتك في استبدال بيانات التخزين المحلي بـ ${parsedData.length} خبر من Supabase؟`);
      if (!confirmed) {
        setIsLoading(false);
        return;
      }
      
      // Save to localStorage
      localStorage.setItem('website-news', JSON.stringify(parsedData));
      
      // Update local display
      setLocalStorageData(JSON.stringify(parsedData, null, 2));
      
      // Broadcast update
      const channel = new BroadcastChannel('news-updates');
      channel.postMessage({ 
        type: 'NEWS_UPDATED', 
        timestamp: Date.now(),
        source: 'debugger'
      });
      
      localStorage.setItem('news-update-trigger', Date.now().toString());
      
      setError(null);
      setSuccess(`تم مزامنة ${parsedData.length} خبر من Supabase إلى التخزين المحلي بنجاح`);
      
      toast({
        title: "تمت المزامنة",
        description: `تم مزامنة ${parsedData.length} خبر من Supabase إلى التخزين المحلي بنجاح`,
      });
    } catch (err) {
      setError('فشل في مزامنة البيانات من Supabase');
      console.error('Error syncing from Supabase:', err);
      
      toast({
        title: "خطأ",
        description: "فشل في مزامنة البيانات من Supabase",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse">
          <Bug className="w-5 h-5 text-amber-500" />
          <span>أداة تصحيح الأخبار</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Local Storage Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold flex items-center">
                <Database className="w-4 h-4 ml-2" />
                بيانات التخزين المحلي
              </Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadLocalStorageData}
                >
                  <RefreshCw className="w-4 h-4 ml-1" />
                  تحميل
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={clearLocalStorageData}
                >
                  <Trash2 className="w-4 h-4 ml-1" />
                  مسح
                </Button>
              </div>
            </div>
            
            <Textarea
              value={localStorageData}
              onChange={(e) => setLocalStorageData(e.target.value)}
              className="font-mono text-xs h-[400px] overflow-auto"
              placeholder="بيانات التخزين المحلي ستظهر هنا..."
              dir="ltr"
            />
            
            <div className="flex justify-between">
              <Button 
                onClick={saveLocalStorageData}
                disabled={isLoading}
              >
                <Save className="w-4 h-4 ml-2" />
                حفظ في التخزين المحلي
              </Button>
              
              <Button 
                onClick={syncToSupabase}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري المزامنة...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 ml-2" />
                    مزامنة إلى Supabase
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Supabase Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold flex items-center">
                <Database className="w-4 h-4 ml-2" />
                بيانات Supabase
              </Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadSupabaseData}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 ml-1" />
                    تحميل
                  </>
                )}
              </Button>
            </div>
            
            <Textarea
              value={supabaseData}
              onChange={(e) => setSupabaseData(e.target.value)}
              className="font-mono text-xs h-[400px] overflow-auto"
              placeholder="بيانات Supabase ستظهر هنا..."
              dir="ltr"
            />
            
            <Button 
              onClick={syncFromSupabase}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري المزامنة...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 ml-2" />
                  مزامنة من Supabase إلى التخزين المحلي
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-amber-800 text-sm">
          <div className="flex items-start space-x-2 space-x-reverse">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">تنبيه: أداة للمطورين فقط</p>
              <p>هذه الأداة مخصصة لتصحيح مشاكل البيانات وإصلاحها. استخدمها بحذر لأن التغييرات قد تؤثر على جميع بيانات الأخبار.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsDebugger;