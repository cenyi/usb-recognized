import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';
import { ChevronUp, Menu, X } from 'lucide-react';

/**
 * Mobile-optimized navigation component for troubleshooting page
 * Provides a collapsible menu and quick section navigation
 */
const MobileNavigation = ({ sections, activeSection, onSectionClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // Toggle menu open/closed
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle section click
  const handleSectionClick = (sectionId) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
    
    // Find section element and scroll to it
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Close menu after selection
    setIsOpen(false);
  };
  
  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <>
      {/* Mobile navigation bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-between items-center p-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-1"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
            <span className="text-xs">Sections</span>
          </Button>
          
          {/* Quick access to key sections */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-1"
              onClick={() => handleSectionClick('diagnostic')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="text-xs">Diagnostic</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-1"
              onClick={() => handleSectionClick('faq')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="text-xs">FAQ</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleMenu}>
          <div 
            className="absolute bottom-16 left-0 right-0 bg-white rounded-t-lg shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold mb-3">Jump to Section</h3>
            <div className="grid grid-cols-2 gap-2">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "outline"}
                  size="sm"
                  className="justify-start"
                  onClick={() => handleSectionClick(section.id)}
                >
                  {section.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Scroll to top button */}
      {showScrollToTop && (
        <Button
          variant="secondary"
          size="icon"
          className="lg:hidden fixed bottom-20 right-4 rounded-full shadow-lg z-30"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </Button>
      )}
    </>
  );
};

MobileNavigation.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  activeSection: PropTypes.string,
  onSectionClick: PropTypes.func
};

export default MobileNavigation;