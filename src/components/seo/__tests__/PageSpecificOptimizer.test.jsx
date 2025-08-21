import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PageSpecificOptimizer, { OptimizationStatsDisplay } from '../PageSpecificOptimizer';

// Mock dependencies
jest.mock('../../../utils/KeywordDensityOptimizer', () => {
  return jest.fn().mockImplementation(() => ({
    analyzeContent: jest.fn().mockReturnValue({
      wordCount: 500,
      keywordCounts: { 'usb不被识别': 5, 'usb设备不被识别': 3 },
      densities: { 'usb不被识别': 4.2, 'usb设备不被识别': 2.8 },
      recommendations: [],
      isOptimal: true,
      overallScore: 85
    }),
    optimizeContent: jest.fn().mockImplementation((content) => ({
      content: content + ' (优化后)',
      analysis: {
        wordCount: 520,
        densities: { 'usb不被识别': 4.5, 'usb设备不被识别': 3.2 },
        overallScore: 90
      },
      changes: [{ type: 'addition', description: '添加关键词' }],
      improvement: { scoreImprovement: 5 }
    }))
  }));
});

jest.mock('../../../data/pageKeywordConfig', () => ({
  getPageKeywordConfig: jest.fn().mockReturnValue({
    pageInfo: {
      title: 'USB设备无法识别问题解决',
      category: 'troubleshooting'
    },
    keywords: {
      primary: {
        zh: 'usb不被识别',
        en: 'usb not recognized',
        density: { min: 4, max: 6 },
        importance: 10
      },
      secondary: [
        {
          zh: 'usb设备不被识别',
          en: 'usb device not recognized',
          density: { min: 2, max: 4 },
          importance: 8
        }
      ],
      longTail: []
    },
    contentStrategy: {
      contentLength: { min: 2000, max: 4000 }
    }
  }),
  getPageOptimizationStrategy: jest.fn().mockReturnValue({
    titleOptimization: {
      includeKeywords: ['usb不被识别'],
      maxLength: 60
    },
    contentOptimization: {
      keywordPlacement: {
        firstParagraph: true,
        headings: true
      }
    }
  }),
  generateKeywordList: jest.fn().mockReturnValue([
    {
      keyword: 'usb不被识别',
      type: 'primary',
      density: { min: 4, max: 6 },
      importance: 10
    },
    {
      keyword: 'usb设备不被识别',
      type: 'secondary',
      density: { min: 2, max: 4 },
      importance: 8
    }
  ]),
  getTargetDensityRange: jest.fn().mockReturnValue({ min: 3, max: 5 }),
  validateKeywordConfig: jest.fn().mockReturnValue({
    isValid: true,
    errors: [],
    warnings: []
  })
}));

