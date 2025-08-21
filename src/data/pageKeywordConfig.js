/**
 * 页面特定关键词配置
 * 为不同的USB问题页面定义特定的关键词策略和优化规则
 */

// 页面关键词配置映射
export const pageKeywordConfigs = {
  'usb-not-recognized': {
    // 基本信息
    pageInfo: {
      title: 'USB设备无法识别问题解决',
      description: 'USB不被识别的完整故障排除指南',
      category: 'troubleshooting',
      priority: 'high'
    },
    
    // 关键词配置
    keywords: {
      primary: {
        zh: 'usb device not recognized',
        en: 'usb device not recognized',
        density: { min: 3, max: 5 }, // 严格控制主关键词密度在3%-5%
        importance: 10
      },
      secondary: [
        {
          zh: 'usb设备不被识别',
          en: 'usb device not recognized',
          density: { min: 2, max: 4 },
          importance: 8
        },
        {
          zh: 'usb识别问题',
          en: 'usb recognition issues',
          density: { min: 1.5, max: 3 },
          importance: 7
        },
        {
          zh: 'usb故障排除',
          en: 'usb troubleshooting',
          density: { min: 1, max: 2.5 },
          importance: 6
        }
      ],
      longTail: [
        {
          zh: 'usb闪存驱动器不被识别',
          en: 'usb flash drive not recognized',
          density: { min: 0.5, max: 1.5 },
          importance: 5
        },
        {
          zh: '外部usb不被识别',
          en: 'external usb not recognized',
          density: { min: 0.5, max: 1.5 },
          importance: 5
        },
        {
          zh: 'windows usb不被识别',
          en: 'windows usb not recognized',
          density: { min: 0.3, max: 1 },
          importance: 4
        },
        {
          zh: 'usb端口不工作',
          en: 'usb port not working',
          density: { min: 0.3, max: 1 },
          importance: 4
        }
      ]
    },
    
    // 内容优化策略
    contentStrategy: {
      focusAreas: ['driver_issues', 'hardware_problems', 'system_settings'],
      contentLength: { min: 2000, max: 4000 },
      keywordDistribution: 'even', // 均匀分布
      semanticKeywords: [
        'usb驱动程序', 'usb driver', '设备管理器', 'device manager',
        'usb端口', 'usb port', '硬件故障', 'hardware failure'
      ]
    }
  },

  'usb-device-not-recognized': {
    pageInfo: {
      title: 'USB设备识别失败解决方案',
      description: 'USB设备不被识别的技术原理和修复方法',
      category: 'technical',
      priority: 'high'
    },
    
    keywords: {
      primary: {
        zh: 'usb设备不被识别',
        en: 'usb device not recognized',
        density: { min: 4, max: 6 },
        importance: 10
      },
      secondary: [
        {
          zh: 'usb设备检测',
          en: 'usb device detection',
          density: { min: 2, max: 4 },
          importance: 8
        },
        {
          zh: 'usb设备识别',
          en: 'usb device identification',
          density: { min: 2, max: 4 },
          importance: 8
        },
        {
          zh: 'usb枚举失败',
          en: 'usb enumeration failure',
          density: { min: 1, max: 2.5 },
          importance: 7
        }
      ],
      longTail: [
        {
          zh: 'usb设备不被识别windows',
          en: 'usb device not recognized windows',
          density: { min: 0.5, max: 1.5 },
          importance: 6
        },
        {
          zh: 'usb设备不被识别mac',
          en: 'usb device not recognized mac',
          density: { min: 0.5, max: 1.5 },
          importance: 6
        },
        {
          zh: 'usb设备描述符错误',
          en: 'usb device descriptor error',
          density: { min: 0.3, max: 1 },
          importance: 5
        }
      ]
    },
    
    contentStrategy: {
      focusAreas: ['device_enumeration', 'driver_loading', 'system_compatibility'],
      contentLength: { min: 2500, max: 4500 },
      keywordDistribution: 'front_loaded', // 前置重点关键词
      semanticKeywords: [
        '设备枚举', 'device enumeration', '设备描述符', 'device descriptor',
        'usb协议', 'usb protocol', '兼容性', 'compatibility'
      ]
    }
  },

  'usb-device-recognized': {
    pageInfo: {
      title: 'USB设备已识别但无法工作',
      description: 'USB设备识别后功能异常的解决方案',
      category: 'functional',
      priority: 'medium'
    },
    
    keywords: {
      primary: {
        zh: 'usb设备已识别',
        en: 'usb device recognized',
        density: { min: 3.5, max: 5.5 },
        importance: 10
      },
      secondary: [
        {
          zh: 'usb设备检测到',
          en: 'usb device detected',
          density: { min: 2, max: 4 },
          importance: 8
        },
        {
          zh: 'usb设备工作',
          en: 'usb device working',
          density: { min: 1.5, max: 3 },
          importance: 7
        },
        {
          zh: 'usb功能异常',
          en: 'usb malfunction',
          density: { min: 1, max: 2.5 },
          importance: 6
        }
      ],
      longTail: [
        {
          zh: 'usb设备已识别但不工作',
          en: 'usb device recognized but not working',
          density: { min: 0.8, max: 2 },
          importance: 7
        },
        {
          zh: 'usb设备已识别windows',
          en: 'usb device recognized windows',
          density: { min: 0.5, max: 1.5 },
          importance: 5
        },
        {
          zh: 'usb权限问题',
          en: 'usb permission issues',
          density: { min: 0.3, max: 1 },
          importance: 4
        }
      ]
    },
    
    contentStrategy: {
      focusAreas: ['driver_mismatch', 'permissions', 'configuration'],
      contentLength: { min: 1800, max: 3500 },
      keywordDistribution: 'balanced',
      semanticKeywords: [
        '驱动程序', 'driver', '权限设置', 'permissions',
        '设备配置', 'device configuration', '功能测试', 'functionality test'
      ]
    }
  },

  'usb-recognized': {
    pageInfo: {
      title: 'USB识别技术和优化',
      description: 'USB识别机制的深入解析和性能优化',
      category: 'technical_guide',
      priority: 'high'
    },
    
    keywords: {
      primary: {
        zh: 'usb recognized',
        en: 'usb recognized',
        density: { min: 3, max: 5 }, // 严格控制主关键词密度在3%-5%
        importance: 10
      },
      secondary: [
        {
          zh: 'usb检测',
          en: 'usb detection',
          density: { min: 2, max: 4 },
          importance: 8
        },
        {
          zh: 'usb识别机制',
          en: 'usb recognition mechanism',
          density: { min: 1.5, max: 3 },
          importance: 7
        },
        {
          zh: 'usb协议',
          en: 'usb protocol',
          density: { min: 1, max: 2.5 },
          importance: 6
        }
      ],
      longTail: [
        {
          zh: 'usb识别但无法访问',
          en: 'usb recognized but not accessible',
          density: { min: 0.5, max: 1.5 },
          importance: 6
        },
        {
          zh: 'usb识别linux',
          en: 'usb recognized linux',
          density: { min: 0.5, max: 1.5 },
          importance: 5
        },
        {
          zh: 'usb识别速度',
          en: 'usb recognition speed',
          density: { min: 0.3, max: 1 },
          importance: 4
        }
      ]
    },
    
    contentStrategy: {
      focusAreas: ['protocol_analysis', 'performance_optimization', 'system_tuning'],
      contentLength: { min: 2200, max: 4200 },
      keywordDistribution: 'technical_focused',
      semanticKeywords: [
        '协议分析', 'protocol analysis', '性能优化', 'performance optimization',
        '系统调优', 'system tuning', '识别速度', 'recognition speed'
      ]
    }
  }
};

