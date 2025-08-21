import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DeviceSpecificSolutions from './DeviceSpecificSolutions';
import USBStorageSolutions from './USBStorageSolutions';
import InputDeviceSolutions from './InputDeviceSolutions';
import MobileDeviceSolutions from './MobileDeviceSolutions';

/**
 * Demo component for showcasing device-specific solution components
 * This component is used for development and testing purposes
 */
const DeviceSolutionsDemo = () => {
  const [platform, setPlatform] = useState('all');
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Device-Specific Solutions Demo</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Platform Selection</CardTitle>
          <CardDescription>
            Select a platform to filter solutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <button
              onClick={() => setPlatform('all')}
              className={`px-4 py-2 rounded-md ${
                platform === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              All Platforms
            </button>
            <button
              onClick={() => setPlatform('windows')}
              className={`px-4 py-2 rounded-md ${
                platform === 'windows' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Windows
            </button>
            <button
              onClick={() => setPlatform('mac')}
              className={`px-4 py-2 rounded-md ${
                platform === 'mac' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              macOS
            </button>
            <button
              onClick={() => setPlatform('linux')}
              className={`px-4 py-2 rounded-md ${
                platform === 'linux' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Linux
            </button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Complete Device Solutions Component</CardTitle>
          <CardDescription>
            The main component that combines all device-specific solutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeviceSpecificSolutions />
        </CardContent>
      </Card>
      
      <Tabs defaultValue="storage" className="mb-8">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="storage">Storage Devices</TabsTrigger>
          <TabsTrigger value="input">Input Devices</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Devices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>USB Storage Solutions</CardTitle>
              <CardDescription>
                Solutions for flash drives, external hard drives, etc.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <USBStorageSolutions platform={platform} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle>Input Device Solutions</CardTitle>
              <CardDescription>
                Solutions for keyboards, mice, game controllers, etc.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InputDeviceSolutions platform={platform} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mobile">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Device Solutions</CardTitle>
              <CardDescription>
                Solutions for smartphones, tablets, etc.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MobileDeviceSolutions platform={platform} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceSolutionsDemo;