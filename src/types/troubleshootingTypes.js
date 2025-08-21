/**
 * Type definitions and PropTypes for troubleshooting content
 * Provides validation and documentation for data structures
 */

import PropTypes from 'prop-types';

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

// Platform types
export const PLATFORMS = {
  WINDOWS: 'windows',
  MAC: 'mac',
  LINUX: 'linux'
};

// Device types
export const DEVICE_TYPES = {
  STORAGE: 'storage',
  INPUT: 'input',
  MOBILE: 'mobile',
  SPECIALIZED: 'specialized'
};

// FAQ categories
export const FAQ_CATEGORIES = {
  GENERAL: 'general',
  WINDOWS: 'windows',
  MAC: 'mac',
  LINUX: 'linux'
};

// Issue types for diagnostics
export const ISSUE_TYPES = {
  NOTHING_HAPPENS: 'nothing-happens',
  ERROR_MESSAGE: 'error-message',
  DETECTED_NOT_WORKING: 'detected-not-working',
  INTERMITTENT: 'intermittent'
};

// PropTypes for solution objects
export const SolutionPropTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  successRate: PropTypes.number,
  timeRequired: PropTypes.string,
  difficulty: PropTypes.oneOf(Object.values(DIFFICULTY_LEVELS)),
  platforms: PropTypes.arrayOf(PropTypes.oneOf(Object.values(PLATFORMS))),
  keywords: PropTypes.arrayOf(PropTypes.string),
  category: PropTypes.string,
  screenshots: PropTypes.arrayOf(PropTypes.string),
  registryEdits: PropTypes.arrayOf(PropTypes.shape({
    warning: PropTypes.string,
    path: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    value: PropTypes.string
  })),
  commands: PropTypes.arrayOf(PropTypes.shape({
    command: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    platform: PropTypes.oneOf(Object.values(PLATFORMS))
  })),
  alternativeSteps: PropTypes.arrayOf(PropTypes.string),
  deviceSpecific: PropTypes.object,
  macOSVersions: PropTypes.object
};

// PropTypes for FAQ items
export const FAQPropTypes = {
  id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  category: PropTypes.oneOf(Object.values(FAQ_CATEGORIES)).isRequired,
  searchVolume: PropTypes.number,
  relatedSolutions: PropTypes.arrayOf(PropTypes.string),
  keywords: PropTypes.arrayOf(PropTypes.string).isRequired
};

// PropTypes for device-specific issues
export const DeviceIssuePropTypes = {
  id: PropTypes.string.isRequired,
  issue: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  solutions: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.oneOf(Object.values(PLATFORMS)).isRequired,
    steps: PropTypes.arrayOf(PropTypes.string).isRequired
  })).isRequired,
  successRate: PropTypes.number,
  keywords: PropTypes.arrayOf(PropTypes.string).isRequired
};

// PropTypes for error messages
export const ErrorMessagePropTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  platforms: PropTypes.arrayOf(PropTypes.oneOf(Object.values(PLATFORMS))).isRequired,
  description: PropTypes.string.isRequired,
  solutions: PropTypes.arrayOf(PropTypes.string).isRequired,
  commonCauses: PropTypes.arrayOf(PropTypes.string).isRequired
};

// PropTypes for visual guides
export const VisualGuidePropTypes = {
  usbConnectors: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    commonUses: PropTypes.arrayOf(PropTypes.string).isRequired
  })),
  commonErrors: PropTypes.arrayOf(PropTypes.shape({
    error: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    meaning: PropTypes.string.isRequired,
    solution: PropTypes.string.isRequired
  }))
};

// PropTypes for diagnostic data
export const DiagnosticDataPropTypes = {
  deviceType: PropTypes.oneOf([...Object.values(DEVICE_TYPES), 'other']),
  operatingSystem: PropTypes.oneOf(Object.values(PLATFORMS)).isRequired,
  issueType: PropTypes.oneOf(Object.values(ISSUE_TYPES)).isRequired,
  hasTriedBasics: PropTypes.bool,
  errorMessage: PropTypes.string,
  deviceBrand: PropTypes.string,
  connectionType: PropTypes.string
};

// PropTypes for search results
export const SearchResultsPropTypes = {
  quickSolutions: PropTypes.arrayOf(PropTypes.shape(SolutionPropTypes)),
  platformSolutions: PropTypes.arrayOf(PropTypes.shape({
    ...SolutionPropTypes,
    platform: PropTypes.oneOf(Object.values(PLATFORMS)).isRequired,
    platformName: PropTypes.string.isRequired
  })),
  deviceSolutions: PropTypes.arrayOf(PropTypes.shape({
    ...DeviceIssuePropTypes,
    deviceType: PropTypes.oneOf(Object.values(DEVICE_TYPES)).isRequired,
    deviceName: PropTypes.string.isRequired
  })),
  faq: PropTypes.arrayOf(PropTypes.shape(FAQPropTypes)),
  errorMessages: PropTypes.arrayOf(PropTypes.shape(ErrorMessagePropTypes)),
  totalResults: PropTypes.number.isRequired
};

// PropTypes for diagnostic recommendations
export const DiagnosticRecommendationsPropTypes = {
  immediate: PropTypes.arrayOf(PropTypes.shape(SolutionPropTypes)),
  followUp: PropTypes.arrayOf(PropTypes.shape(SolutionPropTypes)),
  advanced: PropTypes.arrayOf(PropTypes.shape(SolutionPropTypes)),
  confidence: PropTypes.number.isRequired
};

// Validation functions
export const validateSolution = (solution) => {
  const errors = [];
  
  if (!solution.id || typeof solution.id !== 'string') {
    errors.push('Solution must have a valid string ID');
  }
  
  if (!solution.title || typeof solution.title !== 'string') {
    errors.push('Solution must have a valid title');
  }
  
  if (!solution.description || typeof solution.description !== 'string') {
    errors.push('Solution must have a valid description');
  }
  
  if (!Array.isArray(solution.steps) || solution.steps.length === 0) {
    errors.push('Solution must have at least one step');
  }
  
  if (solution.successRate !== undefined) {
    if (typeof solution.successRate !== 'number' || 
        solution.successRate < 0 || 
        solution.successRate > 100) {
      errors.push('Success rate must be a number between 0 and 100');
    }
  }
  
  if (solution.difficulty && !Object.values(DIFFICULTY_LEVELS).includes(solution.difficulty)) {
    errors.push(`Difficulty must be one of: ${Object.values(DIFFICULTY_LEVELS).join(', ')}`);
  }
  
  if (solution.platforms) {
    if (!Array.isArray(solution.platforms)) {
      errors.push('Platforms must be an array');
    } else {
      const invalidPlatforms = solution.platforms.filter(
        platform => !Object.values(PLATFORMS).includes(platform)
      );
      if (invalidPlatforms.length > 0) {
        errors.push(`Invalid platforms: ${invalidPlatforms.join(', ')}`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateFAQ = (faq) => {
  const errors = [];
  
  if (!faq.id || typeof faq.id !== 'string') {
    errors.push('FAQ must have a valid string ID');
  }
  
  if (!faq.question || typeof faq.question !== 'string') {
    errors.push('FAQ must have a valid question');
  }
  
  if (!faq.answer || typeof faq.answer !== 'string') {
    errors.push('FAQ must have a valid answer');
  }
  
  if (!faq.category || !Object.values(FAQ_CATEGORIES).includes(faq.category)) {
    errors.push(`FAQ category must be one of: ${Object.values(FAQ_CATEGORIES).join(', ')}`);
  }
  
  if (!Array.isArray(faq.keywords) || faq.keywords.length === 0) {
    errors.push('FAQ must have at least one keyword');
  }
  
  if (faq.searchVolume !== undefined && 
      (typeof faq.searchVolume !== 'number' || faq.searchVolume < 0)) {
    errors.push('Search volume must be a non-negative number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateDiagnosticData = (data) => {
  const errors = [];
  
  if (!data.operatingSystem || !Object.values(PLATFORMS).includes(data.operatingSystem)) {
    errors.push(`Operating system must be one of: ${Object.values(PLATFORMS).join(', ')}`);
  }
  
  if (!data.issueType || !Object.values(ISSUE_TYPES).includes(data.issueType)) {
    errors.push(`Issue type must be one of: ${Object.values(ISSUE_TYPES).join(', ')}`);
  }
  
  if (data.deviceType && 
      data.deviceType !== 'other' && 
      !Object.values(DEVICE_TYPES).includes(data.deviceType)) {
    errors.push(`Device type must be one of: ${Object.values(DEVICE_TYPES).join(', ')}, other`);
  }
  
  if (data.hasTriedBasics !== undefined && typeof data.hasTriedBasics !== 'boolean') {
    errors.push('hasTriedBasics must be a boolean');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Type guards for runtime type checking
export const isSolution = (obj) => {
  return obj && 
         typeof obj.id === 'string' &&
         typeof obj.title === 'string' &&
         typeof obj.description === 'string' &&
         Array.isArray(obj.steps);
};

export const isFAQ = (obj) => {
  return obj &&
         typeof obj.id === 'string' &&
         typeof obj.question === 'string' &&
         typeof obj.answer === 'string' &&
         typeof obj.category === 'string' &&
         Array.isArray(obj.keywords);
};

export const isDiagnosticData = (obj) => {
  return obj &&
         typeof obj.operatingSystem === 'string' &&
         typeof obj.issueType === 'string';
};

// Default values
export const DEFAULT_SOLUTION = {
  id: '',
  title: '',
  description: '',
  steps: [],
  successRate: 50,
  timeRequired: 'Varies',
  difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
  platforms: [],
  keywords: []
};

export const DEFAULT_FAQ = {
  id: '',
  question: '',
  answer: '',
  category: FAQ_CATEGORIES.GENERAL,
  searchVolume: 0,
  relatedSolutions: [],
  keywords: []
};

export const DEFAULT_DIAGNOSTIC_DATA = {
  deviceType: null,
  operatingSystem: PLATFORMS.WINDOWS,
  issueType: ISSUE_TYPES.NOTHING_HAPPENS,
  hasTriedBasics: false,
  errorMessage: '',
  deviceBrand: '',
  connectionType: ''
};

export default {
  DIFFICULTY_LEVELS,
  PLATFORMS,
  DEVICE_TYPES,
  FAQ_CATEGORIES,
  ISSUE_TYPES,
  SolutionPropTypes,
  FAQPropTypes,
  DeviceIssuePropTypes,
  ErrorMessagePropTypes,
  VisualGuidePropTypes,
  DiagnosticDataPropTypes,
  SearchResultsPropTypes,
  DiagnosticRecommendationsPropTypes,
  validateSolution,
  validateFAQ,
  validateDiagnosticData,
  isSolution,
  isFAQ,
  isDiagnosticData,
  DEFAULT_SOLUTION,
  DEFAULT_FAQ,
  DEFAULT_DIAGNOSTIC_DATA
};