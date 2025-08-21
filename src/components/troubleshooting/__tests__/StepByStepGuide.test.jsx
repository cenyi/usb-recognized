import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StepByStepGuide from '../StepByStepGuide';

describe('StepByStepGuide', () => {
  const mockSteps = [
    {
      step: 1,
      title: 'Test Step 1',
      instruction: 'Do this first',
      tips: ['Tip 1', 'Tip 2']
    },
    {
      step: 2,
      title: 'Test Step 2',
      instruction: 'Do this second',
      command: 'test-command'
    },
    {
      step: 3,
      title: 'Test Step 3',
      instruction: 'Do this third'
    }
  ];

  const defaultProps = {
    steps: mockSteps,
    description: 'Test description',
    difficulty: 'intermediate',
    successRate: 75,
    timeRequired: '5-10 minutes'
  };

  it('renders all steps correctly', () => {
    render(<StepByStepGuide {...defaultProps} />);
    
    // Check if all steps are rendered
    expect(screen.getByText('Test Step 1')).toBeInTheDocument();
    expect(screen.getByText('Test Step 2')).toBeInTheDocument();
    expect(screen.getByText('Test Step 3')).toBeInTheDocument();
    
    // Check if instructions are rendered
    expect(screen.getByText('Do this first')).toBeInTheDocument();
    expect(screen.getByText('Do this second')).toBeInTheDocument();
    expect(screen.getByText('Do this third')).toBeInTheDocument();
  });

  it('displays tips when available', () => {
    render(<StepByStepGuide {...defaultProps} />);
    
    // Check if tips are rendered
    expect(screen.getByText('Tip 1')).toBeInTheDocument();
    expect(screen.getByText('Tip 2')).toBeInTheDocument();
  });

  it('displays command when available', () => {
    render(<StepByStepGuide {...defaultProps} />);
    
    // Check if command is rendered
    expect(screen.getByText('test-command')).toBeInTheDocument();
  });

  it('displays metadata correctly', () => {
    render(<StepByStepGuide {...defaultProps} />);
    
    // Check if metadata is rendered
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('75% success rate')).toBeInTheDocument();
    expect(screen.getByText('5-10 minutes')).toBeInTheDocument();
  });

  it('handles step completion correctly', () => {
    render(<StepByStepGuide {...defaultProps} />);
    
    // Get checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(3);
    
    // Check first step
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    
    // Check second step
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
    
    // Uncheck first step
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  it('renders with minimal props', () => {
    const minimalProps = {
      steps: [
        { step: 1, instruction: 'Minimal step' }
      ]
    };
    
    render(<StepByStepGuide {...minimalProps} />);
    
    // Check if step is rendered
    expect(screen.getByText('Minimal step')).toBeInTheDocument();
    
    // Check if optional props are not rendered
    expect(screen.queryByText('success rate')).not.toBeInTheDocument();
    expect(screen.queryByText('minutes')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StepByStepGuide {...defaultProps} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});