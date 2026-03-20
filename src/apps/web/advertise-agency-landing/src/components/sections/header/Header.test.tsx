import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Header } from './index';

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

// useTheme reads ThemeContext — mock the hook
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: false, toggle: vi.fn() }),
}));

// useViewportAnimation returns [ref, isVisible] — stub with always-visible
vi.mock('@/hooks/useViewportAnimation', () => ({
  useViewportAnimation: () => [{ current: null }, true],
}));

// useRandomButtonHighlight returns highlighted index
vi.mock('@/hooks/useRandomButtonHighlight', () => ({
  useRandomButtonHighlight: () => null,
}));

function renderHeader(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Header />
    </MemoryRouter>
  );
}

describe('Header', () => {
  it('renders header element', () => {
    renderHeader();
    expect(document.querySelector('header#main-nav')).toBeInTheDocument();
  });

  it('renders logo link', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: '' })).toBeInTheDocument();
  });

  it('renders desktop nav links', () => {
    renderHeader('/');
    expect(screen.getAllByText('О нас')).not.toHaveLength(0);
  });

  it('renders hamburger button for mobile nav', () => {
    renderHeader('/');
    expect(screen.getByRole('button', { name: 'Открыть меню' })).toBeInTheDocument();
  });

  it('renders dark mode toggle', () => {
    renderHeader('/');
    expect(screen.getByRole('button', { name: 'Тёмный режим' })).toBeInTheDocument();
  });
});
