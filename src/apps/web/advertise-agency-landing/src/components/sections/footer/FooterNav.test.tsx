import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/sections/footer/footer', () => ({
  footerContent: {
    navTitle: 'Навигация',
  },
}));

vi.mock('@/types/sections/header/header', () => ({
  headerContent: {
    nav: [
      { href: '#about', label: 'О нас' },
      { href: '#services', label: 'Услуги' },
      { href: '#portfolio', label: 'Портфолио' },
    ],
  },
}));

import { FooterNav } from './FooterNav';

describe('FooterNav', () => {
  it('renders nav section title', () => {
    render(<FooterNav />);
    expect(screen.getByText('Навигация')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<FooterNav />);
    expect(screen.getByText('О нас')).toBeInTheDocument();
    expect(screen.getByText('Услуги')).toBeInTheDocument();
    expect(screen.getByText('Портфолио')).toBeInTheDocument();
  });

  it('navigation links have correct hrefs', () => {
    render(<FooterNav />);
    expect(screen.getByRole('link', { name: 'О нас' })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: 'Услуги' })).toHaveAttribute('href', '#services');
    expect(screen.getByRole('link', { name: 'Портфолио' })).toHaveAttribute('href', '#portfolio');
  });
});
