import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle, Search, Laptop, Smartphone, Settings } from 'lucide-react';
import SEO from '@/components/SEO';
import QuickDiagnosticTool from '@/components/troubleshooting/QuickDiagnosticTool';
import TableOfContents from '@/components/troubleshooting/TableOfContents';
import ScrollSpy from '@/components/troubleshooting/ScrollSpy';
import WindowsTroubleshootingGuide from '@/components/troubleshooting/WindowsTroubleshootingGuide';
import MacOSTroubleshootingGuide from '@/components/troubleshooting/MacOSTroubleshootingGuide';
import LinuxTroubleshootingGuide from '@/components/troubleshooting/LinuxTroubleshootingGuide';
import DeviceSpecificSolutions from '@/components/troubleshooting/DeviceSpecificSolutions';
import VisualTroubleshootingGuide from '@/components/troubleshooting/VisualTroubleshootingGuide';
import FAQSection from '@/components/troubleshooting/FAQSection';
import AdvancedSolutions from '@/components/troubleshooting/AdvancedSolutions';
import ContentSearch from '@/components/troubleshooting/ContentSearch';
import { generateTroubleshootingMeta, generateTroubleshootingStructuredData } from '@/utils/troubleshootingSEO';
import { platformGuides, faqData } from '@/data/troubleshootingContent';

/**
 * Enhanced USB Troubleshooting page with comprehensive content
 */
const EnhancedTroubleshooting = () => {
  const [activeSection, setActiveSection] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState(null);

  // Define page sections for navigation
  const sections = [
    { id: 'diagnostic', title: 'Quick Diagnostic Tool' },
    { id: 'platform-guides', title: 'Platform-Specific Guides' },
    { id: 'device-specific', title: 'Device-Specific Solutions' },
    { id: 'visual-guide', title: 'Visual Troubleshooting Guide' },
    { id: 'faq', title: 'Frequently Asked Questions' },
    { id: 'advanced-solutions', title: 'Advanced Technical Solutions' }
  ];

  // Handle section change from ScrollSpy
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Handle diagnostic results
  const handleDiagnosticResults = (recommendations, data) => {
    setDiagnosticResults({ recommendations, data });
    
    // Scroll to appropriate section based on recommendations
    if (recommendations.immediate.length > 0) {
      const firstSolution = recommendations.immediate[0];
      if (firstSolution.platforms && firstSolution.platforms.includes(data.operatingSystem)) {
        document.getElementById('platform-guides').scrollIntoView({ behavior: 'smooth' });
      } else if (data.deviceType && data.deviceType !== 'other') {
        document.getElementById('device-specific').scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Handle search result click
  const handleSearchResultClick = (resultType, result) => {
    setShowSearch(false);
    
    // Scroll to appropriate section based on result type
    switch (resultType) {
      case 'quickSolution':
        document.getElementById('diagnostic').scrollIntoView({ behavior: 'smooth' });
        break;
      case 'platformSolution':
        document.getElementById('platform-guides').scrollIntoView({ behavior: 'smooth' });
        break;
      case 'deviceSolution':
        document.getElementById('device-specific').scrollIntoView({ behavior: 'smooth' });
        break;
      case 'faq':
        document.getElementById('faq').scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate SEO metadata
  const seoMeta = generateTroubleshootingMeta();
  
  // Generate structured data
  const structuredData = generateTroubleshootingStructuredData({
    guides: [
      ...platformGuides.windows.solutions,
      ...platformGuides.mac.solutions,
      ...platformGuides.linux.solutions
    ],
    faqs: faqData
  });

  return (
    <>
      <SEO 
        title={seoMeta.title}
        description={seoMeta.description}
        canonical={seoMeta.canonical}
        ogImage={seoMeta.ogImage}
        structuredData={structuredData}
        author="USB Recognized Team"
        alternateLanguages={[
          { lang: 'en', url: 'https://usb-recognized.com/en' },
          { lang: 'en-US', url: 'https://usb-recognized.com/en-US' },
          { lang: 'en-GB', url: 'https://usb-recognized.com/en-GB' }
        ]}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8 relative">
        {/* Back to home button */}
        <a 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Home
        </a>
        
        {/* Page header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">USB Device Troubleshooting Guide</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Comprehensive solutions for USB device recognition issues on Windows, Mac, and Linux
          </p>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Button 
              onClick={() => document.getElementById('diagnostic').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2"
            >
              <HelpCircle size={16} />
              Start Diagnostic
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2"
            >
              <Search size={16} />
              Search Solutions
            </Button>
          </div>
        </header>
        
        {/* Search overlay */}
        {showSearch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Search Troubleshooting Solutions</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                  <ArrowLeft size={20} />
                </Button>
              </div>
              <ContentSearch onResultClick={handleSearchResultClick} />
            </div>
          </div>
        )}
        
        {/* Main content layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar navigation */}
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-8">
              <TableOfContents 
                sections={sections} 
                activeSection={activeSection}
                className="mb-6"
              />
              
              <div className="hidden lg:block p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Need More Help?</h3>
                <p className="text-sm text-blue-700 mb-4">
                  If you're still experiencing issues after trying these solutions, contact our support team.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </div>
            </div>
          </aside>
          
          {/* Main content */}
          <main className="flex-1">
            {/* Diagnostic tool section */}
            <section id="diagnostic" className="mb-12 scroll-mt-8">
              <h2 className="text-3xl font-bold mb-6">Quick Diagnostic Tool</h2>
              <QuickDiagnosticTool onRecommendationsGenerated={handleDiagnosticResults} />
            </section>
            
            {/* Platform guides section */}
            <section id="platform-guides" className="mb-12 scroll-mt-8">
              <h2 className="text-3xl font-bold mb-6">Platform-Specific Guides</h2>
              <Tabs defaultValue="windows">
                <TabsList className="mb-6">
                  <TabsTrigger value="windows" className="flex items-center gap-2">
                    <Laptop size={16} />
                    Windows
                  </TabsTrigger>
                  <TabsTrigger value="mac" className="flex items-center gap-2">
                    <Laptop size={16} />
                    macOS
                  </TabsTrigger>
                  <TabsTrigger value="linux" className="flex items-center gap-2">
                    <Settings size={16} />
                    Linux
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="windows">
                  <WindowsTroubleshootingGuide />
                </TabsContent>
                
                <TabsContent value="mac">
                  <MacOSTroubleshootingGuide />
                </TabsContent>
                
                <TabsContent value="linux">
                  <LinuxTroubleshootingGuide />
                </TabsContent>
              </Tabs>
            </section>
            
            {/* Device-specific solutions section */}
            <DeviceSpecificSolutions />
            
            {/* Visual troubleshooting guide section */}
            <VisualTroubleshootingGuide />
            
            {/* FAQ section */}
            <FAQSection />
            
            {/* Advanced solutions section */}
            <AdvancedSolutions />
          </main>
        </div>
        
        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="/about-us" className="hover:text-blue-600 transition-colors">About Us</a>
            <a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a>
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
      
      {/* ScrollSpy for tracking active section */}
      <ScrollSpy 
        sectionIds={sections.map(section => section.id)} 
        offset={100}
        onSectionChange={handleSectionChange}
      />
    </>
  );
};

export default EnhancedTroubleshooting;