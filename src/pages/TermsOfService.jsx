import React, { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { getOrganizationSchema, getBreadcrumbSchema } from '@/utils/structuredData';

const TermsOfService = () => {
  // Prepare structured data
  const structuredData = [
    getOrganizationSchema(),
    getBreadcrumbSchema([
      { name: "Home", url: "https://usbrecognized.com/" },
      { name: "Terms of Service", url: "https://usbrecognized.com/terms-of-service" }
    ])
  ];

  return (
    <>
      <SEO 
        title="USB Recognized Terms of Service - Usage Agreement"
        description="USB Recognized terms of service: Usage agreement for USB device recognition tools. Understand rights when using our USB recognized services."
        canonical="https://usbrecognized.com/terms-of-service"
        structuredData={structuredData}
        author="USB Recognized Team"
        alternateLanguages={[
          { lang: 'en', url: 'https://usbrecognized.com/terms-of-service' },
          { lang: 'en-US', url: 'https://usbrecognized.com/terms-of-service' },
          { lang: 'en-GB', url: 'https://usbrecognized.com/terms-of-service' }
        ]}
      />
      <div className="container mx-auto py-10 px-4 max-w-4xl relative">
      <a href="/" className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-blue-400 text-white p-3 rounded-full shadow-lg hover:bg-blue-500 transition-colors z-50 flex items-center justify-center" aria-label="Go to Home page">
        <ArrowLeft size={20} /> Home
      </a>
      <h1 className="text-3xl font-bold mb-8 text-center">Terms of Service</h1>
      <div className="space-y-6 text-lg">
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <h3 className="text-xl font-medium mb-2">Agreement to Terms</h3>
            <p>By accessing or using our USB recognized software and USB device recognition services ('Services'), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our Services.</p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. License Grant</h2>
            <h3 className="text-xl font-medium mb-2">Usage Permission</h3>
            <p>We grant you a limited, non-exclusive, non-transferable license to use our Services for your personal or business purposes, subject to these Terms of Service.</p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Restrictions</h2>
            <h3 className="text-xl font-medium mb-2">Prohibited Activities</h3>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Modify, reverse engineer, decompile, or disassemble any part of our Services</li>
<li>Sell, rent or sublicense our Services to any third party</li>
<li>Use our Services for any unlawful purpose or in violation of these Terms</li>
<li>Interfere with or disrupt the integrity or performance of our Services</li>
<li>Attempt to gain unauthorized access to our Services or their related systems or networks</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
            <h3 className="text-xl font-medium mb-2">Ownership and Protection</h3>
            <p>The Services and their original content, features and functionality are owned by us and are protected by international copyright, trademark patent, trade secret and other intellectual property or proprietary rights laws.</p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Disclaimer of Warranty</h2>
            <h3 className="text-xl font-medium mb-2">No Guarantees</h3>
            <p>THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p>IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.</p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.</p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.</p>
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

export default TermsOfService;