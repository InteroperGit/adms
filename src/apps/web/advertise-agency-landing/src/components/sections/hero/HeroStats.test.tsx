import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeroStats } from './HeroStats';

vi.mock('@/hooks/useViewportAnimation', () => ({
  useViewportAnimation: () => [{ current: null }, false],
}));

vi.mock('@/hooks/useRandomButtonHighlight', () => ({
  useRandomButtonHighlight: () => null,
}));

const stats = [
  { value: '150+', label: 'Клиентов' },
  { value: '200+', label: 'Проектов' },
  { value: '10+', label: 'Лет опыта' },
];

describe('HeroStats', () => {
  it('renders all stat labels', () => {
    render(<HeroStats stats={stats} />);
    expect(screen.getByText('Клиентов')).toBeInTheDocument();
    expect(screen.getByText('Проектов')).toBeInTheDocument();
    expect(screen.getByText('Лет опыта')).toBeInTheDocument();
  });

  it('renders correct count of stat items', () => {
    render(<HeroStats stats={stats} />);
    const labels = screen.getAllByText(/Клиентов|Проектов|Лет опыта/);
    expect(labels).toHaveLength(3);
  });

  it('renders with empty stats without crashing', () => {
    render(<HeroStats stats={[]} />);
    expect(document.querySelector('div')).toBeInTheDocument();
  });
});
