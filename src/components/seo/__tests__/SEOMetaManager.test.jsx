import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import SEOMetaManager from '../SEOMetaManager';

// 测试辅助函数
const renderWithHelmet = (component) => {
  return render(
    <HelmetProvider>
      {component}
    </HelmetProvider>
  );
};

// 获取helmet数据的辅助函数
const getHelmetData = () => {
  const helmet = document.querySelector('title');
  const description = document.querySelector('meta[name="description"]');
  const canonical = document.querySelector('link[rel="canonical"]');
  const keywords = document.querySelector('meta[name="keywords"]');
  
  return {
    title: helmet?.textContent || '',
    description: description?.getAttribute('content') || '',
    canonical: canonical?.getAttribute('href') || '',
    keywords: keywords?.getAttribute('content') || ''
  };
};

describe('SEOMetaManager', () => {
  beforeEach(() => {
    // 清理DOM
    document.head.innerHTML = '';
  });

  describe('Title生成和验证', () => {
    test('应该生成正确长度的中文Title (40-60字符)', () => {
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="zh" 
          keywords={{ primary: 'USB不被识别' }}
        />
      );
      
      const { title } = getHelmetData();
      expect(title.length).toBeGreaterThanOrEqual(40);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title).toContain('USB');
      expect(title).toContain('识别');
    });

    test('应该生成正确长度的英文Title (40-60字符)', () => {
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="en" 
          keywords={{ primary: 'USB not recognized' }}
        />
      );
      
      const { title } = getHelmetData();
      expect(title.length).toBeGreaterThanOrEqual(40);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title).toContain('USB');
      expect(title).toContain('Recognized');
    });

    test('应该处理过长的Title并截断', () => {
      const longTitle = 'USB设备无法识别问题的完整解决方案和故障排除指南包含所有操作系统的详细步骤';
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="zh" 
          customTitle={longTitle}
        />
      );
      
      const { title } = getHelmetData();
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title).toContain('USB');
    });

    test('应该处理过短的Title并扩展', () => {
      const shortTitle = 'USB问题';
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="zh" 
          customTitle={shortTitle}
        />
      );
      
      const { title } = getHelmetData();
      expect(title.length).toBeGreaterThanOrEqual(40);
      expect(title).toContain('USB');
    });
  });

  describe('Description生成和验证', () => {
    test('应该生成正确长度的中文Description (140-160字符)', () => {
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="zh" 
          keywords={{ primary: 'USB不被识别' }}
        />
      );
      
      const { description } = getHelmetData();
      expect(description.length).toBeGreaterThanOrEqual(140);
      expect(description.length).toBeLessThanOrEqual(160);
      expect(description).toContain('USB');
      expect(description).toContain('识别');
    });

    test('应该生成正确长度的英文Description (140-160字符)', () => {
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="en" 
          keywords={{ primary: 'USB not recognized' }}
        />
      );
      
      const { description } = getHelmetData();
      expect(description.length).toBeGreaterThanOrEqual(140);
      expect(description.length).toBeLessThanOrEqual(160);
      expect(description).toContain('USB');
      expect(description).toContain('recognized');
    });

    test('应该处理过长的Description并截断', () => {
      const longDesc = 'USB设备无法识别问题的完整解决方案包含Windows、Mac、Linux系统的详细故障排除步骤，帮助您快速修复USB连接问题，解决各种USB设备类型的识别故障，提供专业的技术支持和解决方案';
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="zh" 
          customDescription={longDesc}
        />
      );
      
      const { description } = getHelmetData();
      expect(description.length).toBeLessThanOrEqual(160);
      expect(description).toContain('USB');
    });
  });

  describe('SEO元素验证', () => {
    test('Keywords标签应该为空', () => {
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="zh" 
        />
      );
      
      const { keywords } = getHelmetData();
      expect(keywords).toBe('');
    });

    test('应该生成正确的Canonical URL', () => {
      // 模拟window.location
      Object.defineProperty(window, 'location', {
        value: { origin: 'https://usbrecognized.com' },
        writable: true
      });

      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="zh" 
        />
      );
      
      const { canonical } = getHelmetData();
      expect(canonical).toBe('https://usbrecognized.com/zh/usb-not-recognized');
    });

    test('应该为英文页面生成正确的Canonical URL', () => {
      Object.defineProperty(window, 'location', {
        value: { origin: 'https://usbrecognized.com' },
        writable: true
      });

      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="en" 
        />
      );
      
      const { canonical } = getHelmetData();
      expect(canonical).toBe('https://usbrecognized.com/usb-not-recognized');
    });

    test('应该生成Hreflang标签', () => {
      Object.defineProperty(window, 'location', {
        value: { origin: 'https://usbrecognized.com' },
        writable: true
      });

      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="zh" 
        />
      );
      
      const hreflangZh = document.querySelector('link[hreflang="zh"]');
      const hreflangEn = document.querySelector('link[hreflang="en"]');
      const hreflangDefault = document.querySelector('link[hreflang="x-default"]');
      
      expect(hreflangZh).toBeTruthy();
      expect(hreflangEn).toBeTruthy();
      expect(hreflangDefault).toBeTruthy();
      
      expect(hreflangZh.getAttribute('href')).toBe('https://usbrecognized.com/zh/usb-not-recognized');
      expect(hreflangEn.getAttribute('href')).toBe('https://usbrecognized.com/usb-not-recognized');
    });
  });

  describe('不同页面类型测试', () => {
    test('应该为usb-device-not-recognized页面生成正确内容', () => {
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-device-not-recognized" 
          language="zh" 
          keywords={{ primary: 'USB设备不被识别' }}
        />
      );
      
      const { title, description } = getHelmetData();
      expect(title).toContain('USB设备不被识别');
      expect(description).toContain('USB设备不被识别');
      expect(title.length).toBeGreaterThanOrEqual(40);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(description.length).toBeGreaterThanOrEqual(140);
      expect(description.length).toBeLessThanOrEqual(160);
    });

    test('应该为usb-device-recognized页面生成正确内容', () => {
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-device-recognized" 
          language="zh" 
          keywords={{ primary: 'USB设备已识别' }}
        />
      );
      
      const { title, description } = getHelmetData();
      expect(title).toContain('USB设备已识别');
      expect(description).toContain('USB设备已识别');
      expect(title.length).toBeGreaterThanOrEqual(40);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(description.length).toBeGreaterThanOrEqual(140);
      expect(description.length).toBeLessThanOrEqual(160);
    });

    test('应该为usb-recognized页面生成正确内容', () => {
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-recognized" 
          language="zh" 
          keywords={{ primary: 'USB识别' }}
        />
      );
      
      const { title, description } = getHelmetData();
      expect(title).toContain('USB识别');
      expect(description).toContain('USB识别');
      expect(title.length).toBeGreaterThanOrEqual(40);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(description.length).toBeGreaterThanOrEqual(140);
      expect(description.length).toBeLessThanOrEqual(160);
    });
  });

  describe('Open Graph和Twitter Card标签', () => {
    test('应该生成Open Graph标签', () => {
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="zh" 
          keywords={{ primary: 'USB不被识别' }}
        />
      );
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogType = document.querySelector('meta[property="og:type"]');
      const ogLocale = document.querySelector('meta[property="og:locale"]');
      
      expect(ogTitle).toBeTruthy();
      expect(ogDescription).toBeTruthy();
      expect(ogType?.getAttribute('content')).toBe('article');
      expect(ogLocale?.getAttribute('content')).toBe('zh_CN');
    });

    test('应该生成Twitter Card标签', () => {
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="zh" 
        />
      );
      
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      
      expect(twitterCard?.getAttribute('content')).toBe('summary_large_image');
      expect(twitterTitle).toBeTruthy();
      expect(twitterDescription).toBeTruthy();
    });
  });

  describe('其他SEO标签', () => {
    test('应该生成robots标签', () => {
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="zh" 
        />
      );
      
      const robots = document.querySelector('meta[name="robots"]');
      expect(robots?.getAttribute('content')).toBe('index, follow');
    });

    test('应该生成viewport标签', () => {
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="zh" 
        />
      );
      
      const viewport = document.querySelector('meta[name="viewport"]');
      expect(viewport?.getAttribute('content')).toBe('width=device-width, initial-scale=1.0');
    });

    test('应该生成Content-Language标签', () => {
      renderWithHelmet(
        <SEOMetaManager 
          pageType="usb-not-recognized" 
          language="zh" 
        />
      );
      
      const contentLanguage = document.querySelector('meta[http-equiv="Content-Language"]');
      expect(contentLanguage?.getAttribute('content')).toBe('zh');
    });
  });
});