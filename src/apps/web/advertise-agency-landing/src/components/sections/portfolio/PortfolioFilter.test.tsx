import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/hooks/useAnimatedPillPosition', () => ({
  useAnimatedPillPosition: vi.fn(() => ({
    position: { top: 0, left: 0, width: 0, height: 0 },
    isAnimating: false,
  })),
}));

import { PortfolioFilter } from './PortfolioFilter';

const CATEGORIES = ['Все', 'Брендинг', 'Веб'];

describe('PortfolioFilter', () => {
  it('renders a button for each category', () => {
    render(<PortfolioFilter categories={CATEGORIES} active="Все" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Все' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Брендинг' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Веб' })).toBeInTheDocument();
  });

  it('applies active style (text-white) to the active button only', () => {
    render(<PortfolioFilter categories={CATEGORIES} active="Брендинг" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Брендинг' })).toHaveClass('text-white');
    expect(screen.getByRole('button', { name: 'Все' })).not.toHaveClass('text-white');
    expect(screen.getByRole('button', { name: 'Веб' })).not.toHaveClass('text-white');
  });

  it('applies inactive border style to non-active buttons', () => {
    render(<PortfolioFilter categories={CATEGORIES} active="Все" onChange={vi.fn()} />);
    const branding = screen.getByRole('button', { name: 'Брендинг' });
    expect(branding).toHaveClass('border');
    expect(branding).toHaveClass('text-muted-foreground');
  });

  it('calls onChange with the clicked category', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PortfolioFilter categories={CATEGORIES} active="Все" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Брендинг' }));
    expect(onChange).toHaveBeenCalledWith('Брендинг');
  });

  it('calls onChange with the correct value for each category', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PortfolioFilter categories={CATEGORIES} active="Все" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Веб' }));
    expect(onChange).toHaveBeenCalledWith('Веб');
  });

  it('renders with a single category', () => {
    render(<PortfolioFilter categories={['Все']} active="Все" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Все' })).toBeInTheDocument();
  });
});
