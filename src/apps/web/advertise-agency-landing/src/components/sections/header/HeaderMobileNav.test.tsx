import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HeaderMobileNav } from './HeaderMobileNav';

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

describe('HeaderMobileNav', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders hamburger button initially', () => {
    render(<HeaderMobileNav {...makeDefaultProps()} />);
    expect(screen.getByRole('button', { name: 'Открыть меню' })).toBeInTheDocument();
  });

  it('opens menu drawer when hamburger clicked', () => {
    render(<HeaderMobileNav {...makeDefaultProps()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Открыть меню' }));
    expect(screen.getByText('О нас')).toBeInTheDocument();
    expect(screen.getByText('Услуги')).toBeInTheDocument();
  });

  it('shows close button aria-label when menu is open', () => {
    render(<HeaderMobileNav {...makeDefaultProps()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Открыть меню' }));
    expect(screen.getByRole('button', { name: 'Закрыть меню' })).toBeInTheDocument();
  });

  it('closes menu after clicking a nav link', () => {
    render(<HeaderMobileNav {...makeDefaultProps()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Открыть меню' }));
    expect(screen.getByText('О нас')).toBeInTheDocument();

    fireEvent.click(screen.getByText('О нас'));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.queryByText('О нас')).not.toBeInTheDocument();
  });

  it('shows backdrop overlay when menu is open', () => {
    render(<HeaderMobileNav {...makeDefaultProps()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Открыть меню' }));
    const backdrop = document.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeInTheDocument();
  });
});
