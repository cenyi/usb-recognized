/**
 * 关键词密度验证器
 * 专门用于验证首页主关键词"usb device not recognized"和"usb recognized"的密度是否在3%-5%之间
 */

class KeywordDensityValidator {
  constructor() {
    // 首页主关键词配置
    this.primaryKeywords = {
      'usb-not-recognized': 'usb device not recognized',
      'usb-recognized': 'usb recognized'
    };
    
    // 严格的密度要求：3%-5%
    this.requiredDensity = { min: 3, max: 5 };
  }

  /**
   * 验证页面内容的关键词密度
   * @param {string} pageType - 页面类型
   * @param {string} content - 页面内容
   * @returns {Object} 验证结果
   */
  validatePageKeywordDensity(pageType, content) {
    const primaryKeyword = this.primaryKeywords[pageType];
    if (!primaryKeyword) {
      return {
        isValid: false,
        error: `未找到页面类型 ${pageType} 的主关键词配置`
      };
    }

    const analysis = this.analyzeKeywordDensity(content, primaryKeyword);
    const isValid = analysis.density >= this.requiredDensity.min && 
                   analysis.density <= this.requiredDensity.max;

    return {
      isValid,
      pageType,
      primaryKeyword,
      density: analysis.density,
      count: analysis.count,
      wordCount: analysis.wordCount,
      requiredRange: this.requiredDensity,
      status: this.getDensityStatus(analysis.density),
      recommendations: this.generateRecommendations(analysis.density, primaryKeyword)
    };
  }

  /**
   * 分析关键词密度
   * @param {string} content - 内容
   * @param {string} keyword - 关键词
   * @returns {Object} 分析结果
   */
  analyzeKeywordDensity(content, keyword) {
    if (!content || !keyword) {
      return { density: 0, count: 0, wordCount: 0 };
    }

    // 清理内容
    const cleanContent = this.cleanContent(content);
    const wordCount = this.getWordCount(cleanContent);
    const keywordCount = this.countKeyword(cleanContent, keyword);
    const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

    return {
      density: Math.round(density * 100) / 100, // 保留两位小数
      count: keywordCount,
      wordCount
    };
  }

