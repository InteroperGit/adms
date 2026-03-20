import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ImageGalleryThumbnails } from './ImageGalleryThumbnails';

vi.mock('@/components/ui/OptimizedImage', () => ({
  OptimizedImage: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

const images = [{ src: '/img/1.jpg' }, { src: '/img/2.jpg' }, { src: '/img/3.jpg' }];

describe('ImageGalleryThumbnails', () => {
  it('renders a button for each image', () => {
    render(
      <ImageGalleryThumbnails
        images={images}
        activeIndex={0}
        onSelect={vi.fn()}
        altPrefix="Photo"
      />
    );
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('renders images with correct alt text', () => {
    render(
      <ImageGalleryThumbnails
        images={images}
        activeIndex={0}
        onSelect={vi.fn()}
        altPrefix="Photo"
      />
    );
    expect(screen.getByRole('img', { name: 'Photo 1' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Photo 2' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Photo 3' })).toBeInTheDocument();
  });

  it('active thumbnail has ring-2 class', () => {
    const { container } = render(
      <ImageGalleryThumbnails
        images={images}
        activeIndex={1}
        onSelect={vi.fn()}
        altPrefix="Photo"
      />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons[1]).toHaveClass('ring-2');
  });

  it('inactive thumbnails do not have ring-2 class', () => {
    const { container } = render(
      <ImageGalleryThumbnails
        images={images}
        activeIndex={1}
        onSelect={vi.fn()}
        altPrefix="Photo"
      />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons[0]).not.toHaveClass('ring-2');
    expect(buttons[2]).not.toHaveClass('ring-2');
  });

  it('active thumbnail renders the primary overlay span', () => {
    const { container } = render(
      <ImageGalleryThumbnails
        images={images}
        activeIndex={0}
        onSelect={vi.fn()}
        altPrefix="Photo"
      />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons[0].querySelector('.bg-primary\\/20')).toBeInTheDocument();
    expect(buttons[1].querySelector('.bg-primary\\/20')).not.toBeInTheDocument();
  });

  it('calls onSelect with correct index when thumbnail is clicked', async () => {
    const onSelect = vi.fn();
    render(
      <ImageGalleryThumbnails
        images={images}
        activeIndex={0}
        onSelect={onSelect}
        altPrefix="Photo"
      />
    );
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[2]);
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});
