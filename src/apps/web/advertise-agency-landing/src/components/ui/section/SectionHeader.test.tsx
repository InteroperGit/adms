import { render, screen } from '@testing-library/react';
import { SectionHeader } from './SectionHeader';
import { describe, it, expect } from 'vitest';

describe('SectionHeader', () => {
  it('renders label badge + title + description', () => {
    render(<SectionHeader label="Test Label" title="Test Title" description="Test Description" />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders highlight span when titleHighlight is provided', () => {
    render(<SectionHeader label="Test Label" title="Test Title" titleHighlight="Title" />);

    const highlightSpan = screen.getByText('Title');
    expect(highlightSpan).toBeInTheDocument();
    expect(highlightSpan).toHaveClass('text-primary');
  });

  it('omits description when absent', () => {
    render(<SectionHeader label="Test Label" title="Test Title" />);

    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('applies dark variant classes to title and description', () => {
    render(
      <SectionHeader
        label="Test Label"
        title="Test Title"
        description="Test Description"
        variant="dark"
      />
    );

    expect(screen.getByText('Test Title')).toHaveClass('text-white');
    expect(screen.getByText('Test Description')).toHaveClass('text-white/60');
  });

  it('merges custom className', () => {
    render(<SectionHeader label="Test Label" title="Test Title" className="custom-class" />);

    const headerContainer = screen.getByText('Test Title').closest('div.mx-auto');
    expect(headerContainer).toHaveClass('custom-class');
  });
});
