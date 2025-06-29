
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  User, 
  Briefcase, 
  Award, 
  Image, 
  Mail, 
  Home,
  Globe,
  Shield
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
import { useAuth } from '@/hooks/useAuth';

const AdminPanel = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <section className="py-8 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">لوحة التحكم</h1>
            <p className="text-lg opacity-90">
              إدارة محتوى الموقع والإعدادات العامة
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="home" className="space-y-6" dir="rtl">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 gap-2">
              <TabsTrigger value="home" className="flex items-center space-x-2 space-x-reverse">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">الرئيسية</span>
              </TabsTrigger>
              <TabsTrigger value="biography" className="flex items-center space-x-2 space-x-reverse">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">السيرة</span>
              </TabsTrigger>
              <TabsTrigger value="political" className="flex items-center space-x-2 space-x-reverse">
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">السياسية</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center space-x-2 space-x-reverse">
                <Award className="w-4 h-4" />
                <span className="hidden sm:inline">الإنجازات</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center space-x-2 space-x-reverse">
                <Image className="w-4 h-4" />
                <span className="hidden sm:inline">الإعلام</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center space-x-2 space-x-reverse">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">الاتصال</span>
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center space-x-2 space-x-reverse">
                <Image className="w-4 h-4" />
                <span className="hidden sm:inline">المعرض</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2 space-x-reverse">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">الإعدادات</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2 space-x-reverse">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">الأمان</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home">
              <HomeContentManager />
            </TabsContent>

            <TabsContent value="biography">
              <BiographyManager />
            </TabsContent>

            <TabsContent value="political">
              <PoliticalCareerManager />
            </TabsContent>

            <TabsContent value="achievements">
              <AchievementsManager />
            </TabsContent>

            <TabsContent value="media">
              <MediaManager />
            </TabsContent>

            <TabsContent value="contact">
              <ContactManager />
            </TabsContent>

            <TabsContent value="gallery">
              <ImageGalleryManager />
            </TabsContent>

            <TabsContent value="settings">
              <SiteSettingsManager />
            </TabsContent>

            <TabsContent value="security">
              <SecurityManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