describe('PageSpecificOptimizer', () => {
  const defaultProps = {
    pageType: 'usb-not-recognized',
    language: 'zh',
    content: '这是一个关于USB不被识别问题的测试内容。当USB设备不被识别时，用户需要进行故障排除。',
    enableRealTimeOptimization: false,
    showOptimizationStats: false
  };

  describe('基本功能测试', () => {
    test('应该返回正确的优化器对象', () => {
      const optimizer = PageSpecificOptimizer(defaultProps);
      
      expect(optimizer).toHaveProperty('analyzeContent');
      expect(optimizer).toHaveProperty('optimizeContent');
      expect(optimizer).toHaveProperty('optimizationResults');
      expect(optimizer).toHaveProperty('isOptimizing');
      expect(optimizer).toHaveProperty('pageConfig');
      expect(optimizer).toHaveProperty('keywordList');
    });

    test('应该正确分析内容', () => {
      const optimizer = PageSpecificOptimizer(defaultProps);
      const analysis = optimizer.analyzeContent();
      
      expect(analysis).toBeTruthy();
      expect(analysis).toHaveProperty('wordCount');
      expect(analysis).toHaveProperty('densities');
      expect(analysis).toHaveProperty('pageType');
      expect(analysis).toHaveProperty('language');
      expect(analysis).toHaveProperty('keywordBreakdown');
      expect(analysis).toHaveProperty('optimizationScore');
    });

    test('应该处理空内容', () => {
      const optimizer = PageSpecificOptimizer({
        ...defaultProps,
        content: ''
      });
      
      const analysis = optimizer.analyzeContent();
      expect(analysis).toBeNull();
    });
  });

  describe('关键词分析功能', () => {
    test('应该按类型分析关键词', () => {
      const optimizer = PageSpecificOptimizer(defaultProps);
      const analysis = optimizer.analyzeContent();
      
      expect(analysis.keywordBreakdown).toHaveProperty('primary');
      expect(analysis.keywordBreakdown).toHaveProperty('secondary');
      expect(analysis.keywordBreakdown).toHaveProperty('longTail');
      
      expect(Array.isArray(analysis.keywordBreakdown.primary)).toBe(true);
      expect(Array.isArray(analysis.keywordBreakdown.secondary)).toBe(true);
    });

    test('应该正确计算关键词状态', () => {
      const optimizer = PageSpecificOptimizer(defaultProps);
      const analysis = optimizer.analyzeContent();
      
      const primaryKeywords = analysis.keywordBreakdown.primary;
      expect(primaryKeywords.length).toBeGreaterThan(0);
      
      const firstKeyword = primaryKeywords[0];
      expect(firstKeyword).toHaveProperty('keyword');
      expect(firstKeyword).toHaveProperty('density');
      expect(firstKeyword).toHaveProperty('status');
      expect(['optimal', 'low', 'high']).toContain(firstKeyword.status);
    });
  });

  describe('优化评分功能', () => {
    test('应该计算正确的优化评分', () => {
      const optimizer = PageSpecificOptimizer(defaultProps);
      const analysis = optimizer.analyzeContent();
      
      expect(typeof analysis.optimizationScore).toBe('number');
      expect(analysis.optimizationScore).toBeGreaterThanOrEqual(0);
      expect(analysis.optimizationScore).toBeLessThanOrEqual(100);
    });

    test('应该根据关键词重要性加权评分', () => {
      const optimizer = PageSpecificOptimizer(defaultProps);
      const mockAnalysis = {
        densities: { 'usb不被识别': 4.5, 'usb设备不被识别': 3.2 }
      };
      
      const score = optimizer.calculateOptimizationScore(mockAnalysis);
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThan(0);
    });
  });

  describe('内容优化功能', () => {
    test('应该执行内容优化', async () => {
      const mockOnComplete = jest.fn();
      const optimizer = PageSpecificOptimizer({
        ...defaultProps,
        onOptimizationComplete: mockOnComplete
      });
      
      const result = await optimizer.optimizeContent();
      
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('analysis');
      expect(result).toHaveProperty('changes');
      expect(mockOnComplete).toHaveBeenCalledWith(result);
    });

    test('应该处理优化过程中的错误', async () => {
      // Mock optimizer to throw error
      const optimizer = PageSpecificOptimizer({
        ...defaultProps,
        content: null // 这会导致错误
      });
      
      const result = await optimizer.optimizeContent();
      expect(result).toBeNull();
    });

    test('应该防止并发优化', async () => {
      const optimizer = PageSpecificOptimizer(defaultProps);
      
      // 启动第一个优化
      const promise1 = optimizer.optimizeContent();
      
      // 立即启动第二个优化（应该被忽略）
      const promise2 = optimizer.optimizeContent();
      
      const [result1, result2] = await Promise.all([promise1, promise2]);
      
      expect(result1).toBeTruthy();
      expect(result2).toBeNull(); // 第二个应该被忽略
    });
  });

  describe('页面特定优化', () => {
    test('应该为usb-not-recognized页面生成特定建议', () => {
      const optimizer = PageSpecificOptimizer({
        ...defaultProps,
        pageType: 'usb-not-recognized'
      });
      
      const analysis = optimizer.analyzeContent();
      expect(analysis.recommendations).toBeDefined();
      expect(Array.isArray(analysis.recommendations)).toBe(true);
    });

    test('应该为usb-device-not-recognized页面生成技术建议', () => {
      const optimizer = PageSpecificOptimizer({
        ...defaultProps,
        pageType: 'usb-device-not-recognized'
      });
      
      const analysis = optimizer.analyzeContent();
      expect(analysis.recommendations).toBeDefined();
    });

    test('应该为usb-device-recognized页面生成功能性建议', () => {
      const optimizer = PageSpecificOptimizer({
        ...defaultProps,
        pageType: 'usb-device-recognized'
      });
      
      const analysis = optimizer.analyzeContent();
      expect(analysis.recommendations).toBeDefined();
    });

    test('应该为usb-recognized页面生成技术深度建议', () => {
      const optimizer = PageSpecificOptimizer({
        ...defaultProps,
        pageType: 'usb-recognized'
      });
      
      const analysis = optimizer.analyzeContent();
      expect(analysis.recommendations).toBeDefined();
    });
  });

  describe('实时优化功能', () => {
    test('应该在启用实时优化时自动分析内容', async () => {
      const optimizer = PageSpecificOptimizer({
        ...defaultProps,
        enableRealTimeOptimization: true
      });
      
      // 等待实时优化完成
      await waitFor(() => {
        expect(optimizer.optimizationResults).toBeTruthy();
      }, { timeout: 2000 });
    });

    test('应该在禁用实时优化时不自动分析', () => {
      const optimizer = PageSpecificOptimizer({
        ...defaultProps,
        enableRealTimeOptimization: false
      });
      
      // 初始状态不应该有优化结果
      expect(optimizer.optimizationResults).toBeNull();
    });
  });

  describe('配置验证功能', () => {
    test('应该验证关键词配置', () => {
      const optimizer = PageSpecificOptimizer(defaultProps);
      const validation = optimizer.validateConfiguration();
      
      expect(validation).toHaveProperty('isValid');
      expect(validation).toHaveProperty('errors');
      expect(validation).toHaveProperty('warnings');
    });
  });

  describe('历史记录功能', () => {
    test('应该记录优化历史', async () => {
      const optimizer = PageSpecificOptimizer(defaultProps);
      
      await optimizer.optimizeContent();
      
      expect(optimizer.optimizationHistory).toBeDefined();
      expect(Array.isArray(optimizer.optimizationHistory)).toBe(true);
      expect(optimizer.optimizationHistory.length).toBeGreaterThan(0);
    });

    test('应该限制历史记录数量', async () => {
      const optimizer = PageSpecificOptimizer(defaultProps);
      
      // 执行多次优化
      for (let i = 0; i < 15; i++) {
        await optimizer.optimizeContent();
      }
      
      // 历史记录应该被限制在10条以内
      expect(optimizer.optimizationHistory.length).toBeLessThanOrEqual(10);
    });
  });
});

