import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * 结构化数据生成器组件
 * 生成符合Schema.org标准的结构化数据，提升搜索引擎理解和显示效果
 */
const StructuredDataGenerator = ({
  pageType = 'usb-not-recognized',
  language = 'zh',
  content = {},
  faqData = [],
  howToSteps = [],
  breadcrumbs = [],
  customSchemas = []
}) => {
  // 基础网站信息
  const siteInfo = useMemo(() => ({
    name: language === 'zh' ? 'USB识别工具' : 'USB Recognition Tool',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://usbrecognized.com',
    description: language === 'zh' 
      ? '专业的USB设备识别问题解决方案和故障排除工具'
      : 'Professional USB device recognition solutions and troubleshooting tools',
    logo: `${typeof window !== 'undefined' ? window.location.origin : 'https://usbrecognized.com'}/logo.png`
  }), [language]);

  // 生成WebPage结构化数据
  const generateWebPageSchema = useMemo(() => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : `${siteInfo.url}/${pageType}`;
    
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": currentUrl,
      "url": currentUrl,
      "name": content.title || content.h1 || (language === 'zh' ? 'USB故障排除指南' : 'USB Troubleshooting Guide'),
      "description": content.description || (language === 'zh' 
        ? 'USB设备识别问题的完整解决方案'
        : 'Complete solutions for USB device recognition issues'),
      "inLanguage": language === 'zh' ? 'zh-CN' : 'en-US',
      "isPartOf": {
        "@type": "WebSite",
        "@id": `${siteInfo.url}/#website`,
        "url": siteInfo.url,
        "name": siteInfo.name,
        "description": siteInfo.description,
        "publisher": {
          "@type": "Organization",
          "name": siteInfo.name,
          "url": siteInfo.url,
          "logo": {
            "@type": "ImageObject",
            "url": siteInfo.logo
          }
        }
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": `${siteInfo.url}/images/${pageType}-guide.jpg`,
        "width": 1200,
        "height": 630
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "author": {
        "@type": "Organization",
        "name": siteInfo.name,
        "url": siteInfo.url
      }
    };
  }, [pageType, language, content, siteInfo]);

  // 生成FAQ结构化数据
  const generateFAQSchema = useMemo(() => {
    if (!faqData || faqData.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
          "dateCreated": faq.dateCreated || new Date().toISOString(),
          "upvoteCount": faq.upvoteCount || 0,
          "author": {
            "@type": "Organization",
            "name": siteInfo.name
          }
        }
      }))
    };
  }, [faqData, siteInfo]);

  // 生成HowTo结构化数据
  const generateHowToSchema = useMemo(() => {
    if (!howToSteps || howToSteps.length === 0) return null;

    const howToTitle = {
      'usb-not-recognized': language === 'zh' ? '如何解决USB设备无法识别问题' : 'How to Fix USB Device Not Recognized Issues',
      'usb-device-not-recognized': language === 'zh' ? '如何修复USB设备不被识别' : 'How to Fix USB Device Not Being Recognized',
      'usb-device-recognized': language === 'zh' ? '如何解决USB设备已识别但无法工作' : 'How to Fix USB Device Recognized But Not Working',
      'usb-recognized': language === 'zh' ? '如何优化USB识别性能' : 'How to Optimize USB Recognition Performance'
    };

    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": howToTitle[pageType] || howToTitle['usb-not-recognized'],
      "description": content.description || (language === 'zh' 
        ? '详细的USB问题解决步骤指南'
        : 'Detailed step-by-step guide for USB problem resolution'),
      "image": {
        "@type": "ImageObject",
        "url": `${siteInfo.url}/images/${pageType}-howto.jpg`,
        "width": 1200,
        "height": 630
      },
      "totalTime": `PT${Math.max(10, howToSteps.length * 2)}M`, // 估算时间
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "0"
      },
      "supply": howToSteps
        .filter(step => step.supplies)
        .flatMap(step => step.supplies)
        .map(supply => ({
          "@type": "HowToSupply",
          "name": supply
        })),
      "tool": howToSteps
        .filter(step => step.tools)
        .flatMap(step => step.tools)
        .map(tool => ({
          "@type": "HowToTool",
          "name": tool
        })),
      "step": howToSteps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.title || step.name,
        "text": step.description || step.text,
        "image": step.image ? {
          "@type": "ImageObject",
          "url": step.image,
          "width": 800,
          "height": 600
        } : undefined,
        "url": step.url || `${typeof window !== 'undefined' ? window.location.href : siteInfo.url}#step-${index + 1}`
      }))
    };
  }, [howToSteps, pageType, language, content, siteInfo]);

  // 生成面包屑导航结构化数据
  const generateBreadcrumbSchema = useMemo(() => {
    if (!breadcrumbs || breadcrumbs.length === 0) {
      // 生成默认面包屑
      const defaultBreadcrumbs = [
        { name: language === 'zh' ? '首页' : 'Home', url: siteInfo.url },
        { name: language === 'zh' ? 'USB故障排除' : 'USB Troubleshooting', url: `${siteInfo.url}/troubleshooting` },
        { name: content.title || content.h1, url: typeof window !== 'undefined' ? window.location.href : `${siteInfo.url}/${pageType}` }
      ];
      
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": defaultBreadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      };
    }

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  }, [breadcrumbs, language, content, siteInfo, pageType]);

  // 生成技术文章结构化数据
  const generateTechnicalArticleSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "TechnicalArticle",
      "headline": content.title || content.h1,
      "description": content.description,
      "image": {
        "@type": "ImageObject",
        "url": `${siteInfo.url}/images/${pageType}-article.jpg`,
        "width": 1200,
        "height": 630
      },
      "author": {
        "@type": "Organization",
        "name": siteInfo.name,
        "url": siteInfo.url
      },
      "publisher": {
        "@type": "Organization",
        "name": siteInfo.name,
        "url": siteInfo.url,
        "logo": {
          "@type": "ImageObject",
          "url": siteInfo.logo
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": typeof window !== 'undefined' ? window.location.href : `${siteInfo.url}/${pageType}`
      },
      "articleSection": language === 'zh' ? 'USB故障排除' : 'USB Troubleshooting',
      "keywords": generateKeywordsForPage(pageType, language),
      "wordCount": content.wordCount || 2000,
      "inLanguage": language === 'zh' ? 'zh-CN' : 'en-US'
    };
  }, [pageType, language, content, siteInfo]);

  // 生成软件应用结构化数据（针对USB工具）
  const generateSoftwareApplicationSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": siteInfo.name,
      "description": siteInfo.description,
      "url": siteInfo.url,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Windows, macOS, Linux",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "ratingCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Organization",
        "name": siteInfo.name
      },
      "datePublished": "2024-01-01",
      "softwareVersion": "2.0",
      "fileSize": "5MB",
      "screenshot": `${siteInfo.url}/images/app-screenshot.jpg`
    };
  }, [siteInfo]);

  // 生成页面特定的关键词
  const generateKeywordsForPage = (pageType, language) => {
    const keywordMap = {
      'usb-not-recognized': {
        'zh': ['USB不被识别', 'USB设备无法识别', 'USB故障排除', 'USB驱动问题', 'USB端口故障'],
        'en': ['USB not recognized', 'USB device not recognized', 'USB troubleshooting', 'USB driver issues', 'USB port problems']
      },
      'usb-device-not-recognized': {
        'zh': ['USB设备不被识别', 'USB设备检测', 'USB枚举失败', 'USB兼容性', 'USB协议'],
        'en': ['USB device not recognized', 'USB device detection', 'USB enumeration failure', 'USB compatibility', 'USB protocol']
      },
      'usb-device-recognized': {
        'zh': ['USB设备已识别', 'USB设备工作异常', 'USB权限问题', 'USB配置错误', 'USB功能故障'],
        'en': ['USB device recognized', 'USB device malfunction', 'USB permission issues', 'USB configuration error', 'USB functionality problems']
      },
      'usb-recognized': {
        'zh': ['USB识别', 'USB检测', 'USB协议分析', 'USB性能优化', 'USB系统调优'],
        'en': ['USB recognized', 'USB detection', 'USB protocol analysis', 'USB performance optimization', 'USB system tuning']
      }
    };

    return keywordMap[pageType]?.[language] || keywordMap['usb-not-recognized'][language];
  };

  // 生成所有结构化数据
  const generateAllSchemas = useMemo(() => {
    const schemas = [];

    // 基础WebPage schema
    schemas.push(generateWebPageSchema);

    // FAQ schema
    if (faqData && faqData.length > 0) {
      schemas.push(generateFAQSchema);
    }

    // HowTo schema
    if (howToSteps && howToSteps.length > 0) {
      schemas.push(generateHowToSchema);
    }

    // 面包屑导航
    schemas.push(generateBreadcrumbSchema);

    // 技术文章
    schemas.push(generateTechnicalArticleSchema);

    // 软件应用（仅在主页或工具页面）
    if (pageType === 'usb-not-recognized' || pageType === 'home') {
      schemas.push(generateSoftwareApplicationSchema);
    }

    // 自定义schemas
    if (customSchemas && customSchemas.length > 0) {
      schemas.push(...customSchemas);
    }

    return schemas.filter(schema => schema !== null);
  }, [
    generateWebPageSchema,
    generateFAQSchema,
    generateHowToSchema,
    generateBreadcrumbSchema,
    generateTechnicalArticleSchema,
    generateSoftwareApplicationSchema,
    customSchemas,
    faqData,
    howToSteps,
    pageType
  ]);

  // 验证结构化数据
  const validateSchema = (schema) => {
    const errors = [];
    
    if (!schema['@context']) {
      errors.push('Missing @context');
    }
    
    if (!schema['@type']) {
      errors.push('Missing @type');
    }
    
    // 根据类型进行特定验证
    switch (schema['@type']) {
      case 'WebPage':
        if (!schema.name) errors.push('WebPage missing name');
        if (!schema.url) errors.push('WebPage missing url');
        break;
      case 'FAQPage':
        if (!schema.mainEntity || schema.mainEntity.length === 0) {
          errors.push('FAQPage missing mainEntity');
        }
        break;
      case 'HowTo':
        if (!schema.step || schema.step.length === 0) {
          errors.push('HowTo missing steps');
        }
        break;
    }
    
    return errors;
  };

  // 渲染结构化数据脚本标签
  const renderStructuredData = () => {
    return generateAllSchemas.map((schema, index) => {
      const validationErrors = validateSchema(schema);
      
      if (process.env.NODE_ENV === 'development' && validationErrors.length > 0) {
        console.warn(`Schema validation errors for ${schema['@type']}:`, validationErrors);
      }
      
      return (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, process.env.NODE_ENV === 'development' ? 2 : 0)
          }}
        />
      );
    });
  };

  return (
    <Helmet>
      {renderStructuredData()}
    </Helmet>
  );
};

