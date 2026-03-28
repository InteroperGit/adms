/// <reference types="vitest/globals" />
import { render, screen, waitFor } from '@testing-library/react';
import { OptimizedImage } from './OptimizedImage';
import { resolveImageSrcSet } from '../../libs/imageSrcSet';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock resolveImageSrcSet as it's an external dependency for srcset generation
vi.mock('../../libs/imageSrcSet', () => ({
  resolveImageSrcSet: vi.fn((src: string) => (src ? `${src}-1x.webp 1x` : null)),
}));

const mockResolveImageSrcSet = resolveImageSrcSet as ReturnType<typeof vi.fn>;

// Mock the Skeleton component to ensure it's rendered/not rendered correctly
vi.mock('./skeleton', () => ({
  Skeleton: vi.fn(() => <div data-testid="skeleton-mock" />),
}));

describe('OptimizedImage', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test Image',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default to simulating a production environment unless explicitly overridden
    vi.stubEnv('DEV', false);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // Helper to trigger image load event
  const triggerImageLoad = (imgElement: HTMLElement) => {
    imgElement.dispatchEvent(new Event('load'));
  };

  // 1. Basic Rendering and Props
  it('renders with src and alt attributes', () => {
    render(<OptimizedImage {...defaultProps} />);
    const image = screen.getByAltText(defaultProps.alt);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', defaultProps.src);
  });

  it('renders with width and height props', () => {
    render(<OptimizedImage {...defaultProps} width={100} height={50} />);
    const image = screen.getByAltText(defaultProps.alt);
    expect(image).toHaveAttribute('width', '100');
    expect(image).toHaveAttribute('height', '50');
  });

  it('renders with className and imgClassName props', () => {
    render(
      <OptimizedImage {...defaultProps} className="wrapper-class" imgClassName="image-class" />
    );
    const wrapper = screen.getByAltText(defaultProps.alt).closest('div');
    expect(wrapper).toHaveClass('wrapper-class');
    expect(screen.getByAltText(defaultProps.alt)).toHaveClass('image-class');
  });

  it('renders with aspectRatio prop applying inline style', () => {
    render(<OptimizedImage {...defaultProps} aspectRatio="16/9" />);
    const wrapper = screen.getByAltText(defaultProps.alt).closest('div');
    expect(wrapper).toHaveStyle({ aspectRatio: '16/9' });
  });

  it('renders with objectFit prop applying class to img', () => {
    render(<OptimizedImage {...defaultProps} objectFit="contain" />);
    expect(screen.getByAltText(defaultProps.alt)).toHaveClass('object-contain');
  });

  // 2. Priority Loading (priority prop)
  it('applies eager loading attributes when priority is true', () => {
    render(<OptimizedImage {...defaultProps} priority={true} />);
    const image = screen.getByAltText(defaultProps.alt);
    expect(image).toHaveAttribute('loading', 'eager');
    expect(image).toHaveAttribute('fetchPriority', 'high');
    expect(screen.queryByTestId('skeleton-mock')).not.toBeInTheDocument();
  });

  it('applies lazy loading attributes and shows skeleton when priority is false (default)', () => {
    render(<OptimizedImage {...defaultProps} priority={false} />); // Explicitly set for clarity
    const image = screen.getByAltText(defaultProps.alt);
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
    expect(screen.getByTestId('skeleton-mock')).toBeInTheDocument();
  });

  // 3. Lazy Loading and Skeleton
  it('shows skeleton initially and hides it after image loads for lazy-loaded images', async () => {
    render(<OptimizedImage {...defaultProps} />);
    const image = screen.getByAltText(defaultProps.alt);
    const skeleton = screen.getByTestId('skeleton-mock');

    expect(skeleton).toBeInTheDocument();
    expect(image).toHaveClass('opacity-0');

    triggerImageLoad(image);

    await waitFor(() => {
      expect(skeleton).not.toBeInTheDocument();
      expect(image).toHaveClass('opacity-100');
    });
  });

  it('calls onLoad handler when image successfully loads', async () => {
    const handleLoad = vi.fn();
    render(<OptimizedImage {...defaultProps} onLoad={handleLoad} />);
    const image = screen.getByAltText(defaultProps.alt);

    triggerImageLoad(image);

    await waitFor(() => {
      expect(handleLoad).toHaveBeenCalledTimes(1);
    });
  });

  it('hides skeleton even if image fails to load', async () => {
    render(<OptimizedImage {...defaultProps} />);
    const image = screen.getByAltText(defaultProps.alt);
    const skeleton = screen.getByTestId('skeleton-mock');

    expect(skeleton).toBeInTheDocument();

    image.dispatchEvent(new Event('error')); // Simulate error

    await waitFor(() => {
      expect(skeleton).not.toBeInTheDocument();
      expect(image).toHaveClass('opacity-100'); // Should still become visible to show broken state
    });
  });

  // 4. Production vs. Development Environment
  it('renders a plain img tag in development mode', () => {
    vi.stubEnv('DEV', true);
    render(<OptimizedImage {...defaultProps} />);
    const image = screen.getByAltText(defaultProps.alt);
    expect(image.tagName).toBe('IMG');
    expect(image.parentElement?.tagName).toBe('DIV'); // Wrapper div
    expect(resolveImageSrcSet).not.toHaveBeenCalled();
  });

  it('renders a picture element in production mode', () => {
    vi.stubEnv('DEV', false);
    render(<OptimizedImage {...defaultProps} />);
    const picture = screen.getByAltText(defaultProps.alt).parentElement;
    expect(picture?.tagName).toBe('PICTURE');
    expect(resolveImageSrcSet).toHaveBeenCalledWith(defaultProps.src);
  });

  // 5. srcset Generation and source Tag (Production Only)
  it('renders source tag with srcset in production mode when srcset is available', () => {
    vi.stubEnv('DEV', false);
    mockResolveImageSrcSet.mockReturnValue('/test-image.jpg-srcset.webp');
    render(<OptimizedImage {...defaultProps} />);
    const source = screen.getByAltText(defaultProps.alt).previousElementSibling;
    expect(source?.tagName).toBe('SOURCE');
    expect(source).toHaveAttribute('type', 'image/webp');
    expect(source).toHaveAttribute('srcset', '/test-image.jpg-srcset.webp');
  });

  it('does not render source tag when srcset is null/empty in production mode', () => {
    vi.stubEnv('DEV', false);
    mockResolveImageSrcSet.mockReturnValue(null);
    render(<OptimizedImage {...defaultProps} />);
    const image = screen.getByAltText(defaultProps.alt);
    const sibling = image.previousElementSibling;
    expect(sibling).toBeNull();
  });

  // 6. Accessibility
  it('always includes an alt attribute on the img tag', () => {
    render(<OptimizedImage src="/image.png" alt="Accessible image" />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Accessible image');
  });

  // 7. Edge Cases
  it('renders img tag even with missing src prop', () => {
    // @ts-expect-error - testing missing required prop
    render(<OptimizedImage alt="Missing src" />);
    expect(screen.getByAltText('Missing src')).toBeInTheDocument();
    expect(screen.getByAltText('Missing src')).not.toHaveAttribute('src');
  });

  it('renders correctly when all optional props are omitted', () => {
    render(<OptimizedImage src="/minimal.jpg" alt="Minimal Image" />);
    const image = screen.getByAltText('Minimal Image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('loading', 'lazy'); // Default lazy
    expect(screen.getByTestId('skeleton-mock')).toBeInTheDocument(); // Default shows skeleton
  });

  // 8. Empty / falsy src — T1 fix
  it('does not show skeleton when src is empty', () => {
    render(<OptimizedImage src="" alt="No src" />);
    expect(screen.queryByTestId('skeleton-mock')).not.toBeInTheDocument();
  });

  it('calls onLoad callback when image errors (so parent shimmer is dismissed)', async () => {
    const handleLoad = vi.fn();
    render(<OptimizedImage {...defaultProps} onLoad={handleLoad} />);
    const image = screen.getByAltText(defaultProps.alt);

    image.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(handleLoad).toHaveBeenCalledTimes(1);
    });
  });

  it('passes the sizes prop to the source and img elements', () => {
    vi.stubEnv('DEV', false);
    mockResolveImageSrcSet.mockReturnValue('/test-image.jpg-srcset.webp');
    render(<OptimizedImage {...defaultProps} sizes="(max-width: 768px) 100vw, 50vw" />);
    const image = screen.getByAltText(defaultProps.alt);
    const source = image.previousElementSibling;

    expect(image).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
    expect(source).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
  });
});
