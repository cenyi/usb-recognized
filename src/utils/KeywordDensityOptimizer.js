/**
 * 关键词密度优化器
 * 负责分析和优化内容中的关键词密度，确保在3%-5%的目标范围内
 */
class KeywordDensityOptimizer {
  constructor(targetKeywords = [], targetDensity = { min: 3, max: 5 }) {
    this.targetKeywords = Array.isArray(targetKeywords) ? targetKeywords : [targetKeywords];
    this.targetDensity = targetDensity;
    
    // 默认USB相关关键词 - 首页主关键词优先
    this.defaultKeywords = [
      'usb device not recognized', // 首页主关键词1
      'usb recognized',            // 首页主关键词2
      'usb',
      'recognized', 
      'usb not recognized',
      'usb device recognized'
    ];
    
    // 如果没有提供关键词，使用默认关键词
    if (this.targetKeywords.length === 0) {
      this.targetKeywords = this.defaultKeywords;
    }
  }

  /**
   * 分析内容的关键词密度
   * @param {string} content - 要分析的内容
   * @returns {Object} 分析结果
   */
  analyzeContent(content) {
    if (!content || typeof content !== 'string') {
      return this.getEmptyAnalysis();
    }

    const cleanContent = this.cleanContent(content);
    const wordCount = this.getWordCount(cleanContent);
    const keywordCounts = this.countKeywords(cleanContent);
    const densities = this.calculateDensities(keywordCounts, wordCount);
    const recommendations = this.generateRecommendations(densities, keywordCounts, wordCount);

    return {
      wordCount,
      keywordCounts,
      densities,
      recommendations,
      isOptimal: this.isOptimalDensity(densities),
      overallScore: this.calculateOverallScore(densities)
    };
  }

  /**
   * 优化内容的关键词密度
   * @param {string} content - 要优化的内容
   * @returns {Object} 优化结果
   */
  optimizeContent(content) {
    if (!content || typeof content !== 'string') {
      return {
        content: '',
        analysis: this.getEmptyAnalysis(),
        changes: []
      };
    }

    const initialAnalysis = this.analyzeContent(content);
    let optimizedContent = content;
    const changes = [];

    // 处理密度过低的关键词
    for (const keyword of this.targetKeywords) {
      const density = initialAnalysis.densities[keyword] || 0;
      
      if (density < this.targetDensity.min) {
        const result = this.addKeywordsNaturally(optimizedContent, keyword, density);
        optimizedContent = result.content;
        if (result.changes.length > 0) {
          changes.push(...result.changes);
        }
      }
    }

    // 处理密度过高的关键词
    for (const keyword of this.targetKeywords) {
      const currentAnalysis = this.analyzeContent(optimizedContent);
      const density = currentAnalysis.densities[keyword] || 0;
      
      if (density > this.targetDensity.max) {
        const result = this.reduceKeywordDensity(optimizedContent, keyword, density);
        optimizedContent = result.content;
        if (result.changes.length > 0) {
          changes.push(...result.changes);
        }
      }
    }

    return {
      content: optimizedContent,
      analysis: this.analyzeContent(optimizedContent),
      changes,
      improvement: this.calculateImprovement(initialAnalysis, this.analyzeContent(optimizedContent))
    };
  }

  /**
   * 清理内容，移除HTML标签和特殊字符
   * @param {string} content - 原始内容
   * @returns {string} 清理后的内容
   */
  cleanContent(content) {
    return content
      .replace(/<[^>]*>/g, ' ') // 移除HTML标签
      .replace(/\s+/g, ' ') // 合并多个空格
      .replace(/[^\w\s\u4e00-\u9fff]/g, ' ') // 保留字母、数字、空格和中文字符
      .toLowerCase()
      .trim();
  }