// 关键词优化规则
export const keywordOptimizationRules = {
  // 密度检查规则
  densityRules: {
    primary: { min: 3, max: 5, weight: 1.0 }, // 严格控制主关键词密度在3%-5%
    secondary: { min: 1.5, max: 4, weight: 0.8 },
    longTail: { min: 0.3, max: 2, weight: 0.6 }
  },
  
  // 分布规则
  distributionRules: {
    even: {
      title: 0.15,      // 15%在标题中
      introduction: 0.25, // 25%在介绍中
      body: 0.50,       // 50%在正文中
      conclusion: 0.10   // 10%在结论中
    },
    front_loaded: {
      title: 0.20,
      introduction: 0.40,
      body: 0.35,
      conclusion: 0.05
    },
    balanced: {
      title: 0.12,
      introduction: 0.22,
      body: 0.55,
      conclusion: 0.11
    },
    technical_focused: {
      title: 0.10,
      introduction: 0.20,
      body: 0.60,
      conclusion: 0.10
    }
  },
  
  // 语义关键词权重
  semanticWeights: {
    exact_match: 1.0,
    partial_match: 0.7,
    semantic_related: 0.5,
    context_related: 0.3
  }
};

// 页面特定优化策略
export const pageOptimizationStrategies = {
  'usb-not-recognized': {
    titleOptimization: {
      includeKeywords: ['usb不被识别', 'usb not recognized'],
      maxLength: 60,
      template: '{keyword} - 完整解决方案和故障排除指南'
    },
    contentOptimization: {
      keywordPlacement: {
        firstParagraph: true,
        headings: true,
        lastParagraph: true
      },
      avoidOverOptimization: true,
      naturalLanguage: true
    }
  },
  
  'usb-device-not-recognized': {
    titleOptimization: {
      includeKeywords: ['usb设备不被识别', 'usb device not recognized'],
      maxLength: 60,
      template: '{keyword}的原因分析和解决方法'
    },
    contentOptimization: {
      keywordPlacement: {
        firstParagraph: true,
        headings: true,
        technicalSections: true
      },
      technicalTerms: true,
      detailedExplanations: true
    }
  },
  
  'usb-device-recognized': {
    titleOptimization: {
      includeKeywords: ['usb设备已识别', 'usb device recognized'],
      maxLength: 60,
      template: '{keyword}但无法正常工作的解决方案'
    },
    contentOptimization: {
      keywordPlacement: {
        problemDescription: true,
        solutionSteps: true,
        troubleshooting: true
      },
      solutionFocused: true,
      stepByStep: true
    }
  },
  
  'usb-recognized': {
    titleOptimization: {
      includeKeywords: ['usb识别', 'usb recognized'],
      maxLength: 60,
      template: '{keyword}技术原理和优化指南'
    },
    contentOptimization: {
      keywordPlacement: {
        technicalSections: true,
        codeExamples: false, // 避免在代码中强制插入关键词
        explanations: true
      },
      technicalDepth: true,
      comprehensiveGuide: true
    }
  }
};

