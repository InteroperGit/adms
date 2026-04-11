import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ImageGalleryNavButtons } from './ImageGalleryNavButtons';

describe('ImageGalleryNavButtons', () => {
  it('renders prev button with aria-label', () => {
    render(
      <ImageGalleryNavButtons
        onPrev={vi.fn()}
        onNext={vi.fn()}
        prevLabel="Previous"
        nextLabel="Next"
      />
    );
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
  });

  it('renders next button with aria-label', () => {
    render(
      <ImageGalleryNavButtons
        onPrev={vi.fn()}
        onNext={vi.fn()}
        prevLabel="Previous"
        nextLabel="Next"
      />
    );
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('calls onPrev when prev button is clicked', async () => {
    const onPrev = vi.fn();
    render(
      <ImageGalleryNavButtons
        onPrev={onPrev}
        onNext={vi.fn()}
        prevLabel="Previous"
        nextLabel="Next"
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('calls onNext when next button is clicked', async () => {
    const onNext = vi.fn();
    render(
      <ImageGalleryNavButtons
        onPrev={vi.fn()}
        onNext={onNext}
        prevLabel="Previous"
        nextLabel="Next"
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onNext).toHaveBeenCalledOnce();
  });
});
