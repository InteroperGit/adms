import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';

vi.mock('@/types/sections/footer/footer', () => ({
  footerContent: {
    copyright: '© {year} {name}',
    tagline: 'Ваш надёжный партнёр',
    legalLinks: [
      { href: '/privacy', label: 'Политика конфиденциальности' },
      { href: '/agreement', label: 'Пользовательское соглашение' },
    ],
  },
}));

vi.mock('@/types/config/siteData', () => ({
  siteData: {
    name: 'Рекламастер',
  },
}));

import { FooterBottom } from './FooterBottom';

describe('FooterBottom', () => {
  it('renders copyright with current year and company name', () => {
    render(
      <MemoryRouter>
        <FooterBottom />
      </MemoryRouter>
    );
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} Рекламастер`)).toBeInTheDocument();
  });

  it('renders tagline', () => {
    render(
      <MemoryRouter>
        <FooterBottom />
      </MemoryRouter>
    );
    expect(screen.getByText('Ваш надёжный партнёр')).toBeInTheDocument();
  });

  it('renders all legal links', () => {
    render(
      <MemoryRouter>
        <FooterBottom />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Политика конфиденциальности' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Пользовательское соглашение' })).toBeInTheDocument();
  });

  it('legal links have correct hrefs', () => {
    render(
      <MemoryRouter>
        <FooterBottom />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Политика конфиденциальности' })).toHaveAttribute(
      'href',
      '/privacy'
    );
    expect(screen.getByRole('link', { name: 'Пользовательское соглашение' })).toHaveAttribute(
      'href',
      '/agreement'
    );
  });
});
