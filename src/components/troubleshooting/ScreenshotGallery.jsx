import React from 'react';
import PropTypes from 'prop-types';
import { visualGuides } from '../../data/troubleshootingContent';

/**
 * ScreenshotGallery component displays visual guides with screenshots
 * Helps users understand USB troubleshooting through images
 */
const ScreenshotGallery = ({ guideType = 'all' }) => {
  // Get screenshots based on guide type
  const getScreenshots = () => {
    switch (guideType) {
      case 'connectors':
        return visualGuides.usbConnectors;
      case 'errors':
        return visualGuides.commonErrors;
      case 'all':
      default:
        return [
          ...visualGuides.usbConnectors.map(item => ({
            ...item,
            category: 'USB Connectors'
          })),
          ...visualGuides.commonErrors.map(item => ({
            ...item,
            category: 'Common Errors'
          }))
        ];
    }
  };

  const screenshots = getScreenshots();

  return (
    <div>
      {screenshots.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No screenshots available for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {screenshots.map((item, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3">
                <h3 className="font-medium text-gray-800">{item.type || item.error}</h3>
                {item.category && (
                  <span className="text-xs text-gray-500">{item.category}</span>
                )}
              </div>
              
              <div className="p-4">
                <div className="bg-gray-100 rounded mb-3 flex items-center justify-center min-h-[150px]">
                  <img 
                    src={item.image || '/images/placeholder.png'} 
                    alt={item.type || item.error}
                    className="max-h-40 object-contain"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png';
                    }}
                  />
                </div>
                
                <p className="text-gray-600 text-sm mb-2">
                  {item.description || item.meaning}
                </p>
                
                {item.commonUses && (
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Common Uses:</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      {item.commonUses.map((use, useIndex) => (
                        <li key={useIndex} className="text-xs text-gray-600">{use}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {item.solution && (
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Solution:</h4>
                    <p className="text-xs text-gray-600">{item.solution}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ScreenshotGallery.propTypes = {
  guideType: PropTypes.oneOf(['all', 'connectors', 'errors'])
};

export default ScreenshotGallery;