import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send, Clock, Users, Loader2 } from 'lucide-react';
import { sendContactEmail, ContactFormData } from '@/services/emailService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "خطأ في الإرسال",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendContactEmail(formData as ContactFormData);
      
      if (result.success) {
        toast({
          title: "تم إرسال الرسالة بنجاح",
          description: "شكراً لتواصلكم. سيتم الرد عليكم في أقرب وقت ممكن."
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-4">اتصل بي</h1>
            <p className="text-xl opacity-90">
              للتواصل والاستفسارات، يسعدني أن أسمع منكم
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">معلومات التواصل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className="w-12 h-12 bg-iraqi-red rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">العنوان</h3>
                        <p className="text-gray-600">
                          الرمادي، محافظة الأنبار<br />
                          العراق
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className="w-12 h-12 bg-iraqi-green rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">البريد الإلكتروني</h3>
                        <p className="text-gray-600">info@ahmadalwani.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">رقم الهاتف</h3>
                        <p className="text-gray-600">+964 XXX XXX XXXX</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse text-xl">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>أوقات العمل</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-900">الأحد - الخميس</span>
                      <span className="text-gray-600">9:00 ص - 5:00 م</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-900">الجمعة</span>
                      <span className="text-gray-600">مغلق</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-900">السبت</span>
                      <span className="text-red-600">مغلق</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-t-4 border-t-primary">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse text-xl">
                    <Users className="w-5 h-5 text-primary" />
                    <span>لأهلي الكرام</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">يسعدني أن أستمع إلى آرائكم ومقترحاتكم واستفساراتكم. أعتبر التواصل معكم  جزءاً أساسياً من عملي. لا تترددوا في التواصل معي بخصوص أي موضوع يهمكم.</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">إرسال رسالة</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">الاسم الكامل *</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          placeholder="أدخل اسمك الكامل" 
                          required 
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني *</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          placeholder="أدخل بريدك الإلكتروني" 
                          required 
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          placeholder="أدخل رقم هاتفك" 
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">الموضوع</Label>
                        <Input 
                          id="subject" 
                          name="subject" 
                          value={formData.subject} 
                          onChange={handleInputChange} 
                          placeholder="موضوع الرسالة" 
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">الرسالة *</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        value={formData.message} 
                        onChange={handleInputChange} 
                        placeholder="اكتب رسالتك هنا..." 
                        rows={6} 
                        required 
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 ml-2" />
                          إرسال الرسالة
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
