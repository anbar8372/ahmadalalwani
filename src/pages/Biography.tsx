import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, GraduationCap, User } from 'lucide-react';

const Biography = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <section className="py-8 md:py-16 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">السيرة الذاتية</h1>
            <p className="text-base sm:text-lg md:text-xl opacity-90 px-4">
              تعرف على التفاصيل الكاملة لحياة الدكتور أحمد العلواني الشخصية والعلمية
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="space-y-6 md:space-y-8">
            {/* Personal Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse text-xl md:text-2xl">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  <span>المعلومات الشخصية</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-iraqi-green mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm md:text-base">تاريخ الميلاد</p>
                        <p className="text-gray-600 text-sm md:text-base">27 أبريل، 1969</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-iraqi-red mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm md:text-base">مكان الميلاد</p>
                        <p className="text-gray-600 text-sm md:text-base">الرمادي، محافظة الأنبار، العراق</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <p className="font-semibold text-sm md:text-base">الاسم الكامل</p>
                      <p className="text-gray-600 text-sm md:text-base">أحمد سليمان العلواني</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm md:text-base">الديانة</p>
                      <p className="text-gray-600 text-sm md:text-base">مسلم</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm md:text-base">الجنسية</p>
                      <p className="text-gray-600 text-sm md:text-base">عراقي</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Early Life */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl text-primary">النشأة والتكوين المبكر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm md:prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="text-base md:text-lg mb-4">
                    وُلد الدكتور أحمد سليمان العلواني في 27 أبريل عام 1969 في مدينة الرمادي، 
                    مركز محافظة الأنبار في العراق. نشأ في بيئة عراقية أصيلة، حيث ترعرع على القيم 
                    العربية والإسلامية الأصيلة.
                  </p>
                  <p className="text-sm md:text-base">
                    قضى طفولته وشبابه المبكر في مدينة الرمادي، حيث تلقى تعليمه الأولي في مدارسها. 
                    كان طالباً متفوقاً منذ صغره، مما مهد له الطريق لمواصلة تعليمه العالي في العاصمة بغداد.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse text-xl md:text-2xl">
                  <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  <span>المسيرة التعليمية</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 md:space-y-6">
                  <div className="border-r-2 md:border-r-4 border-iraqi-green pr-4 md:pr-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">التعليم الأساسي</h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      درس الدكتور أحمد العلواني المراحل الابتدائية والمتوسطة والإعدادية في مدينة الرمادي، 
                      حيث أظهر تفوقاً ملحوظاً في دراسته، مما أهله للالتحاق بالجامعة.
                    </p>
                  </div>
                  
                  <div className="border-r-2 md:border-r-4 border-iraqi-red pr-4 md:pr-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">التعليم الجامعي</h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                      انتقل إلى العاصمة بغداد لإكمال دراسته الأكاديمية في جامعة بغداد العريقة، 
                      حيث حصل على درجاته العلمية الثلاث في تخصص علوم الأرض (Geology):
                    </p>
                    <ul className="space-y-2 text-sm md:text-base text-gray-600">
                      <li className="flex items-start space-x-2 space-x-reverse">
                        <div className="w-2 h-2 bg-iraqi-green rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>البكالوريوس</strong> في علوم الأرض من جامعة بغداد</span>
                      </li>
                      <li className="flex items-start space-x-2 space-x-reverse">
                        <div className="w-2 h-2 bg-iraqi-red rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>الماجستير</strong> في علوم الأرض من جامعة بغداد</span>
                      </li>
                      <li className="flex items-start space-x-2 space-x-reverse">
                        <div className="w-2 h-2 bg-iraqi-green rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>الدكتوراه</strong> في علوم الأرض من جامعة بغداد</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Character */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl text-primary">الشخصية والمبادئ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm md:prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p className="text-sm md:text-base mb-4">
                    يُعرف الدكتور أحمد العلواني بشخصيته القوية ومواقفه الثابتة من القضايا المبدئية. 
                    نشأ على حب الوطن والدفاع عن قضايا الشعب العراقي، وهو ما انعكس بوضوح في مسيرته السياسية 
                    خلال فترة عضويته في البرلمان العراقي (2005-2014) ولدورتين متتاليتين.
                  </p>
                  <p className="text-sm md:text-base">
                    يتميز بالصراحة والوضوح في طرح آرائه، ولا يتردد في الدفاع عن معتقداته ومبادئه، 
                    حتى لو كلفه ذلك الكثير. هذه الصفات جعلته محل احترام وتقدير من قبل الكثيرين، 
                    كما جعلته هدفاً للانتقادات من آخرين.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Biography;
