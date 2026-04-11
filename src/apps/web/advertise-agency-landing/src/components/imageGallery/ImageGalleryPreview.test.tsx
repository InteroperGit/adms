import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImageGalleryPreview } from './ImageGalleryPreview';

vi.mock('@/components/shared/images/OptimizedImage', () => ({
  OptimizedImage: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe('ImageGalleryPreview', () => {
  it('renders the main image with correct alt', () => {
    render(<ImageGalleryPreview src="/img/photo.jpg" alt="Photo 1" />);
    expect(screen.getByRole('img', { name: 'Photo 1' })).toBeInTheDocument();
  });

  it('renders the image with correct src', () => {
    render(<ImageGalleryPreview src="/img/photo.jpg" alt="Photo 1" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/img/photo.jpg');
  });

  it('renders desktop overlay and mobile paragraph when description provided', () => {
    render(<ImageGalleryPreview src="/img/photo.jpg" alt="Photo 1" description="Nice photo" />);
    // description appears twice: desktop hover overlay + mobile paragraph
    expect(screen.getAllByText('Nice photo')).toHaveLength(2);
  });

  it('does not render description elements when description is omitted', () => {
    render(<ImageGalleryPreview src="/img/photo.jpg" alt="Photo 1" />);
    expect(screen.queryByText('Nice photo')).not.toBeInTheDocument();
  });

  it('mobile description has sm:hidden class', () => {
    const { container } = render(
      <ImageGalleryPreview src="/img/photo.jpg" alt="Photo 1" description="Nice photo" />
    );
    const mobileP = container.querySelector('p.sm\\:hidden');
    expect(mobileP).toBeInTheDocument();
    expect(mobileP?.textContent).toBe('Nice photo');
  });

  it('renders cursor-pointer container for click affordance', () => {
    const { container } = render(<ImageGalleryPreview src="/img/photo.jpg" alt="Photo 1" />);
    expect(container.querySelector('.cursor-pointer')).toBeInTheDocument();
  });
});
