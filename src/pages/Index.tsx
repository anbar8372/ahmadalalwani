import Layout from '@/components/Layout';
import NewsSection from '@/components/NewsSection';
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
            {/* Distinguished Profile Image */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto mb-6 md:mb-8 rounded-full shadow-2xl overflow-hidden bg-white border-4 border-iraqi-red/20 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-iraqi-red/10 to-iraqi-green/10 rounded-full"></div>
              <img src="https://k.top4top.io/p_3466m7gn01.jpg" alt="الدكتور أحمد العلواني" className="w-full h-full object-cover relative z-10" onError={e => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-red-600 to-green-600 flex items-center justify-center relative z-10"><span class="text-4xl md:text-6xl font-bold text-white">أ.ع</span></div>';
            }} />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-4 text-shadow px-4">
              الدكتور أحمد العلواني
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary mb-4 md:mb-6 px-4">
              نائب سابق في البرلمان العراقي (2005-2014)
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              حاصل على الدكتوراه في علوم الأرض من جامعة بغداد، شغل منصب نائب في البرلمان العراقي لدورتين متتاليتين من عام 2005 إلى عام 2014.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-4">
              <Button asChild size="lg" className="text-base md:text-lg px-6 md:px-8 py-2 md:py-3">
                <Link to="/biography">تعرف على سيرتي الذاتية</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base md:text-lg px-6 md:px-8 py-2 md:py-3" asChild>
                <Link to="/contact">تواصل معي</Link>
              </Button>
            </div>
            
            <div className="animate-bounce">
              <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-iraqi-red rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">56</h3>
              <p className="text-gray-600 text-sm md:text-base">عاماً من العمر</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-iraqi-green rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Building className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">2014-2005</h3>
              <p className="text-gray-600 text-sm md:text-base">البرلمان العراقي</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-iraqi-red rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">رئيس سابق</h3>
              <p className="text-gray-600 text-sm md:text-base">اللجنة الاقتصادية</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-iraqi-green rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">دكتوراه</h3>
              <p className="text-gray-600 text-sm md:text-base">علوم الأرض</p>
            </div>
          </div>
        </div>
      </section>

      {/* News Section - Now matches the image exactly */}
      <NewsSection />

      {/* Brief Overview */}
      <section className="py-12 md:py-16 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">نبذة مختصرة</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              تعرف على المسيرة العلمية والسياسية للدكتور أحمد العلواني
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4 md:space-y-6 order-2 lg:order-1">
              <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">التعليم والتكوين العلمي</h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    وُلد الدكتور أحمد سليمان العلواني في 27 أبريل 1969 في مدينة الرمادي، محافظة الأنبار. 
                    حصل على البكالوريوس والماجستير والدكتوراه في علوم الأرض من جامعة بغداد العريقة.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">المسيرة السياسية</h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    شغل منصب نائب في البرلمان العراقي لدورتين متتاليتين من عام 2005 إلى عام 2014، 
                    حيث عمل على تطوير السياسات الاقتصادية وخدمة المواطنين العراقيين.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center order-1 lg:order-2">
              <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto rounded-full shadow-2xl overflow-hidden bg-white">
                <img src="https://i.imgur.com/placeholder-parliament.jpg" alt="الدكتور أحمد العلواني في البرلمان" className="w-full h-full object-cover" onError={e => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-red-600/20 to-green-600/20 rounded-full flex items-center justify-center"><div class="w-4/5 h-4/5 bg-gradient-to-br from-red-600 to-green-600 rounded-full flex items-center justify-center shadow-2xl"><span class="text-6xl md:text-8xl font-bold text-white">أ</span></div></div>';
              }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">صور من المسيرة</h2>
            <p className="text-lg md:text-xl text-gray-600 px-4">
              لحظات مهمة من مسيرة الدكتور أحمد العلواني
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="relative group">
              <div className="w-full h-48 md:h-64 bg-gradient-to-br from-iraqi-red/10 to-iraqi-green/10 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-iraqi-red rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <p className="text-gray-600 font-semibold text-sm md:text-base">صورة من المسيرة السياسية</p>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="w-full h-48 md:h-64 bg-gradient-to-br from-iraqi-green/10 to-iraqi-red/10 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-iraqi-green rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Building className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <p className="text-gray-600 font-semibold text-sm md:text-base">صورة من جلسات البرلمان</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">اكتشف المزيد</h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 px-4">
            تصفح الموقع للتعرف على المزيد من التفاصيل حول مسيرة الدكتور أحمد العلواني
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
            <Button variant="secondary" size="lg" asChild className="h-auto py-3 md:py-4">
              <Link to="/political-career" className="flex flex-col items-center space-y-1 md:space-y-2">
                <Briefcase className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm md:text-base">المسيرة السياسية</span>
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="h-auto py-3 md:py-4">
              <Link to="/achievements" className="flex flex-col items-center space-y-1 md:space-y-2">
                <Award className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm md:text-base">الإنجازات</span>
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="h-auto py-3 md:gap-4">
              <Link to="/media" className="flex flex-col items-center space-y-1 md:space-y-2">
                <Users className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm md:text-base">وسائل الإعلام</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;