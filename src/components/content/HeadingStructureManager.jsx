import React, { useMemo, useCallback } from 'react';
import { getPageHeadings, getPageKeywords } from '../../data/multilingualContent';

/**
 * 标题层级结构管理组件
 * 负责生成和优化页面的H1、H2、H3标签，确保SEO最佳实践和关键词集成
 */
const HeadingStructureManager = ({ 
  pageType = 'usb-not-recognized',
  language = 'zh',
  customHeadings = null,
  enableKeywordOptimization = true,
  onHeadingClick = null
}) => {
  // 获取页面关键词配置
  const pageKeywords = useMemo(() => getPageKeywords(pageType), [pageType]);
  
  // 获取页面标题配置
  const headings = useMemo(() => {
    if (customHeadings) {
      return customHeadings;
    }
    return getPageHeadings(pageType, language);
  }, [pageType, language, customHeadings]);

  // 验证标题结构
  const validateHeadingStructure = useCallback((headings) => {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // 检查H1标题
    if (!headings.h1 || headings.h1.trim() === '') {
      validation.isValid = false;
      validation.errors.push('缺少H1标题');
    } else if (headings.h1.length < 20 || headings.h1.length > 70) {
      validation.warnings.push(`H1标题长度建议在20-70字符之间，当前长度：${headings.h1.length}`);
    }

    // 检查H2标题
    if (!headings.h2 || headings.h2.length === 0) {
      validation.isValid = false;
      validation.errors.push('至少需要3个H2标题');
    } else if (headings.h2.length < 3) {
      validation.warnings.push(`建议至少有3个H2标题，当前数量：${headings.h2.length}`);
    } else if (headings.h2.length > 8) {
      validation.warnings.push(`H2标题过多可能影响用户体验，当前数量：${headings.h2.length}`);
    }

    // 检查H3标题
    if (!headings.h3 || headings.h3.length === 0) {
      validation.warnings.push('建议添加H3标题以改善内容结构');
    } else if (headings.h3.length < 5) {
      validation.warnings.push(`建议至少有5个H3标题，当前数量：${headings.h3.length}`);
    }

    // 检查标题中的关键词
    if (enableKeywordOptimization) {
      const primaryKeyword = pageKeywords.primary;
      if (primaryKeyword && !headings.h1.toLowerCase().includes(primaryKeyword.toLowerCase())) {
        validation.warnings.push(`H1标题建议包含主要关键词：${primaryKeyword}`);
      }
    }

    return validation;
  }, [pageKeywords, enableKeywordOptimization]);

  // 优化标题中的关键词
  const optimizeHeadingKeywords = useCallback((heading, level, index) => {
    if (!enableKeywordOptimization) {
      return heading;
    }

    const keywords = [
      pageKeywords.primary,
      ...pageKeywords.secondary,
      ...pageKeywords.longTail
    ].filter(Boolean);

    // 对于H1标题，确保包含主要关键词
    if (level === 1 && pageKeywords.primary) {
      const primaryKeyword = pageKeywords.primary;
      if (!heading.toLowerCase().includes(primaryKeyword.toLowerCase())) {
        // 如果H1不包含主要关键词，尝试自然地添加
        return heading; // 保持原标题，避免过度优化
      }
    }

    // 对于H2和H3标题，适度添加相关关键词
    if (level === 2 || level === 3) {
      const relevantKeywords = keywords.filter(keyword => 
        keyword.length <= 20 && // 避免过长的关键词
        !heading.toLowerCase().includes(keyword.toLowerCase())
      );

      // 随机选择一个相关关键词（如果有的话）
      if (relevantKeywords.length > 0 && Math.random() < 0.3) {
        const randomKeyword = relevantKeywords[Math.floor(Math.random() * relevantKeywords.length)];
        // 这里可以实现更智能的关键词插入逻辑
        // 暂时返回原标题以避免过度优化
      }
    }

    return heading;
  }, [pageKeywords, enableKeywordOptimization]);

  // 生成标题ID用于锚点链接
  const generateHeadingId = useCallback((heading, level, index) => {
    const baseId = heading
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff]/g, '') // 保留字母、数字、空格和中文
      .replace(/\s+/g, '-') // 空格替换为连字符
      .substring(0, 50); // 限制长度
    
    return `${level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'}-${baseId}-${index}`;
  }, []);

  // 处理标题点击事件
  const handleHeadingClick = useCallback((heading, level, index, id) => {
    if (onHeadingClick) {
      onHeadingClick({ heading, level, index, id });
    }
    
    // 默认行为：滚动到对应位置
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [onHeadingClick]);

  // 渲染单个标题
  const renderHeading = useCallback((heading, level, index) => {
    const optimizedHeading = optimizeHeadingKeywords(heading, level, index);
    const headingId = generateHeadingId(optimizedHeading, level, index);
    const HeadingTag = `h${level}`;
    
    const baseClasses = 'font-bold text-gray-900 leading-tight';
    const levelClasses = {
      1: 'text-4xl mb-6 mt-8',
      2: 'text-2xl mb-4 mt-8',
      3: 'text-xl mb-3 mt-6'
    };
    
    const hoverClasses = onHeadingClick ? 'cursor-pointer hover:text-blue-600 transition-colors' : '';
    
    return (
      <HeadingTag
        key={`${level}-${index}`}
        id={headingId}
        className={`${baseClasses} ${levelClasses[level]} ${hoverClasses}`}
        onClick={() => handleHeadingClick(optimizedHeading, level, index, headingId)}
        role={onHeadingClick ? 'button' : undefined}
        tabIndex={onHeadingClick ? 0 : undefined}
        onKeyDown={onHeadingClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleHeadingClick(optimizedHeading, level, index, headingId);
          }
        } : undefined}
      >
        {optimizedHeading}
      </HeadingTag>
    );
  }, [optimizeHeadingKeywords, generateHeadingId, handleHeadingClick, onHeadingClick]);

  // 渲染标题结构
  const renderHeadingStructure = () => {
    const validation = validateHeadingStructure(headings);
    
    return (
      <div className="heading-structure">
        {/* 开发模式下显示验证信息 */}
        {process.env.NODE_ENV === 'development' && (
          <HeadingValidationInfo validation={validation} />
        )}
        
        {/* H1标题 */}
        {headings.h1 && renderHeading(headings.h1, 1, 0)}
        
        {/* H2和H3标题结构 */}
        {headings.h2 && headings.h2.map((h2Title, h2Index) => (
          <div key={`section-${h2Index}`} className="mb-8">
            {renderHeading(h2Title, 2, h2Index)}
            
            {/* 为每个H2标题分配相关的H3标题 */}
            {headings.h3 && (
              <div className="ml-4">
                {headings.h3
                  .slice(h2Index * 2, (h2Index + 1) * 2) // 每个H2分配2个H3
                  .map((h3Title, h3Index) => (
                    renderHeading(h3Title, 3, h2Index * 2 + h3Index)
                  ))
                }
              </div>
            )}
          </div>
        ))}
        
        {/* 剩余的H3标题 */}
        {headings.h3 && headings.h2 && (
          <div className="remaining-h3">
            {headings.h3
              .slice(headings.h2.length * 2)
              .map((h3Title, h3Index) => (
                renderHeading(h3Title, 3, headings.h2.length * 2 + h3Index)
              ))
            }
          </div>
        )}
      </div>
    );
  };

  // 生成目录结构
  const generateTableOfContents = () => {
    const toc = [];
    
    if (headings.h1) {
      toc.push({
        level: 1,
        title: headings.h1,
        id: generateHeadingId(headings.h1, 1, 0)
      });
    }
    
    if (headings.h2) {
      headings.h2.forEach((h2Title, h2Index) => {
        toc.push({
          level: 2,
          title: h2Title,
          id: generateHeadingId(h2Title, 2, h2Index)
        });
        
        // 添加相关的H3标题
        if (headings.h3) {
          headings.h3
            .slice(h2Index * 2, (h2Index + 1) * 2)
            .forEach((h3Title, h3Index) => {
              toc.push({
                level: 3,
                title: h3Title,
                id: generateHeadingId(h3Title, 3, h2Index * 2 + h3Index)
              });
            });
        }
      });
    }
    
    return toc;
  };

  // 获取标题统计信息
  const getHeadingStats = () => {
    return {
      h1Count: headings.h1 ? 1 : 0,
      h2Count: headings.h2 ? headings.h2.length : 0,
      h3Count: headings.h3 ? headings.h3.length : 0,
      totalCount: (headings.h1 ? 1 : 0) + 
                  (headings.h2 ? headings.h2.length : 0) + 
                  (headings.h3 ? headings.h3.length : 0),
      validation: validateHeadingStructure(headings)
    };
  };

  return {
    // 渲染方法
    renderHeadingStructure,
    renderHeading,
    
    // 工具方法
    generateTableOfContents,
    getHeadingStats,
    validateHeadingStructure: () => validateHeadingStructure(headings),
    
    // 数据
    headings,
    pageKeywords
  };
};

