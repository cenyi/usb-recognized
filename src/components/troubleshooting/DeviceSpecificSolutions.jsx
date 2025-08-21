import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { deviceSpecificSolutions } from '../../data/troubleshootingContent';
import DeviceTypeCard from './DeviceTypeCard';
import USBStorageSolutions from './USBStorageSolutions';
import InputDeviceSolutions from './InputDeviceSolutions';
import MobileDeviceSolutions from './MobileDeviceSolutions';

/**
 * DeviceSpecificSolutions component displays solutions categorized by device type
 * Allows users to select a device type and view specific solutions
 */
const DeviceSpecificSolutions = ({ selectedPlatform = 'windows' }) => {
  const [selectedDeviceType, setSelectedDeviceType] = useState(null);
  
  // Device type definitions with metadata
  const deviceTypes = [
    {
      type: 'storage',
      title: 'USB Storage Devices',
      description: 'Solutions for flash drives, external hard drives, and other storage devices',
      icon: 'HardDrive',
      issues: [
        'Drive not showing up in File Explorer',
        'Drive letter not assigned',
        'Read/write errors',
        'Corrupted file system'
      ],
      successRate: 85
    },
    {
      type: 'input',
      title: 'Input Devices',
      description: 'Solutions for keyboards, mice, and other input peripherals',
      icon: 'Keyboard',
      issues: [
        'Device not responding',
        'Intermittent connection',
        'Driver conflicts',
        'Device recognized but not working'
      ],
      successRate: 80
    },
    {
      type: 'mobile',
      title: 'Mobile Devices',
      description: 'Solutions for smartphones, tablets, and portable devices',
      icon: 'Smartphone',
      issues: [
        'Phone not recognized by computer',
        'Unable to transfer files',
        'Charging but not connecting',
        'MTP connection issues'
      ],
      successRate: 75
    }
  ];
  
  // Render the appropriate component based on selected device type
  const renderDeviceSolutions = () => {
    switch(selectedDeviceType) {
      case 'storage':
        return (
          <USBStorageSolutions 
            platform={selectedPlatform} 
            onBack={() => setSelectedDeviceType(null)} 
          />
        );
      case 'input':
        return (
          <InputDeviceSolutions 
            platform={selectedPlatform} 
            onBack={() => setSelectedDeviceType(null)} 
          />
        );
      case 'mobile':
        return (
          <MobileDeviceSolutions 
            platform={selectedPlatform} 
            onBack={() => setSelectedDeviceType(null)} 
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <section id="device-specific-solutions" className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Device-Specific Solutions</h2>
      
      {!selectedDeviceType ? (
        <>
          <p className="text-gray-600 mb-6">
            Select your device type below to see targeted troubleshooting solutions:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {deviceTypes.map((device) => (
              <DeviceTypeCard
                key={device.type}
                deviceType={device.type}
                title={device.title}
                description={device.description}
                issues={device.issues}
                successRate={device.successRate}
                icon={device.icon}
                onSelect={setSelectedDeviceType}
              />
            ))}
          </div>
        </>
      ) : (
        renderDeviceSolutions()
      )}
    </section>
  );
};

DeviceSpecificSolutions.propTypes = {
  selectedPlatform: PropTypes.oneOf(['windows', 'mac', 'linux'])
};

export default DeviceSpecificSolutions;