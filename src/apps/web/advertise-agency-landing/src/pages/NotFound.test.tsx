import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/config/notFound', () => ({
  notFoundContent: {
    code: '404',
    title: 'Страница не найдена',
    description: 'Запрашиваемая страница не существует.',
    backLabel: 'На главную',
    backHref: '/',
  },
}));

import { NotFound } from './NotFound';

describe('NotFound', () => {
  it('renders the 404 code', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders the title', () => {
    render(<NotFound />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Страница не найдена' })
    ).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<NotFound />);
    expect(screen.getByText('Запрашиваемая страница не существует.')).toBeInTheDocument();
  });

  it('renders the default back link with default label and href', () => {
    render(<NotFound />);
    const link = screen.getByRole('link', { name: 'На главную' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('uses custom backLabel when provided', () => {
    render(<NotFound backLabel="Назад в портфолио" />);
    expect(screen.getByRole('link', { name: 'Назад в портфолио' })).toBeInTheDocument();
  });

  it('uses custom backHref when provided', () => {
    render(<NotFound backHref="/portfolio" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/portfolio');
  });

  it('uses both custom backLabel and backHref together', () => {
    render(<NotFound backLabel="К портфолио" backHref="/portfolio/all" />);
    const link = screen.getByRole('link', { name: 'К портфолио' });
    expect(link).toHaveAttribute('href', '/portfolio/all');
  });

  it('h1 has an aria-label containing the error code', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1, name: /Error 404/i })).toBeInTheDocument();
  });
});
