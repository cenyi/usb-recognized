import React from 'react';

/**
 * SEO-optimized content section component
 * Used to create structured content areas with keyword optimization
 */
const SEOContentSection = ({ 
  title, 
  content, 
  keywords = [], 
  headingLevel = 'h2',
  className = '',
  children 
}) => {
  // Dynamically create heading element
  const HeadingTag = headingLevel;
  
  // Optimize title text to ensure keywords are naturally integrated
  const optimizeTitle = (title, keywords) => {
    if (!keywords.length) return title;
    
    // Check if title already contains keywords
    const hasKeyword = keywords.some(keyword => 
      title.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return title; // Keep original title, keywords should be considered during design
  };

  return (
    <section className={`seo-content-section ${className}`}>
      <HeadingTag className="seo-heading font-semibold text-gray-800 mb-4">
        {optimizeTitle(title, keywords)}
      </HeadingTag>
      
      {content && (
        <div className="seo-content text-gray-700 leading-relaxed">
          {typeof content === 'string' ? (
            <p>{content}</p>
          ) : (
            content
          )}
        </div>
      )}
      
      {children && (
        <div className="seo-content-children">
          {children}
        </div>
      )}
    </section>
  );
};

export default SEOContentSection;