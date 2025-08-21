import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Hreflang管理器组件
 * 负责生成和管理多语言页面的hreflang标签，支持语言切换功能
 */
const HreflangManager = ({
  currentPageType = 'usb-not-recognized',
  currentLanguage = 'zh',
  availableLanguages = ['zh', 'en'],
  baseUrl = '',
  onLanguageChange = null,
  showLanguageSwitcher = true,
  customUrlStructure = null
}) => {
  const [detectedLanguage, setDetectedLanguage] = useState(currentLanguage);

  // 获取基础URL
  const siteBaseUrl = useMemo(() => {
    if (baseUrl) return baseUrl;
    if (typeof window !== 'undefined') return window.location.origin;
    return 'https://usbrecognized.com';
  }, [baseUrl]);

  // 语言配置
  const languageConfig = useMemo(() => ({
    'zh': {
      code: 'zh',
      hreflangCode: 'zh-CN',
      name: '中文',
      nativeName: '中文',
      flag: '🇨🇳',
      urlPrefix: '/zh',
      isDefault: false
    },
    'en': {
      code: 'en',
      hreflangCode: 'en-US',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      urlPrefix: '',
      isDefault: true
    }
  }), []);

  // 页面URL映射
  const pageUrlMapping = useMemo(() => ({
    'usb-not-recognized': {
      'zh': '/zh/usb-device-not-recognized',
      'en': '/usb-device-not-recognized'
    },
    'usb-device-not-recognized': {
      'zh': '/zh/usb-device-not-recognized',
      'en': '/usb-device-not-recognized'
    },
    'usb-device-recognized': {
      'zh': '/zh/usb-device-recognized',
      'en': '/usb-device-recognized'
    },
    'usb-recognized': {
      'zh': '/zh/usb-recognized',
      'en': '/usb-recognized'
    },
    'home': {
      'zh': '/zh',
      'en': '/'
    }
  }), []);

  // 生成页面URL
  const generatePageUrl = useCallback((pageType, language) => {
    if (customUrlStructure && typeof customUrlStructure === 'function') {
      return customUrlStructure(pageType, language);
    }

    const urlMapping = pageUrlMapping[pageType];
    if (!urlMapping) {
      // 默认URL结构
      const langConfig = languageConfig[language];
      return `${langConfig.urlPrefix}/${pageType}`;
    }

    return urlMapping[language] || urlMapping['en'];
  }, [pageUrlMapping, languageConfig, customUrlStructure]);

  // 生成完整URL
  const generateFullUrl = useCallback((pageType, language) => {
    const pagePath = generatePageUrl(pageType, language);
    return `${siteBaseUrl}${pagePath}`;
  }, [siteBaseUrl, generatePageUrl]);

  // 生成hreflang标签
  const generateHreflangTags = useMemo(() => {
    const hreflangTags = [];

    // 为每种可用语言生成hreflang标签
    availableLanguages.forEach(lang => {
      const langConfig = languageConfig[lang];
      if (langConfig) {
        const url = generateFullUrl(currentPageType, lang);
        hreflangTags.push(
          <link
            key={`hreflang-${lang}`}
            rel="alternate"
            hrefLang={langConfig.hreflangCode}
            href={url}
          />
        );
      }
    });

    // 添加x-default标签（指向默认语言版本）
    const defaultLanguage = availableLanguages.find(lang => 
      languageConfig[lang]?.isDefault
    ) || availableLanguages[0];
    
    const defaultUrl = generateFullUrl(currentPageType, defaultLanguage);
    hreflangTags.push(
      <link
        key="hreflang-default"
        rel="alternate"
        hrefLang="x-default"
        href={defaultUrl}
      />
    );

    return hreflangTags;
  }, [availableLanguages, languageConfig, currentPageType, generateFullUrl]);

  // 检测用户语言偏好
  const detectUserLanguage = useCallback(() => {
    if (typeof window === 'undefined') return currentLanguage;

    // 检查URL中的语言参数
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && availableLanguages.includes(urlLang)) {
      return urlLang;
    }

    // 检查localStorage中保存的语言偏好
    try {
      const savedLang = localStorage.getItem('preferred-language');
      if (savedLang && availableLanguages.includes(savedLang)) {
        return savedLang;
      }
    } catch (error) {
      console.warn('无法访问localStorage:', error);
    }

    // 检查浏览器语言设置
    const browserLang = navigator.language || navigator.userLanguage;
    const browserLangCode = browserLang.split('-')[0];
    if (availableLanguages.includes(browserLangCode)) {
      return browserLangCode;
    }

    // 返回默认语言
    return currentLanguage;
  }, [availableLanguages, currentLanguage]);

  // 切换语言
  const switchLanguage = useCallback((newLanguage) => {
    if (!availableLanguages.includes(newLanguage)) {
      console.warn(`不支持的语言: ${newLanguage}`);
      return;
    }

    // 保存语言偏好到localStorage
    try {
      localStorage.setItem('preferred-language', newLanguage);
    } catch (error) {
      console.warn('无法保存语言偏好:', error);
    }

    // 更新状态
    setDetectedLanguage(newLanguage);

    // 调用回调函数
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }

    // 如果需要，重定向到新语言版本的页面
    if (typeof window !== 'undefined' && newLanguage !== currentLanguage) {
      const newUrl = generateFullUrl(currentPageType, newLanguage);
      const currentUrl = window.location.href;
      
      if (newUrl !== currentUrl) {
        window.location.href = newUrl;
      }
    }
  }, [availableLanguages, currentLanguage, currentPageType, generateFullUrl, onLanguageChange]);

  // 获取当前页面的所有语言版本
  const getAlternateVersions = useCallback(() => {
    return availableLanguages.map(lang => ({
      language: lang,
      languageConfig: languageConfig[lang],
      url: generateFullUrl(currentPageType, lang),
      isCurrent: lang === currentLanguage
    }));
  }, [availableLanguages, languageConfig, currentPageType, currentLanguage, generateFullUrl]);

  // 验证hreflang配置
  const validateHreflangConfig = useCallback(() => {
    const errors = [];
    const warnings = [];

    // 检查是否有默认语言
    const hasDefault = availableLanguages.some(lang => 
      languageConfig[lang]?.isDefault
    );
    if (!hasDefault) {
      warnings.push('没有设置默认语言');
    }

    // 检查语言代码格式
    availableLanguages.forEach(lang => {
      const config = languageConfig[lang];
      if (!config) {
        errors.push(`缺少语言配置: ${lang}`);
        return;
      }

      if (!config.hreflangCode) {
        errors.push(`语言 ${lang} 缺少hreflangCode`);
      }

      if (!config.hreflangCode.match(/^[a-z]{2}(-[A-Z]{2})?$/)) {
        warnings.push(`语言 ${lang} 的hreflangCode格式可能不正确: ${config.hreflangCode}`);
      }
    });

    // 检查URL结构
    availableLanguages.forEach(lang => {
      try {
        const url = generateFullUrl(currentPageType, lang);
        new URL(url); // 验证URL格式
      } catch (error) {
        errors.push(`语言 ${lang} 的URL格式错误: ${error.message}`);
      }
    });

    return { errors, warnings, isValid: errors.length === 0 };
  }, [availableLanguages, languageConfig, currentPageType, generateFullUrl]);

  // 生成语言切换器
  const LanguageSwitcher = useCallback(() => {
    if (!showLanguageSwitcher) return null;

    const alternateVersions = getAlternateVersions();

    return (
      <div className="language-switcher">
        <div className="relative inline-block text-left">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">语言:</span>
            <div className="flex space-x-1">
              {alternateVersions.map(version => (
                <button
                  key={version.language}
                  onClick={() => switchLanguage(version.language)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    version.isCurrent
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={version.languageConfig.name}
                >
                  <span className="mr-1">{version.languageConfig.flag}</span>
                  {version.languageConfig.nativeName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }, [showLanguageSwitcher, getAlternateVersions, switchLanguage]);

  // 生成语言切换下拉菜单
  const LanguageDropdown = useCallback(() => {
    const [isOpen, setIsOpen] = useState(false);
    const alternateVersions = getAlternateVersions();
    const currentVersion = alternateVersions.find(v => v.isCurrent);

    if (!showLanguageSwitcher) return null;

    return (
      <div className="language-dropdown relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>{currentVersion?.languageConfig.flag}</span>
          <span>{currentVersion?.languageConfig.nativeName}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            {alternateVersions.map(version => (
              <button
                key={version.language}
                onClick={() => {
                  switchLanguage(version.language);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                  version.isCurrent ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span>{version.languageConfig.flag}</span>
                <span>{version.languageConfig.nativeName}</span>
                {version.isCurrent && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }, [showLanguageSwitcher, getAlternateVersions, switchLanguage]);

  // 初始化语言检测
  useEffect(() => {
    const detectedLang = detectUserLanguage();
    if (detectedLang !== currentLanguage) {
      setDetectedLanguage(detectedLang);
    }
  }, [detectUserLanguage, currentLanguage]);

  // 渲染hreflang标签
  const renderHreflangTags = () => (
    <Helmet>
      {generateHreflangTags}
    </Helmet>
  );

  return {
    // 渲染方法
    renderHreflangTags,
    LanguageSwitcher,
    LanguageDropdown,
    
    // 工具方法
    switchLanguage,
    generatePageUrl,
    generateFullUrl,
    getAlternateVersions,
    validateHreflangConfig,
    detectUserLanguage,
    
    // 状态和配置
    currentLanguage,
    detectedLanguage,
    availableLanguages,
    languageConfig,
    
    // 验证结果
    validation: validateHreflangConfig()
  };
};

// Hreflang标签渲染组件
export const HreflangTags = (props) => {
  const manager = HreflangManager(props);
  return manager.renderHreflangTags();
};

// 语言切换器组件
export const LanguageSwitcher = (props) => {
  const manager = HreflangManager(props);
  return <manager.LanguageSwitcher />;
};

// 语言下拉菜单组件
export const LanguageDropdown = (props) => {
  const manager = HreflangManager(props);
  return <manager.LanguageDropdown />;
};

// 语言检测Hook
export const useLanguageDetection = (availableLanguages = ['zh', 'en']) => {
  const [detectedLanguage, setDetectedLanguage] = useState('zh');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectLanguage = () => {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      // 检查URL参数
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang && availableLanguages.includes(urlLang)) {
        setDetectedLanguage(urlLang);
        setIsLoading(false);
        return;
      }

      // 检查localStorage
      try {
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && availableLanguages.includes(savedLang)) {
          setDetectedLanguage(savedLang);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.warn('无法访问localStorage:', error);
      }

      // 检查浏览器语言
      const browserLang = navigator.language || navigator.userLanguage;
      const browserLangCode = browserLang.split('-')[0];
      if (availableLanguages.includes(browserLangCode)) {
        setDetectedLanguage(browserLangCode);
      }

      setIsLoading(false);
    };

    detectLanguage();
  }, [availableLanguages]);

  return { detectedLanguage, isLoading };
};

// 多语言URL生成工具
export const generateMultilingualUrls = (pageType, availableLanguages = ['zh', 'en'], baseUrl = '') => {
  const manager = HreflangManager({ 
    currentPageType: pageType, 
    availableLanguages, 
    baseUrl 
  });
  
  return manager.getAlternateVersions();
};

export default HreflangManager;