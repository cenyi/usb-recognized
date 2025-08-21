import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ScrollSpy component that tracks scroll position and identifies active sections
 * This is a headless component (no UI) that provides active section information
 */
const ScrollSpy = ({ sectionIds, offset = 100, onSectionChange }) => {
  const [activeSection, setActiveSection] = useState('');
  
  useEffect(() => {
    // Skip if no section IDs provided
    if (!sectionIds || sectionIds.length === 0) return;
    
    const handleScroll = () => {
      // Get current scroll position
      const scrollPosition = window.scrollY + offset;
      
      // Find all section elements
      const sections = sectionIds.map(id => {
        const element = document.getElementById(id);
        if (!element) return null;
        
        const top = element.offsetTop;
        const height = element.offsetHeight;
        
        return {
          id,
          top,
          bottom: top + height
        };
      }).filter(Boolean);
      
      // Find the current section based on scroll position
      let currentSection = '';
      
      // Check if we're at the top of the page
      if (scrollPosition < sections[0]?.top) {
        currentSection = sections[0]?.id || '';
      } 
      // Check if we're at the bottom of the page
      else if (scrollPosition >= sections[sections.length - 1]?.top) {
        currentSection = sections[sections.length - 1]?.id || '';
      }
      // Find the section that contains the current scroll position
      else {
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          const nextSection = sections[i + 1];
          
          // If this is the last section or we're between this section and the next
          if (!nextSection || (scrollPosition >= section.top && scrollPosition < nextSection.top)) {
            currentSection = section.id;
            break;
          }
        }
      }
      
      // Update active section if changed
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
        
        if (onSectionChange) {
          onSectionChange(currentSection);
        }
      }
    };
    
    // Initial check
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, offset, activeSection, onSectionChange]);
  
  // This is a headless component, so it doesn't render anything
  return null;
};

ScrollSpy.propTypes = {
  sectionIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  offset: PropTypes.number,
  onSectionChange: PropTypes.func
};

export default ScrollSpy;