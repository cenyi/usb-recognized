/**
 * Utility functions for troubleshooting content management
 * Provides search, filtering, and content organization capabilities
 */

import { 
  quickSolutions, 
  platformGuides, 
  deviceSpecificSolutions, 
  faqData, 
  errorMessages 
} from '../data/troubleshootingContent.js';

/**
 * Search through all troubleshooting content
 * @param {string} query - Search query
 * @param {Object} filters - Optional filters (platform, difficulty, category)
 * @returns {Object} Search results organized by content type
 */
export const searchTroubleshootingContent = (query, filters = {}) => {
  const normalizedQuery = query.toLowerCase().trim();
  const results = {
    quickSolutions: [],
    platformSolutions: [],
    deviceSolutions: [],
    faq: [],
    errorMessages: [],
    totalResults: 0
  };

  if (!normalizedQuery) return results;

  // Search quick solutions
  results.quickSolutions = quickSolutions.filter(solution => {
    const matchesQuery = 
      solution.title.toLowerCase().includes(normalizedQuery) ||
      solution.description.toLowerCase().includes(normalizedQuery) ||
      solution.steps.some(step => step.toLowerCase().includes(normalizedQuery)) ||
      solution.keywords.some(keyword => keyword.toLowerCase().includes(normalizedQuery));
    
    const matchesFilters = applyFilters(solution, filters);
    return matchesQuery && matchesFilters;
  });

  // Search platform-specific solutions
  Object.entries(platformGuides).forEach(([platform, guide]) => {
    if (filters.platform && filters.platform !== platform) return;
    
    guide.solutions.forEach(solution => {
      const matchesQuery = 
        solution.title.toLowerCase().includes(normalizedQuery) ||
        solution.description.toLowerCase().includes(normalizedQuery) ||
        solution.steps.some(step => step.toLowerCase().includes(normalizedQuery)) ||
        solution.keywords.some(keyword => keyword.toLowerCase().includes(normalizedQuery));
      
      const matchesFilters = applyFilters(solution, filters);
      
      if (matchesQuery && matchesFilters) {
        results.platformSolutions.push({
          ...solution,
          platform: platform,
          platformName: guide.name
        });
      }
    });
  });

  // Search device-specific solutions
  Object.entries(deviceSpecificSolutions).forEach(([deviceType, deviceData]) => {
    if (filters.deviceType && filters.deviceType !== deviceType) return;
    
    deviceData.commonIssues.forEach(issue => {
      const matchesQuery = 
        issue.issue.toLowerCase().includes(normalizedQuery) ||
        issue.description.toLowerCase().includes(normalizedQuery) ||
        issue.keywords.some(keyword => keyword.toLowerCase().includes(normalizedQuery));
      
      if (matchesQuery) {
        results.deviceSolutions.push({
          ...issue,
          deviceType: deviceType,
          deviceName: deviceData.name
        });
      }
    });
  });

  // Search FAQ
  results.faq = faqData.filter(faq => {
    const matchesQuery = 
      faq.question.toLowerCase().includes(normalizedQuery) ||
      faq.answer.toLowerCase().includes(normalizedQuery) ||
      faq.keywords.some(keyword => keyword.toLowerCase().includes(normalizedQuery));
    
    const matchesCategory = !filters.category || faq.category === filters.category;
    return matchesQuery && matchesCategory;
  });

  // Search error messages
  results.errorMessages = errorMessages.filter(error => {
    const matchesQuery = 
      error.message.toLowerCase().includes(normalizedQuery) ||
      error.description.toLowerCase().includes(normalizedQuery) ||
      error.commonCauses.some(cause => cause.toLowerCase().includes(normalizedQuery));
    
    const matchesPlatform = !filters.platform || error.platforms.includes(filters.platform);
    return matchesQuery && matchesPlatform;
  });

  // Calculate total results
  results.totalResults = 
    results.quickSolutions.length +
    results.platformSolutions.length +
    results.deviceSolutions.length +
    results.faq.length +
    results.errorMessages.length;

  return results;
};

/**
 * Apply filters to a solution object
 * @param {Object} solution - Solution to filter
 * @param {Object} filters - Filter criteria
 * @returns {boolean} Whether solution matches filters
 */
const applyFilters = (solution, filters) => {
  if (filters.difficulty && solution.difficulty !== filters.difficulty) {
    return false;
  }
  
  if (filters.platform && solution.platforms && !solution.platforms.includes(filters.platform)) {
    return false;
  }
  
  if (filters.minSuccessRate && solution.successRate < filters.minSuccessRate) {
    return false;
  }
  
  return true;
};

/**
 * Get solutions by platform
 * @param {string} platform - Platform name (windows, mac, linux)
 * @returns {Array} Array of platform-specific solutions
 */
export const getSolutionsByPlatform = (platform) => {
  const platformData = platformGuides[platform];
  if (!platformData) return [];
  
  return platformData.solutions.map(solution => ({
    ...solution,
    platform: platform,
    platformName: platformData.name,
    supportedVersions: platformData.versions
  }));
};

/**
 * Get solutions by device type
 * @param {string} deviceType - Device type (storage, input, mobile)
 * @returns {Array} Array of device-specific solutions
 */
export const getSolutionsByDeviceType = (deviceType) => {
  const deviceData = deviceSpecificSolutions[deviceType];
  if (!deviceData) return [];
  
  return deviceData.commonIssues.map(issue => ({
    ...issue,
    deviceType: deviceType,
    deviceName: deviceData.name,
    supportedTypes: deviceData.types
  }));
};

