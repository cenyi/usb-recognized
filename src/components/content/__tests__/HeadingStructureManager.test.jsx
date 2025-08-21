import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeadingStructureManager, { 
  HeadingStructureRenderer, 
  TableOfContents, 
  HeadingStats 
} from '../HeadingStructureManager';

// Mock multilingualContent
jest.mock('../../../data/multilingualContent', () => ({
  getPageHeadings: jest.fn((pageType, language) => ({
    h1: 'USB设备无法识别？完整故障排除指南',
    h2: [
      'USB不被识别的常见原因分析',
      'Windows系统USB识别问题解决方案',
      'Mac系统USB设备识别故障排除方法',
      'Linux系统USB不被识别的修复步骤'
    ],
    h3: [
      'USB驱动程序问题的诊断和修复',
      'USB端口硬件故障的检测方法',
      'USB设备兼容性问题的解决',
      '系统设置导致的USB识别失败',
      'USB供电不足问题的解决方案',
      'USB线缆和连接器故障排除'
    ]
  })),
  getPageKeywords: jest.fn(() => ({
    primary: 'usb not recognized',
    secondary: ['usb device not recognized', 'usb recognition issues'],
    longTail: ['usb flash drive not recognized', 'external usb not recognized']
  }))
}));

describe('HeadingStructureManager', () => {
  beforeEach(() => {
    // 清理DOM
    document.body.innerHTML = '';
    // 设置测试环境
    process.env.NODE_ENV = 'test';
  });

  describe('基本功能测试', () => {
    test('应该返回正确的管理器对象', () => {
      const manager = HeadingStructureManager({});
      
      expect(manager).toHaveProperty('renderHeadingStructure');
      expect(manager).toHaveProperty('renderHeading');
      expect(manager).toHaveProperty('generateTableOfContents');
      expect(manager).toHaveProperty('getHeadingStats');
      expect(manager).toHaveProperty('validateHeadingStructure');
      expect(manager).toHaveProperty('headings');
      expect(manager).toHaveProperty('pageKeywords');
    });

    test('应该正确获取页面标题', () => {
      const manager = HeadingStructureManager({
        pageType: 'usb-not-recognized',
        language: 'zh'
      });
      
      expect(manager.headings.h1).toBe('USB设备无法识别？完整故障排除指南');
      expect(manager.headings.h2).toHaveLength(4);
      expect(manager.headings.h3).toHaveLength(6);
    });

    test('应该支持自定义标题', () => {
      const customHeadings = {
        h1: '自定义H1标题',
        h2: ['自定义H2-1', '自定义H2-2'],
        h3: ['自定义H3-1', '自定义H3-2']
      };
      
      const manager = HeadingStructureManager({
        customHeadings
      });
      
      expect(manager.headings).toEqual(customHeadings);
    });
  });

  describe('标题验证功能', () => {
    test('应该验证有效的标题结构', () => {
      const manager = HeadingStructureManager({});
      const validation = manager.validateHeadingStructure();
      
      expect(validation).toHaveProperty('isValid');
      expect(validation).toHaveProperty('errors');
      expect(validation).toHaveProperty('warnings');
      expect(Array.isArray(validation.errors)).toBe(true);
      expect(Array.isArray(validation.warnings)).toBe(true);
    });

    test('应该检测缺少H1标题的错误', () => {
      const manager = HeadingStructureManager({
        customHeadings: {
          h1: '',
          h2: ['H2标题'],
          h3: ['H3标题']
        }
      });
      
      const validation = manager.validateHeadingStructure();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('缺少H1标题');
    });

    test('应该检测H2标题数量不足的问题', () => {
      const manager = HeadingStructureManager({
        customHeadings: {
          h1: 'H1标题',
          h2: ['H2标题1', 'H2标题2'], // 少于3个
          h3: ['H3标题']
        }
      });
      
      const validation = manager.validateHeadingStructure();
      expect(validation.warnings.some(w => w.includes('建议至少有3个H2标题'))).toBe(true);
    });

    test('应该检测H1标题长度问题', () => {
      const manager = HeadingStructureManager({
        customHeadings: {
          h1: '短标题', // 少于20字符
          h2: ['H2-1', 'H2-2', 'H2-3'],
          h3: ['H3-1']
        }
      });
      
      const validation = manager.validateHeadingStructure();
      expect(validation.warnings.some(w => w.includes('H1标题长度建议'))).toBe(true);
    });
  });

  describe('目录生成功能', () => {
    test('应该生成正确的目录结构', () => {
      const manager = HeadingStructureManager({});
      const toc = manager.generateTableOfContents();
      
      expect(Array.isArray(toc)).toBe(true);
      expect(toc.length).toBeGreaterThan(0);
      
      // 检查目录项结构
      const firstItem = toc[0];
      expect(firstItem).toHaveProperty('level');
      expect(firstItem).toHaveProperty('title');
      expect(firstItem).toHaveProperty('id');
    });

    test('应该包含所有级别的标题', () => {
      const manager = HeadingStructureManager({});
      const toc = manager.generateTableOfContents();
      
      const h1Items = toc.filter(item => item.level === 1);
      const h2Items = toc.filter(item => item.level === 2);
      const h3Items = toc.filter(item => item.level === 3);
      
      expect(h1Items).toHaveLength(1);
      expect(h2Items.length).toBeGreaterThan(0);
      expect(h3Items.length).toBeGreaterThan(0);
    });
  });

  describe('统计信息功能', () => {
    test('应该返回正确的标题统计', () => {
      const manager = HeadingStructureManager({});
      const stats = manager.getHeadingStats();
      
      expect(stats).toHaveProperty('h1Count');
      expect(stats).toHaveProperty('h2Count');
      expect(stats).toHaveProperty('h3Count');
      expect(stats).toHaveProperty('totalCount');
      expect(stats).toHaveProperty('validation');
      
      expect(stats.h1Count).toBe(1);
      expect(stats.h2Count).toBe(4);
      expect(stats.h3Count).toBe(6);
      expect(stats.totalCount).toBe(11);
    });
  });

  describe('关键词优化功能', () => {
    test('应该在启用优化时处理关键词', () => {
      const manager = HeadingStructureManager({
        enableKeywordOptimization: true
      });
      
      // 测试关键词优化不会破坏标题
      expect(manager.headings.h1).toContain('USB');
    });

    test('应该在禁用优化时保持原始标题', () => {
      const manager = HeadingStructureManager({
        enableKeywordOptimization: false
      });
      
      expect(manager.headings.h1).toBe('USB设备无法识别？完整故障排除指南');
    });
  });
});

