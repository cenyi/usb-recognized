import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HardDrive } from 'lucide-react';
import DeviceTypeCard from '../DeviceTypeCard';

describe('DeviceTypeCard', () => {
  const defaultProps = {
    icon: <HardDrive data-testid="test-icon" />,
    title: 'Test Title',
    description: 'Test Description',
    onClick: jest.fn()
  };

  it('renders correctly with default props', () => {
    render(<DeviceTypeCard {...defaultProps} />);
    
    // Check if title and description are rendered
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    
    // Check if icon is rendered
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    
    // Check if button is not active by default
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('bg-blue-50');
  });

  it('renders with active state when isActive is true', () => {
    render(<DeviceTypeCard {...defaultProps} isActive={true} />);
    
    // Check if button has active class
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-50');
    expect(button).toHaveClass('border-blue-300');
  });

  it('calls onClick handler when clicked', () => {
    render(<DeviceTypeCard {...defaultProps} />);
    
    // Click the button
    fireEvent.click(screen.getByRole('button'));
    
    // Check if onClick was called
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('truncates long descriptions', () => {
    const longDescription = 'This is a very long description that should be truncated in the UI to prevent it from taking up too much space';
    render(<DeviceTypeCard {...defaultProps} description={longDescription} />);
    
    // Check if description is rendered and has line-clamp class
    const descriptionElement = screen.getByText(longDescription);
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveClass('line-clamp-2');
  });

  it('applies custom icon styling based on active state', () => {
    // Render inactive card
    const { rerender } = render(<DeviceTypeCard {...defaultProps} />);
    
    // Check inactive icon styling
    const inactiveIconContainer = screen.getByTestId('test-icon').parentElement;
    expect(inactiveIconContainer).toHaveClass('bg-gray-100');
    expect(inactiveIconContainer).toHaveClass('text-gray-600');
    
    // Rerender with active state
    rerender(<DeviceTypeCard {...defaultProps} isActive={true} />);
    
    // Check active icon styling
    const activeIconContainer = screen.getByTestId('test-icon').parentElement;
    expect(activeIconContainer).toHaveClass('bg-blue-100');
    expect(activeIconContainer).toHaveClass('text-blue-600');
  });
});