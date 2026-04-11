import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/sections/carousel/carouselContent', () => ({
  carouselContent: {
    label: 'Наши проекты',
    prevLabel: 'Назад',
    nextLabel: 'Вперёд',
    slideLabel: 'Слайд {index}',
  },
}));

vi.mock('@/components/shared/images/OptimizedImage', () => ({
  OptimizedImage: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="optimized-image" />
  ),
}));

import { CarouselSlide } from './CarouselSlide';
import type { CarouselSlide as SlideType } from '@/types/sections/carousel/carousel';

const slideWithImage: SlideType = {
  id: 1,
  image: '/images/slide.jpg',
  alt: 'Рекламный проект',
  gradient: 'from-blue-500 to-purple-500',
  title: 'Отличная реклама',
  subtitle: 'Мы делаем результат',
};

const slideWithGradient: SlideType = {
  id: 2,
  image: '',
  alt: '',
  gradient: 'from-orange-400 to-rose-500',
  title: 'Другой проект',
  subtitle: 'Красивый градиент',
};

describe('CarouselSlide — with image', () => {
  it('renders optimized image', () => {
    render(<CarouselSlide slide={slideWithImage} isActive={true} index={0} />);
    expect(screen.getByTestId('optimized-image')).toBeInTheDocument();
  });

  it('renders image with correct alt text', () => {
    render(<CarouselSlide slide={slideWithImage} isActive={true} index={0} />);
    expect(screen.getByAltText('Рекламный проект')).toBeInTheDocument();
  });

  it('renders slide title', () => {
    render(<CarouselSlide slide={slideWithImage} isActive={true} index={0} />);
    expect(screen.getByText('Отличная реклама')).toBeInTheDocument();
  });

  it('renders slide subtitle', () => {
    render(<CarouselSlide slide={slideWithImage} isActive={true} index={0} />);
    expect(screen.getByText('Мы делаем результат')).toBeInTheDocument();
  });

  it('renders section label', () => {
    render(<CarouselSlide slide={slideWithImage} isActive={true} index={0} />);
    expect(screen.getByText('Наши проекты')).toBeInTheDocument();
  });
});

describe('CarouselSlide — gradient fallback', () => {
  it('does not render image when slide has no image', () => {
    render(<CarouselSlide slide={slideWithGradient} isActive={true} index={1} />);
    expect(screen.queryByTestId('optimized-image')).not.toBeInTheDocument();
  });

  it('renders title', () => {
    render(<CarouselSlide slide={slideWithGradient} isActive={true} index={1} />);
    expect(screen.getByText('Другой проект')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<CarouselSlide slide={slideWithGradient} isActive={true} index={1} />);
    expect(screen.getByText('Красивый градиент')).toBeInTheDocument();
  });
});

describe('CarouselSlide — active state', () => {
  it('is not aria-hidden when active', () => {
    const { container } = render(
      <CarouselSlide slide={slideWithImage} isActive={true} index={0} />
    );
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'false');
  });

  it('is aria-hidden when inactive', () => {
    const { container } = render(
      <CarouselSlide slide={slideWithImage} isActive={false} index={0} />
    );
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});