describe('OptimizationStatsDisplay', () => {
  test('应该在showOptimizationStats为true时渲染统计信息', () => {
    const mockOptimizer = {
      renderOptimizationStats: jest.fn().mockReturnValue(
        <div data-testid="optimization-stats">优化统计</div>
      )
    };
    
    // Mock PageSpecificOptimizer to return our mock
    jest.doMock('../PageSpecificOptimizer', () => ({
      __esModule: true,
      default: jest.fn().mockReturnValue(mockOptimizer)
    }));
    
    render(<OptimizationStatsDisplay showOptimizationStats={true} />);
    
    expect(mockOptimizer.renderOptimizationStats).toHaveBeenCalled();
  });

  test('应该在showOptimizationStats为false时不渲染统计信息', () => {
    const { container } = render(
      <OptimizationStatsDisplay showOptimizationStats={false} />
    );
    
    expect(container.firstChild).toBeNull();
  });
});

describe('错误处理和边界情况', () => {
  test('应该处理无效的页面类型', () => {
    const optimizer = PageSpecificOptimizer({
      ...defaultProps,
      pageType: 'invalid-page-type'
    });
    
    expect(optimizer.pageConfig).toBeDefined();
    expect(optimizer.keywordList).toBeDefined();
  });

  test('应该处理无效的语言', () => {
    const optimizer = PageSpecificOptimizer({
      ...defaultProps,
      language: 'invalid-language'
    });
    
    expect(optimizer.keywordList).toBeDefined();
  });

  test('应该处理null内容', () => {
    const optimizer = PageSpecificOptimizer({
      ...defaultProps,
      content: null
    });
    
    const analysis = optimizer.analyzeContent();
    expect(analysis).toBeNull();
  });

  test('应该处理undefined内容', () => {
    const optimizer = PageSpecificOptimizer({
      ...defaultProps,
      content: undefined
    });
    
    const analysis = optimizer.analyzeContent();
    expect(analysis).toBeNull();
  });
});

describe('性能测试', () => {
  test('应该在合理时间内完成内容分析', () => {
    const optimizer = PageSpecificOptimizer({
      ...defaultProps,
      content: '这是一个很长的测试内容'.repeat(100)
    });
    
    const startTime = Date.now();
    const analysis = optimizer.analyzeContent();
    const endTime = Date.now();
    
    expect(analysis).toBeTruthy();
    expect(endTime - startTime).toBeLessThan(1000); // 应该在1秒内完成
  });

  test('应该正确处理大量关键词', () => {
    const optimizer = PageSpecificOptimizer(defaultProps);
    
    // 模拟大量关键词的分析
    const mockAnalysis = {
      densities: {}
    };
    
    // 添加100个关键词
    for (let i = 0; i < 100; i++) {
      mockAnalysis.densities[`keyword${i}`] = Math.random() * 10;
    }
    
    const score = optimizer.calculateOptimizationScore(mockAnalysis);
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});