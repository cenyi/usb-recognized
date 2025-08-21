import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Usb, AlertCircle, Camera } from 'lucide-react';
import USBConnectorGuide from './USBConnectorGuide';
import ErrorMessageGuide from './ErrorMessageGuide';
import ScreenshotGallery from './ScreenshotGallery';

/**
 * Visual troubleshooting guide component with image galleries and visual aids
 * Helps users identify USB connectors, error messages, and visual cues
 */
const VisualTroubleshootingGuide = ({ className }) => {
  const [activeTab, setActiveTab] = useState('connectors');

  const visualGuideTypes = [
    {
      id: 'connectors',
      label: 'USB Connectors',
      icon: <Usb className="h-4 w-4" />,
      description: 'Identify different USB connector types',
      component: <USBConnectorGuide />
    },
    {
      id: 'errors',
      label: 'Error Messages',
      icon: <AlertCircle className="h-4 w-4" />,
      description: 'Common USB error messages and their meanings',
      component: <ErrorMessageGuide />
    },
    {
      id: 'screenshots',
      label: 'Screenshots',
      icon: <Camera className="h-4 w-4" />,
      description: 'Step-by-step visual guides with screenshots',
      component: <ScreenshotGallery />
    }
  ];

  return (
    <section id="visual-guide" className={`mb-12 ${className || ''}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
          <Eye className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Visual Troubleshooting Guide</h2>
          <p className="text-gray-600">
            Visual aids to help identify USB issues and follow troubleshooting steps
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          {visualGuideTypes.map(guide => (
            <TabsTrigger key={guide.id} value={guide.id} className="flex items-center gap-2">
              {guide.icon}
              <span className="hidden sm:inline">{guide.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {visualGuideTypes.map(guide => (
          <TabsContent key={guide.id} value={guide.id} className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {guide.icon}
                  {guide.label}
                </CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {guide.component}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

VisualTroubleshootingGuide.propTypes = {
  className: PropTypes.string
};

export default VisualTroubleshootingGuide;