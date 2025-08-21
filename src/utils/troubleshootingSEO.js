/**
 * SEO utilities for USB troubleshooting content
 * Provides structured data and meta tag optimization
 */

/**
 * Generate HowTo schema for troubleshooting guides
 * @param {Object} guide - Troubleshooting guide data
 * @returns {Object} HowTo schema
 */
export const generateHowToSchema = (guide) => {
  if (!guide || !guide.steps || guide.steps.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": guide.title || "USB Troubleshooting Guide",
    "description": guide.description || "Step-by-step guide to fix USB device recognition issues",
    "totalTime": guide.timeRequired || "PT15M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Computer with USB ports"
      },
      {
        "@type": "HowToTool",
        "name": "USB device"
      }
    ],
    "step": guide.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.title || `Step ${index + 1}`,
      "text": step.instruction || step,
      "image": step.screenshot ? `https://usbrecognized.com/images/${step.screenshot}` : undefined,
      "url": `https://usbrecognized.com/usb-not-recognized#step-${index + 1}`
    }))
  };
};

/**
 * Generate FAQ schema for troubleshooting FAQs
 * @param {Array} faqs - FAQ items
 * @returns {Object} FAQ schema
 */
export const generateFAQSchema = (faqs) => {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

/**
 * Generate breadcrumb schema for navigation
 * @param {Array} items - Breadcrumb items
 * @returns {Object} Breadcrumb schema
 */
export const generateBreadcrumbSchema = (items) => {
  if (!items || items.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

/**
 * Generate meta tags for troubleshooting page
 * @param {Object} options - Meta tag options
 * @returns {Object} Meta tag data
 */
export const generateTroubleshootingMeta = (options = {}) => {
  const {
    title = "USB Device Troubleshooting Guide - Fix USB Not Recognized Issues",
    description = "Comprehensive troubleshooting guide for USB device not recognized issues. Learn how to fix common USB problems and get your device detected.",
    keywords = "USB not recognized, USB troubleshooting, fix USB device, USB driver issues, device recognition problems, WebUSB troubleshooting",
    canonicalUrl = "https://usbrecognized.com/usb-not-recognized",
    imageUrl = "https://usbrecognized.com/images/usb-troubleshooting-guide.png"
  } = options;

  return {
    title,
    description,
    keywords,
    canonical: canonicalUrl,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonicalUrl,
    ogImage: imageUrl,
    ogType: "article",
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: imageUrl
  };
};

/**
 * Generate combined structured data for troubleshooting page
 * @param {Object} options - Structured data options
 * @returns {Object} Combined structured data
 */
export const generateTroubleshootingStructuredData = (options = {}) => {
  const {
    guides = [],
    faqs = [],
    breadcrumbItems = [
      { name: "Home", url: "https://usbrecognized.com/" },
      { name: "USB Troubleshooting", url: "https://usbrecognized.com/usb-not-recognized" }
    ]
  } = options;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": []
  };

  // Add HowTo schemas
  guides.forEach(guide => {
    const howToSchema = generateHowToSchema(guide);
    if (howToSchema) {
      structuredData["@graph"].push(howToSchema);
    }
  });

  // Add FAQ schema
  const faqSchema = generateFAQSchema(faqs);
  if (faqSchema) {
    structuredData["@graph"].push(faqSchema);
  }

  // Add breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  if (breadcrumbSchema) {
    structuredData["@graph"].push(breadcrumbSchema);
  }

  // Add WebPage schema
  structuredData["@graph"].push({
    "@type": "WebPage",
    "@id": "https://usbrecognized.com/usb-not-recognized",
    "url": "https://usbrecognized.com/usb-not-recognized",
    "name": "USB Device Troubleshooting Guide",
    "description": "Comprehensive troubleshooting guide for USB device not recognized issues.",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://usbrecognized.com/#website",
      "url": "https://usbrecognized.com/",
      "name": "USB Recognized",
      "description": "USB device recognition tools and troubleshooting"
    }
  });

  return structuredData;
};

export default {
  generateHowToSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateTroubleshootingMeta,
  generateTroubleshootingStructuredData
};