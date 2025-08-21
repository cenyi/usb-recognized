import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Search, AlertTriangle, AlertCircle, XCircle, Info } from 'lucide-react';
import { errorMessages } from '../../data/troubleshootingContent';

/**
 * ErrorMessageGuide component displays common USB error messages and their solutions
 * Helps users understand error messages they encounter
 */
const ErrorMessageGuide = ({ platform = 'windows' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter error messages by platform and search term
  const filteredErrors = errorMessages.filter(error => {
    const matchesPlatform = error.platforms.includes(platform);
    const matchesSearch = 
      error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.commonCauses.some(cause => cause.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesPlatform && (searchTerm === '' || matchesSearch);
  });
  
  // Get icon based on error severity
  const getErrorIcon = (errorId) => {
    if (errorId.includes('malfunction') || errorId.includes('fail')) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    if (errorId.includes('warning')) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-blue-500" />;
  };
  
  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search error messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {filteredErrors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No error messages match your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredErrors.map((error) => (
            <div 
              key={error.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-5 py-4 flex items-center">
                {getErrorIcon(error.id)}
                <div className="ml-3">
                  <h3 className="font-medium text-gray-800">{error.message}</h3>
                  <p className="text-sm text-gray-600 mt-1">{error.description}</p>
                </div>
              </div>
              
              <div className="p-5 border-t border-gray-200">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Common Causes:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {error.commonCauses.map((cause, index) => (
                      <li key={index} className="text-gray-600 text-sm">{cause}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Solutions:</h4>
                  <div className="space-y-3">
                    {error.solutions.map((solutionId, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                          <Info className="h-3 w-3 text-blue-600" />
                        </div>
                        <div className="text-sm text-gray-600">
                          <SolutionReference solutionId={solutionId} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {error.screenshot && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Error Screenshot:</h4>
                    <div className="bg-gray-100 rounded p-2">
                      <img 
                        src={error.screenshot || '/images/placeholder-error.png'} 
                        alt={`${error.message} screenshot`}
                        className="max-h-40 object-contain mx-auto"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-error.png';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper component to display solution references
const SolutionReference = ({ solutionId }) => {
  // This would ideally link to the actual solution in the app
  // For now, we'll just display the solution ID in a user-friendly way
  const formatSolutionName = (id) => {
    return id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <span>
      Try the <span className="font-medium text-blue-600">{formatSolutionName(solutionId)}</span> solution
    </span>
  );
};

SolutionReference.propTypes = {
  solutionId: PropTypes.string.isRequired
};

ErrorMessageGuide.propTypes = {
  platform: PropTypes.oneOf(['windows', 'mac', 'linux'])
};

export default ErrorMessageGuide;