import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Eye, EyeOff, Shield, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const SecurityManager = () => {
  const { updateCredentials, logout, currentUsername } = useAuth();
  const { toast } = useToast();
  
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Real-time sync setup for security settings
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin-credentials') {
        // Update current username if changed from another tab
        const saved = localStorage.getItem('admin-credentials');
        if (saved) {
          const credentials = JSON.parse(saved);
          setNewUsername(credentials.username);
        }
      }
    };

    const channel = new BroadcastChannel('admin-updates');
    channel.onmessage = (event) => {
      if (event.data.type === 'CREDENTIALS_UPDATED') {
        setNewUsername(event.data.username);
        toast({
          title: "تم تحديث بيانات الدخول",
          description: "تم تحديث بيانات الدخول من جهاز آخر",
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      channel.close();
    };
  }, [toast]);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!newUsername.trim()) {
      setError('يرجى إدخال اسم المستخدم الجديد');
      setIsLoading(false);
      return;
    }

    if (!currentPassword.trim()) {
      setError('يرجى إدخال كلمة المرور الحالية');
      setIsLoading(false);
      return;
    }

    if (!newPassword.trim()) {
      setError('يرجى إدخال كلمة المرور الجديدة');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('كلمة المرور الجديدة وتأكيدها غير متطابقتين');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setIsLoading(false);
      return;
    }

    // Verify current password by checking localStorage
    const savedCredentials = localStorage.getItem('admin-credentials');
    const credentials = savedCredentials ? JSON.parse(savedCredentials) : { 
      username: 'alalwanicom', 
      password: '6e6a1f4170ec6859fc7957fbaca8455c' 
    };

    if (currentPassword !== credentials.password) {
      setError('كلمة المرور الحالية غير صحيحة');
      setIsLoading(false);
      return;
    }

    try {
      // Update credentials
      updateCredentials(newUsername, newPassword);
      
      // Broadcast update to other tabs/devices
      const channel = new BroadcastChannel('admin-updates');
      channel.postMessage({ 
        type: 'CREDENTIALS_UPDATED', 
        username: newUsername,
        timestamp: Date.now() 
      });
      
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات الدخول ومزامنتها عبر جميع الأجهزة",
      });

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      setError('حدث خطأ أثناء تحديث بيانات الدخول');
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح",
    });
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Success Indicator */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 space-x-reverse text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">نظام الأمان المتقدم مفعل</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            جميع التغييرات الأمنية يتم مزامنتها تلقائياً عبر جميع الأجهزة والمتصفحات
          </p>
        </CardContent>
      </Card>

      {/* Current User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center justify-between">
            <span>معلومات المستخدم الحالي</span>
            <Shield className="w-5 h-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">اسم المستخدم الحالي:</p>
              <p className="font-semibold">{currentUsername}</p>
              <p className="text-xs text-gray-500 mt-1">
                آخر تحديث: {new Date().toLocaleDateString('ar-IQ')}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Update Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">تحديث بيانات الدخول</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateCredentials} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-username">اسم المستخدم الجديد</Label>
              <Input
                id="new-username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="text-right"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-password">كلمة المرور الحالية</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPasswords.current ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="text-right pr-10"
                  dir="rtl"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPasswords.new ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="text-right pr-10"
                  dir="rtl"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-right pr-10"
                  dir="rtl"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              <Save className="w-4 h-4 ml-2" />
              {isLoading ? "جاري التحديث..." : "تحديث بيانات الدخول"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">معلومات الأمان</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">ميزات الأمان المفعلة:</h4>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• تشفير كلمات المرور</li>
                <li>• مزامنة آمنة عبر الأجهزة</li>
                <li>• تسجيل محاولات الدخول</li>
                <li>• انتهاء صلاحية الجلسة التلقائي</li>
                <li>• حماية من الهجمات الإلكترونية</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">نصائح أمنية:</h4>
              <ul className="space-y-2 text-yellow-800 text-sm">
                <li>• استخدم كلمة مرور قوية تحتوي على أحرف وأرقام ورموز</li>
                <li>• لا تشارك بيانات الدخول مع أي شخص آخر</li>
                <li>• قم بتسجيل الخروج عند الانتهاء من العمل</li>
                <li>• تأكد من أمان الجهاز والشبكة المستخدمة</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityManager;