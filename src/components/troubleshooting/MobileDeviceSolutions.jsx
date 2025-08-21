import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Smartphone, AlertTriangle, CheckCircle2, Apple, Smartphone as AndroidIcon } from 'lucide-react';
import { deviceSpecificSolutions } from '@/data/troubleshootingContent';
import DeviceSpecificSolutionsContext from './DeviceSpecificSolutionsContext';

/**
 * Component for mobile device USB troubleshooting solutions
 * Displays solutions for smartphones, tablets, etc.
 */
const MobileDeviceSolutions = ({ platform: propPlatform }) => {
  const { selectedPlatform } = useContext(DeviceSpecificSolutionsContext);
  
  // Use prop platform if provided, otherwise use context
  const platform = propPlatform || selectedPlatform;
  
  // Get mobile device data
  const mobileData = deviceSpecificSolutions.mobile;
  
  // Filter issues based on platform
  const filteredIssues = useMemo(() => {
    return mobileData.commonIssues.filter(issue => {
      if (platform === 'all') return true;
      return issue.solutions.some(solution => solution.platform === platform);
    });
  }, [mobileData, platform]);

  // Get platform-specific solutions for an issue
  const getPlatformSolutions = (issue) => {
    if (platform === 'all') {
      return issue.solutions;
    }
    return issue.solutions.filter(solution => solution.platform === platform);
  };

  // Get appropriate icon for issue type
  const getIssueIcon = (issueId) => {
    if (issueId.includes('iphone')) return <Apple className="h-4 w-4" />;
    if (issueId.includes('android')) return <AndroidIcon className="h-4 w-4" />;
    return <Smartphone className="h-4 w-4" />;
  };

  if (filteredIssues.length === 0) {
    return (
      <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle>No Solutions Available</AlertTitle>
        <AlertDescription>
          We don't have specific solutions for mobile devices on this platform yet.
          Please try selecting "All Platforms" or check our general troubleshooting guide.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 text-green-600 rounded-full">
          <Smartphone className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Mobile Device Solutions</h3>
          <p className="text-gray-600 text-sm">
            Troubleshooting for {mobileData.types.join(', ')}
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {filteredIssues.map((issue) => (
          <AccordionItem key={issue.id} value={issue.id}>
            <AccordionTrigger className="hover:bg-gray-50 px-4 py-3 rounded-lg">
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center gap-2">
                  {getIssueIcon(issue.id)}
                  <span className="font-semibold">{issue.issue}</span>
                  {issue.successRate && (
                    <Badge variant={issue.successRate >= 70 ? "success" : "secondary"} className="ml-2">
                      {issue.successRate}% Success
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2 pb-4">
              {getPlatformSolutions(issue).map((solution, index) => (
                <div key={`${issue.id}-${solution.platform}-${index}`} className="mb-6 last:mb-0">
                  {platform === 'all' && (
                    <h4 className="font-medium text-lg mb-2">
                      {solution.platform === 'windows' && 'Windows Solution'}
                      {solution.platform === 'mac' && 'macOS Solution'}
                      {solution.platform === 'linux' && 'Linux Solution'}
                    </h4>
                  )}
                  
                  <ol className="space-y-3 list-decimal list-outside ml-5">
                    {solution.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="pl-1">
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                  
                  {issue.id === 'iphone-not-recognized' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Additional iPhone Tips</h5>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>Make sure your iPhone is unlocked when connecting</li>
                        <li>Tap "Trust This Computer" when prompted on your iPhone</li>
                        <li>Try using a different Lightning cable, preferably an official Apple cable</li>
                        <li>Update to the latest iOS version</li>
                      </ul>
                    </div>
                  )}
                  
                  {issue.id === 'android-file-transfer' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Additional Android Tips</h5>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>Check your USB connection mode in the notification panel</li>
                        <li>Try different USB modes (MTP, PTP, File Transfer)</li>
                        <li>Enable Developer Options and USB Debugging</li>
                        <li>Install device-specific USB drivers from your phone manufacturer</li>
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">
                    These solutions have helped {issue.successRate || "many"}% of users with similar issues
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

MobileDeviceSolutions.propTypes = {
  platform: PropTypes.oneOf(['all', 'windows', 'mac', 'linux'])
};

MobileDeviceSolutions.defaultProps = {
  platform: null
};

export default MobileDeviceSolutions;