// 关键词竞争分析
export const keywordCompetitionAnalysis = {
  'usb not recognized': {
    difficulty: 'high',
    searchVolume: 12000,
    competition: 0.8,
    cpc: 1.2,
    relatedQueries: [
      'usb device not recognized',
      'usb not working',
      'usb driver issues',
      'usb troubleshooting'
    ]
  },
  
  'usb device not recognized': {
    difficulty: 'high',
    searchVolume: 8500,
    competition: 0.75,
    cpc: 1.1,
    relatedQueries: [
      'usb device not detected',
      'usb device unknown',
      'usb device error',
      'usb device driver'
    ]
  },
  
  'usb device recognized': {
    difficulty: 'medium',
    searchVolume: 3200,
    competition: 0.6,
    cpc: 0.8,
    relatedQueries: [
      'usb device detected',
      'usb device working',
      'usb device connected',
      'usb device functional'
    ]
  },
  
  'usb recognized': {
    difficulty: 'medium',
    searchVolume: 2800,
    competition: 0.55,
    cpc: 0.7,
    relatedQueries: [
      'usb detection',
      'usb identification',
      'usb protocol',
      'usb enumeration'
    ]
  }
};

// 工具函数

/**
 * 获取页面的关键词配置
 * @param {string} pageType - 页面类型
 * @returns {Object} 关键词配置
 */
