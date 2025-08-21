import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Smartphone, HardDrive, Monitor } from 'lucide-react';
import { visualGuides } from '@/data/troubleshootingContent';

/**
 * Component for identifying different USB connector types
 * Helps users understand which connector they have and its capabilities
 */
const USBConnectorGuide = ({ selectedConnector, onConnectorSelect }) => {
  const [activeConnector, setActiveConnector] = useState(selectedConnector || null);

  // Get connector icon based on type
  const getConnectorIcon = (type) => {
    switch (type) {
      case 'USB-A':
        return <HardDrive className="h-5 w-5" />;
      case 'USB-C':
        return <Zap className="h-5 w-5" />;
      case 'Micro-USB':
        return <Smartphone className="h-5 w-5" />;
      case 'Lightning':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  // Get connector color theme
  const getConnectorTheme = (type) => {
    switch (type) {
      case 'USB-A':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'USB-C':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'Micro-USB':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'Lightning':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const handleConnectorClick = (connector) => {
    setActiveConnector(activeConnector === connector.type ? null : connector.type);
    if (onConnectorSelect) {
      onConnectorSelect(connector);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">USB Connector Types</h3>
        <p className="text-gray-600">
          Click on a connector type to learn more about it and see compatibility information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visualGuides.usbConnectors.map((connector) => (
          <Card 
            key={connector.type}
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeConnector === connector.type 
                ? 'ring-2 ring-blue-500 shadow-md' 
                : ''
            }`}
            onClick={() => handleConnectorClick(connector)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {getConnectorIcon(connector.type)}
                {connector.type}
              </CardTitle>
              <CardDescription>{connector.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Connector Image Placeholder */}
              <div className={`w-full h-32 rounded-lg mb-4 flex items-center justify-center ${getConnectorTheme(connector.type)}`}>
                <div className="text-center">
                  {getConnectorIcon(connector.type)}
                  <p className="text-sm font-medium mt-2">{connector.type}</p>
                </div>
              </div>

              {/* Common Uses */}
              <div className="mb-3">
                <h4 className="font-medium text-sm mb-2">Common Uses:</h4>
                <div className="flex flex-wrap gap-1">
                  {connector.commonUses.map((use, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Versions/Standards */}
              {connector.versions && (
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-2">Supported Standards:</h4>
                  <div className="flex flex-wrap gap-1">
                    {connector.versions.map((version, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {version}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Expanded Information */}
              {activeConnector === connector.type && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-sm mb-1">Identification Tips:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {connector.type === 'USB-A' && (
                          <>
                            <li>• Rectangular shape, wider than it is tall</li>
                            <li>• Only fits one way (not reversible)</li>
                            <li>• Most common on computers and chargers</li>
                          </>
                        )}
                        {connector.type === 'USB-C' && (
                          <>
                            <li>• Oval/rounded rectangular shape</li>
                            <li>• Reversible - works either way up</li>
                            <li>• Smaller than USB-A but larger than Micro-USB</li>
                          </>
                        )}
                        {connector.type === 'Micro-USB' && (
                          <>
                            <li>• Very small, trapezoidal shape</li>
                            <li>• Only fits one way (not reversible)</li>
                            <li>• Common on older Android devices</li>
                          </>
                        )}
                        {connector.type === 'Lightning' && (
                          <>
                            <li>• Small, flat, rectangular with rounded edges</li>
                            <li>• Reversible - works either way up</li>
                            <li>• Exclusive to Apple devices</li>
                          </>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-1">Troubleshooting Tips:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Check for debris in the connector</li>
                        <li>• Ensure the connector is fully inserted</li>
                        <li>• Try a different cable if available</li>
                        <li>• Check if the port supports the connector type</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Quick Identification Guide</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-1">Size Comparison (largest to smallest):</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>USB-A (Standard)</li>
              <li>USB-C (Modern)</li>
              <li>Micro-USB (Older phones)</li>
              <li>Lightning (Apple only)</li>
            </ol>
          </div>
          <div>
            <p className="font-medium mb-1">Reversible Connectors:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>USB-C ✓</li>
              <li>Lightning ✓</li>
              <li>USB-A ✗</li>
              <li>Micro-USB ✗</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

USBConnectorGuide.propTypes = {
  selectedConnector: PropTypes.string,
  onConnectorSelect: PropTypes.func
};

export default USBConnectorGuide;