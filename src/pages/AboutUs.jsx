import React, { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { getOrganizationSchema, getBreadcrumbSchema } from '@/utils/structuredData';

const AboutUs = () => {
  // Prepare structured data
  const structuredData = [
    getOrganizationSchema(),
    getBreadcrumbSchema([
      { name: "Home", url: "https://usbrecognized.com/" },
      { name: "About Us", url: "https://usbrecognized.com/about-us" }
    ])
  ];

  return (
    <>
    <SEO 
      title="About USB Recognized - Device Connectivity Experts"
      description="Learn about USB Recognized team, our mission to simplify USB device connectivity and commitment to reliable USB recognition solutions."
      canonical="https://usbrecognized.com/about-us"
      structuredData={structuredData}
      author="USB Recognized Team"
      alternateLanguages={[
        { lang: 'en', url: 'https://usbrecognized.com/about-us' },
        { lang: 'en-US', url: 'https://usbrecognized.com/about-us' },
        { lang: 'en-GB', url: 'https://usbrecognized.com/about-us' }
      ]}
    />
      <div className="container mx-auto py-10 px-4 max-w-4xl relative">
      <a href="/" className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-blue-400 text-white p-3 rounded-full shadow-lg hover:bg-blue-500 transition-colors z-50 flex items-center justify-center" aria-label="Go to Home page">
        <ArrowLeft size={20} /> Home
      </a>
      <h1 className="text-3xl font-bold mb-8 text-center">About Us</h1>
      <div className="space-y-8 text-lg">
          <section className="text-center mb-10">
            <p className="text-xl text-muted-foreground">Empowering seamless USB device recognition since {new Date().getFullYear()}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <h3 className="text-xl font-medium mb-2">Simplifying Device Connectivity</h3>
            <p>We are dedicated to providing reliable, secure, and user-friendly USB recognition software solutions that simplify USB device connectivity for individuals and businesses needing USB device recognition worldwide. Our technology aims to eliminate compatibility issues and enhance productivity through intuitive design and robust performance.</p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <h3 className="text-xl font-medium mb-2">Expertise and Experience</h3>
            <p>Our diverse team of engineers, designers, and privacy experts brings decades of combined experience in software development and data security. We are committed to technical excellence and compliance with global privacy regulations, ensuring our solutions meet the highest standards of quality and trust.</p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <h3 className="text-xl font-medium mb-2">Values and Principles</h3>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Continuous improvement of our recognition algorithms and user experience</li>
              <li>Strict adherence to EU GDPR, CCPA, and other international privacy standards</li>
              <li>Transparent data practices with user privacy as our top priority</li>
              <li>Responsive customer support and regular software updates</li>
            </ul>
          </section>

          <Separator />

          <section className="text-center mt-10">
            <p className="text-muted-foreground">Thank you for choosing our USB recognition solutions. We look forward to serving your connectivity needs.</p>
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

export default AboutUs;