export const getPageKeywordConfig = (pageType) => {
  return pageKeywordConfigs[pageType] || pageKeywordConfigs['usb-not-recognized'];
};

/**
 * 获取页面的优化策略
 * @param {string} pageType - 页面类型
 * @returns {Object} 优化策略
 */
export const getPageOptimizationStrategy = (pageType) => {
  return pageOptimizationStrategies[pageType] || pageOptimizationStrategies['usb-not-recognized'];
};

/**
 * 获取关键词的竞争分析数据
 * @param {string} keyword - 关键词
 * @returns {Object} 竞争分析数据
 */
export const getKeywordCompetitionData = (keyword) => {
  return keywordCompetitionAnalysis[keyword] || {
    difficulty: 'unknown',
    searchVolume: 0,
    competition: 0,
    cpc: 0,
    relatedQueries: []
  };
};

/**
 * 根据页面类型生成所有相关关键词列表
 * @param {string} pageType - 页面类型
 * @param {string} language - 语言
 * @returns {Array} 关键词列表
 */
export const generateKeywordList = (pageType, language = 'zh') => {
  const config = getPageKeywordConfig(pageType);
  const keywords = [];
  
  // 添加主关键词
  if (config.keywords.primary) {
    keywords.push({
      keyword: config.keywords.primary[language],
      type: 'primary',
      density: config.keywords.primary.density,
      importance: config.keywords.primary.importance
    });
  }
  
  // 添加次要关键词
  if (config.keywords.secondary) {
    config.keywords.secondary.forEach(item => {
      keywords.push({
        keyword: item[language],
        type: 'secondary',
        density: item.density,
        importance: item.importance
      });
    });
  }
  
  // 添加长尾关键词
  if (config.keywords.longTail) {
    config.keywords.longTail.forEach(item => {
      keywords.push({
        keyword: item[language],
        type: 'longTail',
        density: item.density,
        importance: item.importance
      });
    });
  }
  
  return keywords.sort((a, b) => b.importance - a.importance);
};

/**
 * 计算关键词的目标密度范围
 * @param {string} pageType - 页面类型
 * @param {string} keywordType - 关键词类型
 * @returns {Object} 密度范围
 */
export const getTargetDensityRange = (pageType, keywordType) => {
  const rules = keywordOptimizationRules.densityRules[keywordType];
  const config = getPageKeywordConfig(pageType);
  
  // 根据页面特定配置调整密度范围
  if (config.keywords[keywordType] && config.keywords[keywordType].density) {
    return config.keywords[keywordType].density;
  }
  
  return rules || { min: 1, max: 3 };
};

/**
 * 验证关键词配置的完整性
 * @param {string} pageType - 页面类型
 * @returns {Object} 验证结果
 */
export const validateKeywordConfig = (pageType) => {
  const config = getPageKeywordConfig(pageType);
  const validation = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // 检查主关键词
  if (!config.keywords.primary) {
    validation.isValid = false;
    validation.errors.push('缺少主关键词配置');
  }
  
  // 检查次要关键词
  if (!config.keywords.secondary || config.keywords.secondary.length === 0) {
    validation.warnings.push('建议添加次要关键词');
  }
  
  // 检查长尾关键词
  if (!config.keywords.longTail || config.keywords.longTail.length === 0) {
    validation.warnings.push('建议添加长尾关键词');
  }
  
  // 检查内容策略
  if (!config.contentStrategy) {
    validation.warnings.push('缺少内容策略配置');
  }
  
  return validation;
};

export default {
  pageKeywordConfigs,
  keywordOptimizationRules,
  pageOptimizationStrategies,
  keywordCompetitionAnalysis,
  getPageKeywordConfig,
  getPageOptimizationStrategy,
  getKeywordCompetitionData,
  generateKeywordList,
  getTargetDensityRange,
  validateKeywordConfig
};