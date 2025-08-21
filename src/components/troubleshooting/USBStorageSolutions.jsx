import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, HardDrive, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { deviceSpecificSolutions } from '../../data/troubleshootingContent';

/**
 * USBStorageSolutions component displays solutions for USB storage devices
 * Includes flash drives, external hard drives, and other storage peripherals
 */
const USBStorageSolutions = ({ platform = 'windows', onBack }) => {
  const [expandedIssue, setExpandedIssue] = useState(null);
  
  // Get storage solutions from content data
  const storageData = deviceSpecificSolutions.storage;
  
  // Filter issues by platform if specified
  const filteredIssues = storageData.commonIssues.filter(issue => {
    return issue.solutions.some(solution => solution.platform === platform);
  });
  
  // Toggle issue expansion
  const toggleIssue = (issueId) => {
    setExpandedIssue(expandedIssue === issueId ? null : issueId);
  };
  
  // Get platform-specific solutions for an issue
  const getPlatformSolutions = (issue) => {
    return issue.solutions.find(solution => solution.platform === platform) || null;
  };
  
  // Render data loss risk indicator
  const renderRiskIndicator = (risk) => {
    const riskMap = {
      'none': { color: 'text-green-500', icon: <CheckCircle className="h-4 w-4" />, text: 'No data loss risk' },
      'low': { color: 'text-blue-500', icon: <Info className="h-4 w-4" />, text: 'Low data loss risk' },
      'medium': { color: 'text-yellow-500', icon: <AlertTriangle className="h-4 w-4" />, text: 'Medium data loss risk' },
      'high': { color: 'text-red-500', icon: <AlertTriangle className="h-4 w-4" />, text: 'High data loss risk' }
    };
    
    const riskInfo = riskMap[risk] || riskMap.low;
    
    return (
      <div className={`flex items-center ${riskInfo.color} text-xs font-medium`}>
        {riskInfo.icon}
        <span className="ml-1">{riskInfo.text}</span>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <div className="flex items-center">
            <HardDrive className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-800">{storageData.name}</h3>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Solutions for {storageData.types.join(', ')}
          </p>
        </div>
      </div>
      
      {filteredIssues.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No solutions available for this platform.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue) => {
            const platformSolution = getPlatformSolutions(issue);
            
            return (
              <div 
                key={issue.id} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleIssue(issue.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h4 className="font-medium text-gray-800">{issue.issue}</h4>
                    <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                  </div>
                  <div className="flex items-center">
                    {issue.dataLossRisk && renderRiskIndicator(issue.dataLossRisk)}
                    <div className="ml-3 text-blue-600">
                      {expandedIssue === issue.id ? 'Hide' : 'Show'} Solution
                    </div>
                  </div>
                </button>
                
                {expandedIssue === issue.id && platformSolution && (
                  <div className="p-5 border-t border-gray-200">
                    <h5 className="font-medium text-gray-700 mb-3">Solution Steps:</h5>
                    <ol className="list-decimal pl-5 space-y-3">
                      {platformSolution.steps.map((step, index) => (
                        <li key={index} className="text-gray-700">{step}</li>
                      ))}
                    </ol>
                    
                    {issue.successRate && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                          <span>Success Rate</span>
                          <span className="font-medium">{issue.successRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              issue.successRate >= 80 ? 'bg-green-500' : 
                              issue.successRate >= 60 ? 'bg-blue-500' : 
                              issue.successRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${issue.successRate}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

USBStorageSolutions.propTypes = {
  platform: PropTypes.oneOf(['windows', 'mac', 'linux']),
  onBack: PropTypes.func.isRequired
};

export default USBStorageSolutions;