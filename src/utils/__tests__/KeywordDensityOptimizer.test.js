import KeywordDensityOptimizer from '../KeywordDensityOptimizer';

describe('KeywordDensityOptimizer', () => {
  let optimizer;
  
  beforeEach(() => {
    optimizer = new KeywordDensityOptimizer([
      'usb',
      'recognized',
      'usb not recognized',
      'usb device not recognized'
    ], { min: 3, max: 5 });
  });

  describe('构造函数和初始化', () => {
    test('应该正确初始化默认参数', () => {
      const defaultOptimizer = new KeywordDensityOptimizer();
      expect(defaultOptimizer.targetKeywords).toEqual([
        'usb',
        'recognized', 
        'usb recognized',
        'usb device recognized',
        'usb device not recognized',
        'usb not recognized'
      ]);
      expect(defaultOptimizer.targetDensity).toEqual({ min: 3, max: 5 });
    });

    test('应该正确设置自定义关键词和密度', () => {
      const customOptimizer = new KeywordDensityOptimizer(['test'], { min: 2, max: 4 });
      expect(customOptimizer.targetKeywords).toEqual(['test']);
      expect(customOptimizer.targetDensity).toEqual({ min: 2, max: 4 });
    });

    test('应该处理单个关键词字符串', () => {
      const singleOptimizer = new KeywordDensityOptimizer('usb');
      expect(singleOptimizer.targetKeywords).toEqual(['usb']);
    });
  });

  describe('内容清理功能', () => {
    test('应该移除HTML标签', () => {
      const content = '<p>这是一个<strong>USB设备</strong>识别问题</p>';
      const cleaned = optimizer.cleanContent(content);
      expect(cleaned).toBe('这是一个usb设备识别问题');
    });

    test('应该合并多个空格', () => {
      const content = '这是   一个    USB    设备';
      const cleaned = optimizer.cleanContent(content);
      expect(cleaned).toBe('这是 一个 usb 设备');
    });

    test('应该转换为小写', () => {
      const content = 'USB Device NOT RECOGNIZED';
      const cleaned = optimizer.cleanContent(content);
      expect(cleaned).toBe('usb device not recognized');
    });

    test('应该移除特殊字符但保留中文', () => {
      const content = 'USB设备！@#$%^&*()识别问题？';
      const cleaned = optimizer.cleanContent(content);
      expect(cleaned).toBe('usb设备 识别问题');
    });
  });

  describe('单词计数功能', () => {
    test('应该正确计算英文单词数', () => {
      const content = 'USB device not recognized problem';
      const count = optimizer.getWordCount(content);
      expect(count).toBe(5);
    });

    test('应该正确计算中文字符数', () => {
      const content = 'USB设备无法识别问题';
      const count = optimizer.getWordCount(content);
      expect(count).toBe(8); // USB(3个字母) + 5个中文字符
    });

    test('应该正确计算中英文混合内容', () => {
      const content = 'USB设备 not recognized 问题';
      const count = optimizer.getWordCount(content);
      expect(count).toBe(7); // USB(3) + 设备(2) + not(1) + recognized(1)
    });

    test('应该处理空内容', () => {
      const count = optimizer.getWordCount('');
      expect(count).toBe(0);
    });
  });

  describe('关键词计数功能', () => {
    test('应该正确计算单个关键词出现次数', () => {
      const content = 'usb device usb port usb cable';
      const counts = optimizer.countKeywords(content);
      expect(counts['usb']).toBe(3);
    });

    test('应该正确计算短语关键词出现次数', () => {
      const content = 'usb not recognized error usb not recognized again';
      const counts = optimizer.countKeywords(content);
      expect(counts['usb not recognized']).toBe(2);
    });

    test('应该区分不同的关键词短语', () => {
      const content = 'usb device not recognized but usb recognized sometimes';
      const counts = optimizer.countKeywords(content);
      expect(counts['usb device not recognized']).toBe(1);
      expect(counts['recognized']).toBe(2);
    });

    test('应该处理大小写不敏感匹配', () => {
      const content = 'USB Not Recognized and usb not recognized';
      const counts = optimizer.countKeywords(content);
      expect(counts['usb not recognized']).toBe(2);
    });
  });

  describe('密度计算功能', () => {
    test('应该正确计算关键词密度', () => {
      const keywordCounts = { 'usb': 3, 'recognized': 2 };
      const wordCount = 100;
      const densities = optimizer.calculateDensities(keywordCounts, wordCount);
      
      expect(densities['usb']).toBe(3);
      expect(densities['recognized']).toBe(2);
    });

    test('应该处理零单词数情况', () => {
      const keywordCounts = { 'usb': 3 };
      const densities = optimizer.calculateDensities(keywordCounts, 0);
      expect(densities['usb']).toBe(0);
    });

    test('应该处理缺失的关键词', () => {
      const keywordCounts = {};
      const densities = optimizer.calculateDensities(keywordCounts, 100);
      expect(densities['usb']).toBe(0);
    });
  });

  describe('内容分析功能', () => {
    test('应该返回完整的分析结果', () => {
      const content = 'USB设备无法识别是常见问题。当USB设备不被recognized时，用户需要检查USB端口。解决usb not recognized问题需要多个步骤。首先检查USB连接，然后更新驱动程序。如果USB设备仍然无法被recognized，可能需要更换USB线缆。';
      
      const analysis = optimizer.analyzeContent(content);
      
      expect(analysis).toHaveProperty('wordCount');
      expect(analysis).toHaveProperty('keywordCounts');
      expect(analysis).toHaveProperty('densities');
      expect(analysis).toHaveProperty('recommendations');
      expect(analysis).toHaveProperty('isOptimal');
      expect(analysis).toHaveProperty('overallScore');
      
      expect(analysis.wordCount).toBeGreaterThan(0);
      expect(typeof analysis.isOptimal).toBe('boolean');
      expect(typeof analysis.overallScore).toBe('number');
    });

    test('应该处理空内容', () => {
      const analysis = optimizer.analyzeContent('');
      expect(analysis.wordCount).toBe(0);
      expect(analysis.overallScore).toBe(0);
      expect(analysis.isOptimal).toBe(false);
    });

    test('应该处理null或undefined内容', () => {
      const analysisNull = optimizer.analyzeContent(null);
      const analysisUndefined = optimizer.analyzeContent(undefined);
      
      expect(analysisNull.wordCount).toBe(0);
      expect(analysisUndefined.wordCount).toBe(0);
    });
  });

  describe('建议生成功能', () => {
    test('应该为密度过低的关键词生成增加建议', () => {
      const densities = { 'usb': 1, 'recognized': 2 }; // 低于3%
      const keywordCounts = { 'usb': 1, 'recognized': 2 };
      const recommendations = optimizer.generateRecommendations(densities, keywordCounts, 100);
      
      const usbRec = recommendations.find(r => r.keyword === 'usb');
      expect(usbRec.type).toBe('increase');
      expect(usbRec.action).toContain('增加');
    });

    test('应该为密度过高的关键词生成减少建议', () => {
      const densities = { 'usb': 8, 'recognized': 6 }; // 高于5%
      const keywordCounts = { 'usb': 8, 'recognized': 6 };
      const recommendations = optimizer.generateRecommendations(densities, keywordCounts, 100);
      
      const usbRec = recommendations.find(r => r.keyword === 'usb');
      expect(usbRec.type).toBe('decrease');
      expect(usbRec.action).toContain('减少');
    });

    test('应该为最佳密度的关键词生成确认建议', () => {
      const densities = { 'usb': 4, 'recognized': 3.5 }; // 在3-5%范围内
      const keywordCounts = { 'usb': 4, 'recognized': 3.5 };
      const recommendations = optimizer.generateRecommendations(densities, keywordCounts, 100);
      
      const usbRec = recommendations.find(r => r.keyword === 'usb');
      expect(usbRec.type).toBe('optimal');
      expect(usbRec.action).toContain('最佳范围');
    });
  });

  describe('内容优化功能', () => {
    test('应该优化密度过低的内容', () => {
      const content = '这是一个简单的测试内容，没有足够的关键词。';
      const result = optimizer.optimizeContent(content);
      
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('analysis');
      expect(result).toHaveProperty('changes');
      expect(result).toHaveProperty('improvement');
      
      expect(result.content).not.toBe(content); // 内容应该被修改
      expect(result.changes.length).toBeGreaterThan(0);
    });

    test('应该处理空内容', () => {
      const result = optimizer.optimizeContent('');
      expect(result.content).toBe('');
      expect(result.changes).toEqual([]);
    });

    test('应该处理null内容', () => {
      const result = optimizer.optimizeContent(null);
      expect(result.content).toBe('');
      expect(result.changes).toEqual([]);
    });
  });

  describe('最佳密度检查', () => {
    test('应该正确识别最佳密度', () => {
      const optimalDensities = { 'usb': 4, 'recognized': 3.5, 'usb not recognized': 4.5 };
      expect(optimizer.isOptimalDensity(optimalDensities)).toBe(true);
    });

    test('应该正确识别非最佳密度', () => {
      const nonOptimalDensities = { 'usb': 2, 'recognized': 6, 'usb not recognized': 4 };
      expect(optimizer.isOptimalDensity(nonOptimalDensities)).toBe(false);
    });
  });

  describe('评分计算', () => {
    test('应该为最佳密度给出高分', () => {
      const optimalDensities = { 'usb': 4, 'recognized': 3.5, 'usb not recognized': 4.5, 'usb device not recognized': 3 };
      const score = optimizer.calculateOverallScore(optimalDensities);
      expect(score).toBe(100);
    });

    test('应该为非最佳密度给出较低分数', () => {
      const nonOptimalDensities = { 'usb': 1, 'recognized': 8, 'usb not recognized': 2, 'usb device not recognized': 6 };
      const score = optimizer.calculateOverallScore(nonOptimalDensities);
      expect(score).toBeLessThan(100);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    test('应该处理空密度对象', () => {
      const score = optimizer.calculateOverallScore({});
      expect(score).toBe(0);
    });
  });

  describe('改进计算', () => {
    test('应该正确计算改进程度', () => {
      const beforeAnalysis = {
        overallScore: 60,
        densities: { 'usb': 2, 'recognized': 1 }
      };
      
      const afterAnalysis = {
        overallScore: 85,
        densities: { 'usb': 4, 'recognized': 3.5 }
      };
      
      const improvement = optimizer.calculateImprovement(beforeAnalysis, afterAnalysis);
      
      expect(improvement.scoreImprovement).toBe(25);
      expect(improvement.overallImprovement).toBe('improved');
      expect(improvement.improvedKeywords.length).toBeGreaterThan(0);
    });

    test('应该识别恶化的情况', () => {
      const beforeAnalysis = {
        overallScore: 85,
        densities: { 'usb': 4, 'recognized': 3.5 }
      };
      
      const afterAnalysis = {
        overallScore: 60,
        densities: { 'usb': 2, 'recognized': 1 }
      };
      
      const improvement = optimizer.calculateImprovement(beforeAnalysis, afterAnalysis);
      
      expect(improvement.scoreImprovement).toBe(-25);
      expect(improvement.overallImprovement).toBe('worsened');
    });
  });

  describe('关键词替换功能', () => {
    test('应该提供合适的关键词替换', () => {
      const replacement = optimizer.getKeywordReplacement('usb');
      expect(typeof replacement).toBe('string');
      expect(replacement.length).toBeGreaterThan(0);
    });

    test('应该为未知关键词提供默认替换', () => {
      const replacement = optimizer.getKeywordReplacement('unknown_keyword');
      expect(replacement).toBe('设备');
    });
  });

  describe('插入模式功能', () => {
    test('应该为已知关键词提供插入模式', () => {
      const patterns = optimizer.getInsertionPatterns('usb');
      expect(Array.isArray(patterns)).toBe(true);
      expect(patterns.length).toBeGreaterThan(0);
      
      patterns.forEach(pattern => {
        expect(pattern).toHaveProperty('text');
        expect(pattern).toHaveProperty('reason');
        expect(typeof pattern.text).toBe('string');
        expect(typeof pattern.reason).toBe('string');
      });
    });

    test('应该为未知关键词提供通用插入模式', () => {
      const patterns = optimizer.getInsertionPatterns('unknown_keyword');
      expect(Array.isArray(patterns)).toBe(true);
      expect(patterns.length).toBeGreaterThan(0);
    });
  });
});