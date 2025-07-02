import { Resend } from 'resend';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

// Initialize Resend with API key
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const sendContactEmail = async (formData: ContactFormData) => {
  try {
    // Security: Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      throw new Error('الحقول المطلوبة مفقودة');
    }

    // Security: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('صيغة البريد الإلكتروني غير صحيحة');
    }

    // Prepare email content
    const emailSubject = formData.subject || 'رسالة جديدة من موقع الدكتور أحمد العلواني';
    
    const emailHtml = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #CE1126;">
            <h1 style="color: #CE1126; margin: 0; font-size: 24px;">رسالة جديدة من الموقع</h1>
            <p style="color: #666; margin: 5px 0 0 0;">موقع الدكتور أحمد العلواني</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 15px; font-size: 18px;">تفاصيل المرسل:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; background-color: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold; width: 30%;">الاسم:</td>
                <td style="padding: 8px; border: 1px solid #dee2e6;">${formData.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; background-color: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">البريد الإلكتروني:</td>
                <td style="padding: 8px; border: 1px solid #dee2e6;">${formData.email}</td>
              </tr>
              ${formData.phone ? `
              <tr>
                <td style="padding: 8px; background-color: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">رقم الهاتف:</td>
                <td style="padding: 8px; border: 1px solid #dee2e6;">${formData.phone}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px; background-color: #f8f9fa; border: 1px solid #dee2e6; font-weight: bold;">الموضوع:</td>
                <td style="padding: 8px; border: 1px solid #dee2e6;">${emailSubject}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 15px; font-size: 18px;">محتوى الرسالة:</h3>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; border-right: 4px solid #007A3D;">
              <p style="margin: 0; line-height: 1.6; color: #333; white-space: pre-wrap;">${formData.message}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              تم إرسال هذه الرسالة من موقع الدكتور أحمد العلواني<br>
              التاريخ: ${new Date().toLocaleDateString('ar-IQ')} - الوقت: ${new Date().toLocaleTimeString('ar-IQ')}
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'موقع الدكتور أحمد العلواني <send@ahmedalalwani.com>',
      to: [import.meta.env.VITE_CONTACT_EMAIL || 'anbar8372@gmail.com'],
      subject: emailSubject,
      html: emailHtml,
      reply_to: formData.email,
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error('فشل في إرسال الرسالة');
    }

    // Log successful submission for security monitoring
    console.log('Email sent successfully:', {
      id: data?.id,
      from: formData.email,
      timestamp: new Date().toISOString()
    });

    return { 
      success: true, 
      message: 'تم إرسال رسالتك بنجاح. سيتم الرد عليك في أقرب وقت ممكن.',
      emailId: data?.id
    };

  } catch (error) {
    console.error('Email service error:', error);
    
    // Return user-friendly error message
    if (error instanceof Error) {
      return { 
        success: false, 
        message: error.message.includes('API') ? 
          'حدث خطأ في الخدمة. يرجى المحاولة مرة أخرى لاحقاً.' : 
          error.message 
      };
    }
    
    return { 
      success: false, 
      message: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' 
    };
  }
};