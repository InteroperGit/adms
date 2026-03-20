import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Hero } from './index';

vi.mock('@/types/sections/hero/hero', () => ({
  heroContent: {
    badge: 'Рекламное агентство',
    title: 'Ваша реклама —',
    titleHighlight: 'наша работа',
    subtitle: 'Создаём эффективную рекламу для вашего бизнеса',
    cta: [
      { label: 'Заказать рекламу', href: '/#contact' },
      { label: 'Наши работы', href: '/#portfolio' },
    ],
    stats: [
      { value: '150+', label: 'Клиентов' },
      { value: '200+', label: 'Проектов' },
      { value: '10+', label: 'Лет опыта' },
    ],
  },
}));

vi.mock('@/hooks/useViewportAnimation', () => ({
  useViewportAnimation: () => [{ current: null }, false],
}));

vi.mock('@/hooks/useRandomButtonHighlight', () => ({
  useRandomButtonHighlight: () => null,
}));

describe('Hero', () => {
  it('renders badge', () => {
    render(<Hero />);
    expect(screen.getByText('Рекламное агентство')).toBeInTheDocument();
  });

  it('renders title and highlighted part', () => {
    render(<Hero />);
    expect(screen.getByText('Ваша реклама —')).toBeInTheDocument();
    expect(screen.getByText('наша работа')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<Hero />);
    expect(screen.getByText('Создаём эффективную рекламу для вашего бизнеса')).toBeInTheDocument();
  });

  it('renders primary CTA button', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /Заказать рекламу/i })).toBeInTheDocument();
  });

  it('renders stats section', () => {
    render(<Hero />);
    expect(screen.getByText('Клиентов')).toBeInTheDocument();
    expect(screen.getByText('Проектов')).toBeInTheDocument();
    expect(screen.getByText('Лет опыта')).toBeInTheDocument();
  });
});
