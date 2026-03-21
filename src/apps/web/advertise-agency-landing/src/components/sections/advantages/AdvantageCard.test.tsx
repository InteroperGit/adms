import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { Advantage } from '@/types/sections/advantages/advantages';

vi.mock('@/types/shared/iconMap', () => ({
  ICON_MAP: new Proxy({}, { get: () => (props: object) => <svg data-testid="icon" {...props} /> }),
}));

import { AdvantageCard } from './AdvantageCard';

const item: Advantage = {
  icon: 'Award',
  title: 'Опыт 15 лет',
  description: 'Многолетний опыт работы на рынке рекламы',
};

describe('AdvantageCard', () => {
  it('renders advantage title', () => {
    render(<AdvantageCard item={item} index={0} />);
    expect(screen.getByText('Опыт 15 лет')).toBeInTheDocument();
  });

  it('renders advantage description', () => {
    render(<AdvantageCard item={item} index={0} />);
    expect(screen.getByText('Многолетний опыт работы на рынке рекламы')).toBeInTheDocument();
  });

  it('renders padded index number starting from 1', () => {
    render(<AdvantageCard item={item} index={0} />);
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('renders padded index number for second item', () => {
    render(<AdvantageCard item={item} index={1} />);
    expect(screen.getByText('02')).toBeInTheDocument();
  });

  it('renders icon with icon-shake class', () => {
    const { container } = render(<AdvantageCard item={item} index={0} />);
    expect(container.querySelector('.icon-shake')).toBeInTheDocument();
  });

  it('renders inside ItemCard (has group class)', () => {
    const { container } = render(<AdvantageCard item={item} index={0} />);
    expect(container.querySelector('.group')).toBeInTheDocument();
  });
});
