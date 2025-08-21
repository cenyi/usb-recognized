import React, { useState } from 'react';
import TableOfContents from './TableOfContents';
import SectionNavigator from './SectionNavigator';
import ScrollSpy from './ScrollSpy';
import MobileNavigation from './MobileNavigation';

/**
 * Demo component to showcase the navigation components
 */
const NavigationDemo = () => {
  const [activeSection, setActiveSection] = useState('quick-solutions');
  
  // Sample sections for the demo
  const sections = [
    {
      id: 'quick-solutions',
      title: 'Quick Solutions'
    },
    {
      id: 'windows-guide',
      title: 'Windows Troubleshooting',
      subsections: [
        { id: 'windows-device-manager', title: 'Device Manager' },
        { id: 'windows-power-management', title: 'Power Management' },
        { id: 'windows-registry', title: 'Registry Fixes' }
      ]
    },
    {
      id: 'mac-guide',
      title: 'macOS Troubleshooting',
      subsections: [
        { id: 'mac-system-info', title: 'System Information' },
        { id: 'mac-smc-reset', title: 'SMC Reset' }
      ]
    },
    {
      id: 'linux-guide',
      title: 'Linux Troubleshooting'
    },
    {
      id: 'device-specific',
      title: 'Device-Specific Solutions'
    },
    {
      id: 'advanced-solutions',
      title: 'Advanced Technical Solutions'
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions'
    }
  ];
  
  // Get all section IDs for ScrollSpy
  const sectionIds = sections.reduce((ids, section) => {
    ids.push(section.id);
    
    if (section.subsections) {
      section.subsections.forEach(subsection => {
        ids.push(subsection.id);
      });
    }
    
    return ids;
  }, []);
  
  // Handle section change
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">USB Troubleshooting Navigation Demo</h1>
      
      {/* Table of Contents */}
      <TableOfContents 
        sections={sections} 
        activeSection={activeSection}
        onSectionClick={handleSectionChange}
        className="mb-8"
      />
      
      {/* ScrollSpy (invisible component) */}
      <ScrollSpy 
        sectionIds={sectionIds}
        onSectionChange={handleSectionChange}
      />
      
      {/* Demo content with sections */}
      <div className="space-y-24 mb-32">
        {/* Quick Solutions */}
        <section id="quick-solutions" className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Quick Solutions</h2>
          <p className="mb-4">
            Try these quick solutions first to resolve common USB recognition issues.
          </p>
          <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
            [Quick Solutions Content]
          </div>
        </section>
        
        {/* Windows Troubleshooting */}
        <section id="windows-guide" className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Windows Troubleshooting</h2>
          <p className="mb-4">
            Comprehensive guide for resolving USB issues on Windows.
          </p>
          
          {/* Device Manager subsection */}
          <section id="windows-device-manager" className="mt-8 mb-12">
            <h3 className="text-xl font-semibold mb-3">Device Manager</h3>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
              [Device Manager Content]
            </div>
          </section>
          
          {/* Power Management subsection */}
          <section id="windows-power-management" className="mb-12">
            <h3 className="text-xl font-semibold mb-3">Power Management</h3>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
              [Power Management Content]
            </div>
          </section>
          
          {/* Registry Fixes subsection */}
          <section id="windows-registry" className="mb-12">
            <h3 className="text-xl font-semibold mb-3">Registry Fixes</h3>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
              [Registry Fixes Content]
            </div>
          </section>
        </section>
        
        {/* macOS Troubleshooting */}
        <section id="mac-guide" className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">macOS Troubleshooting</h2>
          <p className="mb-4">
            Solutions for USB recognition issues on Mac computers.
          </p>
          
          {/* System Information subsection */}
          <section id="mac-system-info" className="mt-8 mb-12">
            <h3 className="text-xl font-semibold mb-3">System Information</h3>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
              [System Information Content]
            </div>
          </section>
          
          {/* SMC Reset subsection */}
          <section id="mac-smc-reset" className="mb-12">
            <h3 className="text-xl font-semibold mb-3">SMC Reset</h3>
            <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
              [SMC Reset Content]
            </div>
          </section>
        </section>
        
        {/* Linux Troubleshooting */}
        <section id="linux-guide" className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Linux Troubleshooting</h2>
          <p className="mb-4">
            Command-line solutions for USB issues on Linux distributions.
          </p>
          <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
            [Linux Troubleshooting Content]
          </div>
        </section>
        
        {/* Device-Specific Solutions */}
        <section id="device-specific" className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Device-Specific Solutions</h2>
          <p className="mb-4">
            Solutions tailored to specific types of USB devices.
          </p>
          <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
            [Device-Specific Solutions Content]
          </div>
        </section>
        
        {/* Advanced Technical Solutions */}
        <section id="advanced-solutions" className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Advanced Technical Solutions</h2>
          <p className="mb-4">
            Advanced troubleshooting for technical users and IT professionals.
          </p>
          <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
            [Advanced Solutions Content]
          </div>
        </section>
        
        {/* FAQ */}
        <section id="faq" className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="mb-4">
            Answers to common questions about USB recognition issues.
          </p>
          <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
            [FAQ Content]
          </div>
        </section>
      </div>
      
      {/* Section Navigator (fixed position) */}
      <SectionNavigator 
        sections={sections}
        onSectionChange={handleSectionChange}
      />
      
      {/* Mobile Navigation */}
      <MobileNavigation 
        sections={sections}
        activeSection={activeSection}
        onSectionClick={handleSectionChange}
      />
    </div>
  );
};

export default NavigationDemo;