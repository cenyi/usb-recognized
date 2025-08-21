import React from 'react';

/**
 * Keyword optimized text component
 * Used to naturally emphasize keywords in text for SEO enhancement
 */
const KeywordOptimizedText = ({ 
  children, 
  targetKeywords = [], 
  emphasizeKeywords = false,
  className = '' 
}) => {
  
  // Naturally emphasize keywords in text
  const optimizeText = (text, keywords) => {
    if (!keywords.length || typeof text !== 'string') {
      return text;
    }

    let optimizedText = text;
    
    // If keyword emphasis is enabled, add semantic markup for keywords
    if (emphasizeKeywords) {
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
        optimizedText = optimizedText.replace(regex, '<strong>$1</strong>');
      });
    }
    
    return optimizedText;
  };

  // Process text content
  const processContent = (content) => {
    if (typeof content === 'string') {
      const optimized = optimizeText(content, targetKeywords);
      
      if (emphasizeKeywords && optimized !== content) {
        return <span dangerouslySetInnerHTML={{ __html: optimized }} />;
      }
      
      return content;
    }
    
    return content;
  };

  return (
    <div className={`keyword-optimized-text ${className}`}>
      {React.Children.map(children, child => {
        if (typeof child === 'string') {
          return processContent(child);
        }
        return child;
      })}
    </div>
  );
};

export default KeywordOptimizedText;