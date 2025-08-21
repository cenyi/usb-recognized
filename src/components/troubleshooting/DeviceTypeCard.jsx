import React from 'react';
import PropTypes from 'prop-types';
import { 
  HardDrive, 
  Keyboard, 
  Smartphone, 
  Cpu, 
  ChevronRight, 
  CheckCircle 
} from 'lucide-react';

/**
 * DeviceTypeCard component displays a card for a specific device type with common issues
 * Used in the DeviceSpecificSolutions component to categorize different USB device types
 */
const DeviceTypeCard = ({ 
  deviceType, 
  title, 
  description, 
  issues = [], 
  successRate = null,
  icon = 'HardDrive',
  onSelect 
}) => {
  // Map string icon names to Lucide React components
  const iconMap = {
    HardDrive: HardDrive,
    Keyboard: Keyboard,
    Smartphone: Smartphone,
    Cpu: Cpu
  };
  
  // Get the icon component or default to HardDrive
  const IconComponent = iconMap[icon] || HardDrive;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <IconComponent className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm">{description}</p>
        
        {issues.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Common Issues:</h4>
            <ul className="space-y-1">
              {issues.slice(0, 3).map((issue, index) => (
                <li key={index} className="flex items-start text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{issue}</span>
                </li>
              ))}
              {issues.length > 3 && (
                <li className="text-sm text-blue-600">+{issues.length - 3} more issues</li>
              )}
            </ul>
          </div>
        )}
        
        {successRate && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Success Rate</span>
              <span className="font-medium">{successRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  successRate >= 80 ? 'bg-green-500' : 
                  successRate >= 60 ? 'bg-blue-500' : 
                  successRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      <button
        onClick={() => onSelect && onSelect(deviceType)}
        className="w-full py-3 px-4 bg-gray-50 text-blue-600 text-sm font-medium border-t border-gray-100 hover:bg-blue-50 transition-colors flex items-center justify-center"
      >
        View Solutions
        <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
};

DeviceTypeCard.propTypes = {
  deviceType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  issues: PropTypes.arrayOf(PropTypes.string),
  successRate: PropTypes.number,
  icon: PropTypes.string,
  onSelect: PropTypes.func
};

export default DeviceTypeCard;