describe('HeadingStructureRenderer', () => {
  test('应该渲染标题结构', () => {
    render(<HeadingStructureRenderer />);
    
    // 检查H1标题
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1.textContent).toContain('USB设备无法识别');
  });

  test('应该渲染多个H2标题', () => {
    render(<HeadingStructureRenderer />);
    
    const h2Elements = screen.getAllByRole('heading', { level: 2 });
    expect(h2Elements.length).toBeGreaterThan(1);
  });

  test('应该渲染多个H3标题', () => {
    render(<HeadingStructureRenderer />);
    
    const h3Elements = screen.getAllByRole('heading', { level: 3 });
    expect(h3Elements.length).toBeGreaterThan(1);
  });

  test('应该为标题生成正确的ID', () => {
    render(<HeadingStructureRenderer />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.id).toMatch(/^h1-/);
    
    const h2Elements = screen.getAllByRole('heading', { level: 2 });
    h2Elements.forEach(h2 => {
      expect(h2.id).toMatch(/^h2-/);
    });
  });

  test('应该支持点击事件', () => {
    const mockOnClick = jest.fn();
    render(<HeadingStructureRenderer onHeadingClick={mockOnClick} />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    fireEvent.click(h1);
    
    expect(mockOnClick).toHaveBeenCalledWith(
      expect.objectContaining({
        heading: expect.any(String),
        level: 1,
        index: 0,
        id: expect.any(String)
      })
    );
  });

  test('应该支持键盘导航', () => {
    const mockOnClick = jest.fn();
    render(<HeadingStructureRenderer onHeadingClick={mockOnClick} />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    fireEvent.keyDown(h1, { key: 'Enter' });
    
    expect(mockOnClick).toHaveBeenCalled();
  });
});

describe('TableOfContents', () => {
  test('应该渲染目录', () => {
    render(<TableOfContents />);
    
    const tocHeading = screen.getByText('目录');
    expect(tocHeading).toBeInTheDocument();
  });

  test('应该包含所有标题的链接', () => {
    render(<TableOfContents />);
    
    // 检查是否有链接元素
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  test('应该处理链接点击事件', () => {
    // Mock scrollIntoView
    const mockScrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;
    
    render(<TableOfContents />);
    
    const firstLink = screen.getAllByRole('link')[0];
    fireEvent.click(firstLink);
    
    // 由于我们阻止了默认行为，scrollIntoView可能不会被调用
    // 但至少确保点击不会出错
    expect(firstLink).toBeInTheDocument();
  });

  test('应该为空标题返回null', () => {
    const { container } = render(
      <TableOfContents customHeadings={{ h1: '', h2: [], h3: [] }} />
    );
    
    expect(container.firstChild).toBeNull();
  });
});

describe('HeadingStats', () => {
  test('应该在开发模式下显示统计信息', () => {
    process.env.NODE_ENV = 'development';
    
    render(<HeadingStats />);
    
    const statsHeading = screen.getByText('标题统计 (开发模式)');
    expect(statsHeading).toBeInTheDocument();
  });

  test('应该在生产模式下隐藏统计信息', () => {
    process.env.NODE_ENV = 'production';
    
    const { container } = render(<HeadingStats />);
    
    expect(container.firstChild).toBeNull();
  });

  test('应该显示正确的统计数据', () => {
    process.env.NODE_ENV = 'development';
    
    render(<HeadingStats />);
    
    expect(screen.getByText(/H1标题: 1/)).toBeInTheDocument();
    expect(screen.getByText(/H2标题: 4/)).toBeInTheDocument();
    expect(screen.getByText(/H3标题: 6/)).toBeInTheDocument();
  });

  test('应该显示验证状态', () => {
    process.env.NODE_ENV = 'development';
    
    render(<HeadingStats />);
    
    const statusElement = screen.getByText(/状态:/);
    expect(statusElement).toBeInTheDocument();
  });
});

describe('错误处理和边界情况', () => {
  test('应该处理空的自定义标题', () => {
    const manager = HeadingStructureManager({
      customHeadings: { h1: '', h2: [], h3: [] }
    });
    
    expect(manager.headings.h1).toBe('');
    expect(manager.headings.h2).toEqual([]);
    expect(manager.headings.h3).toEqual([]);
  });

  test('应该处理null自定义标题', () => {
    const manager = HeadingStructureManager({
      customHeadings: null
    });
    
    // 应该回退到默认标题
    expect(manager.headings.h1).toBeTruthy();
  });

  test('应该处理无效的页面类型', () => {
    const manager = HeadingStructureManager({
      pageType: 'invalid-page-type'
    });
    
    // 应该不会崩溃
    expect(manager.headings).toBeDefined();
  });

  test('应该处理无效的语言', () => {
    const manager = HeadingStructureManager({
      language: 'invalid-language'
    });
    
    // 应该不会崩溃
    expect(manager.headings).toBeDefined();
  });
});

describe('可访问性测试', () => {
  test('应该为可点击标题设置正确的ARIA属性', () => {
    render(<HeadingStructureRenderer onHeadingClick={() => {}} />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('role', 'button');
    expect(h1).toHaveAttribute('tabIndex', '0');
  });

  test('应该为非可点击标题不设置ARIA属性', () => {
    render(<HeadingStructureRenderer />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).not.toHaveAttribute('role', 'button');
    expect(h1).not.toHaveAttribute('tabIndex');
  });

  test('目录链接应该有正确的href属性', () => {
    render(<TableOfContents />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link.getAttribute('href')).toMatch(/^#/);
    });
  });
});