  /**
   * 计算单词总数
   * @param {string} content - 内容
   * @returns {number} 单词数
   */
  getWordCount(content) {
    if (!content) return 0;
    
    // 分别处理中文和英文
    const chineseChars = content.match(/[\u4e00-\u9fff]/g) || [];
    const englishWords = content.match(/[a-zA-Z]+/g) || [];
    
    return chineseChars.length + englishWords.length;
  }

  /**
   * 统计关键词出现次数
   * @param {string} content - 内容
   * @returns {Object} 关键词计数
   */
  countKeywords(content) {
    const keywordCounts = {};
    
    for (const keyword of this.targetKeywords) {
      const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      const matches = content.match(regex) || [];
      keywordCounts[keyword] = matches.length;
    }
    
    return keywordCounts;
  }

  /**
   * 计算关键词密度
   * @param {Object} keywordCounts - 关键词计数
   * @param {number} wordCount - 总单词数
   * @returns {Object} 关键词密度
   */
  calculateDensities(keywordCounts, wordCount) {
    const densities = {};
    
    if (wordCount === 0) {
      for (const keyword of this.targetKeywords) {
        densities[keyword] = 0;
      }
      return densities;
    }
    
    for (const keyword of this.targetKeywords) {
      const count = keywordCounts[keyword] || 0;
      densities[keyword] = (count / wordCount) * 100;
    }
    
    return densities;
  }

  /**
   * 生成优化建议
   * @param {Object} densities - 关键词密度
   * @param {Object} keywordCounts - 关键词计数
   * @param {number} wordCount - 总单词数
   * @returns {Array} 建议列表
   */
  generateRecommendations(densities, keywordCounts, wordCount) {
    const recommendations = [];
    
    for (const keyword of this.targetKeywords) {
      const density = densities[keyword] || 0;
      const count = keywordCounts[keyword] || 0;
      
      if (density < this.targetDensity.min) {
        const targetCount = Math.ceil((this.targetDensity.min / 100) * wordCount);
        const needed = targetCount - count;
        recommendations.push({
          type: 'increase',
          keyword,
          currentDensity: density,
          targetDensity: this.targetDensity.min,
          currentCount: count,
          recommendedCount: targetCount,
          action: `增加 "${keyword}" ${needed} 次以达到最低密度要求`
        });
      } else if (density > this.targetDensity.max) {
        const targetCount = Math.floor((this.targetDensity.max / 100) * wordCount);
        const excess = count - targetCount;
        recommendations.push({
          type: 'decrease',
          keyword,
          currentDensity: density,
          targetDensity: this.targetDensity.max,
          currentCount: count,
          recommendedCount: targetCount,
          action: `减少 "${keyword}" ${excess} 次以避免关键词堆砌`
        });
      } else {
        recommendations.push({
          type: 'optimal',
          keyword,
          currentDensity: density,
          action: `"${keyword}" 密度已达到最佳范围`
        });
      }
    }
    
    return recommendations;
  }

  /**
   * 自然地添加关键词到内容中
   * @param {string} content - 原始内容
   * @param {string} keyword - 要添加的关键词
   * @param {number} currentDensity - 当前密度
   * @returns {Object} 修改结果
   */
  addKeywordsNaturally(content, keyword, currentDensity) {
    const changes = [];
    let modifiedContent = content;
    
    // 计算需要添加的次数
    const wordCount = this.getWordCount(this.cleanContent(content));
    const targetCount = Math.ceil((this.targetDensity.min / 100) * wordCount);
    const currentCount = this.countKeywords(this.cleanContent(content))[keyword] || 0;
    const neededCount = Math.max(0, targetCount - currentCount);
    
    if (neededCount === 0) {
      return { content: modifiedContent, changes };
    }

    // 定义可以自然插入关键词的位置和方式
    const insertionPatterns = this.getInsertionPatterns(keyword);
    
    let addedCount = 0;
    for (let i = 0; i < neededCount && i < insertionPatterns.length; i++) {
      const pattern = insertionPatterns[i];
      
      // 查找合适的插入位置
      const insertionPoint = this.findInsertionPoint(modifiedContent, pattern);
      if (insertionPoint !== -1) {
        const before = modifiedContent.substring(0, insertionPoint);
        const after = modifiedContent.substring(insertionPoint);
        modifiedContent = before + pattern.text + after;
        
        changes.push({
          type: 'addition',
          keyword,
          position: insertionPoint,
          text: pattern.text,
          reason: pattern.reason
        });
        
        addedCount++;
      }
    }
    
    return { content: modifiedContent, changes };
  }

