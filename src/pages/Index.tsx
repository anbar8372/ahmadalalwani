
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ChevronDown, Users, Building, Award, BookOpen, Briefcase } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            {/* Profile Image Placeholder */}
            <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-br from-iraqi-red to-iraqi-green shadow-2xl flex items-center justify-center">
              <span className="text-6xl font-bold text-white">أ.ع</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 text-shadow">
              الدكتور أحمد العلواني
            </h1>
            <h2 className="text-2xl md:text-3xl text-primary mb-6">
              نائب في البرلمان العراقي
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              رئيس اللجنة الاقتصادية في البرلمان العراقي، حاصل على الدكتوراه في علوم الأرض من جامعة بغداد، يعمل من أجل خدمة الشعب العراقي وتحقيق التنمية المستدامة.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link to="/biography">تعرف على سيرتي الذاتية</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3" asChild>
                <Link to="/contact">تواصل معي</Link>
              </Button>
            </div>
            
            <div className="animate-bounce">
              <ChevronDown className="w-8 h-8 text-gray-400 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-iraqi-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">56</h3>
              <p className="text-gray-600">عاماً من العمر</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-iraqi-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">البرلمان</h3>
              <p className="text-gray-600">العراقي</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-iraqi-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">رئيس</h3>
              <p className="text-gray-600">اللجنة الاقتصادية</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-iraqi-green rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">دكتوراه</h3>
              <p className="text-gray-600">علوم الأرض</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brief Overview */}
      <section className="py-16 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">نبذة مختصرة</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              تعرف على المسيرة العلمية والسياسية للدكتور أحمد العلواني
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">التعليم والتكوين العلمي</h3>
                  <p className="text-gray-600 leading-relaxed">
                    وُلد الدكتور أحمد سليمان العلواني في 27 أبريل 1969 في مدينة الرمادي، محافظة الأنبار. 
                    حصل على البكالوريوس والماجستير والدكتوراه في علوم الأرض من جامعة بغداد العريقة.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">المسيرة السياسية</h3>
                  <p className="text-gray-600 leading-relaxed">
                    يشغل حالياً منصب نائب في البرلمان العراقي ورئيس اللجنة الاقتصادية، 
                    حيث يعمل على تطوير السياسات الاقتصادية وخدمة المواطنين العراقيين.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <div className="w-96 h-96 mx-auto bg-gradient-to-br from-iraqi-red/20 to-iraqi-green/20 rounded-full flex items-center justify-center">
                <div className="w-80 h-80 bg-gradient-to-br from-iraqi-red to-iraqi-green rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-8xl font-bold text-white">أ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">اكتشف المزيد</h2>
          <p className="text-xl mb-8 opacity-90">
            تصفح الموقع للتعرف على المزيد من التفاصيل حول مسيرة الدكتور أحمد العلواني
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Button variant="secondary" size="lg" asChild className="h-auto py-4">
              <Link to="/political-career" className="flex flex-col items-center space-y-2">
                <Briefcase className="w-6 h-6" />
                <span>المسيرة السياسية</span>
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="h-auto py-4">
              <Link to="/achievements" className="flex flex-col items-center space-y-2">
                <Award className="w-6 h-6" />
                <span>الإنجازات</span>
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="h-auto py-4">
              <Link to="/media" className="flex flex-col items-center space-y-2">
                <Users className="w-6 h-6" />
                <span>وسائل الإعلام</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
