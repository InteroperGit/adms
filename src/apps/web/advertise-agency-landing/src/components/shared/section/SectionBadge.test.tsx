import { render, screen } from '@testing-library/react';
import { SectionBadge } from './SectionBadge';
import { describe, it, expect } from 'vitest';

describe('SectionBadge', () => {
  it('renders label text', () => {
    render(<SectionBadge label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('applies light variant classes by default', () => {
    render(<SectionBadge label="Test Label" />);
    const badge = screen.getByText('Test Label').closest('div');
    expect(badge).toHaveClass('border-primary/20 bg-primary/5 text-primary dark:border-primary/50');
  });

  it('applies dark variant classes', () => {
    render(<SectionBadge label="Test Label" variant="dark" />);
    const badge = screen.getByText('Test Label').closest('div');
    expect(badge).toHaveClass('border-white/10 bg-white/10 text-white/80');
  });

  it('applies accent variant classes', () => {
    render(<SectionBadge label="Test Label" variant="accent" />);
    const badge = screen.getByText('Test Label').closest('div');
    expect(badge).toHaveClass('border-accent/20 bg-accent/5 text-accent dark:border-accent/50');
  });

  it('renders dot indicator when dot prop is true', () => {
    render(<SectionBadge label="Test Label" dot data-testid="dot-indicator" />);
    expect(screen.getByTestId('dot-indicator')).toBeInTheDocument();
  });

  it('applies accent dot indicator class when variant is accent', () => {
    render(<SectionBadge label="Test Label" dot variant="accent" data-testid="dot-indicator" />);
    const dot = screen.getByTestId('dot-indicator');
    expect(dot).toHaveClass('bg-accent');
  });

  it('applies primary dot indicator class when variant is light or dark', () => {
    const { rerender } = render(
      <SectionBadge label="Test Label" dot variant="light" data-testid="dot-indicator" />
    );
    let dot = screen.getByTestId('dot-indicator');
    expect(dot).toHaveClass('bg-primary');

    rerender(<SectionBadge label="Test Label" dot variant="dark" data-testid="dot-indicator" />);
    dot = screen.getByTestId('dot-indicator');
    expect(dot).toHaveClass('bg-primary');
  });

  it('merges custom className', () => {
    render(<SectionBadge label="Test Label" className="custom-class" />);
    const badge = screen.getByText('Test Label').closest('div');
    expect(badge).toHaveClass('custom-class');
  });
});
