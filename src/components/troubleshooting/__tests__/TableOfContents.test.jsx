import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TableOfContents from '../TableOfContents';

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('TableOfContents', () => {
  const mockSections = [
    { id: 'section1', title: 'Section 1' },
    { id: 'section2', title: 'Section 2' },
    { 
      id: 'section3', 
      title: 'Section 3',
      subsections: [
        { id: 'subsection1', title: 'Subsection 1' },
        { id: 'subsection2', title: 'Subsection 2' }
      ]
    }
  ];

  beforeEach(() => {
    // Mock document.getElementById
    document.getElementById = jest.fn().mockImplementation((id) => {
      const element = document.createElement('div');
      element.id = id;
      return element;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all sections correctly', () => {
    render(<TableOfContents sections={mockSections} />);
    
    // Check if all sections are rendered
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
    expect(screen.getByText('Section 3')).toBeInTheDocument();
  });

  it('renders subsections when available', () => {
    render(<TableOfContents sections={mockSections} />);
    
    // Check if subsections are rendered
    expect(screen.getByText('Subsection 1')).toBeInTheDocument();
    expect(screen.getByText('Subsection 2')).toBeInTheDocument();
  });

  it('scrolls to section when clicked', () => {
    render(<TableOfContents sections={mockSections} />);
    
    // Click on section
    fireEvent.click(screen.getByText('Section 1'));
    
    // Check if getElementById was called with correct id
    expect(document.getElementById).toHaveBeenCalledWith('section1');
    
    // Check if scrollIntoView was called
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    });
  });

  it('calls onSectionClick when section is clicked', () => {
    const handleSectionClick = jest.fn();
    render(
      <TableOfContents 
        sections={mockSections} 
        onSectionClick={handleSectionClick} 
      />
    );
    
    // Click on section
    fireEvent.click(screen.getByText('Section 2'));
    
    // Check if onSectionClick was called with correct id
    expect(handleSectionClick).toHaveBeenCalledWith('section2');
  });

  it('highlights active section', () => {
    render(
      <TableOfContents 
        sections={mockSections} 
        activeSection="section2" 
      />
    );
    
    // Get section buttons
    const section1Button = screen.getByText('Section 1').closest('button');
    const section2Button = screen.getByText('Section 2').closest('button');
    
    // Check if active section has active class
    expect(section1Button).not.toHaveClass('bg-blue-100');
    expect(section2Button).toHaveClass('bg-blue-100');
  });

  it('updates active section when prop changes', () => {
    const { rerender } = render(
      <TableOfContents 
        sections={mockSections} 
        activeSection="section1" 
      />
    );
    
    // Check initial active section
    let section1Button = screen.getByText('Section 1').closest('button');
    expect(section1Button).toHaveClass('bg-blue-100');
    
    // Update active section
    rerender(
      <TableOfContents 
        sections={mockSections} 
        activeSection="section2" 
      />
    );
    
    // Check if active section was updated
    const section2Button = screen.getByText('Section 2').closest('button');
    expect(section2Button).toHaveClass('bg-blue-100');
  });

  it('applies custom className', () => {
    const { container } = render(
      <TableOfContents 
        sections={mockSections} 
        className="custom-class" 
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});