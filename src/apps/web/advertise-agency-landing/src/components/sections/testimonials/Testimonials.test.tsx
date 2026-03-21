import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/hooks/useFadeIn', () => ({
  useFadeIn: () => ({ ref: { current: null }, isVisible: true }),
}));

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: false, toggle: vi.fn() }),
}));

vi.mock('@/types/config/siteData', () => ({
  siteData: { yandexMapsOrgId: '12345678', name: 'Рекламастер' },
}));

vi.mock('@/types/sections/testimonials/testimonialsContent', () => ({
  testimonialsSectionContent: {
    label: 'Отзывы',
    title: 'Что говорят клиенты',
    description: 'Реальные отзывы наших клиентов',
    reviewsTitle: 'Отзывы на Яндекс.Картах',
  },
}));

vi.mock('./YandexReviews', () => ({
  YandexReviews: ({ orgId }: { orgId: string }) => (
    <div data-testid="yandex-reviews" data-org-id={orgId} />
  ),
}));

import { Testimonials } from './index';
import { TestimonialsEmpty } from './TestimonialsEmpty';

describe('Testimonials — with orgId', () => {
  it('renders section label', () => {
    render(<Testimonials />);
    expect(screen.getByText('Отзывы')).toBeInTheDocument();
  });

  it('renders section title', () => {
    render(<Testimonials />);
    expect(screen.getByText('Что говорят клиенты')).toBeInTheDocument();
  });

  it('renders section description', () => {
    render(<Testimonials />);
    expect(screen.getByText('Реальные отзывы наших клиентов')).toBeInTheDocument();
  });

  it('renders YandexReviews when orgId is set', () => {
    render(<Testimonials />);
    expect(screen.getByTestId('yandex-reviews')).toBeInTheDocument();
  });

  it('does not render empty state when orgId is set', () => {
    render(<Testimonials />);
    expect(screen.queryByText('Отзывы не найдены')).not.toBeInTheDocument();
  });

  it('passes orgId to YandexReviews', () => {
    render(<Testimonials />);
    expect(screen.getByTestId('yandex-reviews')).toHaveAttribute('data-org-id', '12345678');
  });
});

describe('TestimonialsEmpty', () => {
  it('renders empty state message', () => {
    render(<TestimonialsEmpty />);
    expect(screen.getByText('Отзывы не найдены')).toBeInTheDocument();
  });

  it('renders configuration hint with yandexMapsOrgId key', () => {
    render(<TestimonialsEmpty />);
    expect(screen.getByText('yandexMapsOrgId')).toBeInTheDocument();
  });
});
