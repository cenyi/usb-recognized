import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sun, 
  Moon, 
  ZoomIn, 
  ZoomOut, 
  Type, 
  Contrast, 
  MousePointer2
} from 'lucide-react';

/**
 * Accessibility controls component for enhancing user experience
 * Provides high contrast mode, font size adjustment, and other accessibility features
 */
const AccessibilityControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  // Apply accessibility settings when they change
  useEffect(() => {
    // High contrast mode
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }

    // Font size
    document.documentElement.style.fontSize = `${fontSize}%`;

    // Reduced motion
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }

    // Focus visible
    if (focusVisible) {
      document.documentElement.classList.add('focus-visible');
    } else {
      document.documentElement.classList.remove('focus-visible');
    }

    // Save settings to localStorage
    localStorage.setItem('accessibility', JSON.stringify({
      highContrast,
      fontSize,
      reducedMotion,
      focusVisible
    }));
  }, [highContrast, fontSize, reducedMotion, focusVisible]);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setHighContrast(settings.highContrast || false);
        setFontSize(settings.fontSize || 100);
        setReducedMotion(settings.reducedMotion || false);
        setFocusVisible(settings.focusVisible || false);
      } catch (error) {
        console.error('Failed to parse accessibility settings', error);
      }
    }

    // Check for user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setReducedMotion(true);
    }
  }, []);

  // Increase font size
  const increaseFontSize = () => {
    if (fontSize < 150) {
      setFontSize(fontSize + 10);
    }
  };

  // Decrease font size
  const decreaseFontSize = () => {
    if (fontSize > 80) {
      setFontSize(fontSize - 10);
    }
  };

  // Reset all settings
  const resetSettings = () => {
    setHighContrast(false);
    setFontSize(100);
    setReducedMotion(false);
    setFocusVisible(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Accessibility Options</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
              aria-label="Close accessibility menu"
            >
              ×
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Type size={16} />
                  Font Size
                </label>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={decreaseFontSize}
                    disabled={fontSize <= 80}
                    aria-label="Decrease font size"
                  >
                    <ZoomOut size={14} />
                  </Button>
                  <span className="mx-2 text-sm">{fontSize}%</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={increaseFontSize}
                    disabled={fontSize >= 150}
                    aria-label="Increase font size"
                  >
                    <ZoomIn size={14} />
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <button
                className={`flex items-center justify-between w-full p-2 rounded-md ${
                  highContrast ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
                onClick={() => setHighContrast(!highContrast)}
                aria-pressed={highContrast}
              >
                <span className="flex items-center gap-2">
                  <Contrast size={16} />
                  <span className="text-sm font-medium">High Contrast</span>
                </span>
                <span className={`w-8 h-4 rounded-full relative ${
                  highContrast ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  <span className={`absolute w-3 h-3 rounded-full bg-white top-0.5 transition-all ${
                    highContrast ? 'left-[18px]' : 'left-0.5'
                  }`}></span>
                </span>
              </button>
            </div>
            
            <div>
              <button
                className={`flex items-center justify-between w-full p-2 rounded-md ${
                  reducedMotion ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
                onClick={() => setReducedMotion(!reducedMotion)}
                aria-pressed={reducedMotion}
              >
                <span className="flex items-center gap-2">
                  <Moon size={16} />
                  <span className="text-sm font-medium">Reduce Motion</span>
                </span>
                <span className={`w-8 h-4 rounded-full relative ${
                  reducedMotion ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  <span className={`absolute w-3 h-3 rounded-full bg-white top-0.5 transition-all ${
                    reducedMotion ? 'left-[18px]' : 'left-0.5'
                  }`}></span>
                </span>
              </button>
            </div>
            
            <div>
              <button
                className={`flex items-center justify-between w-full p-2 rounded-md ${
                  focusVisible ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
                onClick={() => setFocusVisible(!focusVisible)}
                aria-pressed={focusVisible}
              >
                <span className="flex items-center gap-2">
                  <MousePointer2 size={16} />
                  <span className="text-sm font-medium">Focus Indicator</span>
                </span>
                <span className={`w-8 h-4 rounded-full relative ${
                  focusVisible ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  <span className={`absolute w-3 h-3 rounded-full bg-white top-0.5 transition-all ${
                    focusVisible ? 'left-[18px]' : 'left-0.5'
                  }`}></span>
                </span>
              </button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={resetSettings}
            >
              Reset to Default
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="default"
          size="icon"
          className="rounded-full h-12 w-12 shadow-lg"
          onClick={() => setIsOpen(true)}
          aria-label="Open accessibility options"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
          </svg>
        </Button>
      )}
    </div>
  );
};

export default AccessibilityControls;