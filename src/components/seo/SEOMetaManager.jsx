import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO元数据管理组件
 * 负责生成和管理页面的SEO元素，包括Title、Description、Canonical、Hreflang等
 */
const SEOMetaManager = ({ 
  pageType = 'usb-not-recognized', 
  language = 'zh', 
  keywords = {},
  customTitle = '',
  customDescription = ''
}) => {
  // 确保Title长度在40-60字符之间
  const ensureTitleLength = (title, min = 40, max = 60) => {
    if (title.length < min) {
      // 如果太短，添加相关关键词
      const padding = ` - USB设备识别问题解决方案`;
      return (title + padding).substring(0, max);
    }
    if (title.length > max) {
      // 如果太长，截断但保持完整性
      return title.substring(0, max - 3) + '...';
    }
    return title;
  };

  // 确保Description长度在140-160字符之间
  const ensureDescriptionLength = (description, min = 140, max = 160) => {
    if (description.length < min) {
      // 如果太短，添加相关信息
      const padding = `专业的USB故障排除指南，帮助您快速解决USB设备识别问题。`;
      const extended = description + ' ' + padding;
      return extended.substring(0, max);
    }
    if (description.length > max) {
      // 如果太长，智能截断
      return description.substring(0, max - 3) + '...';
    }
    return description;
  };

  // 生成Title
  const generateTitle = (pageType, keywords, language) => {
    const titleTemplates = {
      'usb-not-recognized': {
        'zh': `USB设备无法识别？完整解决方案 - ${keywords.primary || 'USB识别问题'}`,
        'en': `USB Device Not Recognized? Complete Solutions - ${keywords.primary || 'USB Recognition'}`
      },
      'usb-device-not-recognized': {
        'zh': `USB设备不被识别的原因和解决方法 - ${keywords.primary || 'USB设备识别'}`,
        'en': `USB Device Recognition Issues and Solutions - ${keywords.primary || 'USB Device Recognition'}`
      },
      'usb-device-recognized': {
        'zh': `USB设备已识别但无法正常工作的解决方案 - ${keywords.primary || 'USB设备识别'}`,
        'en': `USB Device Recognized But Not Working Solutions - ${keywords.primary || 'USB Device Recognized'}`
      },
      'usb-recognized': {
        'zh': `USB识别问题完整故障排除指南 - ${keywords.primary || 'USB识别'}`,
        'en': `Complete USB Recognition Troubleshooting Guide - ${keywords.primary || 'USB Recognized'}`
      }
    };
    
    const title = customTitle || titleTemplates[pageType]?.[language] || titleTemplates['usb-not-recognized'][language];
    return ensureTitleLength(title, 40, 60);
  };

  // 生成Description
  const generateDescription = (pageType, keywords, language) => {
    const descTemplates = {
      'usb-not-recognized': {
        'zh': `解决USB设备无法识别问题的完整指南。包含Windows、Mac、Linux系统的${keywords.primary || 'USB不被识别'}故障排除步骤，帮助您快速修复USB连接问题。`,
        'en': `Complete guide to fix ${keywords.primary || 'USB not recognized'} issues on Windows, Mac, and Linux. Step-by-step troubleshooting solutions for USB connection problems.`
      },
      'usb-device-not-recognized': {
        'zh': `专业的${keywords.primary || 'USB设备不被识别'}问题解决方案。详细的故障排除步骤，涵盖各种USB设备类型和操作系统，快速恢复USB设备正常工作。`,
        'en': `Professional ${keywords.primary || 'USB device not recognized'} problem solutions. Detailed troubleshooting steps covering various USB device types and operating systems.`
      },
      'usb-device-recognized': {
        'zh': `${keywords.primary || 'USB设备已识别'}但无法正常工作的完整解决方案。包含驱动程序修复、系统设置优化和硬件故障排除的专业指南。`,
        'en': `Complete solutions for ${keywords.primary || 'USB device recognized'} but not working properly. Professional guide including driver fixes and system optimization.`
      },
      'usb-recognized': {
        'zh': `${keywords.primary || 'USB识别'}问题的综合故障排除资源。提供专业的解决方案，帮助您解决各种USB连接和识别相关问题。`,
        'en': `Comprehensive ${keywords.primary || 'USB recognized'} troubleshooting resource. Professional solutions to help you resolve various USB connection and recognition issues.`
      }
    };
    
    const description = customDescription || descTemplates[pageType]?.[language] || descTemplates['usb-not-recognized'][language];
    return ensureDescriptionLength(description, 140, 160);
  };

  // 生成Canonical URL
  const generateCanonicalUrl = (pageType, language) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://usbrecognized.com';
    const langPrefix = language === 'en' ? '' : `/${language}`;
    const pagePath = pageType === 'usb-not-recognized' ? '/usb-not-recognized' : `/${pageType}`;
    return `${baseUrl}${langPrefix}${pagePath}`;
  };

  // 生成Hreflang标签
  const generateHreflangTags = (pageType) => {
    const availableLanguages = ['zh', 'en'];
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://usbrecognized.com';
    const pagePath = pageType === 'usb-not-recognized' ? '/usb-not-recognized' : `/${pageType}`;
    
    return availableLanguages.map(lang => {
      const langPrefix = lang === 'en' ? '' : `/${lang}`;
      const url = `${baseUrl}${langPrefix}${pagePath}`;
      
      return (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={url}
        />
      );
    });
  };

  const title = generateTitle(pageType, keywords, language);
  const description = generateDescription(pageType, keywords, language);
  const canonicalUrl = generateCanonicalUrl(pageType, language);
  const hreflangTags = generateHreflangTags(pageType);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="" />
      <link rel="canonical" href={canonicalUrl} />
      {hreflangTags}
      <link rel="alternate" hrefLang="x-default" href={generateCanonicalUrl(pageType, 'en')} />
      
      {/* Open Graph标签 */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:locale" content={language === 'zh' ? 'zh_CN' : 'en_US'} />
      
      {/* Twitter Card标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* 其他SEO标签 */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content={language} />
    </Helmet>
  );
};

export default SEOMetaManager;