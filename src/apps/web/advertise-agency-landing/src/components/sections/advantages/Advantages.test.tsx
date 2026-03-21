import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/shared/iconMap', () => ({
  ICON_MAP: new Proxy({}, { get: () => (props: object) => <svg data-testid="icon" {...props} /> }),
}));

vi.mock('@/hooks/useStaggeredReveal', () => ({
  useStaggeredReveal: () => ({
    ref: { current: null },
    isVisible: true,
    getDelay: (i: number) => i * 60,
  }),
}));

vi.mock('@/types/sections/advantages/advantagesContent', () => ({
  advantagesContent: {
    label: 'Преимущества',
    title: 'Почему выбирают',
    titleHighlight: 'нас',
    description: 'Мы делаем рекламу эффективной',
  },
}));

vi.mock('@/types/sections/advantages/advantages', () => ({
  advantages: [
    { icon: 'Award', title: 'Опыт 15 лет', description: 'Многолетний опыт на рынке' },
    { icon: 'Users', title: 'Команда профи', description: 'Профессиональная команда' },
    { icon: 'TrendingUp', title: 'Рост продаж', description: 'Увеличиваем конверсию' },
  ],
}));

import { Advantages } from './index';

describe('Advantages', () => {
  it('renders section header label', () => {
    render(<Advantages />);
    expect(screen.getByText('Преимущества')).toBeInTheDocument();
  });

  it('renders section title and highlight', () => {
    render(<Advantages />);
    expect(screen.getByText('Почему выбирают')).toBeInTheDocument();
    expect(screen.getByText('нас')).toBeInTheDocument();
  });

  it('renders section description', () => {
    render(<Advantages />);
    expect(screen.getByText('Мы делаем рекламу эффективной')).toBeInTheDocument();
  });

  it('renders all advantage card titles', () => {
    render(<Advantages />);
    expect(screen.getByText('Опыт 15 лет')).toBeInTheDocument();
    expect(screen.getByText('Команда профи')).toBeInTheDocument();
    expect(screen.getByText('Рост продаж')).toBeInTheDocument();
  });

  it('renders all advantage card descriptions', () => {
    render(<Advantages />);
    expect(screen.getByText('Многолетний опыт на рынке')).toBeInTheDocument();
    expect(screen.getByText('Профессиональная команда')).toBeInTheDocument();
    expect(screen.getByText('Увеличиваем конверсию')).toBeInTheDocument();
  });

  it('renders advantages section element', () => {
    const { container } = render(<Advantages />);
    expect(container.querySelector('#advantages')).toBeInTheDocument();
  });
});
