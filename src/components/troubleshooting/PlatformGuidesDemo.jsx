import React, { useState } from 'react';
import WindowsTroubleshootingGuide from './WindowsTroubleshootingGuide';
import MacOSTroubleshootingGuide from './MacOSTroubleshootingGuide';
import LinuxTroubleshootingGuide from './LinuxTroubleshootingGuide';
import { Windows, Apple, Terminal } from 'lucide-react';

/**
 * Demo component to showcase platform-specific troubleshooting guides
 */
const PlatformGuidesDemo = () => {
  const [activePlatform, setActivePlatform] = useState('windows');
  
  // Platform tabs configuration
  const platforms = [
    {
      id: 'windows',
      name: 'Windows',
      icon: <Windows size={18} />,
      component: <WindowsTroubleshootingGuide />
    },
    {
      id: 'mac',
      name: 'macOS',
      icon: <Apple size={18} />,
      component: <MacOSTroubleshootingGuide />
    },
    {
      id: 'linux',
      name: 'Linux',
      icon: <Terminal size={18} />,
      component: <LinuxTroubleshootingGuide />
    }
  ];
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">USB Troubleshooting by Platform</h2>
        <p className="text-gray-600">
          Select your operating system to see platform-specific troubleshooting guides.
        </p>
      </div>
      
      {/* Platform tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {platforms.map(platform => (
          <button
            key={platform.id}
            className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
              activePlatform === platform.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActivePlatform(platform.id)}
          >
            <span className="mr-2">{platform.icon}</span>
            {platform.name}
          </button>
        ))}
      </div>
      
      {/* Active platform content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {platforms.find(platform => platform.id === activePlatform)?.component}
      </div>
      
      {/* Common tips section */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">Cross-Platform USB Tips</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="inline-block bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
            <span>Always try a different USB cable before extensive troubleshooting - cables are a common point of failure.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
            <span>USB 3.0 ports (usually blue) provide more power than USB 2.0 ports - try these for power-hungry devices.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
            <span>Some devices work better when connected directly to your computer rather than through a USB hub.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">4</span>
            <span>For external drives, try a powered USB hub if your computer's ports don't provide enough power.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlatformGuidesDemo;