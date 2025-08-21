import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  DEVICE_TYPES, 
  PLATFORMS, 
  ISSUE_TYPES,
  DiagnosticDataPropTypes
} from '../../types/troubleshootingTypes';
import { generateDiagnosticRecommendations } from '../../utils/troubleshootingUtils';

/**
 * Multi-step diagnostic questionnaire to help users identify USB issues
 * and get targeted troubleshooting recommendations
 */
const QuickDiagnosticTool = ({ onRecommendationsGenerated, className }) => {
  // Current step in the diagnostic flow
  const [currentStep, setCurrentStep] = useState(0);
  
  // User's diagnostic data
  const [diagnosticData, setDiagnosticData] = useState({
    deviceType: '',
    operatingSystem: '',
    issueType: '',
    hasTriedBasics: false,
    errorMessage: '',
    deviceBrand: '',
    connectionType: ''
  });
  
  // Generated recommendations
  const [recommendations, setRecommendations] = useState(null);
  
  // Diagnostic questions configuration
  const diagnosticSteps = [
    {
      id: 'device-type',
      question: 'What type of USB device are you having issues with?',
      options: [
        { value: DEVICE_TYPES.STORAGE, label: 'Storage Device (Flash Drive, External Hard Drive)' },
        { value: DEVICE_TYPES.INPUT, label: 'Input Device (Keyboard, Mouse, Controller)' },
        { value: DEVICE_TYPES.MOBILE, label: 'Mobile Device (Phone, Tablet)' },
        { value: 'other', label: 'Other Device' }
      ],
      fieldName: 'deviceType'
    },
    {
      id: 'operating-system',
      question: 'Which operating system are you using?',
      options: [
        { value: PLATFORMS.WINDOWS, label: 'Windows' },
        { value: PLATFORMS.MAC, label: 'macOS' },
        { value: PLATFORMS.LINUX, label: 'Linux' }
      ],
      fieldName: 'operatingSystem'
    },
    {
      id: 'issue-type',
      question: 'What happens when you connect your USB device?',
      options: [
        { value: ISSUE_TYPES.NOTHING_HAPPENS, label: 'Nothing happens at all' },
        { value: ISSUE_TYPES.ERROR_MESSAGE, label: 'I get an error message' },
        { value: ISSUE_TYPES.DETECTED_NOT_WORKING, label: 'Device is detected but not working properly' },
        { value: ISSUE_TYPES.INTERMITTENT, label: 'Connection is intermittent or unstable' }
      ],
      fieldName: 'issueType'
    },
    {
      id: 'tried-basics',
      question: 'Have you already tried these basic troubleshooting steps?',
      subtext: 'Different USB port, different cable, restarting computer',
      options: [
        { value: true, label: 'Yes, I\'ve tried all of these' },
        { value: false, label: 'No, I haven\'t tried all of these yet' }
      ],
      fieldName: 'hasTriedBasics'
    }
  ];
  
  // Optional follow-up questions based on previous answers
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  
  // Update follow-up questions based on user's answers
  useEffect(() => {
    const newFollowUpQuestions = [];
    
    // If user gets error messages, ask for the error text
    if (diagnosticData.issueType === ISSUE_TYPES.ERROR_MESSAGE) {
      newFollowUpQuestions.push({
        id: 'error-message',
        question: 'What error message do you see?',
        type: 'text',
        fieldName: 'errorMessage',
        placeholder: 'E.g., "USB device not recognized" or "Error code 43"'
      });
    }
    
    // If it's a mobile device, ask for the brand
    if (diagnosticData.deviceType === DEVICE_TYPES.MOBILE) {
      newFollowUpQuestions.push({
        id: 'device-brand',
        question: 'What brand is your mobile device?',
        options: [
          { value: 'apple', label: 'Apple (iPhone, iPad)' },
          { value: 'samsung', label: 'Samsung' },
          { value: 'google', label: 'Google (Pixel)' },
          { value: 'other-android', label: 'Other Android Device' },
          { value: 'other', label: 'Other' }
        ],
        fieldName: 'deviceBrand'
      });
    }
    
    setFollowUpQuestions(newFollowQuestions);
  }, [diagnosticData.issueType, diagnosticData.deviceType]);
  
  // Total number of steps (base questions + dynamic follow-ups)
  const totalSteps = diagnosticSteps.length + followUpQuestions.length;
  
  // Handle option selection
  const handleOptionSelect = (fieldName, value) => {
    setDiagnosticData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Move to next step
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate recommendations on last step
      generateRecommendations();
    }
  };
  
  // Handle text input change
  const handleTextInputChange = (fieldName, value) => {
    setDiagnosticData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  
  // Handle text input submission
  const handleTextInputSubmit = (fieldName) => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateRecommendations();
    }
  };
  
  // Generate troubleshooting recommendations
  const generateRecommendations = () => {
    const generatedRecommendations = generateDiagnosticRecommendations(diagnosticData);
    setRecommendations(generatedRecommendations);
    
    // Notify parent component
    if (onRecommendationsGenerated) {
      onRecommendationsGenerated(generatedRecommendations, diagnosticData);
    }
  };
  
  // Reset the diagnostic tool
  const resetDiagnostic = () => {
    setCurrentStep(0);
    setDiagnosticData({
      deviceType: '',
      operatingSystem: '',
      issueType: '',
      hasTriedBasics: false,
      errorMessage: '',
      deviceBrand: '',
      connectionType: ''
    });
    setRecommendations(null);
  };
  
  // Get current question (either from base questions or follow-ups)
  const getCurrentQuestion = () => {
    if (currentStep < diagnosticSteps.length) {
      return diagnosticSteps[currentStep];
    } else {
      return followUpQuestions[currentStep - diagnosticSteps.length];
    }
  };
  
  // Render current question
  const renderCurrentQuestion = () => {
    const currentQuestion = getCurrentQuestion();
    
    if (!currentQuestion) {
      return null;
    }
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{currentQuestion.question}</h3>
        
        {currentQuestion.subtext && (
          <p className="text-sm text-gray-600 mb-4">{currentQuestion.subtext}</p>
        )}
        
        {currentQuestion.type === 'text' ? (
          <div className="mt-4">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder={currentQuestion.placeholder || ''}
              value={diagnosticData[currentQuestion.fieldName] || ''}
              onChange={(e) => handleTextInputChange(currentQuestion.fieldName, e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleTextInputSubmit(currentQuestion.fieldName);
                }
              }}
            />
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleTextInputSubmit(currentQuestion.fieldName)}
            >
              {currentStep < totalSteps - 1 ? 'Next' : 'Get Recommendations'}
            </button>
          </div>
        ) : (
          <div className="grid gap-2 mt-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                className="p-3 border border-gray-300 rounded text-left hover:bg-blue-50 hover:border-blue-300 transition-colors"
                onClick={() => handleOptionSelect(currentQuestion.fieldName, option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render progress indicator
  const renderProgress = () => {
    return (
      <div className="mb-4">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>
    );
  };
  
  // Render recommendations
  const renderRecommendations = () => {
    if (!recommendations) return null;
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-4">Recommended Solutions</h3>
        
        {recommendations.immediate.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-blue-800 mb-2">Try These First:</h4>
            <ul className="space-y-2">
              {recommendations.immediate.map((solution) => (
                <li key={solution.id} className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="font-medium">{solution.title}</div>
                  <div className="text-sm text-gray-600">{solution.description}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {recommendations.followUp.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-green-800 mb-2">If Those Don't Work:</h4>
            <ul className="space-y-2">
              {recommendations.followUp.map((solution) => (
                <li key={solution.id} className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="font-medium">{solution.title}</div>
                  <div className="text-sm text-gray-600">{solution.description}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          onClick={resetDiagnostic}
        >
          Start Over
        </button>
      </div>
    );
  };
  
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className || ''}`}>
      <h2 className="text-xl font-bold mb-4">USB Troubleshooting Diagnostic</h2>
      
      {!recommendations ? (
        <>
          {renderProgress()}
          {renderCurrentQuestion()}
        </>
      ) : (
        renderRecommendations()
      )}
    </div>
  );
};

QuickDiagnosticTool.propTypes = {
  onRecommendationsGenerated: PropTypes.func,
  className: PropTypes.string
};

export default QuickDiagnosticTool;