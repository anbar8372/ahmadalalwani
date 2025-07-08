import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  User, 
  Briefcase, 
  Award, 
  Image, 
  Mail, 
  Home,
  Shield,
  Menu,
  X, 
  FileText,
  Server,
} from 'lucide-react';
import HomeContentManager from '@/components/admin/HomeContentManager';
import BiographyManager from '@/components/admin/BiographyManager';
import PoliticalCareerManager from '@/components/admin/PoliticalCareerManager';
import AchievementsManager from '@/components/admin/AchievementsManager';
import MediaManager from '@/components/admin/MediaManager';
import ContactManager from '@/components/admin/ContactManager';
import ImageGalleryManager from '@/components/admin/ImageGalleryManager';
import SiteSettingsManager from '@/components/admin/SiteSettingsManager';
import SecurityManager from '@/components/admin/SecurityManager';
import LoginForm from '@/components/admin/LoginForm';
import DrAhmedNewsManager from '@/components/admin/DrAhmedNewsManager';
import SyncStatusIndicator from '@/components/admin/SyncStatusIndicator';
import ErrorBoundary from '@/components/admin/ErrorBoundary';
import ConnectionTester from '@/components/admin/ConnectionTester';
import ConnectionErrorHandler from '@/components/admin/ConnectionErrorHandler';
import { useAuth } from '@/hooks/useAuth';

const AdminPanel = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showConnectionTester, setShowConnectionTester] = useState(false);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const menuItems = [
    { id: 'home', label: 'الصفحة الرئيسية', icon: Home },
    { id: 'dr-ahmed-news', label: 'أخبار الدكتور أحمد', icon: FileText },
    { id: 'biography', label: 'السيرة الذاتية', icon: User },
    { id: 'political', label: 'المسيرة السياسية', icon: Briefcase },
    { id: 'achievements', label: 'الإنجازات', icon: Award },
    { id: 'media', label: 'وسائل الإعلام', icon: Image },
    { id: 'contact', label: 'صفحة الاتصال', icon: Mail },
    { id: 'gallery', label: 'معرض الصور', icon: Image },
    { id: 'settings', label: 'إعدادات الموقع', icon: Settings },
    { id: 'security', label: 'إعدادات الأمان', icon: Shield },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeContentManager />;
      case 'dr-ahmed-news':
        return <DrAhmedNewsManager />;
      case 'biography':
        return <BiographyManager />;
      case 'political':
        return <PoliticalCareerManager />;
      case 'achievements':
        return <AchievementsManager />;
      case 'media':
        return <MediaManager />;
      case 'contact':
        return <ContactManager />;
      case 'gallery':
        return <ImageGalleryManager />;
      case 'settings':
        return <SiteSettingsManager />;
      case 'security':
        return <SecurityManager />;
      default:
        return <HomeContentManager />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowConnectionTester(!showConnectionTester)}
              >
                <Server className="w-4 h-4 ml-2" />
                {showConnectionTester ? 'إخفاء اختبار الاتصال' : 'اختبار الاتصال'}
              </Button>
              <div className="text-sm text-gray-600">
                مرحباً بك في لوحة إدارة الموقع
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className={`
            fixed lg:static inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            lg:translate-x-0 border-l
          `}>
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="p-4 border-b bg-primary text-white">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">ع</span>
                  </div>
                  <div>
                    <h2 className="font-semibold">لوحة التحكم</h2>
                    <p className="text-xs opacity-90">إدارة المحتوى</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false); // Close sidebar on mobile after selection
                      }}
                      className={`
                        w-full flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg text-right transition-colors
                        ${activeTab === item.id 
                          ? 'bg-primary text-white shadow-md' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar Footer */}
              <div className="p-4 border-t bg-gray-50">
                <div className="text-xs text-gray-500 text-center">
                  © 2025 الدكتور أحمد العلواني
                </div>
              </div>
            </div>
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 lg:mr-64">
            <div className="p-4 lg:p-6">
              {/* Content Header */}
              <div className="mb-6">
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-right flex items-center justify-between">
                      <span>
                        {menuItems.find(item => item.id === activeTab)?.label || 'لوحة التحكم'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-2">
                    {showConnectionTester && (
                      <div className="mb-4">
                        <ConnectionTester />
                      </div>
                    )}
                    <SyncStatusIndicator />
                  </CardContent>
                </Card>
              </div>

              {/* Dynamic Content */}
              <div className="space-y-6">
                <ErrorBoundary>
                  {renderContent()}
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;