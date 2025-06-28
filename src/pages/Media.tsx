
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Tv, Newspaper, Mic, Quote, AlertCircle } from 'lucide-react';

const Media = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-4">وسائل الإعلام</h1>
            <p className="text-xl opacity-90">
              تغطية إعلامية شاملة لأبرز ظهورات وتصريحات الدكتور أحمد العلواني
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-8">
            {/* Media Presence Overview */}
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse text-2xl">
                  <Camera className="w-6 h-6 text-primary" />
                  <span>الحضور الإعلامي</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    يتميز الدكتور أحمد العلواني بحضور إعلامي قوي ومؤثر، حيث يظهر بانتظام في 
                    وسائل الإعلام المختلفة للتعبير عن آرائه السياسية ومواقفه من القضايا المهمة. 
                    خطاباته تتميز بالوضوح والجرأة في طرح المواضيع الحساسة.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <Tv className="w-8 h-8 text-iraqi-red mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900">البرامج التلفزيونية</h4>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Mic className="w-8 h-8 text-iraqi-green mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900">المؤتمرات الصحفية</h4>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Newspaper className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900">المقابلات الصحفية</h4>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Quote className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-900">التصريحات</h4>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notable Media Appearances */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">أبرز الظهورات الإعلامية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-r-4 border-iraqi-red pr-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">في المحطات التلفزيونية</h3>
                    <p className="text-gray-700 leading-relaxed">
                      ظهر الدكتور العلواني في العديد من البرامج التلفزيونية الحوارية والإخبارية، 
                      حيث كان يناقش القضايا السياسية الراهنة بجرأة ووضوح. كانت مداخلاته 
                      تحظى بمتابعة واسعة من الجمهور العراقي.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline">البرامج السياسية</Badge>
                      <Badge variant="outline">البرامج الحوارية</Badge>
                      <Badge variant="outline">النشرات الإخبارية</Badge>
                    </div>
                  </div>
                  
                  <div className="border-r-4 border-iraqi-green pr-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">المؤتمرات الصحفية</h3>
                    <p className="text-gray-700 leading-relaxed">
                      عقد العديد من المؤتمرات الصحفية للتعليق على الأحداث السياسية المهمة 
                      والإعلان عن مواقفه من القضايا الجدلية. هذه المؤتمرات كانت تلقى 
                      تغطية إعلامية واسعة من مختلف وسائل الإعلام.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline">مؤتمرات سياسية</Badge>
                      <Badge variant="outline">إعلانات هامة</Badge>
                      <Badge variant="outline">ردود فعل</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Statements */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse text-2xl">
                  <Quote className="w-6 h-6 text-primary" />
                  <span>أبرز التصريحات الإعلامية</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-iraqi-red/10 to-iraqi-green/10 p-6 rounded-lg">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">طبيعة خطاباته الإعلامية</h4>
                    <p className="text-gray-700 leading-relaxed">
                      تميزت تصريحات الدكتور العلواني الإعلامية بالحدة والوضوح في انتقاد 
                      السياسات الحكومية والمواقف السياسية التي يعارضها. كان لا يتردد في 
                      استخدام عبارات قوية للتعبير عن رفضه للسياسات التي يعتبرها ضارة 
                      بالمصلحة الوطنية.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border border-orange-200 bg-orange-50">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-orange-900 mb-2">المواضيع الرئيسية</h4>
                        <ul className="space-y-2 text-orange-800 text-sm">
                          <li>• انتقاد السياسات الحكومية</li>
                          <li>• الدفاع عن حقوق المكون السني</li>
                          <li>• مناقشة الأوضاع الأمنية</li>
                          <li>• التطورات السياسية العامة</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">تأثير التصريحات</h4>
                        <ul className="space-y-2 text-blue-800 text-sm">
                          <li>• إثارة النقاش العام</li>
                          <li>• تحريك الرأي العام</li>
                          <li>• إثارة الجدل السياسي</li>
                          <li>• التأثير على المشهد السياسي</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Coverage Impact */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">تأثير التغطية الإعلامية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    كان للحضور الإعلامي القوي للدكتور أحمد العلواني تأثير كبير على الرأي العام 
                    العراقي. خطاباته وتصريحاته كانت تثير جدلاً واسعاً وتحرك النقاش حول 
                    القضايا السياسية المهمة في البلاد.
                  </p>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border-r-4 border-yellow-400">
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-yellow-900">ردود الفعل المتباينة</h4>
                        <p className="text-yellow-800 text-sm mt-1">
                          تصريحاته الحادة أثارت ردود فعل متباينة، حيث حظي بدعم قوي من مؤيديه، 
                          في حين انتقده آخرون، وصل الأمر إلى مطالبة بعض السياسيين برفع الحصانة عنه.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900">المؤيدون</h4>
                      <p className="text-green-800 text-sm mt-2">
                        رأوا فيه صوت الحق والشجاعة في قول الحقيقة
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-900">المعارضون</h4>
                      <p className="text-red-800 text-sm mt-2">
                        اعتبروا خطاباته تحريضية ومثيرة للفتنة
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900">الإعلام</h4>
                      <p className="text-blue-800 text-sm mt-2">
                        منح تصريحاته تغطية واسعة لما تثيره من جدل
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

export default Media;
