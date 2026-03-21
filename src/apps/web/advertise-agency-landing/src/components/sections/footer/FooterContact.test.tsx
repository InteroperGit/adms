import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/sections/footer/footer', () => ({
  footerContent: {
    contactsTitle: 'Контакты',
  },
}));

vi.mock('@/types/config/siteData', () => ({
  siteData: {
    contact: {
      phone: '+7 (999) 123-45-67',
      email: 'info@example.com',
      address: 'г. Москва, ул. Примерная, 1',
    },
  },
}));

vi.mock('@/types/shared/iconMap', () => ({
  ICON_MAP: new Proxy(
    {},
    {
      get:
        () =>
        ({ size, className }: { size?: number; className?: string }) => (
          <svg data-testid="icon" data-size={size} className={className} />
        ),
    }
  ),
}));

import { FooterContact } from './FooterContact';

describe('FooterContact', () => {
  it('renders contacts section title', () => {
    render(<FooterContact />);
    expect(screen.getByText('Контакты')).toBeInTheDocument();
  });

  it('renders phone number', () => {
    render(<FooterContact />);
    expect(screen.getByText('+7 (999) 123-45-67')).toBeInTheDocument();
  });

  it('renders email', () => {
    render(<FooterContact />);
    expect(screen.getByText('info@example.com')).toBeInTheDocument();
  });

  it('renders address', () => {
    render(<FooterContact />);
    expect(screen.getByText('г. Москва, ул. Примерная, 1')).toBeInTheDocument();
  });

  it('phone is a link with tel: href', () => {
    render(<FooterContact />);
    const link = screen.getByRole('link', { name: '+7 (999) 123-45-67' });
    expect(link).toHaveAttribute('href', 'tel:79991234567');
  });

  it('email is a link with mailto: href', () => {
    render(<FooterContact />);
    const link = screen.getByRole('link', { name: 'info@example.com' });
    expect(link).toHaveAttribute('href', 'mailto:info@example.com');
  });

  it('address is plain text, not a link', () => {
    render(<FooterContact />);
    expect(
      screen.queryByRole('link', { name: 'г. Москва, ул. Примерная, 1' })
    ).not.toBeInTheDocument();
    expect(screen.getByText('г. Москва, ул. Примерная, 1')).toBeInTheDocument();
  });

  it('renders an icon for each contact item', () => {
    render(<FooterContact />);
    expect(screen.getAllByTestId('icon')).toHaveLength(3);
  });
});
