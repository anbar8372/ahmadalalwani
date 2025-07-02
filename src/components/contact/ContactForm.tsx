
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Send, Loader2, Shield } from 'lucide-react';
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
        toast({
          title: "تم تسجيل الرسالة بنجاح",
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
        throw new Error('فشل في إرسال الرسالة');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setAttempts(prev => prev + 1);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء معالجة الرسالة. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                جاري المعالجة الآمنة...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 ml-2" />
                إرسال الرسالة بأمان
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
