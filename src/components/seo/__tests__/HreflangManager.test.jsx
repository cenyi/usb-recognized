import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import HreflangManager, { 
  HreflangTags, 
  LanguageSwitcher, 
  LanguageDropdown,
  useLanguageDetection,
  generateMultilingualUrls
} from '../HreflangManager';

// 测试辅助函数
const renderWithHelmet = (component) => {
  return render(
    <HelmetProvider>
      {component}
    </HelmetProvider>
  );
};

// 获取hreflang标签的辅助函数
const getHreflangTags = () => {
  return Array.from(document.querySelectorAll('link[rel="alternate"]'))
    .map(link => ({
      hreflang: link.getAttribute('hreflang'),
      href: link.getAttribute('href')
    }));
};

describe('HreflangManager', () => {
  beforeEach(() => {
    // 清理DOM
    document.head.innerHTML = '';
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://usbrecognized.com',
        href: 'https://usbrecognized.com/usb-not-recognized',
        search: ''
      },
      writable: true
    });

    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });

    // Mock navigator.language
    Object.defineProperty(navigator, 'language', {
      value: 'zh-CN',
      writable: true
    });
  });

  describe('基本功能测试', () => {
    test('应该返回正确的管理器对象', () => {
      const manager = HreflangManager({});
      
      expect(manager).toHaveProperty('renderHreflangTags');
      expect(manager).toHaveProperty('LanguageSwitcher');
      expect(manager).toHaveProperty('LanguageDropdown');
      expect(manager).toHaveProperty('switchLanguage');
      expect(manager).toHaveProperty('generatePageUrl');
      expect(manager).toHaveProperty('generateFullUrl');
      expect(manager).toHaveProperty('getAlternateVersions');
      expect(manager).toHaveProperty('currentLanguage');
      expect(manager).toHaveProperty('availableLanguages');
    });

    test('应该使用默认配置', () => {
      const manager = HreflangManager({});
      
      expect(manager.currentLanguage).toBe('zh');
      expect(manager.availableLanguages).toEqual(['zh', 'en']);
    });

    test('应该使用自定义配置', () => {
      const manager = HreflangManager({
        currentLanguage: 'en',
        availableLanguages: ['en', 'zh', 'fr']
      });
      
      expect(manager.currentLanguage).toBe('en');
      expect(manager.availableLanguages).toEqual(['en', 'zh', 'fr']);
    });
  });

  describe('URL生成功能', () => {
    test('应该生成正确的页面URL', () => {
      const manager = HreflangManager({});
      
      const zhUrl = manager.generatePageUrl('usb-not-recognized', 'zh');
      const enUrl = manager.generatePageUrl('usb-not-recognized', 'en');
      
      expect(zhUrl).toBe('/zh/usb-device-not-recognized');
      expect(enUrl).toBe('/usb-device-not-recognized');
    });

    test('应该生成正确的完整URL', () => {
      const manager = HreflangManager({
        baseUrl: 'https://example.com'
      });
      
      const zhUrl = manager.generateFullUrl('usb-not-recognized', 'zh');
      const enUrl = manager.generateFullUrl('usb-not-recognized', 'en');
      
      expect(zhUrl).toBe('https://example.com/zh/usb-device-not-recognized');
      expect(enUrl).toBe('https://example.com/usb-device-not-recognized');
    });

    test('应该支持自定义URL结构', () => {
      const customUrlStructure = (pageType, language) => {
        return `/${language}/custom/${pageType}`;
      };

      const manager = HreflangManager({
        customUrlStructure
      });
      
      const url = manager.generatePageUrl('usb-not-recognized', 'zh');
      expect(url).toBe('/zh/custom/usb-not-recognized');
    });
  });

  describe('Hreflang标签生成', () => {
    test('应该生成正确的hreflang标签', () => {
      renderWithHelmet(<HreflangTags />);
      
      const hreflangTags = getHreflangTags();
      
      expect(hreflangTags.length).toBeGreaterThan(0);
      
      // 检查中文标签
      const zhTag = hreflangTags.find(tag => tag.hreflang === 'zh-CN');
      expect(zhTag).toBeTruthy();
      expect(zhTag.href).toContain('/zh/');
      
      // 检查英文标签
      const enTag = hreflangTags.find(tag => tag.hreflang === 'en-US');
      expect(enTag).toBeTruthy();
      
      // 检查默认标签
      const defaultTag = hreflangTags.find(tag => tag.hreflang === 'x-default');
      expect(defaultTag).toBeTruthy();
    });

    test('应该为不同页面类型生成正确的hreflang标签', () => {
      renderWithHelmet(
        <HreflangTags 
          currentPageType="usb-device-recognized"
        />
      );
      
      const hreflangTags = getHreflangTags();
      const zhTag = hreflangTags.find(tag => tag.hreflang === 'zh-CN');
      
      expect(zhTag.href).toContain('usb-device-recognized');
    });
  });

  describe('语言切换功能', () => {
    test('应该渲染语言切换器', () => {
      render(<LanguageSwitcher />);
      
      expect(screen.getByText('语言:')).toBeInTheDocument();
      expect(screen.getByText('中文')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    test('应该正确显示当前语言', () => {
      render(<LanguageSwitcher currentLanguage="zh" />);
      
      const zhButton = screen.getByText('中文');
      expect(zhButton).toHaveClass('bg-blue-600', 'text-white');
    });

    test('应该处理语言切换点击', () => {
      const mockOnLanguageChange = jest.fn();
      
      render(
        <LanguageSwitcher 
          currentLanguage="zh"
          onLanguageChange={mockOnLanguageChange}
        />
      );
      
      const enButton = screen.getByText('English');
      fireEvent.click(enButton);
      
      expect(mockOnLanguageChange).toHaveBeenCalledWith('en');
    });

    test('应该保存语言偏好到localStorage', () => {
      const mockSetItem = jest.fn();
      window.localStorage.setItem = mockSetItem;
      
      const manager = HreflangManager({});
      manager.switchLanguage('en');
      
      expect(mockSetItem).toHaveBeenCalledWith('preferred-language', 'en');
    });
  });

  describe('语言下拉菜单', () => {
    test('应该渲染语言下拉菜单', () => {
      render(<LanguageDropdown currentLanguage="zh" />);
      
      expect(screen.getByText('中文')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('应该在点击时显示下拉选项', () => {
      render(<LanguageDropdown currentLanguage="zh" />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      // 应该显示所有语言选项
      const options = screen.getAllByText('中文');
      expect(options.length).toBeGreaterThan(1); // 按钮中一个，下拉中一个
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    test('应该处理下拉菜单中的语言选择', () => {
      const mockOnLanguageChange = jest.fn();
      
      render(
        <LanguageDropdown 
          currentLanguage="zh"
          onLanguageChange={mockOnLanguageChange}
        />
      );
      
      // 打开下拉菜单
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      // 点击英文选项
      const englishOptions = screen.getAllByText('English');
      fireEvent.click(englishOptions[englishOptions.length - 1]); // 选择下拉菜单中的选项
      
      expect(mockOnLanguageChange).toHaveBeenCalledWith('en');
    });
  });

  describe('语言检测功能', () => {
    test('应该检测浏览器语言', () => {
      const manager = HreflangManager({});
      const detectedLang = manager.detectUserLanguage();
      
      expect(detectedLang).toBe('zh'); // 基于mock的navigator.language
    });

    test('应该优先使用localStorage中的语言', () => {
      window.localStorage.getItem = jest.fn().mockReturnValue('en');
      
      const manager = HreflangManager({});
      const detectedLang = manager.detectUserLanguage();
      
      expect(detectedLang).toBe('en');
    });

    test('应该优先使用URL参数中的语言', () => {
      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          search: '?lang=en'
        },
        writable: true
      });
      
      const manager = HreflangManager({});
      const detectedLang = manager.detectUserLanguage();
      
      expect(detectedLang).toBe('en');
    });
  });

  describe('配置验证功能', () => {
    test('应该验证正确的配置', () => {
      const manager = HreflangManager({});
      const validation = manager.validateHreflangConfig();
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('应该检测缺少的语言配置', () => {
      const manager = HreflangManager({
        availableLanguages: ['zh', 'en', 'fr'] // fr没有配置
      });
      
      const validation = manager.validateHreflangConfig();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(error => error.includes('fr'))).toBe(true);
    });

    test('应该警告没有默认语言', () => {
      // 创建一个没有默认语言的配置
      const manager = HreflangManager({});
      // 修改内部配置使其没有默认语言
      manager.languageConfig.en.isDefault = false;
      
      const validation = manager.validateHreflangConfig();
      
      expect(validation.warnings.some(warning => 
        warning.includes('没有设置默认语言')
      )).toBe(true);
    });
  });

  describe('替代版本获取', () => {
    test('应该返回所有语言版本', () => {
      const manager = HreflangManager({
        currentPageType: 'usb-not-recognized',
        currentLanguage: 'zh'
      });
      
      const alternateVersions = manager.getAlternateVersions();
      
      expect(alternateVersions).toHaveLength(2);
      expect(alternateVersions[0].language).toBe('zh');
      expect(alternateVersions[1].language).toBe('en');
      expect(alternateVersions[0].isCurrent).toBe(true);
      expect(alternateVersions[1].isCurrent).toBe(false);
    });

    test('应该包含正确的URL', () => {
      const manager = HreflangManager({
        baseUrl: 'https://example.com'
      });
      
      const alternateVersions = manager.getAlternateVersions();
      
      alternateVersions.forEach(version => {
        expect(version.url).toMatch(/^https:\/\/example\.com/);
        expect(typeof version.url).toBe('string');
      });
    });
  });
});

describe('useLanguageDetection Hook', () => {
  test('应该返回检测到的语言', async () => {
    const TestComponent = () => {
      const { detectedLanguage, isLoading } = useLanguageDetection();
      return (
        <div>
          <span data-testid="language">{detectedLanguage}</span>
          <span data-testid="loading">{isLoading.toString()}</span>
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('language')).toHaveTextContent('zh');
  });
});

describe('generateMultilingualUrls', () => {
  test('应该生成多语言URL列表', () => {
    const urls = generateMultilingualUrls('usb-not-recognized', ['zh', 'en'], 'https://example.com');
    
    expect(Array.isArray(urls)).toBe(true);
    expect(urls).toHaveLength(2);
    
    urls.forEach(urlInfo => {
      expect(urlInfo).toHaveProperty('language');
      expect(urlInfo).toHaveProperty('url');
      expect(urlInfo).toHaveProperty('languageConfig');
      expect(urlInfo).toHaveProperty('isCurrent');
    });
  });
});

describe('错误处理和边界情况', () => {
  test('应该处理无效的语言切换', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    const manager = HreflangManager({});
    manager.switchLanguage('invalid-lang');
    
    expect(consoleSpy).toHaveBeenCalledWith('不支持的语言: invalid-lang');
    
    consoleSpy.mockRestore();
  });

  test('应该处理localStorage访问错误', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Mock localStorage抛出错误
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => { throw new Error('Access denied'); }),
        setItem: jest.fn(() => { throw new Error('Access denied'); })
      }
    });
    
    const manager = HreflangManager({});
    manager.detectUserLanguage();
    manager.switchLanguage('en');
    
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  test('应该处理缺少window对象的情况', () => {
    const originalWindow = global.window;
    delete global.window;
    
    const manager = HreflangManager({});
    const detectedLang = manager.detectUserLanguage();
    
    expect(detectedLang).toBe('zh'); // 应该返回默认语言
    
    global.window = originalWindow;
  });

  test('应该在不显示切换器时返回null', () => {
    const manager = HreflangManager({ showLanguageSwitcher: false });
    const switcher = manager.LanguageSwitcher();
    
    expect(switcher).toBeNull();
  });
});

describe('集成测试', () => {
  test('应该正确集成所有组件', () => {
    renderWithHelmet(
      <div>
        <HreflangTags currentPageType="usb-not-recognized" />
        <LanguageSwitcher currentLanguage="zh" />
      </div>
    );
    
    // 检查hreflang标签
    const hreflangTags = getHreflangTags();
    expect(hreflangTags.length).toBeGreaterThan(0);
    
    // 检查语言切换器
    expect(screen.getByText('语言:')).toBeInTheDocument();
    expect(screen.getByText('中文')).toBeInTheDocument();
  });

  test('应该在语言切换时更新URL', () => {
    const mockOnLanguageChange = jest.fn();
    
    render(
      <LanguageSwitcher 
        currentLanguage="zh"
        onLanguageChange={mockOnLanguageChange}
      />
    );
    
    const enButton = screen.getByText('English');
    fireEvent.click(enButton);
    
    expect(mockOnLanguageChange).toHaveBeenCalledWith('en');
  });
});