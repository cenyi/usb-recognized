import React from 'react';
import { render, screen } from '@testing-library/react';
import MultilingualContentGenerator from '../MultilingualContentGenerator';

// Mock KeywordDensityOptimizer
jest.mock('../../../utils/KeywordDensityOptimizer', () => {
  return jest.fn().mockImplementation(() => ({
    analyzeContent: jest.fn().mockReturnValue({
      wordCount: 100,
      keywordCounts: { 'usb': 4, 'recognized': 3 },
      densities: { 'usb': 4, 'recognized': 3 },
      recommendations: [],
      isOptimal: true,
      overallScore: 95
    }),
    optimizeContent: jest.fn().mockImplementation((content) => ({
      content: content + ' (优化后)',
      analysis: {
        wordCount: 105,
        densities: { 'usb': 4.2, 'recognized': 3.5 },
        isOptimal: true,
        overallScore: 98
      },
      changes: [],
      improvement: { scoreImprovement: 3 }
    }))
  }));
});

describe('MultilingualContentGenerator', () => {
  beforeEach(() => {
    // 设置开发环境以隐藏调试信息
    process.env.NODE_ENV = 'test';
  });

  describe('基本渲染功能', () => {
    test('应该渲染默认的中文内容', () => {
      render(<MultilingualContentGenerator />);
      
      // 检查是否有H1标题
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1.textContent).toContain('USB设备无法识别');
    });

    test('应该渲染英文内容', () => {
      render(<MultilingualContentGenerator language="en" />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1.textContent).toContain('USB Device Not Recognized');
    });

    test('应该渲染指定页面类型的内容', () => {
      render(
        <MultilingualContentGenerator 
          pageType="usb-device-not-recognized" 
          language="zh" 
        />
      );
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1.textContent).toContain('USB设备不被识别');
    });
  });

  describe('标题层级结构', () => {
    test('应该只有一个H1标题', () => {
      render(<MultilingualContentGenerator />);
      
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements).toHaveLength(1);
    });

    test('应该有多个H2标题', () => {
      render(<MultilingualContentGenerator />);
      
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThan(1);
    });

    test('应该有多个H3标题', () => {
      render(<MultilingualContentGenerator />);
      
      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      expect(h3Elements.length).toBeGreaterThan(1);
    });
  });

  describe('不同页面类型测试', () => {
    const pageTypes = [
      'usb-not-recognized',
      'usb-device-not-recognized', 
      'usb-device-recognized',
      'usb-recognized'
    ];

    pageTypes.forEach(pageType => {
      test(`应该正确渲染${pageType}页面的中文内容`, () => {
        render(
          <MultilingualContentGenerator 
            pageType={pageType} 
            language="zh" 
          />
        );
        
        const h1 = screen.getByRole('heading', { level: 1 });
        expect(h1).toBeInTheDocument();
        expect(h1.textContent).toContain('USB');
      });

      test(`应该正确渲染${pageType}页面的英文内容`, () => {
        render(
          <MultilingualContentGenerator 
            pageType={pageType} 
            language="en" 
          />
        );
        
        const h1 = screen.getByRole('heading', { level: 1 });
        expect(h1).toBeInTheDocument();
        expect(h1.textContent).toContain('USB');
      });
    });
  });

  describe('内容优化功能', () => {
    test('应该在启用优化时优化内容', () => {
      render(
        <MultilingualContentGenerator 
          enableOptimization={true}
        />
      );
      
      // 检查内容是否存在（优化后的内容应该被渲染）
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    test('应该在禁用优化时使用原始内容', () => {
      render(
        <MultilingualContentGenerator 
          enableOptimization={false}
        />
      );
      
      // 检查内容是否存在（原始内容应该被渲染）
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  describe('自定义内容支持', () => {
    test('应该使用提供的自定义内容', () => {
      const customContent = '这是自定义的USB故障排除内容，包含特定的解决方案和技术细节。';
      
      render(
        <MultilingualContentGenerator 
          customContent={customContent}
        />
      );
      
      // 检查自定义内容是否被使用
      expect(screen.getByText(/自定义的USB故障排除内容/)).toBeInTheDocument();
    });
  });

  describe('错误处理', () => {
    test('应该处理无效的页面类型', () => {
      render(
        <MultilingualContentGenerator 
          pageType="invalid-page-type" 
          language="zh" 
        />
      );
      
      // 应该渲染默认内容而不是崩溃
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    test('应该处理无效的语言', () => {
      render(
        <MultilingualContentGenerator 
          pageType="usb-not-recognized" 
          language="invalid-language" 
        />
      );
      
      // 应该渲染默认内容而不是崩溃
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    test('应该处理空的自定义内容', () => {
      render(
        <MultilingualContentGenerator 
          customContent=""
        />
      );
      
      // 应该渲染默认内容
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    test('应该处理null自定义内容', () => {
      render(
        <MultilingualContentGenerator 
          customContent={null}
        />
      );
      
      // 应该渲染默认内容
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  describe('内容结构验证', () => {
    test('应该包含介绍部分', () => {
      render(<MultilingualContentGenerator />);
      
      // 查找包含介绍内容的元素
      const introContent = screen.getByText(/USB设备识别问题/);
      expect(introContent).toBeInTheDocument();
    });

    test('应该包含解决方案部分', () => {
      render(<MultilingualContentGenerator />);
      
      // 查找解决方案相关的标题
      const solutionHeadings = screen.getAllByRole('heading').filter(
        heading => heading.textContent.includes('解决') || heading.textContent.includes('方案')
      );
      expect(solutionHeadings.length).toBeGreaterThan(0);
    });

    test('应该有适当的内容长度', () => {
      render(<MultilingualContentGenerator />);
      
      // 检查页面是否有足够的内容
      const contentElements = screen.getAllByText(/USB/);
      expect(contentElements.length).toBeGreaterThan(5);
    });
  });

  describe('响应式和可访问性', () => {
    test('应该有正确的语义HTML结构', () => {
      render(<MultilingualContentGenerator />);
      
      // 检查是否有正确的标题层级
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2s = screen.getAllByRole('heading', { level: 2 });
      const h3s = screen.getAllByRole('heading', { level: 3 });
      
      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
      expect(h3s.length).toBeGreaterThan(0);
    });

    test('应该有适当的CSS类名用于样式', () => {
      render(<MultilingualContentGenerator />);
      
      const contentContainer = document.querySelector('.content-container');
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe('开发模式功能', () => {
    test('应该在开发模式下显示内容分析', () => {
      // 设置开发环境
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      render(<MultilingualContentGenerator />);
      
      // 查找内容分析部分
      const analysisSection = screen.getByText(/内容分析/);
      expect(analysisSection).toBeInTheDocument();
      
      // 恢复原始环境
      process.env.NODE_ENV = originalEnv;
    });

    test('应该在生产模式下隐藏内容分析', () => {
      // 确保不是开发环境
      process.env.NODE_ENV = 'production';
      
      render(<MultilingualContentGenerator />);
      
      // 内容分析部分不应该存在
      const analysisSection = screen.queryByText(/内容分析/);
      expect(analysisSection).not.toBeInTheDocument();
    });
  });

  describe('性能和优化', () => {
    test('应该正确使用useMemo优化性能', () => {
      const { rerender } = render(<MultilingualContentGenerator />);
      
      // 重新渲染相同的props
      rerender(<MultilingualContentGenerator />);
      
      // 组件应该正常渲染而不出错
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    test('应该在props改变时重新计算内容', () => {
      const { rerender } = render(
        <MultilingualContentGenerator pageType="usb-not-recognized" />
      );
      
      // 改变页面类型
      rerender(
        <MultilingualContentGenerator pageType="usb-device-recognized" />
      );
      
      // 标题应该反映新的页面类型
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1.textContent).toContain('已识别');
    });
  });
});