/**
 * Get FAQ by category
 * @param {string} category - FAQ category (general, windows, mac, linux)
 * @returns {Array} Filtered FAQ items
 */
export const getFAQByCategory = (category) => {
  if (!category) return faqData;
  return faqData.filter(faq => faq.category === category);
};

/**
 * Get related solutions based on solution IDs
 * @param {Array} solutionIds - Array of solution IDs
 * @returns {Array} Array of related solutions
 */
export const getRelatedSolutions = (solutionIds) => {
  const related = [];
  
  // Search in quick solutions
  quickSolutions.forEach(solution => {
    if (solutionIds.includes(solution.id)) {
      related.push({
        ...solution,
        type: 'quick',
        source: 'Quick Solutions'
      });
    }
  });
  
  // Search in platform solutions
  Object.entries(platformGuides).forEach(([platform, guide]) => {
    guide.solutions.forEach(solution => {
      if (solutionIds.includes(solution.id)) {
        related.push({
          ...solution,
          type: 'platform',
          platform: platform,
          source: guide.name
        });
      }
    });
  });
  
  return related;
};

/**
 * Generate diagnostic recommendations based on user input
 * @param {Object} diagnosticData - User's diagnostic responses
 * @returns {Object} Recommended solutions and next steps
 */
export const generateDiagnosticRecommendations = (diagnosticData) => {
  const { deviceType, operatingSystem, issueType, hasTriedBasics } = diagnosticData;
  const recommendations = {
    immediate: [],
    followUp: [],
    advanced: [],
    confidence: 0
  };

  // Start with quick solutions if user hasn't tried basics
  if (!hasTriedBasics) {
    recommendations.immediate = quickSolutions
      .filter(solution => 
        !solution.platforms || solution.platforms.includes(operatingSystem)
      )
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 3);
    recommendations.confidence = 0.8;
  }

  // Add platform-specific solutions
  const platformSolutions = getSolutionsByPlatform(operatingSystem);
  if (platformSolutions.length > 0) {
    recommendations.followUp = platformSolutions
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 2);
    recommendations.confidence = Math.max(recommendations.confidence, 0.7);
  }

  // Add device-specific solutions if device type is known
  if (deviceType && deviceType !== 'other') {
    const deviceSolutions = getSolutionsByDeviceType(deviceType);
    if (deviceSolutions.length > 0) {
      recommendations.advanced = deviceSolutions.slice(0, 2);
      recommendations.confidence = Math.max(recommendations.confidence, 0.9);
    }
  }

  // Adjust confidence based on issue type
  if (issueType === 'nothing-happens') {
    recommendations.confidence *= 0.9; // Hardware issues are harder to diagnose
  } else if (issueType === 'error-message') {
    recommendations.confidence *= 1.1; // Error messages provide more info
  }

  return recommendations;
};

/**
 * Get popular FAQ items based on search volume
 * @param {number} limit - Number of items to return
 * @returns {Array} Most popular FAQ items
 */
export const getPopularFAQ = (limit = 10) => {
  return faqData
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, limit);
};

/**
 * Validate troubleshooting content structure
 * @param {Object} content - Content object to validate
 * @returns {Object} Validation results
 */
export const validateContent = (content) => {
  const errors = [];
  const warnings = [];

  // Validate required fields
  const requiredFields = ['id', 'title', 'description', 'steps'];
  requiredFields.forEach(field => {
    if (!content[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate steps array
  if (content.steps && !Array.isArray(content.steps)) {
    errors.push('Steps must be an array');
  } else if (content.steps && content.steps.length === 0) {
    warnings.push('Steps array is empty');
  }

  // Validate success rate
  if (content.successRate && (content.successRate < 0 || content.successRate > 100)) {
    errors.push('Success rate must be between 0 and 100');
  }

  // Validate difficulty level
  const validDifficulties = ['beginner', 'intermediate', 'advanced'];
  if (content.difficulty && !validDifficulties.includes(content.difficulty)) {
    errors.push(`Invalid difficulty level. Must be one of: ${validDifficulties.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Format time duration for display
 * @param {string} timeRequired - Time string like "2-5 minutes"
 * @returns {string} Formatted time string
 */
export const formatTimeRequired = (timeRequired) => {
  if (!timeRequired) return 'Time varies';
  
  // Convert common patterns to more readable format
  return timeRequired
    .replace(/(\d+)-(\d+)\s*minutes?/i, '$1-$2 min')
    .replace(/(\d+)\s*minutes?/i, '$1 min')
    .replace(/(\d+)\s*hours?/i, '$1 hr');
};

/**
 * Calculate solution difficulty score
 * @param {Object} solution - Solution object
 * @returns {number} Difficulty score (1-10)
 */
export const calculateDifficultyScore = (solution) => {
  let score = 1;
  
  // Base difficulty
  const difficultyMap = {
    'beginner': 2,
    'intermediate': 5,
    'advanced': 8
  };
  score = difficultyMap[solution.difficulty] || 3;
  
  // Adjust based on number of steps
  if (solution.steps) {
    if (solution.steps.length > 10) score += 2;
    else if (solution.steps.length > 5) score += 1;
  }
  
  // Adjust based on registry edits or command line usage
  if (solution.registryEdits || solution.commands) {
    score += 2;
  }
  
  return Math.min(score, 10);
};

export default {
  searchTroubleshootingContent,
  getSolutionsByPlatform,
  getSolutionsByDeviceType,
  getFAQByCategory,
  getRelatedSolutions,
  generateDiagnosticRecommendations,
  getPopularFAQ,
  validateContent,
  formatTimeRequired,
  calculateDifficultyScore
};