import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/ui/imageGallery', () => ({
  ImageGallery: ({ images }: { images: unknown[] }) => (
    <div data-testid="image-gallery" data-count={images.length} />
  ),
}));

vi.mock('@/types/shared/imageGallery', () => ({
  imageGalleryContent: {
    prevLabel: 'Prev',
    nextLabel: 'Next',
    counter: '{current} of {total}',
    closeLabel: 'Close',
    photoAltTemplate: 'Photo from {title}',
  },
}));

vi.mock('@/libs/utils', () => ({
  interpolate: (tpl: string, vars: Record<string, string>) =>
    tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? ''),
}));

import { GalleryBlock } from './GalleryBlock';

const images = [
  { src: '/a.jpg', width: 800, height: 600 },
  { src: '/b.jpg', width: 800, height: 600 },
];

describe('GalleryBlock', () => {
  it('renders ImageGallery component', () => {
    render(<GalleryBlock block={{ __component: 'gallery', images }} articleTitle="My Project" />);
    expect(screen.getByTestId('image-gallery')).toBeInTheDocument();
  });

  it('passes images to ImageGallery', () => {
    render(<GalleryBlock block={{ __component: 'gallery', images }} articleTitle="My Project" />);
    expect(screen.getByTestId('image-gallery')).toHaveAttribute('data-count', '2');
  });
});
