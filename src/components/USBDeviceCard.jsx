import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, Zap, HardDrive } from 'lucide-react';

const USBDeviceCard = ({ deviceInfo, className = "" }) => {
  if (!deviceInfo) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'connected-but-cannot-open':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Fully Connected';
      case 'connected-but-cannot-open':
        return 'Detected (Limited Access)';
      default:
        return 'Not Connected';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-green-600';
      case 'connected-but-cannot-open':
        return 'text-yellow-600';
      default:
        return 'text-red-600';
    }
  };

  const formatVendorId = (id) => `0x${id.toString(16).toUpperCase().padStart(4, '0')}`;
  const formatProductId = (id) => `0x${id.toString(16).toUpperCase().padStart(4, '0')}`;

  return (
    <div className={`border border-green-200 bg-green-50 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getStatusIcon(deviceInfo.connectionStatus)}
          <h3 className="text-lg font-semibold text-green-800 ml-2">USB Device Detected</h3>
        </div>
        <div className={`text-sm font-medium ${getStatusColor(deviceInfo.connectionStatus)}`}>
          {getStatusText(deviceInfo.connectionStatus)}
        </div>
      </div>

      {/* Device Name */}
      <div className="mb-4 p-3 bg-white rounded-lg border border-green-200">
        <div className="flex items-center">
          <HardDrive className="h-5 w-5 text-blue-600 mr-2" />
          <div>
            <p className="font-medium text-gray-800">{deviceInfo.name}</p>
            <p className="text-sm text-gray-600">{deviceInfo.manufacturerName}</p>
          </div>
        </div>
      </div>

      {/* Technical Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-1">VENDOR ID</p>
          <p className="text-sm font-mono text-gray-800">{formatVendorId(deviceInfo.vendorId)}</p>
        </div>
        
        <div className="p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-1">PRODUCT ID</p>
          <p className="text-sm font-mono text-gray-800">{formatProductId(deviceInfo.productId)}</p>
        </div>
        
        <div className="p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-1">SERIAL NUMBER</p>
          <p className="text-sm font-mono text-gray-800 truncate" title={deviceInfo.serialNumber}>
            {deviceInfo.serialNumber}
          </p>
        </div>
        
        <div className="p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-1">DEVICE VERSION</p>
          <p className="text-sm text-gray-800">{deviceInfo.deviceVersion}</p>
        </div>
        
        <div className="p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-1">DEVICE CLASS</p>
          <p className="text-sm text-gray-800">{deviceInfo.deviceClass}</p>
        </div>
        
        <div className="p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-1">CONFIGURATIONS</p>
          <p className="text-sm text-gray-800">{deviceInfo.configurationCount}</p>
        </div>
      </div>

      {/* Status Information */}
      <div className="space-y-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start">
            <Info className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">Privacy Notice</p>
              <p className="text-xs text-blue-700">
                All device information is processed locally in your browser. No data is transmitted to our servers.
              </p>
            </div>
          </div>
        </div>

        {deviceInfo.connectionStatus === 'connected-but-cannot-open' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800 mb-1">Limited Access</p>
                <p className="text-xs text-yellow-700">
                  Device detected but requires specific drivers or has restricted access. This is normal for smartphones, 
                  audio interfaces, and specialized hardware.
                </p>
              </div>
            </div>
          </div>
        )}

        {deviceInfo.connectionStatus === 'connected' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800 mb-1">Full Access Available</p>
                <p className="text-xs text-green-700">
                  Device is fully accessible and should work properly with compatible software.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t border-green-200">
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => window.location.href = '/usb-not-recognized'}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Troubleshooting Guide
          </button>
          <button 
            onClick={() => window.location.href = '/blog'}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default USBDeviceCard;