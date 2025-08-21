import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Check, ChevronDown, ChevronUp, ExternalLink, Info } from 'lucide-react';

/**
 * Reusable component for displaying step-by-step troubleshooting instructions
 */
const StepByStepGuide = ({ 
  steps, 
  title, 
  description, 
  difficulty = 'beginner',
  successRate,
  timeRequired,
  className
}) => {
  const [expandedStep, setExpandedStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  
  // Toggle step expansion
  const toggleStep = (index) => {
    setExpandedStep(expandedStep === index ? null : index);
  };
  
  // Toggle step completion
  const toggleStepCompletion = (index, event) => {
    event.stopPropagation();
    
    setCompletedSteps(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };
  
  // Get difficulty level styling
  const getDifficultyStyle = () => {
    switch (difficulty) {
      case 'advanced':
        return 'bg-red-100 text-red-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'beginner':
      default:
        return 'bg-green-100 text-green-800';
    }
  };
  
  // Format success rate for display
  const formatSuccessRate = () => {
    if (!successRate && successRate !== 0) return null;
    
    let color = 'text-gray-600';
    if (successRate >= 75) color = 'text-green-600';
    else if (successRate >= 50) color = 'text-yellow-600';
    else color = 'text-red-600';
    
    return (
      <span className={`text-sm font-medium ${color}`}>
        {successRate}% success rate
      </span>
    );
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className || ''}`}>
      {/* Header */}
      {(title || description) && (
        <div className="p-4 border-b border-gray-200">
          {title && <h3 className="text-lg font-semibold mb-1">{title}</h3>}
          {description && <p className="text-gray-600">{description}</p>}
          
          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {difficulty && (
              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyStyle()}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            )}
            
            {formatSuccessRate()}
            
            {timeRequired && (
              <span className="text-sm text-gray-600">
                {timeRequired}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Steps */}
      <div className="divide-y divide-gray-100">
        {steps.map((step, index) => {
          const isExpanded = expandedStep === index;
          const isCompleted = completedSteps.includes(index);
          
          // Handle different step formats
          const stepContent = typeof step === 'string' 
            ? { text: step } 
            : step;
          
          const { 
            step: stepNumber, 
            title: stepTitle, 
            text, 
            instruction, 
            screenshot, 
            command, 
            expectedOutput, 
            tips, 
            links 
          } = stepContent;
          
          // Determine step display text
          const displayText = text || instruction || stepTitle;
          
          return (
            <div 
              key={index} 
              className={`transition-colors ${isCompleted ? 'bg-green-50' : ''}`}
            >
              {/* Step header */}
              <button
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                onClick={() => toggleStep(index)}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center">
                  {/* Completion checkbox */}
                  <button
                    className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center border ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                    onClick={(e) => toggleStepCompletion(index, e)}
                    aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isCompleted && <Check size={14} />}
                  </button>
                  
                  {/* Step number and title */}
                  <div>
                    <div className="font-medium">
                      {stepNumber ? `Step ${stepNumber}: ` : `Step ${index + 1}: `}
                      {displayText}
                    </div>
                    
                    {/* Preview of command if available */}
                    {command && !isExpanded && (
                      <div className="text-sm text-gray-500 font-mono mt-1 truncate max-w-md">
                        $ {command}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Expand/collapse icon */}
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {/* Expanded step content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1">
                  {/* Command */}
                  {command && (
                    <div className="mb-3">
                      <div className="text-sm text-gray-600 mb-1">Run this command:</div>
                      <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm overflow-x-auto">
                        $ {command}
                      </div>
                      
                      {/* Expected output */}
                      {expectedOutput && (
                        <div className="mt-2">
                          <div className="text-sm text-gray-600 mb-1">Expected output:</div>
                          <div className="bg-gray-100 p-3 rounded font-mono text-sm text-gray-800 overflow-x-auto">
                            {expectedOutput}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Screenshot */}
                  {screenshot && (
                    <div className="mb-3">
                      <img 
                        src={screenshot} 
                        alt={`Screenshot for step ${stepNumber || index + 1}`} 
                        className="rounded border border-gray-200 max-w-full"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  {/* Tips */}
                  {tips && tips.length > 0 && (
                    <div className="mb-3 bg-blue-50 p-3 rounded">
                      <div className="flex items-center text-blue-800 font-medium mb-1">
                        <Info size={16} className="mr-1" />
                        Tips:
                      </div>
                      <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
                        {tips.map((tip, tipIndex) => (
                          <li key={tipIndex}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* External links */}
                  {links && links.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-600 mb-1">Helpful resources:</div>
                      <ul className="space-y-1">
                        {links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                            >
                              {link.title || link.url}
                              <ExternalLink size={14} className="ml-1" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress indicator */}
      {completedSteps.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-1">
            Progress: {completedSteps.length} of {steps.length} steps completed
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-300 ease-in-out"
              style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

StepByStepGuide.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        step: PropTypes.number,
        title: PropTypes.string,
        text: PropTypes.string,
        instruction: PropTypes.string,
        screenshot: PropTypes.string,
        command: PropTypes.string,
        expectedOutput: PropTypes.string,
        tips: PropTypes.arrayOf(PropTypes.string),
        links: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            url: PropTypes.string.isRequired
          })
        )
      })
    ])
  ).isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  difficulty: PropTypes.oneOf(['beginner', 'intermediate', 'advanced']),
  successRate: PropTypes.number,
  timeRequired: PropTypes.string,
  className: PropTypes.string
};

export default StepByStepGuide;