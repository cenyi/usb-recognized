import React, { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Mail, ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { getOrganizationSchema, getBreadcrumbSchema } from '@/utils/structuredData';

const Contact = () => {
  // Prepare structured data
  const structuredData = [
    getOrganizationSchema(),
    getBreadcrumbSchema([
      { name: "Home", url: "https://usbrecognized.com/" },
      { name: "Contact", url: "https://usbrecognized.com/contact" }
    ])
  ];

  return (
    <>
      <SEO 
        title="Contact USB Recognized - Device Support & Inquiries"
        description="Get support for USB device not recognized issues. Contact our team for USB recognition technical help, privacy questions, or general inquiries."
        canonical="https://usbrecognized.com/contact"
        structuredData={structuredData}
        author="USB Recognized Team"
        alternateLanguages={[
          { lang: 'en', url: 'https://usbrecognized.com/contact' },
          { lang: 'en-US', url: 'https://usbrecognized.com/contact' },
          { lang: 'en-GB', url: 'https://usbrecognized.com/contact' }
        ]}
      />
      <div className="container mx-auto py-10 px-4 max-w-4xl relative">
        <a href="/" className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-blue-400 text-white p-3 rounded-full shadow-lg hover:bg-blue-500 transition-colors z-50 flex items-center justify-center" aria-label="Go to Home page">
          <ArrowLeft size={20} /> Home
        </a>
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
        <div className="space-y-8 text-lg">
          <section className="text-center mb-10">
            <p>We're here to help with any questions or concerns about our USB recognized services and USB device recognition issues.</p>
          </section>

          <div className="flex flex-col items-center justify-center">
            <div className="bg-card p-8 rounded-lg shadow-sm w-full max-w-md">
              <div className="flex items-center justify-center mb-6">
                <Mail className="h-10 w-10 text-primary mr-2" />
                <h2 className="text-2xl font-semibold">Email Us</h2>
              </div>

              <h3 className="text-xl font-medium mb-2 text-center">General Inquiries</h3>
              <p className="mb-6 text-center">For general inquiries, support questions, or privacy concerns:</p>

              <div className="bg-muted p-4 rounded-md text-center font-mono text-sm">
                cenyi2024[at]gmail[dot]com
              </div>

              <p className="mt-4 text-sm text-muted-foreground text-center">
                <strong>Note:</strong> To send an email, replace [at] with @ and [dot] with .
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          <section className="text-center">
            <h2 className="text-xl font-semibold mb-4">Data Protection Inquiries</h2>
            <h3 className="text-lg font-medium mb-2">Privacy Concerns</h3>
            <p>For questions regarding our privacy practices or to exercise your data protection rights under GDPR or CCPA, please use the email address above with the subject line: "Data Protection Inquiry".</p>
          </section>
        </div>
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-muted-foreground">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="/about-us" className="hover:text-primary transition-colors">About Us</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p>© {new Date().getFullYear()} USB Recognition Software. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Contact;