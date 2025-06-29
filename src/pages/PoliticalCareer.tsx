
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, Users, Gavel } from 'lucide-react';

const PoliticalCareer = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-4">المسيرة السياسية</h1>
            <p className="text-xl opacity-90">
              رحلة الدكتور أحمد العلواني في العمل السياسي والدفاع عن قضايا الشعب العراقي (2010-2013)
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-8">
            {/* Parliamentary Period */}
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse text-2xl">
                  <Gavel className="w-6 h-6 text-primary" />
                  <span>الفترة البرلمانية</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default" className="text-sm px-3 py-1">
                      نائب في البرلمان العراقي (2010-2013)
                    </Badge>
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      رئيس اللجنة الاقتصادية
                    </Badge>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    شغل الدكتور أحمد العلواني منصب نائب في البرلمان العراقي من عام 2010 حتى أواخر عام 2013، 
                    كما تولى رئاسة اللجنة الاقتصادية خلال هذه الفترة، حيث عمل على وضع السياسات الاقتصادية 
                    التي تهدف إلى تطوير الاقتصاد العراقي وتحسين الأوضاع المعيشية للمواطنين.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Political Stance */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">التوجه السياسي والمواقف</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-r-4 border-iraqi-red pr-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">الموقف من السياسة الخارجية</h3>
                    <p className="text-gray-700 leading-relaxed">
                      عُرف الدكتور العلواني خلال فترته البرلمانية (2010-2013) بموقفه المعارض والحازم من التدخلات الخارجية 
                      في الشؤون العراقية، خاصة التدخل الإيراني. كان ينتقد بشدة السياسيين العراقيين الذين يعتبرهم موالين لإيران، 
                      ويدعو إلى استقلالية القرار العراقي.
                    </p>
                  </div>
                  
                  <div className="border-r-4 border-iraqi-green pr-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">النقد للحكومات</h3>
                    <p className="text-gray-700 leading-relaxed">
                      كان من أشد المنتقدين لحكومة رئيس الوزراء نوري المالكي خلال فترته البرلمانية، حيث اتهمها 
                      بالفساد وسوء الإدارة والانحياز الطائفي. كانت خطاباته في البرلمان ووسائل الإعلام 
                      تتميز بالحدة والوضوح في انتقاد السياسات الحكومية.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Movement Support */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse text-2xl">
                  <Users className="w-6 h-6 text-primary" />
                  <span>دعم الحراك الشعبي</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    منذ انطلاق الحراك الشعبي في المحافظات السنية، كان الدكتور أحمد العلواني 
                    في طليعة الداعمين للحراك والمدافعين عنه. حضر جميع النشاطات التي أقيمت 
                    في الساحات الشعبية، وكانت له كلمة في كل مناسبة، خاصة في الفترة الأخيرة من عضويته البرلمانية.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">أبرز مواقفه في الحراك:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start space-x-2 space-x-reverse">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>المشاركة الفعالة في جميع المظاهرات والفعاليات</span>
                      </li>
                      <li className="flex items-start space-x-2 space-x-reverse">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>إلقاء خطابات حماسية لدعم مطالب المتظاهرين</span>
                      </li>
                      <li className="flex items-start space-x-2 space-x-reverse">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>الدفاع عن حقوق المتظاهرين في البرلمان</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sunni Region Advocacy */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">الدعوة للإقليم السني</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    كانت "قضية أهل السنة والجماعة، والإقليم السني" شغله الشاغل خلال فترته البرلمانية. 
                    أبرز هذه القضية بقوة خاصة في الفترة الأخيرة من عام 2013، استجابة لما يتعرض له المكون السني 
                    من تهميش وظلم في العراق.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg border-r-4 border-blue-400">
                    <h4 className="font-semibold text-gray-900 mb-2">رؤيته للإقليم السني:</h4>
                    <p className="text-gray-700">
                      كان يعتقد أن الإقليم السني هو الخيار الوحيد المتبقي أمام أهل السنة في العراق 
                      لحماية حقوقهم وضمان مشاركتهم العادلة في الحكم، بعد التهميش الذي تعرضوا له 
                      والحملات الأمنية التي استهدفتهم.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* End of Parliamentary Term and Arrest */}
            <Card className="shadow-lg border-t-4 border-t-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse text-2xl">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                  <span>نهاية الفترة البرلمانية والاعتقال</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 space-x-reverse mb-4">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <span className="font-semibold">28 سبتمبر 2013</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    انتهت فترة الدكتور أحمد العلواني في البرلمان العراقي في أواخر عام 2013. 
                    وفي 28 سبتمبر 2013، تم اعتقاله من منزله في الرمادي من قبل قوات الأمن العراقية 
                    بتهم "التحريض على الإرهاب". هذا الاعتقال أثار جدلاً واسعاً وردود فعل متباينة 
                    في الأوساط السياسية والشعبية.
                  </p>
                  <div className="bg-yellow-50 p-4 rounded-lg border-r-4 border-yellow-400">
                    <p className="text-gray-700">
                      <strong>ملاحظة:</strong> كان بعض السياسيين قد طالبوا برفع الحصانة عنه قبل انتهاء فترته البرلمانية، 
                      وقدموا ضده دعوى قضائية، لكن المحكمة أبطلت هذه الدعوى في ذلك الوقت.
                    </p>
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

export default PoliticalCareer;