// 标题验证信息组件（开发模式使用）
const HeadingValidationInfo = ({ validation }) => {
  if (!validation || (validation.errors.length === 0 && validation.warnings.length === 0)) {
    return (
      <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded">
        <p className="text-green-800 font-semibold">✓ 标题结构验证通过</p>
      </div>
    );
  }

  return (
    <div className="mb-4 p-3 border rounded">
      {validation.errors.length > 0 && (
        <div className="mb-2">
          <p className="text-red-800 font-semibold">错误:</p>
          <ul className="list-disc list-inside text-red-700">
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {validation.warnings.length > 0 && (
        <div>
          <p className="text-orange-800 font-semibold">警告:</p>
          <ul className="list-disc list-inside text-orange-700">
            {validation.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// 标题结构渲染组件
export const HeadingStructureRenderer = (props) => {
  const manager = HeadingStructureManager(props);
  return manager.renderHeadingStructure();
};

// 目录组件
export const TableOfContents = (props) => {
  const manager = HeadingStructureManager(props);
  const toc = manager.generateTableOfContents();
  
  if (toc.length === 0) return null;
  
  return (
    <nav className="table-of-contents bg-gray-50 p-6 rounded-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">目录</h2>
      <ul className="space-y-2">
        {toc.map((item, index) => (
          <li key={index} className={`${
            item.level === 1 ? 'font-semibold' :
            item.level === 2 ? 'ml-4' :
            'ml-8 text-sm'
          }`}>
            <a 
              href={`#${item.id}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(item.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// 标题统计组件
export const HeadingStats = (props) => {
  const manager = HeadingStructureManager(props);
  const stats = manager.getHeadingStats();
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="heading-stats bg-blue-50 p-4 rounded-lg mb-4">
      <h3 className="font-semibold mb-2">标题统计 (开发模式)</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p>H1标题: {stats.h1Count}</p>
          <p>H2标题: {stats.h2Count}</p>
          <p>H3标题: {stats.h3Count}</p>
        </div>
        <div>
          <p>总计: {stats.totalCount}</p>
          <p className={`font-semibold ${
            stats.validation.isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            状态: {stats.validation.isValid ? '有效' : '需要修复'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeadingStructureManager;