import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Send, Loader2, Shield, CheckCircle } from 'lucide-react';
import { sendContactEmail, ContactFormData } from '@/services/emailService';
import { 
  sanitizeInput, 
  validateEmail, 
  validateName, 
  validatePhone, 
  validateMessage, 
  rateLimitCheck 
} from '@/utils/securityUtils';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const maxAttempts = 3;

  // Security: Clear form data on component unmount
  useEffect(() => {
    return () => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Security: Sanitize input
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const validateForm = (): string | null => {
    // Security: Enhanced validation
    if (!validateName(formData.name)) {
      return 'الاسم يجب أن يكون بين 2-50 حرف ويحتوي على أحرف صحيحة فقط';
    }

    if (!validateEmail(formData.email)) {
      return 'يرجى إدخال بريد إلكتروني صحيح';
    }

    if (!validatePhone(formData.phone)) {
      return 'رقم الهاتف غير صحيح';
    }

    if (!validateMessage(formData.message)) {
      return 'الرسالة يجب أن تكون بين 10-1000 حرف';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Security: Rate limiting
    if (!rateLimitCheck()) {
      toast({
        title: "تم تجاوز الحد المسموح",
        description: "يرجى الانتظار 5 دقائق قبل إرسال رسالة أخرى",
        variant: "destructive"
      });
      return;
    }

    // Security: Attempt limiting
    if (attempts >= maxAttempts) {
      toast({
        title: "تم تجاوز عدد المحاولات",
        description: "يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى",
        variant: "destructive"
      });
      return;
    }

    // Security: Enhanced validation
    const validationError = validateForm();
    if (validationError) {
      setAttempts(prev => prev + 1);
      toast({
        title: "خطأ في البيانات",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendContactEmail(formData as ContactFormData);
      
      if (result.success) {
        setIsSuccess(true);
        toast({
          title: "تم إرسال الرسالة بنجاح",
          description: result.message || "شكراً لتواصلكم. سيتم الرد عليكم في أقرب وقت ممكن.",
        });

        // Security: Clear form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setAttempts(0);
      } else {
        throw new Error(result.message || 'فشل في إرسال الرسالة');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setAttempts(prev => prev + 1);
      toast({
        title: "خطأ في الإرسال",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setAttempts(0);
  };

  if (isSuccess) {
    return (
      <Card className="shadow-lg border-t-4 border-t-green-500">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-800 mb-4">تم إرسال الرسالة بنجاح!</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            شكراً لتواصلكم معنا. تم استلام رسالتكم وسيتم الرد عليكم في أقرب وقت ممكن.
          </p>
          <Button onClick={resetForm} variant="outline">
            إرسال رسالة أخرى
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-t-4 border-t-green-500">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse text-2xl text-primary">
          <Shield className="w-6 h-6 text-green-600" />
          <span>نموذج التواصل الآمن</span>
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          تم تطبيق أعلى معايير الأمان لحماية بياناتكم
        </p>
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
                maxLength={50}
                dir="rtl"
                className="text-right"
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
                maxLength={254}
                dir="ltr"
                className="text-left"
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
                maxLength={15}
                dir="ltr"
                className="text-left"
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
                maxLength={100}
                dir="rtl"
                className="text-right"
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
              maxLength={1000}
              dir="rtl"
              className="text-right resize-none"
              style={{ whiteSpace: 'pre-wrap' }}
            />
            <p className="text-xs text-gray-500">
              {formData.message.length}/1000 حرف
            </p>
          </div>
          
          {attempts > 0 && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
              عدد المحاولات: {attempts}/{maxAttempts}
            </div>
          )}
          
          <Button 
            type="submit" 
            size="lg" 
            className="w-full" 
            disabled={isSubmitting || attempts >= maxAttempts}
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
  );
};

export default ContactForm;