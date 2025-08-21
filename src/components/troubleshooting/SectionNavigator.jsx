import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Section Navigator component for in-page navigation
 * Provides next/previous section buttons and tracks current section
 */
const SectionNavigator = ({ sections, onSectionChange, className }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  
  // Flatten sections and subsections for navigation
  const flattenedSections = sections.reduce((acc, section) => {
    acc.push({ id: section.id, title: section.title });
    
    if (section.subsections) {
      section.subsections.forEach(subsection => {
        acc.push({ id: subsection.id, title: subsection.title, isSubsection: true });
      });
    }
    
    return acc;
  }, []);
  
  // Track scroll position and determine current section
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Determine scroll direction
      if (scrollTop > lastScrollTop) {
        setScrollDirection('down');
      } else if (scrollTop < lastScrollTop) {
        setScrollDirection('up');
      }
      setLastScrollTop(scrollTop);
      
      // Show navigator after scrolling down a bit
      setIsVisible(scrollTop > 300);
      
      // Find current section based on scroll position
      const sectionElements = flattenedSections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id),
        title: section.title,
        isSubsection: section.isSubsection
      })).filter(section => section.element);
      
      // Calculate which section is currently in view
      const currentSection = sectionElements.reduce((current, section) => {
        const rect = section.element.getBoundingClientRect();
        const isInView = rect.top <= 100 && rect.bottom >= 100;
        
        if (isInView) {
          return section;
        }
        return current;
      }, null);
      
      if (currentSection) {
        const index = flattenedSections.findIndex(section => section.id === currentSection.id);
        if (index !== currentSectionIndex) {
          setCurrentSectionIndex(index);
          
          if (onSectionChange) {
            onSectionChange(currentSection.id);
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [flattenedSections, currentSectionIndex, lastScrollTop, onSectionChange]);
  
  // Navigate to previous section
  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      const prevIndex = currentSectionIndex - 1;
      const prevSection = flattenedSections[prevIndex];
      
      navigateToSection(prevSection.id);
      setCurrentSectionIndex(prevIndex);
    }
  };
  
  // Navigate to next section
  const goToNextSection = () => {
    if (currentSectionIndex < flattenedSections.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      const nextSection = flattenedSections[nextIndex];
      
      navigateToSection(nextSection.id);
      setCurrentSectionIndex(nextIndex);
    }
  };
  
  // Scroll to section
  const navigateToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    
    if (sectionElement) {
      sectionElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      if (onSectionChange) {
        onSectionChange(sectionId);
      }
    }
  };
  
  // Don't render if there are no sections
  if (flattenedSections.length === 0) {
    return null;
  }
  
  // Get current section info
  const currentSection = flattenedSections[currentSectionIndex] || {};
  
  return (
    <div 
      className={`fixed right-4 bottom-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${className || ''}`}
    >
      <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <div className="text-center mb-2 text-sm font-medium text-gray-700">
          {currentSection.isSubsection ? 'Subsection:' : 'Section:'}
        </div>
        
        <div className="text-center mb-3 px-2 py-1 bg-blue-50 rounded text-blue-700 font-medium">
          {currentSection.title || 'Introduction'}
        </div>
        
        <div className="flex justify-between">
          <button
            className={`p-2 rounded-md ${
              currentSectionIndex > 0
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
            onClick={goToPreviousSection}
            disabled={currentSectionIndex === 0}
            aria-label="Previous section"
            title="Previous section"
          >
            <ChevronUp size={20} />
          </button>
          
          <button
            className={`p-2 rounded-md ${
              currentSectionIndex < flattenedSections.length - 1
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
            onClick={goToNextSection}
            disabled={currentSectionIndex === flattenedSections.length - 1}
            aria-label="Next section"
            title="Next section"
          >
            <ChevronDown size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

SectionNavigator.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      subsections: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired
        })
      )
    })
  ).isRequired,
  onSectionChange: PropTypes.func,
  className: PropTypes.string
};

export default SectionNavigator;