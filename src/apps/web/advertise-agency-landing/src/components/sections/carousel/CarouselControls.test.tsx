import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CarouselControls } from './CarouselControls';

const defaultProps = {
  total: 3,
  current: 0,
  onPrev: vi.fn(),
  onNext: vi.fn(),
  onDot: vi.fn(),
  prevLabel: 'Назад',
  nextLabel: 'Вперёд',
  slideLabel: 'Перейти к слайду {index}',
};

describe('CarouselControls', () => {
  it('renders prev button with aria-label', () => {
    render(<CarouselControls {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Назад' })).toBeInTheDocument();
  });

  it('renders next button with aria-label', () => {
    render(<CarouselControls {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Вперёд' })).toBeInTheDocument();
  });

  it('calls onPrev when prev button is clicked', async () => {
    const onPrev = vi.fn();
    render(<CarouselControls {...defaultProps} onPrev={onPrev} />);
    await userEvent.click(screen.getByRole('button', { name: 'Назад' }));
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('calls onNext when next button is clicked', async () => {
    const onNext = vi.fn();
    render(<CarouselControls {...defaultProps} onNext={onNext} />);
    await userEvent.click(screen.getByRole('button', { name: 'Вперёд' }));
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('renders one dot indicator per slide', () => {
    render(<CarouselControls {...defaultProps} />);
    const dots = screen.getAllByRole('button', { name: /Перейти к слайду/ });
    expect(dots).toHaveLength(3);
  });

  it('renders dot aria-labels with correct 1-based index', () => {
    render(<CarouselControls {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Перейти к слайду 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Перейти к слайду 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Перейти к слайду 3' })).toBeInTheDocument();
  });

  it('calls onDot with correct index when dot is clicked', async () => {
    const onDot = vi.fn();
    render(<CarouselControls {...defaultProps} onDot={onDot} />);
    const dots = screen.getAllByRole('button', { name: /Перейти к слайду/ });
    await userEvent.click(dots[1]);
    expect(onDot).toHaveBeenCalledWith(1);
  });

  it('renders slide counter as current+1 / total', () => {
    render(<CarouselControls {...defaultProps} current={1} total={3} />);
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('renders slide counter for first slide', () => {
    render(<CarouselControls {...defaultProps} current={0} total={3} />);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });
});
