import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/shared/images/OptimizedImage', () => ({
  OptimizedImage: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="optimized-image" />
  ),
}));

import { ImageBlock } from './ImageBlock';

describe('ImageBlock', () => {
  it('renders figure with image', () => {
    const { container } = render(
      <ImageBlock block={{ __component: 'image', src: '/photo.jpg', alt: 'A photo' }} />
    );
    expect(container.querySelector('figure')).toBeInTheDocument();
    expect(screen.getByTestId('optimized-image')).toBeInTheDocument();
  });

  it('passes src and alt to OptimizedImage', () => {
    render(<ImageBlock block={{ __component: 'image', src: '/photo.jpg', alt: 'A photo' }} />);
    const img = screen.getByTestId('optimized-image');
    expect(img).toHaveAttribute('src', '/photo.jpg');
    expect(img).toHaveAttribute('alt', 'A photo');
  });

  it('renders caption when provided', () => {
    render(
      <ImageBlock
        block={{ __component: 'image', src: '/img.jpg', alt: 'alt', caption: 'My caption' }}
      />
    );
    expect(screen.getByText('My caption')).toBeInTheDocument();
  });

  it('does not render caption when not provided', () => {
    const { container } = render(
      <ImageBlock block={{ __component: 'image', src: '/img.jpg', alt: 'alt' }} />
    );
    expect(container.querySelector('figcaption')).not.toBeInTheDocument();
  });

  it('applies max-w-md class for small size', () => {
    const { container } = render(
      <ImageBlock block={{ __component: 'image', src: '/img.jpg', alt: 'alt', size: 'small' }} />
    );
    expect(container.querySelector('figure')).toHaveClass('max-w-md');
  });

  it('applies max-w-5xl class for full size', () => {
    const { container } = render(
      <ImageBlock block={{ __component: 'image', src: '/img.jpg', alt: 'alt', size: 'full' }} />
    );
    expect(container.querySelector('figure')).toHaveClass('max-w-5xl');
  });
});
