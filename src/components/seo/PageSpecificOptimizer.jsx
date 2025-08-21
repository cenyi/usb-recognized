import React, { useMemo, useCallback, useEffect, useState } from 'react';
import KeywordDensityOptimizer from '../../utils/KeywordDensityOptimizer';
import KeywordDensityValidator from '../../utils/KeywordDensityValidator';
import { 
  getPageKeywordConfig, 
  getPageOptimizationStrategy,
  generateKeywordList,
  getTargetDensityRange,
  validateKeywordConfig
} from '../../data/pageKeywordConfig';

/**
 * 页面特定关键词优化组件
 * 根据不同页面类型实现特定的关键词优化策略
 */
const PageSpecificOptimizer = ({
  pageType = 'usb-not-recognized',
  language = 'zh',
  content = '',
  onOptimizationComplete = null,
  enableRealTimeOptimization = true,
  showOptimizationStats = false
}) => {
  const [optimizationResults, setOptimizationResults] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationHistory, setOptimizationHistory] = useState([]);
  const [keywordValidation, setKeywordValidation] = useState(null);

  // 获取页面配置
  const pageConfig = useMemo(() => getPageKeywordConfig(pageType), [pageType]);
  const optimizationStrategy = useMemo(() => getPageOptimizationStrategy(pageType), [pageType]);
  const keywordList = useMemo(() => generateKeywordList(pageType, language), [pageType, language]);

  // 创建关键词优化器
  const optimizer = useMemo(() => {
    const keywords = keywordList.map(item => item.keyword);
    const targetDensity = getTargetDensityRange(pageType, 'primary');
    
    return new KeywordDensityOptimizer(keywords, targetDensity);
  }, [keywordList, pageType]);

  // 创建关键词密度验证器
  const validator = useMemo(() => new KeywordDensityValidator(), []);

  // 分析当前内容
  const analyzeContent = useCallback((contentToAnalyze = content) => {
    if (!contentToAnalyze) return null;
    
    try {
      const analysis = optimizer.analyzeContent(contentToAnalyze);
      
      // 使用KeywordDensityValidator验证主关键词密度
      const validation = validator.validatePageKeywordDensity(pageType, contentToAnalyze);
      
      // 添加页面特定的分析信息
      const enhancedAnalysis = {
        ...analysis,
        pageType,
        language,
        keywordBreakdown: analyzeKeywordsByType(analysis, keywordList),
        optimizationScore: calculateOptimizationScore(analysis, keywordList),
        recommendations: generatePageSpecificRecommendations(analysis, keywordList, optimizationStrategy),
        primaryKeywordValidation: validation // 添加主关键词验证结果
      };
      
      // 更新验证状态
      setKeywordValidation(validation);
      
      return enhancedAnalysis;
    } catch (error) {
      console.error('Content analysis failed:', error);
      return null;
    }
  }, [content, optimizer, validator, pageType, language, keywordList, optimizationStrategy]);

  // 按关键词类型分析
  const analyzeKeywordsByType = useCallback((analysis, keywordList) => {
    const breakdown = {
      primary: [],
      secondary: [],
      longTail: []
    };
    
    keywordList.forEach(item => {
      const density = analysis.densities[item.keyword] || 0;
      const count = analysis.keywordCounts[item.keyword] || 0;
      const targetRange = getTargetDensityRange(pageType, item.type);
      
      breakdown[item.type].push({
        keyword: item.keyword,
        density,
        count,
        targetRange,
        importance: item.importance,
        status: density >= targetRange.min && density <= targetRange.max ? 'optimal' : 
                density < targetRange.min ? 'low' : 'high'
      });
    });
    
    return breakdown;
  }, [pageType]);

  // 计算优化评分
  const calculateOptimizationScore = useCallback((analysis, keywordList) => {
    let totalScore = 0;
    let totalWeight = 0;
    
    keywordList.forEach(item => {
      const density = analysis.densities[item.keyword] || 0;
      const targetRange = getTargetDensityRange(pageType, item.type);
      const weight = item.importance / 10; // 重要性权重
      
      let score = 0;
      if (density >= targetRange.min && density <= targetRange.max) {
        score = 100;
      } else if (density < targetRange.min) {
        score = Math.max(0, (density / targetRange.min) * 100);
      } else {
        const excess = density - targetRange.max;
        score = Math.max(0, 100 - (excess * 10));
      }
      
      totalScore += score * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }, [pageType]);

  // 生成页面特定的优化建议
  const generatePageSpecificRecommendations = useCallback((analysis, keywordList, strategy) => {
    const recommendations = [];
    
    // 基于页面类型的特定建议
    switch (pageType) {
      case 'usb-not-recognized':
        recommendations.push(...generateUSBNotRecognizedRecommendations(analysis, keywordList));
        break;
      case 'usb-device-not-recognized':
        recommendations.push(...generateUSBDeviceNotRecognizedRecommendations(analysis, keywordList));
        break;
      case 'usb-device-recognized':
        recommendations.push(...generateUSBDeviceRecognizedRecommendations(analysis, keywordList));
        break;
      case 'usb-recognized':
        recommendations.push(...generateUSBRecognizedRecommendations(analysis, keywordList));
        break;
      default:
        recommendations.push(...generateGenericRecommendations(analysis, keywordList));
    }
    
    // 添加通用优化建议
    recommendations.push(...generateContentStructureRecommendations(analysis, strategy));
    
    return recommendations.slice(0, 10); // 限制建议数量
  }, [pageType]);

  // USB不被识别页面的特定建议
  const generateUSBNotRecognizedRecommendations = (analysis, keywordList) => {
    const recommendations = [];
    const primaryKeyword = keywordList.find(k => k.type === 'primary');
    
    if (primaryKeyword && analysis.densities[primaryKeyword.keyword] < 4) {
      recommendations.push({
        type: 'keyword_density',
        priority: 'high',
        message: `增加"${primaryKeyword.keyword}"的使用频率，特别是在故障排除步骤中`,
        action: 'increase_primary_keyword',
        target: primaryKeyword.keyword
      });
    }
    
    // 检查是否包含解决方案相关内容
    const solutionKeywords = ['解决方案', 'solution', '修复', 'fix', '故障排除', 'troubleshooting'];
    const hasSolutionContent = solutionKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (!hasSolutionContent) {
      recommendations.push({
        type: 'content_structure',
        priority: 'high',
        message: '添加更多具体的解决方案和故障排除步骤',
        action: 'add_solution_content',
        suggestions: ['设备管理器修复步骤', 'USB驱动程序更新', '硬件检查方法']
      });
    }
    
    return recommendations;
  };

  // USB设备不被识别页面的特定建议
  const generateUSBDeviceNotRecognizedRecommendations = (analysis, keywordList) => {
    const recommendations = [];
    
    // 检查技术术语的使用
    const technicalTerms = ['设备枚举', 'device enumeration', '设备描述符', 'device descriptor'];
    const hasTechnicalContent = technicalTerms.some(term => 
      content.toLowerCase().includes(term.toLowerCase())
    );
    
    if (!hasTechnicalContent) {
      recommendations.push({
        type: 'technical_content',
        priority: 'medium',
        message: '添加更多技术细节，如设备枚举过程和设备描述符相关内容',
        action: 'add_technical_details',
        suggestions: ['USB协议解释', '设备枚举流程', '驱动程序加载过程']
      });
    }
    
    return recommendations;
  };

  // USB设备已识别页面的特定建议
  const generateUSBDeviceRecognizedRecommendations = (analysis, keywordList) => {
    const recommendations = [];
    
    // 检查功能性问题的覆盖
    const functionalKeywords = ['权限', 'permission', '配置', 'configuration', '驱动程序', 'driver'];
    const functionalCoverage = functionalKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    
    if (functionalCoverage < 3) {
      recommendations.push({
        type: 'functional_content',
        priority: 'medium',
        message: '增加设备功能性问题的解决方案，如权限设置和驱动程序配置',
        action: 'add_functional_solutions',
        suggestions: ['权限设置指南', '驱动程序匹配', '设备配置检查']
      });
    }
    
    return recommendations;
  };

  // USB识别页面的特定建议
  const generateUSBRecognizedRecommendations = (analysis, keywordList) => {
    const recommendations = [];
    
    // 检查技术深度
    const advancedTerms = ['协议分析', 'protocol analysis', '性能优化', 'performance optimization'];
    const hasAdvancedContent = advancedTerms.some(term => 
      content.toLowerCase().includes(term.toLowerCase())
    );
    
    if (!hasAdvancedContent) {
      recommendations.push({
        type: 'technical_depth',
        priority: 'low',
        message: '考虑添加更深入的技术分析和性能优化内容',
        action: 'add_advanced_content',
        suggestions: ['USB协议深度分析', '性能基准测试', '系统调优技巧']
      });
    }
    
    return recommendations;
  };

  // 通用建议生成
  const generateGenericRecommendations = (analysis, keywordList) => {
    const recommendations = [];
    
    keywordList.forEach(item => {
      const density = analysis.densities[item.keyword] || 0;
      const targetRange = getTargetDensityRange(pageType, item.type);
      
      if (density < targetRange.min) {
        recommendations.push({
          type: 'keyword_density',
          priority: item.type === 'primary' ? 'high' : 'medium',
          message: `增加"${item.keyword}"的使用频率`,
          action: 'increase_keyword',
          target: item.keyword,
          currentDensity: density,
          targetDensity: targetRange.min
        });
      } else if (density > targetRange.max) {
        recommendations.push({
          type: 'keyword_density',
          priority: 'medium',
          message: `减少"${item.keyword}"的使用以避免过度优化`,
          action: 'decrease_keyword',
          target: item.keyword,
          currentDensity: density,
          targetDensity: targetRange.max
        });
      }
    });
    
    return recommendations;
  };

  // 内容结构建议
  const generateContentStructureRecommendations = (analysis, strategy) => {
    const recommendations = [];
    
    // 检查内容长度
    const wordCount = analysis.wordCount;
    const targetLength = pageConfig.contentStrategy?.contentLength;
    
    if (targetLength && wordCount < targetLength.min) {
      recommendations.push({
        type: 'content_length',
        priority: 'medium',
        message: `内容长度偏短，建议增加到${targetLength.min}字以上`,
        action: 'increase_content_length',
        currentLength: wordCount,
        targetLength: targetLength.min
      });
    }
    
    return recommendations;
  };

  // 执行内容优化
  const optimizeContent = useCallback(async (contentToOptimize = content) => {
    if (!contentToOptimize || isOptimizing) return null;
    
    setIsOptimizing(true);
    
    try {
      // 执行基础优化
      const basicOptimization = optimizer.optimizeContent(contentToOptimize);
      
      // 应用页面特定优化
      const pageSpecificOptimization = await applyPageSpecificOptimization(
        basicOptimization.content, 
        optimizationStrategy
      );
      
      const finalResult = {
        ...basicOptimization,
        content: pageSpecificOptimization.content,
        pageSpecificChanges: pageSpecificOptimization.changes,
        analysis: analyzeContent(pageSpecificOptimization.content),
        timestamp: new Date().toISOString()
      };
      
      setOptimizationResults(finalResult);
      
      // 更新历史记录
      setOptimizationHistory(prev => [
        ...prev.slice(-9), // 保留最近10次记录
        {
          timestamp: finalResult.timestamp,
          score: finalResult.analysis?.optimizationScore || 0,
          changes: finalResult.changes?.length || 0
        }
      ]);
      
      if (onOptimizationComplete) {
        onOptimizationComplete(finalResult);
      }
      
      return finalResult;
    } catch (error) {
      console.error('Content optimization failed:', error);
      return null;
    } finally {
      setIsOptimizing(false);
    }
  }, [content, optimizer, optimizationStrategy, analyzeContent, isOptimizing, onOptimizationComplete]);

  // 应用页面特定优化
  const applyPageSpecificOptimization = async (content, strategy) => {
    const changes = [];
    let optimizedContent = content;
    
    // 根据页面类型应用特定优化
    switch (pageType) {
      case 'usb-not-recognized':
        const usbNotRecognizedResult = await optimizeForUSBNotRecognized(optimizedContent, strategy);
        optimizedContent = usbNotRecognizedResult.content;
        changes.push(...usbNotRecognizedResult.changes);
        break;
        
      case 'usb-device-not-recognized':
        const deviceNotRecognizedResult = await optimizeForUSBDeviceNotRecognized(optimizedContent, strategy);
        optimizedContent = deviceNotRecognizedResult.content;
        changes.push(...deviceNotRecognizedResult.changes);
        break;
        
      // 其他页面类型的优化...
    }
    
    return { content: optimizedContent, changes };
  };

  // USB不被识别页面的特定优化
  const optimizeForUSBNotRecognized = async (content, strategy) => {
    const changes = [];
    let optimizedContent = content;
    
    // 确保包含关键解决步骤
    const essentialSteps = [
      '检查USB端口',
      '更新驱动程序',
      '重启计算机',
      '检查设备管理器'
    ];
    
    essentialSteps.forEach(step => {
      if (!optimizedContent.includes(step)) {
        const insertion = `\n\n**${step}**: 这是解决USB不被识别问题的重要步骤之一。`;
        optimizedContent += insertion;
        changes.push({
          type: 'content_addition',
          description: `添加必要步骤: ${step}`,
          content: insertion
        });
      }
    });
    
    return { content: optimizedContent, changes };
  };

  // USB设备不被识别页面的特定优化
  const optimizeForUSBDeviceNotRecognized = async (content, strategy) => {
    const changes = [];
    let optimizedContent = content;
    
    // 添加技术术语解释
    const technicalTerms = {
      '设备枚举': 'USB设备连接时系统识别设备的过程',
      '设备描述符': 'USB设备向系统提供的身份信息',
      'USB协议': 'USB通信的标准规范'
    };
    
    Object.entries(technicalTerms).forEach(([term, explanation]) => {
      if (!optimizedContent.includes(term)) {
        const insertion = `\n\n**${term}**: ${explanation}。这对理解USB设备不被识别的问题很重要。`;
        optimizedContent += insertion;
        changes.push({
          type: 'technical_addition',
          description: `添加技术术语: ${term}`,
          content: insertion
        });
      }
    });
    
    return { content: optimizedContent, changes };
  };

  // 实时优化效果
  useEffect(() => {
    if (enableRealTimeOptimization && content) {
      const timeoutId = setTimeout(() => {
        const analysis = analyzeContent(content);
        setOptimizationResults(prev => ({
          ...prev,
          analysis
        }));
      }, 1000); // 防抖
      
      return () => clearTimeout(timeoutId);
    }
  }, [content, enableRealTimeOptimization, analyzeContent]);

  // 渲染优化统计信息
  const renderOptimizationStats = () => {
    if (!showOptimizationStats || !optimizationResults?.analysis) return null;
    
    const analysis = optimizationResults.analysis;
    
    return (
      <div className="optimization-stats bg-blue-50 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-3">优化统计</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">优化评分</p>
            <p className={`text-2xl font-bold ${
              analysis.optimizationScore >= 80 ? 'text-green-600' :
              analysis.optimizationScore >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {analysis.optimizationScore}/100
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">总字数</p>
            <p className="text-2xl font-bold text-gray-800">{analysis.wordCount}</p>
          </div>
        </div>
        
        {/* 主关键词验证结果 */}
        {analysis.primaryKeywordValidation && (
          <div className="primary-keyword-validation mb-4 p-3 border rounded-lg">
            <h4 className="font-medium mb-2">首页主关键词验证</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">"{analysis.primaryKeywordValidation.primaryKeyword}"</span>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-bold ${
                  analysis.primaryKeywordValidation.isValid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {analysis.primaryKeywordValidation.density.toFixed(2)}%
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  analysis.primaryKeywordValidation.status === 'optimal' ? 'bg-green-100 text-green-800' :
                  analysis.primaryKeywordValidation.status === 'too_low' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {analysis.primaryKeywordValidation.status === 'optimal' ? '✅ 最佳' :
                   analysis.primaryKeywordValidation.status === 'too_low' ? '⚠️ 过低' : '❌ 过高'}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              要求范围: {analysis.primaryKeywordValidation.requiredRange.min}% - {analysis.primaryKeywordValidation.requiredRange.max}%
            </div>
          </div>
        )}

        {/* 关键词密度详情 */}
        <div className="keyword-breakdown">
          <h4 className="font-medium mb-2">关键词密度</h4>
          {analysis.keywordBreakdown && Object.entries(analysis.keywordBreakdown).map(([type, keywords]) => (
            <div key={type} className="mb-2">
              <p className="text-sm font-medium text-gray-700 capitalize">{type}:</p>
              <div className="ml-2">
                {keywords.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.keyword}</span>
                    <span className={`${
                      item.status === 'optimal' ? 'text-green-600' :
                      item.status === 'low' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {item.density.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* 优化建议 */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div className="recommendations mt-4">
            <h4 className="font-medium mb-2">优化建议</h4>
            <ul className="text-sm space-y-1">
              {analysis.recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className={`${
                  rec.priority === 'high' ? 'text-red-600' :
                  rec.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`}>
                  • {rec.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return {
    // 核心功能
    analyzeContent,
    optimizeContent,
    
    // 状态
    optimizationResults,
    isOptimizing,
    optimizationHistory,
    
    // 配置
    pageConfig,
    optimizationStrategy,
    keywordList,
    
    // 渲染组件
    renderOptimizationStats,
    
    // 工具方法
    calculateOptimizationScore: (analysis) => calculateOptimizationScore(analysis, keywordList),
    validateConfiguration: () => validateKeywordConfig(pageType)
  };
};

// 优化统计显示组件
export const OptimizationStatsDisplay = (props) => {
  const optimizer = PageSpecificOptimizer(props);
  return optimizer.renderOptimizationStats();
};

export default PageSpecificOptimizer;