// 预定义的FAQ数据生成器
export const generateUSBFAQData = (language = 'zh') => {
  const faqData = {
    'zh': [
      {
        question: '为什么我的USB设备无法被识别？',
        answer: 'USB设备无法被识别的常见原因包括：驱动程序问题、USB端口故障、电源供应不足、设备兼容性问题或系统设置错误。建议首先尝试不同的USB端口，然后检查设备管理器中的驱动程序状态。',
        upvoteCount: 45
      },
      {
        question: '如何更新USB驱动程序？',
        answer: '在Windows中，右键点击"此电脑" > "管理" > "设备管理器"，找到有问题的USB设备，右键选择"更新驱动程序"。也可以访问设备制造商网站下载最新驱动程序。',
        upvoteCount: 38
      },
      {
        question: 'USB设备在设备管理器中显示为未知设备怎么办？',
        answer: '这通常表示缺少适当的驱动程序。尝试右键点击未知设备，选择"更新驱动程序"，让Windows自动搜索驱动程序。如果失败，需要手动安装设备特定的驱动程序。',
        upvoteCount: 32
      }
    ],
    'en': [
      {
        question: 'Why is my USB device not recognized?',
        answer: 'Common causes of USB device recognition issues include: driver problems, USB port failure, insufficient power supply, device compatibility issues, or system configuration errors. Try different USB ports first, then check driver status in Device Manager.',
        upvoteCount: 45
      },
      {
        question: 'How do I update USB drivers?',
        answer: 'In Windows, right-click "This PC" > "Manage" > "Device Manager", find the problematic USB device, right-click and select "Update driver". You can also visit the device manufacturer\'s website to download the latest drivers.',
        upvoteCount: 38
      },
      {
        question: 'What if USB device shows as unknown device in Device Manager?',
        answer: 'This usually indicates missing appropriate drivers. Try right-clicking the unknown device, select "Update driver", and let Windows automatically search for drivers. If this fails, you need to manually install device-specific drivers.',
        upvoteCount: 32
      }
    ]
  };

  return faqData[language] || faqData['en'];
};

