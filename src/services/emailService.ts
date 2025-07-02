
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export const sendContactEmail = async (formData: ContactFormData) => {
  const RESEND_API_KEY = 're_iBk9Dvmq_B6PVA3pFTsDvUDnHL36fn9yQ';
  const RECIPIENT_EMAIL = 'anbar8372@gmail.com';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@resend.dev', // Default Resend sender
        to: [RECIPIENT_EMAIL],
        subject: formData.subject || 'رسالة جديدة من موقع الدكتور أحمد العلواني',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; color: #333;">
            <h2>رسالة جديدة من موقع الدكتور أحمد العلواني</h2>
            <hr>
            <p><strong>اسم المرسل:</strong> ${formData.name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${formData.email}</p>
            ${formData.phone ? `<p><strong>رقم الهاتف:</strong> ${formData.phone}</p>` : ''}
            ${formData.subject ? `<p><strong>الموضوع:</strong> ${formData.subject}</p>` : ''}
            <hr>
            <h3>الرسالة:</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
              ${formData.message.replace(/\n/g, '<br>')}
            </div>
            <hr>
            <p style="font-size: 12px; color: #666;">
              تم إرسال هذه الرسالة من موقع الدكتور أحمد العلواني في ${new Date().toLocaleString('ar-SA')}
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
