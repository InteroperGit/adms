import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ArticleThumbnail } from './ArticleThumbnail';

vi.mock('@/components/ui/OptimizedImage', () => ({
  OptimizedImage: vi.fn(({ alt, onLoad }: { alt: string; onLoad?: () => void }) => (
    <img data-testid="optimized-image" alt={alt} onLoad={onLoad} />
  )),
}));

const defaultProps = {
  href: '/portfolio/branding/test-case',
  title: 'Test Case Title',
  category: 'Брендинг',
  gradient: 'from-purple-500 to-pink-500',
};

describe('ArticleThumbnail', () => {
  it('renders a link with the correct href', () => {
    render(<ArticleThumbnail {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/portfolio/branding/test-case');
  });

  it('shows category badge', () => {
    render(<ArticleThumbnail {...defaultProps} />);
    expect(screen.getByText('Брендинг')).toBeInTheDocument();
  });

  it('renders gradient fallback (dot pattern) when no image provided', () => {
    const { container } = render(<ArticleThumbnail {...defaultProps} />);
    expect(screen.queryByTestId('optimized-image')).not.toBeInTheDocument();
    const dotPattern = container.querySelector('[style*="radial-gradient"]');
    expect(dotPattern).toBeInTheDocument();
  });

  it('renders OptimizedImage when image is provided', () => {
    render(<ArticleThumbnail {...defaultProps} image="/images/thumb.jpg" />);
    expect(screen.getByTestId('optimized-image')).toBeInTheDocument();
    expect(screen.getByAltText('Test Case Title')).toBeInTheDocument();
  });

  it('does not render dot pattern when image is provided', () => {
    const { container } = render(<ArticleThumbnail {...defaultProps} image="/images/thumb.jpg" />);
    const dotPattern = container.querySelector('[style*="radial-gradient"]');
    expect(dotPattern).not.toBeInTheDocument();
  });

  it('applies gradient classes from props', () => {
    const { container } = render(<ArticleThumbnail {...defaultProps} />);
    const link = container.querySelector('a');
    expect(link).toHaveClass('from-purple-500');
    expect(link).toHaveClass('to-pink-500');
  });

  // T2 fix — shimmer / imageLoaded state
  it('does not show shimmer when no image is provided', () => {
    const { container } = render(<ArticleThumbnail {...defaultProps} />);
    const shimmer = container.querySelector('[style*="shimmer"]');
    expect(shimmer).not.toBeInTheDocument();
  });

  it('shows shimmer initially when image is provided', () => {
    const { container } = render(<ArticleThumbnail {...defaultProps} image="/images/thumb.jpg" />);
    const shimmer = container.querySelector('[aria-hidden="true"]');
    expect(shimmer).toBeInTheDocument();
  });

  it('dismisses shimmer after OptimizedImage onLoad fires', () => {
    const { container } = render(<ArticleThumbnail {...defaultProps} image="/images/thumb.jpg" />);
    const img = screen.getByTestId('optimized-image');
    fireEvent.load(img);
    const shimmer = container.querySelector('[aria-hidden="true"]');
    expect(shimmer).not.toBeInTheDocument();
  });
});
