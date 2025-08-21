/**
 * Generate structured data for SEO enhancement and rich search results
 */

// Website organization information
export const getOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'USB Recognized',
    url: 'https://usbrecognized.com',
    logo: 'https://usbrecognized.com/favicon.png',
    sameAs: [
      'https://twitter.com/usbrecognized',
      'https://www.facebook.com/usbrecognized'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'cenyi2024@gmail.com',
      contactType: 'customer service'
    }
  };
};

// Homepage tool application structured data
export const getWebApplicationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'USB Device Recognition Tool',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Windows, macOS, Linux, Chrome OS',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    description: 'Free online tool to check if your USB device is recognized by your system. Diagnose USB connectivity issues without downloading any software.',
    browserRequirements: 'Requires a browser that supports WebUSB API (Chrome, Edge)',
    permissions: 'USB device access'
  };
};

// Article page structured data
export const getArticleSchema = (title, description, url, imageUrl, datePublished, dateModified) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'USB Recognized Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'USB Recognized',
      logo: {
        '@type': 'ImageObject',
        url: 'https://usbrecognized.com/favicon.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };
};

// FAQ page structured data
export const getFAQSchema = (questions) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  };
};

// Breadcrumb navigation structured data
export const getBreadcrumbSchema = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
};

// Combine multiple structured data schemas
export const combineStructuredData = (...schemas) => {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas
  };
};