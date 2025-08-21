import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuickDiagnosticTool from '../QuickDiagnosticTool';
import * as troubleshootingUtils from '../../../utils/troubleshootingUtils';

// Mock generateDiagnosticRecommendations
jest.mock('../../../utils/troubleshootingUtils', () => ({
  generateDiagnosticRecommendations: jest.fn()
}));

describe('QuickDiagnosticTool', () => {
  const mockRecommendations = {
    immediate: [
      { id: 'rec1', title: 'Recommendation 1', description: 'Description 1' }
    ],
    followUp: [
      { id: 'rec2', title: 'Recommendation 2', description: 'Description 2' }
    ],
    confidence: 0.8
  };

  beforeEach(() => {
    // Reset mock implementation
    troubleshootingUtils.generateDiagnosticRecommendations.mockReset();
    troubleshootingUtils.generateDiagnosticRecommendations.mockReturnValue(mockRecommendations);
  });

  it('renders initial question correctly', () => {
    render(<QuickDiagnosticTool />);
    
    // Check if first question is rendered
    expect(screen.getByText('What type of USB device are you having issues with?')).toBeInTheDocument();
    
    // Check if options are rendered
    expect(screen.getByText('Storage Device (Flash Drive, External Hard Drive)')).toBeInTheDocument();
    expect(screen.getByText('Input Device (Keyboard, Mouse, Controller)')).toBeInTheDocument();
    expect(screen.getByText('Mobile Device (Phone, Tablet)')).toBeInTheDocument();
    expect(screen.getByText('Other Device')).toBeInTheDocument();
  });

  it('progresses through questions when options are selected', () => {
    render(<QuickDiagnosticTool />);
    
    // Select first option in first question
    fireEvent.click(screen.getByText('Storage Device (Flash Drive, External Hard Drive)'));
    
    // Check if second question is rendered
    expect(screen.getByText('Which operating system are you using?')).toBeInTheDocument();
    
    // Select option in second question
    fireEvent.click(screen.getByText('Windows'));
    
    // Check if third question is rendered
    expect(screen.getByText('What happens when you connect your USB device?')).toBeInTheDocument();
  });

  it('shows follow-up questions based on previous answers', async () => {
    render(<QuickDiagnosticTool />);
    
    // Select mobile device
    fireEvent.click(screen.getByText('Mobile Device (Phone, Tablet)'));
    
    // Select Windows
    fireEvent.click(screen.getByText('Windows'));
    
    // Select error message
    fireEvent.click(screen.getByText('I get an error message'));
    
    // Answer basic troubleshooting question
    fireEvent.click(screen.getByText('No, I haven\'t tried all of these yet'));
    
    // Check if error message follow-up question appears
    await waitFor(() => {
      expect(screen.getByText('What error message do you see?')).toBeInTheDocument();
    });
    
    // Enter error message
    const input = screen.getByPlaceholderText(/E.g., "USB device not recognized"/);
    fireEvent.change(input, { target: { value: 'Device not recognized' } });
    fireEvent.click(screen.getByText('Next'));
    
    // Check if device brand follow-up question appears
    await waitFor(() => {
      expect(screen.getByText('What brand is your mobile device?')).toBeInTheDocument();
    });
  });

  it('generates recommendations after completing all questions', async () => {
    const handleRecommendations = jest.fn();
    render(<QuickDiagnosticTool onRecommendationsGenerated={handleRecommendations} />);
    
    // Complete questionnaire
    fireEvent.click(screen.getByText('Storage Device (Flash Drive, External Hard Drive)'));
    fireEvent.click(screen.getByText('Windows'));
    fireEvent.click(screen.getByText('Nothing happens at all'));
    fireEvent.click(screen.getByText('Yes, I\'ve tried all of these'));
    
    // Check if recommendations are generated
    await waitFor(() => {
      expect(troubleshootingUtils.generateDiagnosticRecommendations).toHaveBeenCalled();
      expect(handleRecommendations).toHaveBeenCalledWith(
        mockRecommendations,
        expect.objectContaining({
          deviceType: 'storage',
          operatingSystem: 'windows',
          issueType: 'nothing-happens',
          hasTriedBasics: true
        })
      );
    });
    
    // Check if recommendations are displayed
    expect(screen.getByText('Recommended Solutions')).toBeInTheDocument();
    expect(screen.getByText('Recommendation 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });

  it('allows resetting the diagnostic', async () => {
    render(<QuickDiagnosticTool />);
    
    // Complete questionnaire
    fireEvent.click(screen.getByText('Storage Device (Flash Drive, External Hard Drive)'));
    fireEvent.click(screen.getByText('Windows'));
    fireEvent.click(screen.getByText('Nothing happens at all'));
    fireEvent.click(screen.getByText('Yes, I\'ve tried all of these'));
    
    // Wait for recommendations
    await waitFor(() => {
      expect(screen.getByText('Recommended Solutions')).toBeInTheDocument();
    });
    
    // Reset diagnostic
    fireEvent.click(screen.getByText('Start Over'));
    
    // Check if first question is rendered again
    expect(screen.getByText('What type of USB device are you having issues with?')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<QuickDiagnosticTool className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});