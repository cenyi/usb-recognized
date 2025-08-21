import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import StructuredDataGenerator, { generateUSBFAQData, generateUSBHowToSteps } from '../StructuredDataGenerator';

// 测试辅助函数
const renderWithHelmet = (component) => {
  return render(
    <HelmetProvider>
      {component}
    </HelmetProvider>
  );
};

// 获取结构化数据的辅助函数
const getStructuredDataScripts = () => {
  return Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map(script => {
      try {
        return JSON.parse(script.textContent);
      } catch (e) {
        return null;
      }
    })
    .filter(data => data !== null);
};

describe('StructuredDataGenerator', () => {
  beforeEach(() => {
    // 清理DOM
    document.head.innerHTML = '';
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://usbrecognized.com',
        href: 'https://usbrecognized.com/usb-not-recognized'
      },
      writable: true
    });
  });

  describe('基本结构化数据生成', () => {
    test('应该生成WebPage结构化数据', () => {
      renderWithHelmet(
        <StructuredDataGenerator 
          pageType="usb-not-recognized"
          language="zh"
          content={{ title: 'USB设备无法识别', description: '解决USB问题' }}
        />
      );

      const schemas = getStructuredDataScripts();
      const webPageSchema = schemas.find(schema => schema['@type'] === 'WebPage');
      
      expect(webPageSchema).toBeTruthy();
      expect(webPageSchema['@context']).toBe('https://schema.org');
      expect(webPageSchema.name).toBe('USB设备无法识别');
      expect(webPageSchema.description).toBe('解决USB问题');
      expect(webPageSchema.inLanguage).toBe('zh-CN');
    });

    test('应该生成面包屑导航结构化数据', () => {
      renderWithHelmet(
        <StructuredDataGenerator 
          pageType="usb-not-recognized"
          language="zh"
        />
      );

      const schemas = getStructuredDataScripts();
      const breadcrumbSchema = schemas.find(schema => schema['@type'] === 'BreadcrumbList');
      
      expect(breadcrumbSchema).toBeTruthy();
      expect(breadcrumbSchema.itemListElement).toBeDefined();
      expect(Array.isArray(breadcrumbSchema.itemListElement)).toBe(true);
      expect(breadcrumbSchema.itemListElement.length).toBeGreaterThan(0);
    });

    test('应该生成技术文章结构化数据', () => {
      renderWithHelmet(
        <StructuredDataGenerator 
          pageType="usb-not-recognized"
          language="zh"
          content={{ title: 'USB故障排除', description: '详细指南' }}
        />
      );

      const schemas = getStructuredDataScripts();
      const articleSchema = schemas.find(schema => schema['@type'] === 'TechnicalArticle');
      
      expect(articleSchema).toBeTruthy();
      expect(articleSchema.headline).toBe('USB故障排除');
      expect(articleSchema.description).toBe('详细指南');
      expect(articleSchema.inLanguage).toBe('zh-CN');
      expect(articleSchema.keywords).toBeDefined();
    });
  });

  describe('FAQ结构化数据', () => {
    test('应该在提供FAQ数据时生成FAQ结构化数据', () => {
      const faqData = [
        {
          question: '为什么USB设备无法识别？',
          answer: '这可能是驱动程序问题。',
          upvoteCount: 10
        }
      ];

      renderWithHelmet(
        <StructuredDataGenerator 
          pageType="usb-not-recognized"
          language="zh"
          faqData={faqData}
        />
      );

      const schemas = getStructuredDataScripts();
      const faqSchema = schemas.find(schema => schema['@type'] === 'FAQPage');
      
      expect(faqSchema).toBeTruthy();
      expect(faqSchema.mainEntity).toBeDefined();
      expect(faqSchema.mainEntity).toHaveLength(1);
      expect(faqSchema.mainEntity[0]['@type']).toBe('Question');
      expect(faqSchema.mainEntity[0].name).toBe('为什么USB设备无法识别？');
      expect(faqSchema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
    });

    test('应该在没有FAQ数据时不生成FAQ结构化数据', () => {
      renderWithHelmet(
        <StructuredDataGenerator 
          pageType="usb-not-recognized"
          language="zh"
        />
      );

      const schemas = getStructuredDataScripts();
      const faqSchema = schemas.find(schema => schema['@type'] === 'FAQPage');
      
      expect(faqSchema).toBeFalsy();
    });
  });

  describe('HowTo结构化数据', () => {
    test('应该在提供步骤数据时生成HowTo结构化数据', () => {
      const howToSteps = [
        {
          title: '检查USB连接',
          description: '确保USB设备正确连接',
          tools: ['USB线缆'],
          supplies: []
        },
        {
          title: '重启计算机',
          description: '重启可以解决驱动问题',
          tools: [],
          supplies: []
        }
      ];

      renderWithHelmet(
        <StructuredDataGenerator 
          pageType="usb-not-recognized"
          language="zh"
          howToSteps={howToSteps}
        />
      );

      const schemas = getStructuredDataScripts();
      const howToSchema = schemas.find(schema => schema['@type'] === 'HowTo');
      
      expect(howToSchema).toBeTruthy();
      expect(howToSchema.step).toBeDefined();
      expect(howToSchema.step).toHaveLength(2);
      expect(howToSchema.step[0]['@type']).toBe('HowToStep');
      expect(howToSchema.step[0].position).toBe(1);
      expect(howToSchema.step[0].name).toBe('检查USB连接');
      expect(howToSchema.totalTime).toBeDefined();
    });

    test('应该正确处理工具和供应品', () => {
      const howToSteps = [
        {
          title: '使用工具检查',
          description: '使用特定工具进行检查',
          tools: ['螺丝刀', '万用表'],
          supplies: ['清洁剂']
        }
      ];

      renderWithHelmet(
        <StructuredDataGenerator 
          pageType="usb-not-recognized"
          language="zh"
          howToSteps={howToSteps}
        />
      );

      const schemas = getStructuredDataScripts();
      const howToSchema = schemas.find(schema => schema['@type'] === 'HowTo');
      
      expect(howToSchema.tool).toBeDefined();
      expect(howToSchema.tool).toHaveLength(2);
      expect(howToSchema.supply).toBeDefined();
      expect(howToSchema.supply).toHaveLength(1);
    });
  });

  describe('多语言支持', () => {
    test('应该为英文生成正确的结构化数据', () => {
      renderWithHelmet(
        <StructuredDataGenerator 
          pageType="usb-not-recognized"
          language="en"
          content={{ title: 'USB Device Not Recognized', description: 'Fix USB issues' }}
        />
      );

      const schemas = getStructuredDataScripts();
      const webPageSchema = schemas.find(schema => schema['@type'] === 'WebPage');
      const articleSchema = schemas.find(schema => schema['@type'] === 'TechnicalArticle');
      
      expect(webPageSchema.inLanguage).toBe('en-US');
      expect(articleSchema.inLanguage).toBe('en-US');
      expect(articleSchema.keywords).toContain('USB not recognized');
    });

    test('应该为中文生成正确的关键词', () => {
      renderWithHelmet(
        <StructuredDataGenerator 
          pageType="usb-device-not-recognized"
          language="zh"
        />
      );

      const schemas = getStructuredDataScripts();
      const articleSchema = schemas.find(schema => schema['@type'] === 'TechnicalArticle');
      
      expect(articleSchema.keywords).toContain('USB设备不被识别');
      expect(articleSchema.keywords).toContain('USB设备检测');
    });
  });

  describe('不同页面类型', () => {
    const pageTypes = [
      'usb-not-recognized',
      'usb-device-not-recognized',
      'usb-device-recognized',
      'usb-recognized'
    ];

    pageTypes.forEach(pageType => {
      test(`应该为${pageType}页面生成正确的结构化数据`, () => {
        renderWithHelmet(
          <StructuredDataGenerator 
            pageType={pageType}
            language="zh"
          />
        );

        const schemas = getStructuredDataScripts();
        expect(schemas.length).toBeGreaterThan(0);
        
        const webPageSchema = schemas.find(schema => schema['@type'] === 'WebPage');
        const articleSchema = schemas.find(schema => schema['@type'] === 'TechnicalArticle');
        
        expect(webPageSchema).toBeTruthy();
        expect(articleSchema).toBeTruthy();
      });
    });

    test('应该为主页生成软件应用结构化数据', () => {
      renderWithHelmet(
        <StructuredDataGenerator 
          pageType="usb-not-recognized"
          language="zh"
        />
      );

      const schemas = getStructuredDataScripts();
      const appSchema = schemas.find(schema => schema['@type'] === 'SoftwareApplication');
      
      expect(appSchema).toBeTruthy();
      expect(appSchema.name).toBeDefined();
      expect(appSchema.applicationCategory).toBe('UtilitiesApplication');
      expect(appSchema.operatingSystem).toBe('Windows, macOS, Linux');
    });
  });

  describe('自定义结构化数据', () => {
    test('应该支持自定义结构化数据', () => {
      const customSchemas = [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "USB诊断工具",
          "description": "专业的USB设备诊断工具"
        }
      ];

      renderWithHelmet(
        <StructuredDataGenerator 
          pageType="usb-not-recognized"
          language="zh"
          customSchemas={customSchemas}
        />
      );

      const schemas = getStructuredDataScripts();
      const productSchema = schemas.find(schema => schema['@type'] === 'Product');
      
      expect(productSchema).toBeTruthy();
      expect(productSchema.name).toBe('USB诊断工具');
    });
  });

  describe('数据验证', () => {
    test('应该在开发模式下验证结构化数据', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      renderWithHelmet(
        <StructuredDataGenerator 
          pageType="usb-not-recognized"
          language="zh"
          content={{}} // 缺少必要字段
        />
      );

      // 恢复环境
      process.env.NODE_ENV = originalEnv;
      consoleSpy.mockRestore();
    });

    test('生成的结构化数据应该有正确的必需字段', () => {
      renderWithHelmet(
        <StructuredDataGenerator 
          pageType="usb-not-recognized"
          language="zh"
          content={{ title: 'Test Title', description: 'Test Description' }}
        />
      );

      const schemas = getStructuredDataScripts();
      
      schemas.forEach(schema => {
        expect(schema['@context']).toBeDefined();
        expect(schema['@type']).toBeDefined();
        
        // 根据类型检查特定字段
        if (schema['@type'] === 'WebPage') {
          expect(schema.name).toBeDefined();
          expect(schema.url).toBeDefined();
        }
        
        if (schema['@type'] === 'TechnicalArticle') {
          expect(schema.headline).toBeDefined();
          expect(schema.author).toBeDefined();
          expect(schema.publisher).toBeDefined();
        }
      });
    });
  });
});

