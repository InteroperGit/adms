import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/sections/footer/footer', () => ({
  footerContent: {
    servicesTitle: 'Услуги',
  },
}));

vi.mock('@/types/sections/services/services', () => ({
  services: [
    { title: 'Таргетированная реклама' },
    { title: 'Контекстная реклама' },
    { title: 'SMM' },
    { title: 'SEO' },
    { title: 'Дизайн' }, // 5th — must not appear
  ],
}));

import { FooterServices } from './FooterServices';

describe('FooterServices', () => {
  it('renders services section title', () => {
    render(<FooterServices />);
    expect(screen.getByText('Услуги')).toBeInTheDocument();
  });

  it('renders first four services', () => {
    render(<FooterServices />);
    expect(screen.getByText('Таргетированная реклама')).toBeInTheDocument();
    expect(screen.getByText('Контекстная реклама')).toBeInTheDocument();
    expect(screen.getByText('SMM')).toBeInTheDocument();
    expect(screen.getByText('SEO')).toBeInTheDocument();
  });

  it('does not render the fifth service', () => {
    render(<FooterServices />);
    expect(screen.queryByText('Дизайн')).not.toBeInTheDocument();
  });

  it('service links all point to #services', () => {
    render(<FooterServices />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '#services');
    });
  });
});
