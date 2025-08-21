import React, { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { getOrganizationSchema, getBreadcrumbSchema } from '@/utils/structuredData';

const PrivacyPolicy = () => {
  // Prepare structured data
  const structuredData = [
    getOrganizationSchema(),
    getBreadcrumbSchema([
      { name: "Home", url: "https://usbrecognized.com/" },
      { name: "Privacy Policy", url: "https://usbrecognized.com/privacy-policy" }
    ])
  ];

  return (
    <>
      <SEO 
        title="USB Recognized Privacy Policy - Data Protection"
        description="USB Recognized privacy policy: How we protect your USB device data. Covers collection, usage, retention, and GDPR/CCPA rights."
        canonical="https://usbrecognized.com/privacy-policy"
        structuredData={structuredData}
        author="USB Recognized Team"
        alternateLanguages={[
          { lang: 'en', url: 'https://usbrecognized.com/privacy-policy' },
          { lang: 'en-US', url: 'https://usbrecognized.com/privacy-policy' },
          { lang: 'en-GB', url: 'https://usbrecognized.com/privacy-policy' }
        ]}
      />
      <div className="container mx-auto py-10 px-4 max-w-4xl relative">
      <a href="/" className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-blue-400 text-white p-3 rounded-full shadow-lg hover:bg-blue-500 transition-colors z-50 flex items-center justify-center" aria-label="Go to Home page">
        <ArrowLeft size={20} /> Home
      </a>
      <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
      <div className="space-y-6 text-lg">
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <h3 className="text-xl font-medium mb-2">About This Policy</h3>
            <p>This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our USB recognized software and USB device recognition services ('Services'). We comply with the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA) as applicable.</p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium mb-2">Types of Data</h3>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Device Information:</strong> Information about your device, including USB device identifiers, hardware model, operating system, and software versions</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our Services, including recognition events and error logs</li>
              <li><strong>Personal Information:</strong> We do not collect personal information unless you voluntarily provide it to us</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <h3 className="text-xl font-medium mb-2">Data Usage Purposes</h3>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide, maintain, and improve our Services</li>
              <li>Diagnose and fix technical issues</li>
              <li>Enhance the security of our Services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
            <h3 className="text-xl font-medium mb-2">How Long We Keep Data</h3>
            <p>We retain your information only for as long as necessary to provide our Services and for legitimate and essential business purposes, such as complying with legal obligations, resolving disputes, and enforcing our agreements.</p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <h3 className="text-xl font-medium mb-2">Data Protection Rights</h3>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>The right to access and receive a copy of your personal information</li>
              <li>The right to rectify or correct inaccurate personal information</li>
              <li>The right to request erasure of your personal information</li>
              <li>The right to restrict processing of your personal information</li>
              <li>The right to object to processing of your personal information</li>
              <li>The right to data portability</li>
            </ul>
            <p className="mt-4">To exercise these rights, please contact us using the contact information provided below.</p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date.</p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at: cenyi2024[at]gmail[dot]com (replace [at] with @ and [dot] with .)</p>
          </section>
        </div>
      <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-muted-foreground">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="/about-us" className="hover:text-primary transition-colors">About Us</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <div className="mb-4">
            <a 
              href="https://www.buymeacoffee.com/usbrecognized" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm"
              aria-label="Buy me a coffee"
            >
              <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              Buy Me A Coffee
            </a>
          </div>
          <p>© {new Date().getFullYear()} USB Recognition Software. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default PrivacyPolicy;