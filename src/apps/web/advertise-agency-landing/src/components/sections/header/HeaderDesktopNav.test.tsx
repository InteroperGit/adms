import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeaderDesktopNav } from './HeaderDesktopNav';

vi.mock('@/types/sections/header/header', () => ({
  headerContent: {
    lang: 'ru',
    logo: { href: '/', src: '/logo.png' },
    nav: [
      { href: '#about', label: 'О нас' },
      { href: '#services', label: 'Услуги' },
    ],
    navCta: 'Заказать',
    openMenuLabel: 'Открыть меню',
    closeMenuLabel: 'Закрыть меню',
  },
}));

vi.mock('@/types/config/siteData', () => ({
  siteData: {
    contact: {
      phone: '71234567890',
      telegram: 'https://t.me/example',
      vk: 'https://vk.com/example',
    },
  },
}));

const makeDefaultProps = () => ({
  isHome: true,
  highlightedActionIndex: null as number | null,
  isDark: false,
  onToggleDark: vi.fn(),
});

describe('HeaderDesktopNav', () => {
  it('renders nav links', () => {
    render(<HeaderDesktopNav {...makeDefaultProps()} />);
    expect(screen.getByText('О нас')).toBeInTheDocument();
    expect(screen.getByText('Услуги')).toBeInTheDocument();
  });

  it('renders dark mode toggle button', () => {
    render(<HeaderDesktopNav {...makeDefaultProps()} />);
    expect(screen.getByRole('button', { name: 'Тёмный режим' })).toBeInTheDocument();
  });

  it('renders social links (phone)', () => {
    render(<HeaderDesktopNav {...makeDefaultProps()} />);
    expect(screen.getByRole('link', { name: 'Позвонить' })).toBeInTheDocument();
  });

  it('dark mode toggle shows correct aria-label when dark', () => {
    render(<HeaderDesktopNav {...makeDefaultProps()} isDark={true} />);
    expect(screen.getByRole('button', { name: 'Светлый режим' })).toBeInTheDocument();
  });
});