  /**
   * 减少关键词密度
   * @param {string} content - 原始内容
   * @param {string} keyword - 要减少的关键词
   * @param {number} currentDensity - 当前密度
   * @returns {Object} 修改结果
   */
  reduceKeywordDensity(content, keyword, currentDensity) {
    const changes = [];
    let modifiedContent = content;
    
    // 计算需要移除的次数
    const wordCount = this.getWordCount(this.cleanContent(content));
    const targetCount = Math.floor((this.targetDensity.max / 100) * wordCount);
    const currentCount = this.countKeywords(this.cleanContent(content))[keyword] || 0;
    const excessCount = Math.max(0, currentCount - targetCount);
    
    if (excessCount === 0) {
      return { content: modifiedContent, changes };
    }

    // 查找并替换过度使用的关键词
    const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    const matches = [...modifiedContent.matchAll(regex)];
    
    // 从后往前替换，避免位置偏移
    const toReplace = matches.slice(-excessCount);
    
    for (let i = toReplace.length - 1; i >= 0; i--) {
      const match = toReplace[i];
      const replacement = this.getKeywordReplacement(keyword);
      
      const before = modifiedContent.substring(0, match.index);
      const after = modifiedContent.substring(match.index + match[0].length);
      modifiedContent = before + replacement + after;
      
      changes.push({
        type: 'replacement',
        keyword,
        position: match.index,
        original: match[0],
        replacement,
        reason: '减少关键词密度以避免堆砌'
      });
    }
    
    return { content: modifiedContent, changes };
  }

  /**
   * 获取关键词插入模式
   * @param {string} keyword - 关键词
   * @returns {Array} 插入模式列表
   */
  getInsertionPatterns(keyword) {
    const patterns = {
      'usb': [
        { text: '当USB设备连接时，', reason: '自然的场景描述' },
        { text: '解决USB问题的方法包括', reason: '引导性语句' },
        { text: '大多数USB故障都可以通过', reason: '概括性描述' }
      ],
      'recognized': [
        { text: '设备被正确recognized后，', reason: '状态描述' },
        { text: '确保设备能够被recognized', reason: '目标描述' },
        { text: '当设备未被recognized时', reason: '问题场景' }
      ],
      'usb not recognized': [
        { text: '遇到usb not recognized问题时，', reason: '问题场景描述' },
        { text: '解决usb not recognized的步骤：', reason: '解决方案引导' }
      ],
      'usb device not recognized': [
        { text: '当出现usb device not recognized错误时，', reason: '错误场景描述' },
        { text: '修复usb device not recognized问题需要', reason: '解决方案描述' }
      ]
    };
    
    return patterns[keyword] || [
      { text: `关于${keyword}的解决方案：`, reason: '通用解决方案引导' },
      { text: `${keyword}问题的常见原因包括`, reason: '通用原因分析' }
    ];
  }

  /**
   * 查找合适的插入位置
   * @param {string} content - 内容
   * @param {Object} pattern - 插入模式
   * @returns {number} 插入位置
   */
  findInsertionPoint(content, pattern) {
    // 查找段落开始位置
    const paragraphStarts = [];
    const lines = content.split('\n');
    let position = 0;
    
    for (const line of lines) {
      if (line.trim().length > 0) {
        paragraphStarts.push(position);
      }
      position += line.length + 1;
    }
    
    // 随机选择一个段落开始位置
    if (paragraphStarts.length > 0) {
      const randomIndex = Math.floor(Math.random() * paragraphStarts.length);
      return paragraphStarts[randomIndex];
    }
    
    return -1;
  }

