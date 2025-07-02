
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData) => {
  // Security: API key removed from frontend code
  // This should be handled by a secure backend service
  console.log('Contact form submission:', {
    name: formData.name,
    email: formData.email,
    phone: formData.phone || 'غير محدد',
    subject: formData.subject || 'رسالة من الموقع',
    timestamp: new Date().toISOString()
  });

  // Simulate API call for demonstration
  return new Promise<{ success: boolean; message?: string }>((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        message: 'تم حفظ الرسالة محلياً. للأمان، تم إزالة إرسال البريد المباشر.' 
      });
    }, 1000);
  });
};
