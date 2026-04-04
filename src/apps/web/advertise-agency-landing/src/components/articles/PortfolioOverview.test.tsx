import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/config/portfolioConfig', () => ({
  portfolioConfig: {
    perPage: 9,
    allLabel: 'Все',
    prevLabel: 'Назад',
    nextLabel: 'Вперёд',
    pageLabel: 'Страница {current} из {total}',
    emptyLabel: 'Проектов нет',
    notFoundCategory: 'Категория не найдена',
    allProjectsLink: 'Все проекты',
    cta: { label: 'CTA', href: '/#contact' },
    overviewLabels: { client: 'Клиент', category: 'Категория', year: 'Год', services: 'Услуги' },
  },
}));

import { PortfolioOverview } from './PortfolioOverview';

const defaultProps = {
  client: 'ACME Corp',
  category: 'Брендинг',
  year: '2024',
  services: 'Логотип, Гайдлайн',
};

describe('PortfolioOverview', () => {
  it('renders the client value', () => {
    render(<PortfolioOverview {...defaultProps} />);
    expect(screen.getByText('ACME Corp')).toBeInTheDocument();
  });

  it('renders the category value', () => {
    render(<PortfolioOverview {...defaultProps} />);
    expect(screen.getByText('Брендинг')).toBeInTheDocument();
  });

  it('renders the year value', () => {
    render(<PortfolioOverview {...defaultProps} />);
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('renders the services value', () => {
    render(<PortfolioOverview {...defaultProps} />);
    expect(screen.getByText('Логотип, Гайдлайн')).toBeInTheDocument();
  });

  it('renders localised labels from overviewLabels', () => {
    render(<PortfolioOverview {...defaultProps} />);
    expect(screen.getByText('Клиент')).toBeInTheDocument();
    expect(screen.getByText('Категория')).toBeInTheDocument();
    expect(screen.getByText('Год')).toBeInTheDocument();
    expect(screen.getByText('Услуги')).toBeInTheDocument();
  });

  it('renders all four grid items', () => {
    const { container } = render(<PortfolioOverview {...defaultProps} />);
    const grid = container.querySelector('.grid');
    expect(grid?.children).toHaveLength(4);
  });

  it('wraps content in a section element', () => {
    const { container } = render(<PortfolioOverview {...defaultProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});
