import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ImageGalleryLightbox } from './ImageGalleryLightbox';

vi.mock('@/hooks/useSwipe', () => ({
  useSwipe: () => ({ onTouchStart: vi.fn(), onTouchEnd: vi.fn() }),
}));

vi.mock('@/components/ui/OptimizedImage', () => ({
  OptimizedImage: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

vi.mock('./ImageGalleryThumbnails', () => ({
  ImageGalleryThumbnails: () => <div data-testid="lightbox-thumbnails" />,
}));

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

const images = [{ src: '/img/1.jpg', description: 'First photo' }, { src: '/img/2.jpg' }];

const defaultProps = {
  images,
  activeIndex: 0,
  altPrefix: 'Photo',
  onClose: vi.fn(),
  onPrev: vi.fn(),
  onNext: vi.fn(),
  onSelect: vi.fn(),
  prevLabel: 'Previous',
  nextLabel: 'Next',
  closeLabel: 'Close',
};

describe('ImageGalleryLightbox', () => {
  it('renders the active image', () => {
    render(<ImageGalleryLightbox {...defaultProps} />);
    expect(screen.getByRole('img', { name: 'Photo 1' })).toBeInTheDocument();
  });

  it('renders close button with aria-label', () => {
    render(<ImageGalleryLightbox {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<ImageGalleryLightbox {...defaultProps} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<ImageGalleryLightbox {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onPrev when ArrowLeft key is pressed', () => {
    const onPrev = vi.fn();
    render(<ImageGalleryLightbox {...defaultProps} onPrev={onPrev} />);
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('calls onNext when ArrowRight key is pressed', () => {
    const onNext = vi.fn();
    render(<ImageGalleryLightbox {...defaultProps} onNext={onNext} />);
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('renders prev/next buttons when multiple images', () => {
    render(<ImageGalleryLightbox {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('does not render nav buttons for a single image', () => {
    render(<ImageGalleryLightbox {...defaultProps} images={[images[0]]} />);
    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
  });

  it('calls onPrev when prev button is clicked', async () => {
    const onPrev = vi.fn();
    render(<ImageGalleryLightbox {...defaultProps} onPrev={onPrev} />);
    await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('calls onNext when next button is clicked', async () => {
    const onNext = vi.fn();
    render(<ImageGalleryLightbox {...defaultProps} onNext={onNext} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('renders thumbnail strip when multiple images', () => {
    render(<ImageGalleryLightbox {...defaultProps} />);
    expect(screen.getByTestId('lightbox-thumbnails')).toBeInTheDocument();
  });

  it('does not render thumbnail strip for a single image', () => {
    render(<ImageGalleryLightbox {...defaultProps} images={[images[0]]} />);
    expect(screen.queryByTestId('lightbox-thumbnails')).not.toBeInTheDocument();
  });

  it('shows description of active image', () => {
    render(<ImageGalleryLightbox {...defaultProps} />);
    expect(screen.getByText('First photo')).toBeInTheDocument();
  });

  it('does not show description when active image has none', () => {
    render(<ImageGalleryLightbox {...defaultProps} activeIndex={1} />);
    expect(screen.queryByText('First photo')).not.toBeInTheDocument();
  });
});