  /**
   * 清理内容
   * @param {string} content - 原始内容
   * @returns {string} 清理后的内容
   */
  cleanContent(content) {
    return content
      .replace(/<[^>]*>/g, ' ') // 移除HTML标签
      .replace(/\s+/g, ' ') // 合并多个空格
      .replace(/[^\w\s]/g, ' ') // 移除标点符号
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
   * @param {string} keyword - 关键词
   * @returns {number} 出现次数
   */
  countKeyword(content, keyword) {
    if (!content || !keyword) return 0;
    
    const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    const matches = content.match(regex) || [];
    return matches.length;
  }

  /**
   * 获取密度状态
   * @param {number} density - 密度值
   * @returns {string} 状态
   */
  getDensityStatus(density) {
    if (density < this.requiredDensity.min) {
      return 'too_low';
    } else if (density > this.requiredDensity.max) {
      return 'too_high';
    } else {
      return 'optimal';
    }
  }

  /**
   * 生成优化建议
   * @param {number} density - 当前密度
   * @param {string} keyword - 关键词
   * @returns {Array} 建议列表
   */
  generateRecommendations(density, keyword) {
    const recommendations = [];

    if (density < this.requiredDensity.min) {
      const deficit = this.requiredDensity.min - density;
      recommendations.push({
        type: 'increase',
        message: `关键词"${keyword}"密度过低（${density.toFixed(2)}%），需要增加${deficit.toFixed(2)}%`,
        action: `在内容中自然地增加"${keyword}"的使用频率`,
        priority: 'high'
      });
    } else if (density > this.requiredDensity.max) {
      const excess = density - this.requiredDensity.max;
      recommendations.push({
        type: 'decrease',
        message: `关键词"${keyword}"密度过高（${density.toFixed(2)}%），需要减少${excess.toFixed(2)}%`,
        action: `减少"${keyword}"的使用频率，避免关键词堆砌`,
        priority: 'high'
      });
    } else {
      recommendations.push({
        type: 'optimal',
        message: `关键词"${keyword}"密度已达到最佳范围（${density.toFixed(2)}%）`,
        action: '保持当前关键词使用频率',
        priority: 'low'
      });
    }

    return recommendations;
  }

  /**
   * 批量验证多个页面
   * @param {Array} pages - 页面数组 [{pageType, content}]
   * @returns {Array} 验证结果数组
   */
  validateMultiplePages(pages) {
    return pages.map(page => 
      this.validatePageKeywordDensity(page.pageType, page.content)
    );
  }

  /**
   * 生成密度报告
   * @param {Object} validationResult - 验证结果
   * @returns {string} 报告文本
   */
  generateDensityReport(validationResult) {
    const { pageType, primaryKeyword, density, count, wordCount, status, recommendations } = validationResult;
    
    let report = `=== 关键词密度验证报告 ===\n`;
    report += `页面类型: ${pageType}\n`;
    report += `主关键词: "${primaryKeyword}"\n`;
    report += `当前密度: ${density.toFixed(2)}%\n`;
    report += `出现次数: ${count}\n`;
    report += `总字数: ${wordCount}\n`;
    report += `要求范围: ${this.requiredDensity.min}% - ${this.requiredDensity.max}%\n`;
    report += `状态: ${this.getStatusText(status)}\n\n`;
    
    if (recommendations.length > 0) {
      report += `优化建议:\n`;
      recommendations.forEach((rec, index) => {
        report += `${index + 1}. ${rec.message}\n`;
        report += `   操作: ${rec.action}\n`;
      });
    }
    
    return report;
  }

  /**
   * 获取状态文本
   * @param {string} status - 状态
   * @returns {string} 状态文本
   */
  getStatusText(status) {
    const statusMap = {
      'too_low': '密度过低 ❌',
      'too_high': '密度过高 ⚠️',
      'optimal': '密度最佳 ✅'
    };
    return statusMap[status] || '未知状态';
  }

  /**
   * 实时监控关键词密度
   * @param {string} pageType - 页面类型
   * @param {string} content - 内容
   * @param {Function} callback - 回调函数
   */
  monitorKeywordDensity(pageType, content, callback) {
    const validation = this.validatePageKeywordDensity(pageType, content);
    
    if (callback && typeof callback === 'function') {
      callback(validation);
    }
    
    // 如果密度不在要求范围内，发出警告
    if (!validation.isValid) {
      console.warn(`关键词密度警告: ${validation.primaryKeyword} 密度为 ${validation.density.toFixed(2)}%，要求范围: ${this.requiredDensity.min}%-${this.requiredDensity.max}%`);
    }
    
    return validation;
  }

  /**
   * 获取建议的关键词插入位置
   * @param {string} content - 内容
   * @param {string} keyword - 关键词
   * @param {number} targetCount - 目标出现次数
   * @returns {Array} 建议插入位置
   */
  getSuggestedInsertionPoints(content, keyword, targetCount) {
    const currentCount = this.countKeyword(this.cleanContent(content), keyword);
    const neededCount = Math.max(0, targetCount - currentCount);
    
    if (neededCount === 0) {
      return [];
    }

    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    const insertionPoints = [];
    
    // 建议在不同段落中插入关键词
    const paragraphsPerInsertion = Math.max(1, Math.floor(paragraphs.length / neededCount));
    
    for (let i = 0; i < neededCount && i * paragraphsPerInsertion < paragraphs.length; i++) {
      const paragraphIndex = i * paragraphsPerInsertion;
      insertionPoints.push({
        position: paragraphIndex,
        suggestion: `在第${paragraphIndex + 1}段中自然地加入"${keyword}"`,
        context: paragraphs[paragraphIndex].substring(0, 100) + '...'
      });
    }
    
    return insertionPoints;
  }
}

export default KeywordDensityValidator;