import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Component for lazy loading content sections
 * Improves performance by only loading content when it's about to enter the viewport
 */
const LazyLoadSection = ({ children, threshold = 0.1, placeholder, id, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When section becomes visible
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, [threshold]);

  // Set hasLoaded after a small delay to allow for transition effects
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setHasLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef} 
      id={id} 
      className={`transition-opacity duration-300 ${className || ''} ${
        hasLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {isVisible ? children : placeholder || (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
        </div>
      )}
    </section>
  );
};

LazyLoadSection.propTypes = {
  children: PropTypes.node.isRequired,
  threshold: PropTypes.number,
  placeholder: PropTypes.node,
  id: PropTypes.string,
  className: PropTypes.string
};

export default LazyLoadSection;