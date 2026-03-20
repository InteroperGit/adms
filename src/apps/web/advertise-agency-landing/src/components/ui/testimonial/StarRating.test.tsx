import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StarRating } from './StarRating';

describe('StarRating', () => {
  it('renders 5 stars when rating is 5', () => {
    const { container } = render(<StarRating rating={5} />);
    const stars = container.querySelectorAll('svg');
    expect(stars).toHaveLength(5);
  });

  it('renders 3 stars when rating is 3', () => {
    const { container } = render(<StarRating rating={3} />);
    const stars = container.querySelectorAll('svg');
    expect(stars).toHaveLength(3);
  });

  it('renders 1 star when rating is 1', () => {
    const { container } = render(<StarRating rating={1} />);
    const stars = container.querySelectorAll('svg');
    expect(stars).toHaveLength(1);
  });

  it('renders no stars when rating is 0', () => {
    const { container } = render(<StarRating rating={0} />);
    const stars = container.querySelectorAll('svg');
    expect(stars).toHaveLength(0);
  });

  it('applies fill-primary and text-primary classes to stars', () => {
    const { container } = render(<StarRating rating={2} />);
    const stars = container.querySelectorAll('svg');
    stars.forEach((star) => {
      expect(star).toHaveClass('fill-primary');
      expect(star).toHaveClass('text-primary');
    });
  });

  it('applies custom className to container', () => {
    const { container } = render(<StarRating rating={3} className="my-custom-class" />);
    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  it('applies custom starClassName to each star', () => {
    const { container } = render(<StarRating rating={2} starClassName="star-extra" />);
    const stars = container.querySelectorAll('svg');
    stars.forEach((star) => {
      expect(star).toHaveClass('star-extra');
    });
  });

  it('container has flex and gap-1 classes', () => {
    const { container } = render(<StarRating rating={3} />);
    expect(container.firstChild).toHaveClass('flex', 'gap-1');
  });
});
