import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { About } from './index';

vi.mock('@/types/sections/about/aboutContent', () => ({
  aboutContent: {
    label: 'О нас',
    title: 'Мы создаём',
    titleHighlight: 'эффективную рекламу',
    text: ['Первый абзац текста.', 'Второй абзац текста.'],
    card: {
      tagline: 'Ваш надёжный партнёр',
      stats: [
        { label: 'Клиентов', value: '150+' },
        { label: 'Проектов', value: '200+' },
      ],
      nps: { label: 'NPS', value: '95' },
    },
  },
}));

vi.mock('@/types/sections/about/aboutValues', () => ({
  aboutValues: [
    { title: 'Честность', description: 'Мы всегда честны с клиентами' },
    { title: 'Инновации', description: 'Мы используем новые технологии' },
  ],
}));

vi.mock('@/types/config/siteData', () => ({
  siteData: { name: 'Рекламастер' },
}));

vi.mock('@/hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, className: '' }),
}));

describe('About', () => {
  it('renders section header label', () => {
    render(<About />);
    expect(screen.getByText('О нас')).toBeInTheDocument();
  });

  it('renders section title', () => {
    render(<About />);
    expect(screen.getByText('Мы создаём')).toBeInTheDocument();
    expect(screen.getByText('эффективную рекламу')).toBeInTheDocument();
  });

  it('renders about text paragraphs', () => {
    render(<About />);
    expect(screen.getByText('Первый абзац текста.')).toBeInTheDocument();
    expect(screen.getByText('Второй абзац текста.')).toBeInTheDocument();
  });

  it('renders about values', () => {
    render(<About />);
    expect(screen.getByText('Честность')).toBeInTheDocument();
    expect(screen.getByText('Инновации')).toBeInTheDocument();
  });

  it('renders about card tagline', () => {
    render(<About />);
    expect(screen.getByText('Ваш надёжный партнёр')).toBeInTheDocument();
  });

  it('renders about card stat values', () => {
    render(<About />);
    expect(screen.getByText('150+')).toBeInTheDocument();
    expect(screen.getByText('200+')).toBeInTheDocument();
  });
});
