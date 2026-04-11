import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ImageGallery } from './index';

vi.mock('@/hooks/useSwipe', () => ({
  useSwipe: () => ({
    onTouchStart: vi.fn(),
    onTouchEnd: vi.fn(),
    didSwipe: { current: false },
  }),
}));

vi.mock('./ImageGalleryPreview', () => ({
  ImageGalleryPreview: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

vi.mock('./ImageGalleryNavButtons', () => ({
  ImageGalleryNavButtons: ({
    onPrev,
    onNext,
    prevLabel,
    nextLabel,
  }: {
    onPrev: () => void;
    onNext: () => void;
    prevLabel: string;
    nextLabel: string;
  }) => (
    <>
      <button onClick={onPrev} aria-label={prevLabel} />
      <button onClick={onNext} aria-label={nextLabel} />
    </>
  ),
}));

vi.mock('./ImageGalleryThumbnails', () => ({
  ImageGalleryThumbnails: ({
    images,
    onSelect,
  }: {
    images: { src: string }[];
    onSelect: (i: number) => void;
  }) => (
    <div data-testid="thumbnails">
      {images.map((img, i) => (
        <button key={img.src} onClick={() => onSelect(i)} data-testid={`thumb-${i}`} />
      ))}
    </div>
  ),
}));

vi.mock('./ImageGalleryLightbox', () => ({
  ImageGalleryLightbox: ({ onClose, closeLabel }: { onClose: () => void; closeLabel: string }) => (
    <div data-testid="lightbox">
      <button onClick={onClose} aria-label={closeLabel} />
    </div>
  ),
}));

const images = [
  { src: '/img/1.jpg', description: 'First' },
  { src: '/img/2.jpg', description: 'Second' },
  { src: '/img/3.jpg' },
];

const defaultProps = {
  images,
  altPrefix: 'Photo',
  prevLabel: 'Previous',
  nextLabel: 'Next',
  closeLabel: 'Close',
  counterTemplate: '{current} / {total}',
};

describe('ImageGallery', () => {
  it('renders the preview image for the first item', () => {
    render(<ImageGallery {...defaultProps} />);
    expect(screen.getByRole('img', { name: 'Photo 1' })).toBeInTheDocument();
  });

  it('renders thumbnail strip when multiple images', () => {
    render(<ImageGallery {...defaultProps} />);
    expect(screen.getByTestId('thumbnails')).toBeInTheDocument();
  });

  it('does not render thumbnails for a single image', () => {
    render(<ImageGallery {...defaultProps} images={[images[0]]} />);
    expect(screen.queryByTestId('thumbnails')).not.toBeInTheDocument();
  });

  it('does not render nav buttons for a single image', () => {
    render(<ImageGallery {...defaultProps} images={[images[0]]} />);
    expect(screen.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
  });

  it('clicking next advances to the second image', async () => {
    render(<ImageGallery {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('img', { name: 'Photo 2' })).toBeInTheDocument();
  });

  it('clicking prev wraps around to the last image', async () => {
    render(<ImageGallery {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByRole('img', { name: `Photo ${images.length}` })).toBeInTheDocument();
  });

  it('clicking a thumbnail changes the active image', async () => {
    render(<ImageGallery {...defaultProps} />);
    await userEvent.click(screen.getByTestId('thumb-1'));
    expect(screen.getByRole('img', { name: 'Photo 2' })).toBeInTheDocument();
  });

  it('renders counter with current / total', () => {
    const { container } = render(<ImageGallery {...defaultProps} />);
    expect(container.querySelector('.tabular-nums')?.textContent).toBe('1 / 3');
  });

  it('counter updates after navigation', async () => {
    const { container } = render(<ImageGallery {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(container.querySelector('.tabular-nums')?.textContent).toBe('2 / 3');
  });

  it('does not render lightbox initially', () => {
    render(<ImageGallery {...defaultProps} />);
    expect(screen.queryByTestId('lightbox')).not.toBeInTheDocument();
  });

  it('opens lightbox when preview area is clicked', async () => {
    const { container } = render(<ImageGallery {...defaultProps} />);
    const groupDiv = container.querySelector('.group');
    await userEvent.click(groupDiv!);
    expect(screen.getByTestId('lightbox')).toBeInTheDocument();
  });

  it('closes lightbox when onClose is triggered', async () => {
    const { container } = render(<ImageGallery {...defaultProps} />);
    await userEvent.click(container.querySelector('.group')!);
    expect(screen.getByTestId('lightbox')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByTestId('lightbox')).not.toBeInTheDocument();
  });
});