describe('generateUSBFAQData', () => {
  test('应该生成中文FAQ数据', () => {
    const faqData = generateUSBFAQData('zh');
    
    expect(Array.isArray(faqData)).toBe(true);
    expect(faqData.length).toBeGreaterThan(0);
    
    faqData.forEach(faq => {
      expect(faq).toHaveProperty('question');
      expect(faq).toHaveProperty('answer');
      expect(faq).toHaveProperty('upvoteCount');
      expect(typeof faq.question).toBe('string');
      expect(typeof faq.answer).toBe('string');
      expect(typeof faq.upvoteCount).toBe('number');
    });
  });

  test('应该生成英文FAQ数据', () => {
    const faqData = generateUSBFAQData('en');
    
    expect(Array.isArray(faqData)).toBe(true);
    expect(faqData.length).toBeGreaterThan(0);
    
    const firstFaq = faqData[0];
    expect(firstFaq.question).toContain('USB device not recognized');
    expect(firstFaq.answer).toContain('driver problems');
  });

  test('应该为无效语言返回英文数据', () => {
    const faqData = generateUSBFAQData('invalid-lang');
    
    expect(Array.isArray(faqData)).toBe(true);
    expect(faqData[0].question).toContain('USB device not recognized');
  });
});

describe('generateUSBHowToSteps', () => {
  test('应该生成中文HowTo步骤', () => {
    const steps = generateUSBHowToSteps('usb-not-recognized', 'zh');
    
    expect(Array.isArray(steps)).toBe(true);
    expect(steps.length).toBeGreaterThan(0);
    
    steps.forEach(step => {
      expect(step).toHaveProperty('title');
      expect(step).toHaveProperty('description');
      expect(step).toHaveProperty('tools');
      expect(step).toHaveProperty('supplies');
      expect(typeof step.title).toBe('string');
      expect(typeof step.description).toBe('string');
      expect(Array.isArray(step.tools)).toBe(true);
      expect(Array.isArray(step.supplies)).toBe(true);
    });
  });

  test('应该生成英文HowTo步骤', () => {
    const steps = generateUSBHowToSteps('usb-not-recognized', 'en');
    
    expect(Array.isArray(steps)).toBe(true);
    expect(steps.length).toBeGreaterThan(0);
    
    const firstStep = steps[0];
    expect(firstStep.title).toContain('Physical Connection');
    expect(firstStep.description).toContain('USB device');
  });

  test('应该为无效页面类型返回默认步骤', () => {
    const steps = generateUSBHowToSteps('invalid-page-type', 'zh');
    
    expect(Array.isArray(steps)).toBe(true);
    expect(steps.length).toBeGreaterThan(0);
  });

  test('应该包含工具和供应品信息', () => {
    const steps = generateUSBHowToSteps('usb-not-recognized', 'zh');
    
    const stepWithTools = steps.find(step => step.tools.length > 0);
    expect(stepWithTools).toBeTruthy();
    expect(stepWithTools.tools[0]).toBeDefined();
  });
});