  /**
   * 获取关键词的替换词
   * @param {string} keyword - 原关键词
   * @returns {string} 替换词
   */
  getKeywordReplacement(keyword) {
    const replacements = {
      'usb': '设备',
      'recognized': '识别',
      'usb recognized': '设备识别',
      'usb not recognized': '设备无法识别',
      'usb device recognized': '设备被识别',
      'usb device not recognized': '设备无法被识别'
    };
    
    return replacements[keyword] || '设备';
  }

  /**
   * 检查密度是否最佳
   * @param {Object} densities - 关键词密度
   * @returns {boolean} 是否最佳
   */
  isOptimalDensity(densities) {
    for (const keyword of this.targetKeywords) {
      const density = densities[keyword] || 0;
      if (density < this.targetDensity.min || density > this.targetDensity.max) {
        return false;
      }
    }
    return true;
  }

  /**
   * 计算整体评分
   * @param {Object} densities - 关键词密度
   * @returns {number} 评分 (0-100)
   */
  calculateOverallScore(densities) {
    let totalScore = 0;
    let keywordCount = 0;
    
    for (const keyword of this.targetKeywords) {
      const density = densities[keyword] || 0;
      let score = 0;
      
      if (density >= this.targetDensity.min && density <= this.targetDensity.max) {
        score = 100;
      } else if (density < this.targetDensity.min) {
        score = Math.max(0, (density / this.targetDensity.min) * 100);
      } else {
        const excess = density - this.targetDensity.max;
        score = Math.max(0, 100 - (excess * 10));
      }
      
      totalScore += score;
      keywordCount++;
    }
    
    return keywordCount > 0 ? Math.round(totalScore / keywordCount) : 0;
  }

  /**
   * 计算优化改进程度
   * @param {Object} beforeAnalysis - 优化前分析
   * @param {Object} afterAnalysis - 优化后分析
   * @returns {Object} 改进信息
   */
  calculateImprovement(beforeAnalysis, afterAnalysis) {
    const scoreDiff = afterAnalysis.overallScore - beforeAnalysis.overallScore;
    const improvedKeywords = [];
    const worsenedKeywords = [];
    
    for (const keyword of this.targetKeywords) {
      const beforeDensity = beforeAnalysis.densities[keyword] || 0;
      const afterDensity = afterAnalysis.densities[keyword] || 0;
      
      const beforeOptimal = beforeDensity >= this.targetDensity.min && beforeDensity <= this.targetDensity.max;
      const afterOptimal = afterDensity >= this.targetDensity.min && afterDensity <= this.targetDensity.max;
      
      if (!beforeOptimal && afterOptimal) {
        improvedKeywords.push(keyword);
      } else if (beforeOptimal && !afterOptimal) {
        worsenedKeywords.push(keyword);
      }
    }
    
    return {
      scoreImprovement: scoreDiff,
      improvedKeywords,
      worsenedKeywords,
      overallImprovement: scoreDiff > 0 ? 'improved' : scoreDiff < 0 ? 'worsened' : 'unchanged'
    };
  }

  /**
   * 获取空分析结果
   * @returns {Object} 空分析结果
   */
  getEmptyAnalysis() {
    const emptyDensities = {};
    const emptyKeywordCounts = {};
    
    for (const keyword of this.targetKeywords) {
      emptyDensities[keyword] = 0;
      emptyKeywordCounts[keyword] = 0;
    }
    
    return {
      wordCount: 0,
      keywordCounts: emptyKeywordCounts,
      densities: emptyDensities,
      recommendations: [],
      isOptimal: false,
      overallScore: 0
    };
  }
}

export default KeywordDensityOptimizer;