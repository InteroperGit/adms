import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/types/sections/contact/contact', () => ({
  contactContent: {
    directTitle: 'Напишите нам напрямую',
    contactLabels: { phone: 'ТЕЛЕФОН', email: 'EMAIL', address: 'АДРЕС' },
    socialTitle: 'Мы в соцсетях',
    mapTitle: 'Карта',
  },
}));

vi.mock('@/types/config/siteData', () => ({
  siteData: {
    contact: {
      phone: '+7 (999) 123-45-67',
      email: 'info@example.com',
      address: 'г. Москва, ул. Примерная, 1',
      telegram: 'https://t.me/agency',
      vk: 'https://vk.com/agency',
    },
    yandexMapUrl: 'https://yandex.ru/maps/org/123',
  },
}));

vi.mock('@/components/ui/SocialLinks', () => ({
  SocialLinks: ({ telegram, vk }: { telegram: string; vk: string }) => (
    <div data-testid="social-links" data-telegram={telegram} data-vk={vk} />
  ),
}));

vi.mock('@/components/ui/WidgetIframe', () => ({
  WidgetIframe: ({ src, title }: { src: string; title: string }) => (
    <div data-testid="widget-iframe" data-src={src} aria-label={title} />
  ),
}));

import { ContactInfo } from './ContactInfo';

describe('ContactInfo', () => {
  it('renders direct contact title', () => {
    render(<ContactInfo isDark={false} />);
    expect(screen.getByText('Напишите нам напрямую')).toBeInTheDocument();
  });

  it('renders phone number', () => {
    render(<ContactInfo isDark={false} />);
    expect(screen.getByText('+7 (999) 123-45-67')).toBeInTheDocument();
  });

  it('renders email', () => {
    render(<ContactInfo isDark={false} />);
    expect(screen.getByText('info@example.com')).toBeInTheDocument();
  });

  it('renders address', () => {
    render(<ContactInfo isDark={false} />);
    expect(screen.getByText('г. Москва, ул. Примерная, 1')).toBeInTheDocument();
  });

  it('phone is a clickable link', () => {
    render(<ContactInfo isDark={false} />);
    const link = screen.getByRole('link', { name: '+7 (999) 123-45-67' });
    expect(link).toHaveAttribute('href', 'tel:79991234567');
  });

  it('email is a clickable link', () => {
    render(<ContactInfo isDark={false} />);
    const link = screen.getByRole('link', { name: 'info@example.com' });
    expect(link).toHaveAttribute('href', 'mailto:info@example.com');
  });

  it('renders social links section title', () => {
    render(<ContactInfo isDark={false} />);
    expect(screen.getByText('Мы в соцсетях')).toBeInTheDocument();
  });

  it('renders social links component', () => {
    render(<ContactInfo isDark={false} />);
    expect(screen.getByTestId('social-links')).toBeInTheDocument();
  });

  it('passes telegram and vk to SocialLinks', () => {
    render(<ContactInfo isDark={false} />);
    const links = screen.getByTestId('social-links');
    expect(links).toHaveAttribute('data-telegram', 'https://t.me/agency');
    expect(links).toHaveAttribute('data-vk', 'https://vk.com/agency');
  });

  it('renders map when yandexMapUrl is set', () => {
    render(<ContactInfo isDark={false} />);
    expect(screen.getByTestId('widget-iframe')).toBeInTheDocument();
  });

  it('passes yandexMapUrl as src to map iframe', () => {
    render(<ContactInfo isDark={false} />);
    expect(screen.getByTestId('widget-iframe')).toHaveAttribute(
      'data-src',
      'https://yandex.ru/maps/org/123'
    );
  });
});
