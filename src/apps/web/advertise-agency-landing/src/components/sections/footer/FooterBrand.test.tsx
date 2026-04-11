import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/sections/footer/footer', () => ({
  footerContent: {
    description: '{description}',
  },
}));

vi.mock('@/types/config/siteData', () => ({
  siteData: {
    description: 'Рекламное агентство полного цикла',
    contact: {
      phone: '+7 (999) 123-45-67',
      telegram: 'https://t.me/agency',
      vk: 'https://vk.com/agency',
    },
  },
}));

vi.mock('@/components/shared/logo/Logo', () => ({
  Logo: ({ className }: { className?: string }) => <div data-testid="logo" className={className} />,
}));

vi.mock('@/components/shared/socialLinks/SocialLinks', () => ({
  SocialLinks: ({
    phone,
    telegram,
    vk,
    variant,
  }: {
    phone: string;
    telegram: string;
    vk: string;
    variant: string;
  }) => (
    <div
      data-testid="social-links"
      data-phone={phone}
      data-telegram={telegram}
      data-vk={vk}
      data-variant={variant}
    />
  ),
}));

import { FooterBrand } from './FooterBrand';

describe('FooterBrand', () => {
  it('renders logo', () => {
    render(<FooterBrand />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('renders company description', () => {
    render(<FooterBrand />);
    expect(screen.getByText('Рекламное агентство полного цикла')).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<FooterBrand />);
    expect(screen.getByTestId('social-links')).toBeInTheDocument();
  });

  it('passes dark variant to social links', () => {
    render(<FooterBrand />);
    expect(screen.getByTestId('social-links')).toHaveAttribute('data-variant', 'dark');
  });

  it('passes phone to social links', () => {
    render(<FooterBrand />);
    expect(screen.getByTestId('social-links')).toHaveAttribute('data-phone', '+7 (999) 123-45-67');
  });

  it('passes telegram to social links', () => {
    render(<FooterBrand />);
    expect(screen.getByTestId('social-links')).toHaveAttribute(
      'data-telegram',
      'https://t.me/agency'
    );
  });

  it('passes vk to social links', () => {
    render(<FooterBrand />);
    expect(screen.getByTestId('social-links')).toHaveAttribute('data-vk', 'https://vk.com/agency');
  });
});
