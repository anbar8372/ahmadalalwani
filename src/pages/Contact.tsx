
import Layout from '@/components/Layout';
import ContactHero from '@/components/contact/ContactHero';
import ContactInfo from '@/components/contact/ContactInfo';
import WorkingHours from '@/components/contact/WorkingHours';
import ContactMessage from '@/components/contact/ContactMessage';
import ContactForm from '@/components/contact/ContactForm';

const Contact = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <ContactHero />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information Cards */}
            <div className="space-y-8">
              <ContactInfo />
              <WorkingHours />
              <ContactMessage />
            </div>

            {/* Secure Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
