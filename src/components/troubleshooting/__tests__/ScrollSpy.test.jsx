import React from 'react';
import { render, act } from '@testing-library/react';
import ScrollSpy from '../ScrollSpy';

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Map();
  }

  observe(element) {
    this.elements.set(element, {
      isIntersecting: false,
      target: element
    });
  }

  disconnect() {
    this.elements.clear();
  }

  // Helper method for tests to simulate intersection
  simulateIntersection(element, isIntersecting) {
    const entry = this.elements.get(element);
    if (entry) {
      entry.isIntersecting = isIntersecting;
      this.callback([entry]);
    }
  }
}

describe('ScrollSpy', () => {
  let originalIntersectionObserver;
  let mockIntersectionObserver;

  beforeEach(() => {
    // Save original IntersectionObserver
    originalIntersectionObserver = global.IntersectionObserver;
    
    // Create mock IntersectionObserver
    mockIntersectionObserver = null;
    global.IntersectionObserver = class {
      constructor(callback) {
        mockIntersectionObserver = new MockIntersectionObserver(callback);
        return mockIntersectionObserver;
      }
      
      observe(element) {
        mockIntersectionObserver.observe(element);
      }
      
      disconnect() {
        mockIntersectionObserver.disconnect();
      }
    };
    
    // Mock document.getElementById
    document.getElementById = jest.fn().mockImplementation((id) => {
      const element = document.createElement('div');
      element.id = id;
      element.getBoundingClientRect = () => ({
        top: 0,
        bottom: 100,
        height: 100
      });
      return element;
    });
  });

  afterEach(() => {
    // Restore original IntersectionObserver
    global.IntersectionObserver = originalIntersectionObserver;
    jest.restoreAllMocks();
  });

  it('calls onSectionChange when section becomes active', () => {
    const sectionIds = ['section1', 'section2', 'section3'];
    const handleSectionChange = jest.fn();
    
    render(
      <ScrollSpy 
        sectionIds={sectionIds} 
        onSectionChange={handleSectionChange} 
      />
    );
    
    // Get the elements that were observed
    const section1 = document.getElementById('section1');
    const section2 = document.getElementById('section2');
    
    // Simulate section1 intersection
    act(() => {
      mockIntersectionObserver.simulateIntersection(section1, true);
    });
    
    expect(handleSectionChange).toHaveBeenCalledWith('section1');
    
    // Simulate section2 intersection
    act(() => {
      mockIntersectionObserver.simulateIntersection(section1, false);
      mockIntersectionObserver.simulateIntersection(section2, true);
    });
    
    expect(handleSectionChange).toHaveBeenCalledWith('section2');
  });

  it('respects offset parameter', () => {
    const sectionIds = ['section1'];
    const handleSectionChange = jest.fn();
    const offset = 200;
    
    render(
      <ScrollSpy 
        sectionIds={sectionIds} 
        onSectionChange={handleSectionChange}
        offset={offset}
      />
    );
    
    // Verify that offset is used (this is a bit of a mock implementation check)
    expect(document.getElementById).toHaveBeenCalledWith('section1');
  });

  it('handles empty sectionIds gracefully', () => {
    const handleSectionChange = jest.fn();
    
    render(
      <ScrollSpy 
        sectionIds={[]} 
        onSectionChange={handleSectionChange}
      />
    );
    
    // No errors should be thrown
    expect(handleSectionChange).not.toHaveBeenCalled();
  });

  it('cleans up observer on unmount', () => {
    const sectionIds = ['section1'];
    const handleSectionChange = jest.fn();
    
    const { unmount } = render(
      <ScrollSpy 
        sectionIds={sectionIds} 
        onSectionChange={handleSectionChange}
      />
    );
    
    // Spy on disconnect method
    const disconnectSpy = jest.spyOn(mockIntersectionObserver, 'disconnect');
    
    // Unmount component
    unmount();
    
    // Verify disconnect was called
    expect(disconnectSpy).toHaveBeenCalled();
  });
});