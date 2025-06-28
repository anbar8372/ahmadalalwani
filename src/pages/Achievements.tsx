
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, Users, BookOpen, Briefcase, Heart } from 'lucide-react';

const Achievements = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-4">الإنجازات</h1>
            <p className="text-xl opacity-90">
              أبرز إنجازات الدكتور أحمد العلواني في المجالين الأكاديمي والسياسي
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-8">
            {/* Academic Achievements */}
            <Card className="shadow-lg border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse text-2xl">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                  <span>الإنجازات الأكاديمية</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                        <Award className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">درجة الدكتوراه</h3>
                        <p className="text-gray-600">حصل على الدكتوراه في علوم الأرض من جامعة بغداد</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                        <Award className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">التخصص العلمي</h3>
                        <p className="text-gray-600">متخصص في علوم الأرض (Geology) بدرجة عالية من الخبرة</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">المسيرة التعليمية</h4>
                      <p className="text-gray-700 text-sm">
                        أكمل جميع مراحل تعليمه الجامعي في جامعة بغداد العريقة، مما يعكس 
                        التزامه بالتميز الأكاديمي والبحث العلمي في مجال تخصصه.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Political Achievements */}
            <Card className="shadow-lg border-t-4 border-t-iraqi-red">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse text-2xl">
                  <Briefcase className="w-6 h-6 text-iraqi-red" />
                  <span>الإنجازات السياسية</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 space-x-reverse mb-3">
                          <TrendingUp className="w-5 h-5 text-iraqi-red" />
                          <h3 className="font-semibold">رئاسة اللجنة الاقتصادية</h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                          يترأس اللجنة الاقتصادية في البرلمان العراقي، حيث يعمل على وضع 
                          السياسات الاقتصادية والمالية للدولة.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 space-x-reverse mb-3">
                          <Users className="w-5 h-5 text-iraqi-green" />
                          <h3 className="font-semibold">النيابة البرلمانية</h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                          نائب منتخب في البرلمان العراقي، يمثل دائرته الانتخابية 
                          ويدافع عن مصالح ناخبيه.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-gradient-to-r from-iraqi-red/10 to-iraqi-green/10 p-6 rounded-lg">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">أبرز المساهمات البرلمانية</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3 space-x-reverse">
                        <Badge variant="outline" className="mt-1">اقتصادي</Badge>
                        <span className="text-gray-700">العمل على تطوير السياسات الاقتصادية الوطنية</span>
                      </li>
                      <li className="flex items-start space-x-3 space-x-reverse">
                        <Badge variant="outline" className="mt-1">تشريعي</Badge>
                        <span className="text-gray-700">المشاركة في صياغة القوانين المهمة للدولة</span>
                      </li>
                      <li className="flex items-start space-x-3 space-x-reverse">
                        <Badge variant="outline" className="mt-1">رقابي</Badge>
                        <span className="text-gray-700">مراقبة أداء الحكومة ومحاسبتها على أعمالها</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social and Community Achievements */}
            <Card className="shadow-lg border-t-4 border-t-iraqi-green">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse text-2xl">
                  <Heart className="w-6 h-6 text-iraqi-green" />
                  <span>الإنجازات الاجتماعية</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Users className="w-8 h-8 text-iraqi-green mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900">دعم الحراك الشعبي</h4>
                      <p className="text-gray-600 text-sm mt-2">
                        قاد ودعم الحراك الشعبي للمطالبة بحقوق المواطنين
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900">الدفاع عن الحقوق</h4>
                      <p className="text-gray-600 text-sm mt-2">
                        دافع بقوة عن حقوق المكون السني في العراق
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-iraqi-red mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900">المبادرات السياسية</h4>
                      <p className="text-gray-600 text-sm mt-2">
                        طرح مبادرات لحل الأزمات السياسية في البلاد
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">التأثير المجتمعي</h4>
                    <p className="text-gray-700 leading-relaxed">
                      كان للدكتور أحمد العلواني تأثير كبير في المجتمع العراقي من خلال مواقفه الواضحة 
                      وخطاباته القوية. استطاع أن يكون صوتاً للمهمشين والمظلومين، وأن يعبر عن 
                      مطالب شريحة واسعة من الشعب العراقي في مختلف المحافل المحلية والإقليمية.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recognition and Impact */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">التقدير والتأثير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    حظي الدكتور أحمد العلواني بتقدير واحترام واسعين من قبل مؤيديه وناخبيه، 
                    الذين يرون فيه رمزاً للمقاومة السياسية والدفاع عن الحقوق. كما أن مواقفه 
                    الجريئة وخطاباته الواضحة جعلته شخصية مؤثرة في المشهد السياسي العراقي.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">في الأوساط الأكاديمية</h4>
                      <p className="text-blue-800 text-sm">
                        احترام كبير كأكاديمي متخصص في علوم الأرض مع خلفية علمية قوية
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">في الأوساط السياسية</h4>
                      <p className="text-green-800 text-sm">
                        معروف بمواقفه الثابتة وشجاعته في طرح القضايا الحساسة
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Achievements;