describe('错误处理和边界情况', () => {
  test('应该处理缺少window对象的情况', () => {
    const originalWindow = global.window;
    delete global.window;
    
    renderWithHelmet(
      <StructuredDataGenerator 
        pageType="usb-not-recognized"
        language="zh"
      />
    );

    const schemas = getStructuredDataScripts();
    expect(schemas.length).toBeGreaterThan(0);
    
    // 恢复window对象
    global.window = originalWindow;
  });

  test('应该处理空的内容对象', () => {
    renderWithHelmet(
      <StructuredDataGenerator 
        pageType="usb-not-recognized"
        language="zh"
        content={{}}
      />
    );

    const schemas = getStructuredDataScripts();
    const webPageSchema = schemas.find(schema => schema['@type'] === 'WebPage');
    
    expect(webPageSchema).toBeTruthy();
    expect(webPageSchema.name).toBeDefined(); // 应该有默认值
  });

  test('应该处理空的FAQ和HowTo数据', () => {
    renderWithHelmet(
      <StructuredDataGenerator 
        pageType="usb-not-recognized"
        language="zh"
        faqData={[]}
        howToSteps={[]}
      />
    );

    const schemas = getStructuredDataScripts();
    const faqSchema = schemas.find(schema => schema['@type'] === 'FAQPage');
    const howToSchema = schemas.find(schema => schema['@type'] === 'HowTo');
    
    expect(faqSchema).toBeFalsy();
    expect(howToSchema).toBeFalsy();
  });
});