/**
 * SEO keyword configuration and utility functions
 */

// Keyword configuration
export const keywordConfig = {
  primary: [
    "USB not recognized",
    "USB device not recognized", 
    "USB device recognized"
  ],
  longTail: [
    "USB device not detected",
    "USB not working", 
    "USB recognition tool",
    "fix USB not recognized Windows",
    "USB not recognized Mac",
    "USB device recognition problems",
    "USB connectivity issues",
    "USB troubleshooting"
  ],
  semantic: [
    "device detection problems", 
    "hardware recognition",
    "USB driver issues",
    "device connectivity",
    "USB port problems"
  ]
};

// Page-specific keyword mapping
export const pageKeywords = {
  home: [
    ...keywordConfig.primary,
    "USB recognition tool",
    "USB device not detected",
    "USB troubleshooting"
  ],
  troubleshooting: [
    ...keywordConfig.primary,
    ...keywordConfig.longTail.filter(k => k.includes('fix') || k.includes('Windows') || k.includes('Mac')),
    "USB driver issues",
    "device connectivity"
  ],
  about: [
    "USB recognition tool",
    "device connectivity",
    "USB troubleshooting"
  ]
};

// Keyword density calculation
export const calculateKeywordDensity = (text, keyword) => {
  if (!text || !keyword) return 0;
  
  const words = text.toLowerCase().split(/\s+/);
  const keywordWords = keyword.toLowerCase().split(/\s+/);
  const totalWords = words.length;
  
  let matches = 0;
  for (let i = 0; i <= words.length - keywordWords.length; i++) {
    const phrase = words.slice(i, i + keywordWords.length).join(' ');
    if (phrase === keyword.toLowerCase()) {
      matches++;
    }
  }
  
  return totalWords > 0 ? (matches / totalWords) * 100 : 0;
};

// Get density of all keywords in text
export const analyzeKeywordDensity = (text, keywords) => {
  return keywords.map(keyword => ({
    keyword,
    density: calculateKeywordDensity(text, keyword),
    count: (text.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
  }));
};

// Check if keyword density is within optimal range
export const isKeywordDensityOptimal = (density) => {
  return density >= 1 && density <= 4; // 1-4% is the ideal range
};

// Generate keyword variations
export const generateKeywordVariations = (baseKeyword) => {
  const variations = [];
  
  // Add plural forms
  if (!baseKeyword.endsWith('s')) {
    variations.push(baseKeyword + 's');
  }
  
  // Add verb forms
  if (baseKeyword.includes('recognition')) {
    variations.push(baseKeyword.replace('recognition', 'recognize'));
    variations.push(baseKeyword.replace('recognition', 'recognizing'));
  }
  
  // Add problem forms
  if (baseKeyword.includes('not recognized')) {
    variations.push(baseKeyword.replace('not recognized', 'not detected'));
    variations.push(baseKeyword.replace('not recognized', 'not working'));
  }
  
  return variations;
};

// Get recommended keywords for specific page
export const getRecommendedKeywords = (pageType) => {
  return pageKeywords[pageType] || keywordConfig.primary;
};