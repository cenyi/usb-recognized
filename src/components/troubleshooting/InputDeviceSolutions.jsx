import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, Keyboard, MousePointer, Gamepad, AlertTriangle, CheckCircle } from 'lucide-react';
import { deviceSpecificSolutions } from '../../data/troubleshootingContent';

/**
 * InputDeviceSolutions component displays solutions for USB input devices
 * Includes keyboards, mice, game controllers, and other input peripherals
 */
const InputDeviceSolutions = ({ platform = 'windows', onBack }) => {
  const [expandedIssue, setExpandedIssue] = useState(null);
  
  // Get input device solutions from content data
  const inputData = deviceSpecificSolutions.input;
  
  // Filter issues by platform if specified
  const filteredIssues = inputData.commonIssues.filter(issue => {
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
  
  // Get icon based on issue type
  const getIssueIcon = (issueId) => {
    if (issueId.includes('keyboard')) return <Keyboard className="h-5 w-5 text-blue-600" />;
    if (issueId.includes('mouse')) return <MousePointer className="h-5 w-5 text-blue-600" />;
    if (issueId.includes('controller') || issueId.includes('gaming')) return <Gamepad className="h-5 w-5 text-blue-600" />;
    return <Keyboard className="h-5 w-5 text-blue-600" />;
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
            <Keyboard className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-800">{inputData.name}</h3>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Solutions for {inputData.types.join(', ')}
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
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {getIssueIcon(issue.id)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{issue.issue}</h4>
                      <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                    </div>
                  </div>
                  <div className="text-blue-600 ml-4">
                    {expandedIssue === issue.id ? 'Hide' : 'Show'} Solution
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
                    
                    {/* Additional tips section */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h5 className="font-medium text-gray-700 mb-2">Additional Tips:</h5>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            Try the device on another computer to determine if it's a hardware or software issue
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            For wireless devices, check battery levels and replace if necessary
                          </span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            If all else fails, contact the manufacturer for warranty service
                          </span>
                        </li>
                      </ul>
                    </div>
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

InputDeviceSolutions.propTypes = {
  platform: PropTypes.oneOf(['windows', 'mac', 'linux']),
  onBack: PropTypes.func.isRequired
};

export default InputDeviceSolutions;