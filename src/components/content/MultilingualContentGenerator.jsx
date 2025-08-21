import React, { useMemo } from 'react';
import KeywordDensityOptimizer from '../../utils/KeywordDensityOptimizer';
import { 
  contentTemplates, 
  getPageHeadings, 
  getPageKeywords, 
  getTargetDensity,
  generateSectionContent 
} from '../../data/multilingualContent';

/**
 * 多语言内容生成器组件
 * 根据页面类型和语言生成优化的内容，确保关键词密度在目标范围内
 */
const MultilingualContentGenerator = ({ 
  pageType = 'usb-not-recognized', 
  language = 'zh',
  customContent = null,
  enableOptimization = true 
}) => {
  // 获取页面配置
  const pageKeywords = useMemo(() => getPageKeywords(pageType), [pageType]);
  const targetDensity = useMemo(() => getTargetDensity(pageType), [pageType]);
  const headings = useMemo(() => getPageHeadings(pageType, language), [pageType, language]);

  // 初始化关键词优化器
  const optimizer = useMemo(() => {
    const allKeywords = [
      pageKeywords.primary,
      ...pageKeywords.secondary,
      ...pageKeywords.longTail
    ].filter(Boolean);
    
    return new KeywordDensityOptimizer(allKeywords, targetDensity);
  }, [pageKeywords, targetDensity]);

  // 生成优化的内容
  const generateOptimizedContent = (baseContent, sectionType = 'general') => {
    if (!enableOptimization || !baseContent) {
      return baseContent;
    }

    try {
      const optimizationResult = optimizer.optimizeContent(baseContent);
      return optimizationResult.content;
    } catch (error) {
      console.warn('Content optimization failed:', error);
      return baseContent;
    }
  };

  // 生成章节内容
  const generateSectionContent = (sectionKey) => {
    const template = contentTemplates[pageType]?.[language];
    if (!template || !template.sections || !template.sections[sectionKey]) {
      return '';
    }

    const sectionData = template.sections[sectionKey];
    const baseContent = sectionData.content;
    
    return generateOptimizedContent(baseContent, sectionKey);
  };

  // 生成完整页面内容
  const generateFullPageContent = () => {
    const template = contentTemplates[pageType]?.[language];
    if (!template) {
      return getDefaultContent(language);
    }

    // 如果提供了自定义内容，使用自定义内容
    if (customContent) {
      return generateOptimizedContent(customContent);
    }

    // 生成默认内容结构
    const sections = template.sections || {};
    let fullContent = '';

    // 添加介绍部分
    if (sections.introduction) {
      fullContent += sections.introduction.content + '\n\n';
    }

    // 添加常见原因部分
    if (sections.commonCauses) {
      fullContent += sections.commonCauses.content + '\n\n';
    }

    // 添加解决方案部分
    if (sections.windowsSolutions) {
      fullContent += sections.windowsSolutions.content + '\n\n';
    }

    // 如果内容太短，添加额外内容
    if (fullContent.length < 1000) {
      fullContent += generateAdditionalContent(pageType, language);
    }

    return generateOptimizedContent(fullContent);
  };

  // 生成额外内容以满足最小长度要求
  const generateAdditionalContent = (pageType, language) => {
    const additionalContent = {
      'zh': {
        'usb-not-recognized': `
USB设备识别问题的解决需要系统性的方法。首先，确保USB设备本身没有硬件故障，可以通过在其他计算机上测试设备来验证。其次，检查USB线缆的完整性，损坏的线缆是导致USB不被识别的常见原因之一。

在Windows系统中，USB识别问题经常与驱动程序相关。访问设备管理器，查看是否有带有黄色警告标志的USB设备。如果发现此类设备，尝试更新或重新安装驱动程序。对于某些特殊设备，可能需要从制造商网站下载特定的驱动程序。

USB端口的物理状态也会影响设备识别。检查USB端口是否有灰尘、碎屑或物理损坏。使用压缩空气清洁USB端口，确保连接器能够完全插入。尝试使用不同的USB端口，特别是直接连接到主板的端口，而不是前置面板或USB集线器的端口。

系统的电源管理设置可能会影响USB设备的识别。在设备管理器中，找到"通用串行总线控制器"部分，右键点击USB根集线器，选择属性，然后在电源管理选项卡中取消选择"允许计算机关闭此设备以节约电源"。

对于持续的USB识别问题，可能需要检查系统的注册表。损坏的注册表项可能会阻止USB设备的正确识别。使用注册表编辑器时要格外小心，建议在进行任何更改之前备份注册表。
        `,
        'usb-device-not-recognized': `
USB设备不被识别的问题往往涉及到设备枚举过程的失败。当USB设备连接到计算机时，系统会执行一系列步骤来识别和配置设备。这个过程包括检测设备连接、读取设备描述符、分配设备地址和加载适当的驱动程序。

设备描述符是USB设备向主机系统提供的重要信息，包含设备的制造商ID、产品ID、设备类别和其他关键信息。如果设备描述符损坏或无法正确读取，系统将无法识别USB设备。这种情况可能需要设备固件更新或硬件维修。

USB设备的兼容性问题也可能导致识别失败。某些较旧的USB设备可能与新的操作系统版本不兼容，而某些新设备可能需要特定的系统更新才能正常工作。检查设备制造商的兼容性列表和驱动程序更新。

系统的USB栈问题可能影响设备识别。USB栈是操作系统中处理USB通信的软件层。如果USB栈出现问题，可能需要重新安装USB控制器驱动程序或执行系统修复。

安全软件和防火墙设置有时会阻止USB设备的识别。某些安全程序可能会将未知的USB设备视为潜在威胁并阻止其访问。检查安全软件的设置，确保USB设备访问没有被阻止。
        `
      },
      'en': {
        'usb-not-recognized': `
Solving USB device recognition problems requires a systematic approach. First, ensure that the USB device itself has no hardware faults by testing the device on other computers. Second, check the integrity of the USB cable, as damaged cables are one of the common causes of USB not being recognized.

In Windows systems, USB recognition problems are often related to drivers. Access Device Manager and check if there are USB devices with yellow warning signs. If such devices are found, try updating or reinstalling drivers. For some special devices, you may need to download specific drivers from the manufacturer's website.

The physical condition of USB ports also affects device recognition. Check if USB ports have dust, debris, or physical damage. Use compressed air to clean USB ports and ensure connectors can be fully inserted. Try using different USB ports, especially those directly connected to the motherboard rather than front panel or USB hub ports.

System power management settings may affect USB device recognition. In Device Manager, find the "Universal Serial Bus controllers" section, right-click USB Root Hub, select Properties, then uncheck "Allow the computer to turn off this device to save power" in the Power Management tab.

For persistent USB recognition problems, you may need to check the system registry. Corrupted registry entries may prevent correct USB device recognition. Be extra careful when using Registry Editor and recommend backing up the registry before making any changes.
        `,
        'usb-device-not-recognized': `
USB device not recognized problems often involve failure in the device enumeration process. When a USB device is connected to a computer, the system executes a series of steps to identify and configure the device. This process includes detecting device connection, reading device descriptors, assigning device addresses, and loading appropriate drivers.

Device descriptors are important information that USB devices provide to the host system, containing the device's manufacturer ID, product ID, device category, and other key information. If device descriptors are corrupted or cannot be read correctly, the system will be unable to recognize the USB device. This situation may require device firmware updates or hardware repair.

USB device compatibility issues may also cause recognition failure. Some older USB devices may be incompatible with new operating system versions, while some new devices may require specific system updates to work properly. Check the device manufacturer's compatibility list and driver updates.

System USB stack problems may affect device recognition. The USB stack is the software layer in the operating system that handles USB communication. If the USB stack has problems, you may need to reinstall USB controller drivers or perform system repair.

Security software and firewall settings sometimes block USB device recognition. Some security programs may treat unknown USB devices as potential threats and block their access. Check security software settings to ensure USB device access is not blocked.
        `
      }
    };

    return additionalContent[language]?.[pageType] || '';
  };

  // 获取默认内容
  const getDefaultContent = (language) => {
    const defaultContent = {
      'zh': `USB设备识别问题是计算机用户经常遇到的技术难题。当USB设备无法被系统正确识别时，用户将无法正常使用设备功能。本指南提供了全面的USB识别问题解决方案，帮助用户快速诊断和修复相关问题。

USB识别过程涉及硬件检测、驱动程序加载和系统配置等多个环节。理解这些技术细节有助于更好地解决USB识别问题。通过系统性的故障排除方法，大多数USB识别问题都可以得到有效解决。`,
      
      'en': `USB device recognition problems are technical challenges frequently encountered by computer users. When USB devices cannot be correctly recognized by the system, users will be unable to use device functions normally. This guide provides comprehensive USB recognition problem solutions to help users quickly diagnose and fix related issues.

The USB recognition process involves multiple aspects including hardware detection, driver loading, and system configuration. Understanding these technical details helps better solve USB recognition problems. Through systematic troubleshooting methods, most USB recognition problems can be effectively resolved.`
    };

    return defaultContent[language] || defaultContent['en'];
  };

  // 分析当前内容的关键词密度
  const analyzeCurrentContent = () => {
    const content = generateFullPageContent();
    return optimizer.analyzeContent(content);
  };

  // 渲染内容组件
  const ContentSection = ({ title, content, level = 2 }) => {
    const HeadingTag = `h${level}`;
    
    return (
      <section className="mb-8">
        <HeadingTag className={`font-bold mb-4 ${
          level === 1 ? 'text-3xl' : 
          level === 2 ? 'text-2xl' : 
          'text-xl'
        }`}>
          {title}
        </HeadingTag>
        <div className="prose max-w-none">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    );
  };

  // 主要渲染逻辑
  const renderContent = () => {
    const template = contentTemplates[pageType]?.[language];
    
    if (!template) {
      return (
        <div className="content-container">
          <ContentSection 
            title={`USB Recognition Guide`}
            content={generateFullPageContent()}
            level={1}
          />
        </div>
      );
    }

    return (
      <div className="content-container">
        {/* H1 标题 */}
        <h1 className="text-4xl font-bold mb-8">{headings.h1}</h1>
        
        {/* 主要内容区域 */}
        <div className="content-sections">
          {/* 介绍部分 */}
          {template.sections?.introduction && (
            <ContentSection
              title={template.sections.introduction.title}
              content={generateSectionContent('introduction')}
              level={2}
            />
          )}
          
          {/* 常见原因部分 */}
          {template.sections?.commonCauses && (
            <ContentSection
              title={template.sections.commonCauses.title}
              content={generateSectionContent('commonCauses')}
              level={2}
            />
          )}
          
          {/* Windows解决方案部分 */}
          {template.sections?.windowsSolutions && (
            <ContentSection
              title={template.sections.windowsSolutions.title}
              content={generateSectionContent('windowsSolutions')}
              level={2}
            />
          )}
          
          {/* H2 标题部分 */}
          {headings.h2.map((h2Title, index) => (
            <section key={`h2-${index}`} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{h2Title}</h2>
              
              {/* 相关的H3标题 */}
              {headings.h3.slice(index * 2, (index + 1) * 2).map((h3Title, h3Index) => (
                <div key={`h3-${index}-${h3Index}`} className="ml-4 mb-4">
                  <h3 className="text-xl font-semibold mb-2">{h3Title}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {generateOptimizedContent(
                      `关于${h3Title}的详细解决方案和技术说明。这部分内容将提供具体的操作步骤和专业建议，帮助用户解决相关的USB识别问题。`
                    )}
                  </p>
                </div>
              ))}
            </section>
          ))}
        </div>
        
        {/* 内容分析信息（开发模式下显示） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">内容分析 (开发模式)</h3>
            <ContentAnalysis analysis={analyzeCurrentContent()} />
          </div>
        )}
      </div>
    );
  };

  return renderContent();
};

// 内容分析组件（用于开发调试）
const ContentAnalysis = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="text-sm">
      <p><strong>总字数:</strong> {analysis.wordCount}</p>
      <p><strong>整体评分:</strong> {analysis.overallScore}/100</p>
      <p><strong>是否最佳:</strong> {analysis.isOptimal ? '是' : '否'}</p>
      
      <div className="mt-2">
        <strong>关键词密度:</strong>
        <ul className="ml-4 mt-1">
          {Object.entries(analysis.densities).map(([keyword, density]) => (
            <li key={keyword} className={`${
              density >= 3 && density <= 5 ? 'text-green-600' : 
              density < 3 ? 'text-orange-600' : 'text-red-600'
            }`}>
              {keyword}: {density.toFixed(2)}%
            </li>
          ))}
        </ul>
      </div>
      
      {analysis.recommendations.length > 0 && (
        <div className="mt-2">
          <strong>优化建议:</strong>
          <ul className="ml-4 mt-1">
            {analysis.recommendations.slice(0, 3).map((rec, index) => (
              <li key={index} className="text-gray-600">
                {rec.action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultilingualContentGenerator;