/**
 * Unit tests for troubleshooting utilities
 */

import {
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
} from '../troubleshootingUtils.js';

// Mock data for testing
const mockSolution = {
  id: 'test-solution',
  title: 'Test USB Solution',
  description: 'A test solution for USB issues',
  steps: ['Step 1', 'Step 2', 'Step 3'],
  successRate: 75,
  difficulty: 'intermediate',
  platforms: ['windows', 'mac'],
  keywords: ['usb', 'test', 'solution']
};

describe('troubleshootingUtils', () => {
  describe('searchTroubleshootingContent', () => {
    test('should return empty results for empty query', () => {
      const results = searchTroubleshootingContent('');
      expect(results.totalResults).toBe(0);
      expect(results.quickSolutions).toHaveLength(0);
    });

    test('should find results for valid query', () => {
      const results = searchTroubleshootingContent('usb not recognized');
      expect(results.totalResults).toBeGreaterThan(0);
      expect(results.quickSolutions.length + results.faq.length).toBeGreaterThan(0);
    });

    test('should filter by platform', () => {
      const results = searchTroubleshootingContent('driver', { platform: 'windows' });
      results.platformSolutions.forEach(solution => {
        expect(solution.platform).toBe('windows');
      });
    });

    test('should filter by difficulty', () => {
      const results = searchTroubleshootingContent('usb', { difficulty: 'beginner' });
      results.quickSolutions.forEach(solution => {
        expect(solution.difficulty).toBe('beginner');
      });
    });
  });

  describe('getSolutionsByPlatform', () => {
    test('should return Windows solutions', () => {
      const solutions = getSolutionsByPlatform('windows');
      expect(solutions).toBeInstanceOf(Array);
      expect(solutions.length).toBeGreaterThan(0);
      solutions.forEach(solution => {
        expect(solution.platform).toBe('windows');
        expect(solution.platformName).toBe('Windows USB Troubleshooting');
      });
    });

    test('should return Mac solutions', () => {
      const solutions = getSolutionsByPlatform('mac');
      expect(solutions).toBeInstanceOf(Array);
      expect(solutions.length).toBeGreaterThan(0);
      solutions.forEach(solution => {
        expect(solution.platform).toBe('mac');
      });
    });

    test('should return empty array for invalid platform', () => {
      const solutions = getSolutionsByPlatform('invalid-platform');
      expect(solutions).toHaveLength(0);
    });
  });

  describe('getSolutionsByDeviceType', () => {
    test('should return storage device solutions', () => {
      const solutions = getSolutionsByDeviceType('storage');
      expect(solutions).toBeInstanceOf(Array);
      expect(solutions.length).toBeGreaterThan(0);
      solutions.forEach(solution => {
        expect(solution.deviceType).toBe('storage');
        expect(solution.deviceName).toBe('USB Storage Devices');
      });
    });

    test('should return input device solutions', () => {
      const solutions = getSolutionsByDeviceType('input');
      expect(solutions).toBeInstanceOf(Array);
      expect(solutions.length).toBeGreaterThan(0);
    });

    test('should return empty array for invalid device type', () => {
      const solutions = getSolutionsByDeviceType('invalid-device');
      expect(solutions).toHaveLength(0);
    });
  });

  describe('getFAQByCategory', () => {
    test('should return all FAQ when no category specified', () => {
      const faq = getFAQByCategory();
      expect(faq).toBeInstanceOf(Array);
      expect(faq.length).toBeGreaterThan(0);
    });

    test('should filter FAQ by category', () => {
      const windowsFaq = getFAQByCategory('windows');
      expect(windowsFaq).toBeInstanceOf(Array);
      windowsFaq.forEach(item => {
        expect(item.category).toBe('windows');
      });
    });

    test('should return empty array for non-existent category', () => {
      const faq = getFAQByCategory('non-existent');
      expect(faq).toHaveLength(0);
    });
  });

  describe('getRelatedSolutions', () => {
    test('should return related solutions for valid IDs', () => {
      const related = getRelatedSolutions(['basic-checks', 'driver-update']);
      expect(related).toBeInstanceOf(Array);
      expect(related.length).toBeGreaterThan(0);
      related.forEach(solution => {
        expect(['basic-checks', 'driver-update']).toContain(solution.id);
      });
    });

    test('should return empty array for invalid IDs', () => {
      const related = getRelatedSolutions(['invalid-id-1', 'invalid-id-2']);
      expect(related).toHaveLength(0);
    });
  });

  describe('generateDiagnosticRecommendations', () => {
    test('should generate recommendations for new user', () => {
      const diagnosticData = {
        deviceType: 'storage',
        operatingSystem: 'windows',
        issueType: 'nothing-happens',
        hasTriedBasics: false
      };
      
      const recommendations = generateDiagnosticRecommendations(diagnosticData);
      expect(recommendations.immediate).toBeInstanceOf(Array);
      expect(recommendations.immediate.length).toBeGreaterThan(0);
      expect(recommendations.confidence).toBeGreaterThan(0);
    });

    test('should adjust confidence based on issue type', () => {
      const diagnosticData1 = {
        deviceType: 'storage',
        operatingSystem: 'windows',
        issueType: 'nothing-happens',
        hasTriedBasics: false
      };
      
      const diagnosticData2 = {
        ...diagnosticData1,
        issueType: 'error-message'
      };
      
      const rec1 = generateDiagnosticRecommendations(diagnosticData1);
      const rec2 = generateDiagnosticRecommendations(diagnosticData2);
      
      expect(rec2.confidence).toBeGreaterThan(rec1.confidence);
    });
  });

  describe('getPopularFAQ', () => {
    test('should return popular FAQ items', () => {
      const popular = getPopularFAQ(5);
      expect(popular).toBeInstanceOf(Array);
      expect(popular.length).toBeLessThanOrEqual(5);
      
      // Should be sorted by search volume (descending)
      for (let i = 1; i < popular.length; i++) {
        expect(popular[i-1].searchVolume).toBeGreaterThanOrEqual(popular[i].searchVolume);
      }
    });

    test('should respect limit parameter', () => {
      const popular = getPopularFAQ(3);
      expect(popular.length).toBeLessThanOrEqual(3);
    });
  });

  describe('validateContent', () => {
    test('should validate correct content structure', () => {
      const validation = validateContent(mockSolution);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should detect missing required fields', () => {
      const invalidContent = {
        title: 'Test Solution'
        // Missing id, description, steps
      };
      
      const validation = validateContent(invalidContent);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors.some(error => error.includes('id'))).toBe(true);
    });

    test('should validate success rate range', () => {
      const invalidContent = {
        ...mockSolution,
        successRate: 150 // Invalid: > 100
      };
      
      const validation = validateContent(invalidContent);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(error => error.includes('Success rate'))).toBe(true);
    });

    test('should validate difficulty level', () => {
      const invalidContent = {
        ...mockSolution,
        difficulty: 'expert' // Invalid difficulty
      };
      
      const validation = validateContent(invalidContent);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(error => error.includes('difficulty'))).toBe(true);
    });

    test('should warn about empty steps', () => {
      const contentWithEmptySteps = {
        ...mockSolution,
        steps: []
      };
      
      const validation = validateContent(contentWithEmptySteps);
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings.some(warning => warning.includes('empty'))).toBe(true);
    });
  });

  describe('formatTimeRequired', () => {
    test('should format time ranges', () => {
      expect(formatTimeRequired('2-5 minutes')).toBe('2-5 min');
      expect(formatTimeRequired('10-15 minutes')).toBe('10-15 min');
    });

    test('should format single time values', () => {
      expect(formatTimeRequired('5 minutes')).toBe('5 min');
      expect(formatTimeRequired('1 hour')).toBe('1 hr');
    });

    test('should handle undefined input', () => {
      expect(formatTimeRequired()).toBe('Time varies');
      expect(formatTimeRequired(null)).toBe('Time varies');
    });

    test('should handle already formatted strings', () => {
      expect(formatTimeRequired('Quick')).toBe('Quick');
      expect(formatTimeRequired('Varies')).toBe('Varies');
    });
  });

  describe('calculateDifficultyScore', () => {
    test('should calculate score based on difficulty level', () => {
      const beginnerSolution = { ...mockSolution, difficulty: 'beginner' };
      const advancedSolution = { ...mockSolution, difficulty: 'advanced' };
      
      const beginnerScore = calculateDifficultyScore(beginnerSolution);
      const advancedScore = calculateDifficultyScore(advancedSolution);
      
      expect(advancedScore).toBeGreaterThan(beginnerScore);
    });

    test('should adjust score based on number of steps', () => {
      const fewStepsSolution = { ...mockSolution, steps: ['Step 1', 'Step 2'] };
      const manyStepsSolution = { 
        ...mockSolution, 
        steps: Array.from({ length: 12 }, (_, i) => `Step ${i + 1}`)
      };
      
      const fewStepsScore = calculateDifficultyScore(fewStepsSolution);
      const manyStepsScore = calculateDifficultyScore(manyStepsSolution);
      
      expect(manyStepsScore).toBeGreaterThan(fewStepsScore);
    });

    test('should increase score for registry edits', () => {
      const basicSolution = { ...mockSolution };
      const registrySolution = { 
        ...mockSolution, 
        registryEdits: [{ path: 'HKEY_LOCAL_MACHINE\\...', action: 'modify' }]
      };
      
      const basicScore = calculateDifficultyScore(basicSolution);
      const registryScore = calculateDifficultyScore(registrySolution);
      
      expect(registryScore).toBeGreaterThan(basicScore);
    });

    test('should cap score at 10', () => {
      const complexSolution = {
        ...mockSolution,
        difficulty: 'advanced',
        steps: Array.from({ length: 20 }, (_, i) => `Step ${i + 1}`),
        registryEdits: [{ path: 'test', action: 'modify' }],
        commands: [{ command: 'test', description: 'test' }]
      };
      
      const score = calculateDifficultyScore(complexSolution);
      expect(score).toBeLessThanOrEqual(10);
    });
  });
});

// Integration tests
describe('troubleshootingUtils integration', () => {
  test('should work together for complete workflow', () => {
    // Search for content
    const searchResults = searchTroubleshootingContent('usb not recognized');
    expect(searchResults.totalResults).toBeGreaterThan(0);
    
    // Get platform-specific solutions
    const windowsSolutions = getSolutionsByPlatform('windows');
    expect(windowsSolutions.length).toBeGreaterThan(0);
    
    // Generate diagnostic recommendations
    const diagnosticData = {
      deviceType: 'storage',
      operatingSystem: 'windows',
      issueType: 'nothing-happens',
      hasTriedBasics: false
    };
    
    const recommendations = generateDiagnosticRecommendations(diagnosticData);
    expect(recommendations.immediate.length).toBeGreaterThan(0);
    
    // Validate content structure
    if (recommendations.immediate.length > 0) {
      const validation = validateContent(recommendations.immediate[0]);
      expect(validation.isValid).toBe(true);
    }
  });

  test('should handle edge cases gracefully', () => {
    // Empty search
    expect(() => searchTroubleshootingContent('')).not.toThrow();
    
    // Invalid platform
    expect(() => getSolutionsByPlatform('invalid')).not.toThrow();
    
    // Invalid device type
    expect(() => getSolutionsByDeviceType('invalid')).not.toThrow();
    
    // Empty diagnostic data
    expect(() => generateDiagnosticRecommendations({})).not.toThrow();
  });
});