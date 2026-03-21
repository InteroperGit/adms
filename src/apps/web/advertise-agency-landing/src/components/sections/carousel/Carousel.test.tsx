import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';

vi.mock('./CarouselSlide', () => ({
  CarouselSlide: ({
    slide,
    isActive,
    index,
  }: {
    slide: { id: number; title: string };
    isActive: boolean;
    index: number;
  }) => (
    <div data-testid={`slide-${index}`} data-active={String(isActive)} aria-hidden={!isActive}>
      {slide.title}
    </div>
  ),
}));

vi.mock('./CarouselControls', () => ({
  CarouselControls: ({
    current,
    total,
    onPrev,
    onNext,
  }: {
    total: number;
    current: number;
    onPrev: () => void;
    onNext: () => void;
    onDot: (i: number) => void;
    prevLabel: string;
    nextLabel: string;
    slideLabel: string;
  }) => (
    <div data-testid="carousel-controls" data-current={String(current)} data-total={String(total)}>
      <button onClick={onPrev}>Prev</button>
      <button onClick={onNext}>Next</button>
    </div>
  ),
}));

vi.mock('@/hooks/useSwipe', () => ({
  useSwipe: () => ({
    onTouchStart: vi.fn(),
    onTouchEnd: vi.fn(),
    didSwipe: { current: false },
  }),
}));

vi.mock('@/types/sections/carousel/carousel', () => ({
  carouselSlides: [
    {
      id: 1,
      image: '/img/a.jpg',
      alt: 'A',
      gradient: 'from-blue-500',
      title: 'Слайд 1',
      subtitle: 'Sub 1',
    },
    {
      id: 2,
      image: '/img/b.jpg',
      alt: 'B',
      gradient: 'from-red-500',
      title: 'Слайд 2',
      subtitle: 'Sub 2',
    },
    {
      id: 3,
      image: '/img/c.jpg',
      alt: 'C',
      gradient: 'from-green-500',
      title: 'Слайд 3',
      subtitle: 'Sub 3',
    },
  ],
}));

vi.mock('@/types/sections/carousel/carouselContent', () => ({
  carouselContent: {
    label: 'Наши проекты',
    prevLabel: 'Назад',
    nextLabel: 'Вперёд',
    slideLabel: 'Слайд {index}',
    ariaLabel: 'Карусель проектов',
  },
}));

import { Carousel } from './index';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({ matches: false }),
  });
});

describe('Carousel', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders all slides', () => {
    render(<Carousel />);
    expect(screen.getByTestId('slide-0')).toBeInTheDocument();
    expect(screen.getByTestId('slide-1')).toBeInTheDocument();
    expect(screen.getByTestId('slide-2')).toBeInTheDocument();
  });

  it('renders first slide as active initially', () => {
    render(<Carousel />);
    expect(screen.getByTestId('slide-0')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('slide-1')).toHaveAttribute('data-active', 'false');
  });

  it('auto-advances to next slide after interval', () => {
    render(<Carousel />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByTestId('slide-0')).toHaveAttribute('data-active', 'false');
    expect(screen.getByTestId('slide-1')).toHaveAttribute('data-active', 'true');
  });

  it('pauses auto-advance on mouse enter', () => {
    render(<Carousel />);
    fireEvent.mouseEnter(screen.getByRole('region'));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByTestId('slide-0')).toHaveAttribute('data-active', 'true');
  });

  it('resumes auto-advance after mouse leave', () => {
    render(<Carousel />);
    const region = screen.getByRole('region');
    fireEvent.mouseEnter(region);
    fireEvent.mouseLeave(region);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByTestId('slide-1')).toHaveAttribute('data-active', 'true');
  });

  it('renders carousel region with aria-label', () => {
    render(<Carousel />);
    expect(screen.getByRole('region', { name: 'Карусель проектов' })).toBeInTheDocument();
  });

  it('renders controls', () => {
    render(<Carousel />);
    expect(screen.getByTestId('carousel-controls')).toBeInTheDocument();
  });
});
