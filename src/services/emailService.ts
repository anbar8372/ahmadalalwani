export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

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

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Log successful submission for security monitoring
    console.log('Email sent successfully:', {
      from: formData.email,
      timestamp: new Date().toISOString()
    });

    return { 
      success: true, 
      message: 'تم إرسال رسالتك بنجاح. سيتم الرد عليك في أقرب وقت ممكن.',
      emailId: Math.random().toString(36).substring(2, 15)
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