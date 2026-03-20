import { render, screen } from '@testing-library/react';
import { SkipToContent } from './SkipToContent';
import { describe, it, expect } from 'vitest';

describe('SkipToContent', () => {
  it('renders a link', () => {
    render(<SkipToContent contentAnchor="#main-content" />);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('has the correct href attribute', () => {
    render(<SkipToContent contentAnchor="#main-content" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '#main-content');
  });

  it('is visually hidden by default (sr-only class)', () => {
    render(<SkipToContent contentAnchor="#main" />);
    expect(screen.getByRole('link')).toHaveClass('sr-only');
  });

  it('renders with correct link text', () => {
    render(<SkipToContent contentAnchor="#main" />);
    expect(screen.getByText('Перейти к содержимому')).toBeInTheDocument();
  });
});
