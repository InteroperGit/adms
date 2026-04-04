import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/portfolio/portfolioCaseContent', () => ({
  portfolioCaseContent: {
    backLabel: 'Назад',
    overviewLabels: { client: 'Клиент', category: 'Категория', year: 'Год', services: 'Услуги' },
    challengeTitle: 'Задача',
    solutionTitle: 'Решение',
    resultsTitle: 'Результаты',
    galleryTitle: 'Галерея',
    photoAlt: '{title} — фото {index}',
    cta: {
      title: 'Готовы к похожему результату?',
      subtitle: 'Расскажите о вашем проекте.',
      label: 'Обсудить проект',
      href: '/#contact',
    },
    notFound: { title: 'Страница не найдена', back: '← Вернуться' },
  },
}));

import { ArticleCTA } from './ArticleCTA';

describe('ArticleCTA', () => {
  it('renders the CTA section heading', () => {
    render(<ArticleCTA />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Готовы к похожему результату?'
    );
  });

  it('renders the subtitle text', () => {
    render(<ArticleCTA />);
    expect(screen.getByText('Расскажите о вашем проекте.')).toBeInTheDocument();
  });

  it('renders the CTA button with the configured label', () => {
    render(<ArticleCTA />);
    expect(screen.getByRole('link', { name: 'Обсудить проект' })).toBeInTheDocument();
  });

  it('links the button to the configured href', () => {
    render(<ArticleCTA />);
    expect(screen.getByRole('link', { name: 'Обсудить проект' })).toHaveAttribute(
      'href',
      '/#contact'
    );
  });
});
