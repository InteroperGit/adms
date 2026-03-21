import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { Pagination } from './Pagination';

const defaultProps = {
  current: 2,
  total: 5,
  prevLabel: 'Назад',
  nextLabel: 'Вперёд',
  pageLabel: 'Страница {current} из {total}',
  onPrev: vi.fn(),
  onNext: vi.fn(),
};

describe('Pagination', () => {
  it('renders the prev button with the configured label', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Назад' })).toBeInTheDocument();
  });

  it('renders the next button with the configured label', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Вперёд' })).toBeInTheDocument();
  });

  it('renders the interpolated page label', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('Страница 2 из 5')).toBeInTheDocument();
  });

  it('prev button is enabled when current > 1', () => {
    render(<Pagination {...defaultProps} current={2} />);
    expect(screen.getByRole('button', { name: 'Назад' })).not.toBeDisabled();
  });

  it('prev button is disabled when current is 1', () => {
    render(<Pagination {...defaultProps} current={1} />);
    expect(screen.getByRole('button', { name: 'Назад' })).toBeDisabled();
  });

  it('next button is enabled when current < total', () => {
    render(<Pagination {...defaultProps} current={2} total={5} />);
    expect(screen.getByRole('button', { name: 'Вперёд' })).not.toBeDisabled();
  });

  it('next button is disabled when current equals total', () => {
    render(<Pagination {...defaultProps} current={5} total={5} />);
    expect(screen.getByRole('button', { name: 'Вперёд' })).toBeDisabled();
  });

  it('calls onPrev when prev button is clicked', async () => {
    const user = userEvent.setup();
    const onPrev = vi.fn();
    render(<Pagination {...defaultProps} current={3} onPrev={onPrev} />);
    await user.click(screen.getByRole('button', { name: 'Назад' }));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it('calls onNext when next button is clicked', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    render(<Pagination {...defaultProps} current={2} onNext={onNext} />);
    await user.click(screen.getByRole('button', { name: 'Вперёд' }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('reflects current page in the label correctly', () => {
    render(<Pagination {...defaultProps} current={4} total={10} />);
    expect(screen.getByText('Страница 4 из 10')).toBeInTheDocument();
  });
});