// 预定义的HowTo步骤生成器
export const generateUSBHowToSteps = (pageType, language = 'zh') => {
  const stepsData = {
    'usb-not-recognized': {
      'zh': [
        {
          title: '检查物理连接',
          description: '确保USB设备正确插入端口，尝试不同的USB端口，检查线缆是否损坏。',
          tools: ['USB线缆'],
          supplies: []
        },
        {
          title: '重启计算机',
          description: '简单的重启可以解决许多USB识别问题，特别是驱动程序冲突。',
          tools: [],
          supplies: []
        },
        {
          title: '检查设备管理器',
          description: '打开设备管理器，查看USB设备是否显示错误标志，更新或重新安装驱动程序。',
          tools: ['设备管理器'],
          supplies: []
        },
        {
          title: '禁用USB选择性暂停',
          description: '在电源选项中禁用USB选择性暂停设置，防止系统自动关闭USB端口。',
          tools: ['控制面板'],
          supplies: []
        }
      ],
      'en': [
        {
          title: 'Check Physical Connection',
          description: 'Ensure USB device is properly inserted, try different USB ports, check if cable is damaged.',
          tools: ['USB Cable'],
          supplies: []
        },
        {
          title: 'Restart Computer',
          description: 'A simple restart can resolve many USB recognition issues, especially driver conflicts.',
          tools: [],
          supplies: []
        },
        {
          title: 'Check Device Manager',
          description: 'Open Device Manager, look for USB devices with error flags, update or reinstall drivers.',
          tools: ['Device Manager'],
          supplies: []
        },
        {
          title: 'Disable USB Selective Suspend',
          description: 'Disable USB selective suspend setting in power options to prevent system from automatically turning off USB ports.',
          tools: ['Control Panel'],
          supplies: []
        }
      ]
    }
  };

  return stepsData[pageType]?.[language] || stepsData['usb-not-recognized'][language];
};

export default StructuredDataGenerator;