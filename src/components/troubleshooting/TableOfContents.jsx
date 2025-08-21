import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Table of Contents component for the troubleshooting page
 * Provides navigation links to different sections with smooth scrolling
 */
const TableOfContents = ({ sections, className, activeSection, onSectionClick }) => {
  const [activeId, setActiveId] = useState(activeSection || '');
  
  // Update active section when prop changes
  useEffect(() => {
    if (activeSection) {
      setActiveId(activeSection);
    }
  }, [activeSection]);
  
  // Handle section click
  const handleSectionClick = (sectionId) => {
    // Find the section element
    const sectionElement = document.getElementById(sectionId);
    
    if (sectionElement) {
      // Scroll to section with smooth behavior
      sectionElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update active section
      setActiveId(sectionId);
      
      // Call callback if provided
      if (onSectionClick) {
        onSectionClick(sectionId);
      }
    }
  };
  
  return (
    <nav className={`bg-gray-50 p-4 rounded-lg ${className || ''}`} aria-label="Table of contents">
      <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
      
      <ul className="grid gap-1 md:grid-cols-2">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              className={`text-left w-full px-3 py-2 rounded-md transition-colors ${
                activeId === section.id
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleSectionClick(section.id)}
              aria-current={activeId === section.id ? 'page' : undefined}
            >
              {section.title}
            </button>
            
            {/* Render subsections if available */}
            {section.subsections && section.subsections.length > 0 && (
              <ul className="ml-6 mt-1 space-y-1">
                {section.subsections.map((subsection) => (
                  <li key={subsection.id}>
                    <button
                      className={`text-left w-full px-2 py-1 text-sm rounded-md transition-colors ${
                        activeId === subsection.id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => handleSectionClick(subsection.id)}
                      aria-current={activeId === subsection.id ? 'page' : undefined}
                    >
                      {subsection.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

TableOfContents.propTypes = {
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
  className: PropTypes.string,
  activeSection: PropTypes.string,
  onSectionClick: PropTypes.func
};

export default TableOfContents;