import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeaderNav } from './HeaderNav';

vi.mock('@/types/sections/header/header', () => ({
  headerContent: {
    lang: 'ru',
    logo: { href: '/', src: '/logo.png' },
    nav: [
      { href: '#about', label: 'О нас' },
      { href: '#services', label: 'Услуги' },
      { href: '#portfolio', label: 'Портфолио' },
    ],
    navCta: 'Заказать',
    openMenuLabel: 'Открыть меню',
    closeMenuLabel: 'Закрыть меню',
  },
}));

describe('HeaderNav', () => {
  it('renders all nav items', () => {
    render(<HeaderNav isHome={true} />);
    expect(screen.getByText('О нас')).toBeInTheDocument();
    expect(screen.getByText('Услуги')).toBeInTheDocument();
    expect(screen.getByText('Портфолио')).toBeInTheDocument();
  });

  it('uses href directly when isHome=true', () => {
    render(<HeaderNav isHome={true} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '#about');
  });

  it('prefixes href with "/" when isHome=false', () => {
    render(<HeaderNav isHome={false} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/#about');
  });

  it('renders desktop nav element by default', () => {
    const { container } = render(<HeaderNav isHome={true} />);
    expect(container.querySelector('nav')).toBeInTheDocument();
  });

  it('calls onLinkClick when a link is clicked', () => {
    const onLinkClick = vi.fn();
    render(<HeaderNav isHome={true} variant="mobile" onLinkClick={onLinkClick} />);
    fireEvent.click(screen.getByText('О нас'));
    expect(onLinkClick).toHaveBeenCalledTimes(1);
  });

  it('applies mobile-nav-item class when animateItems=true and variant=mobile', () => {
    render(<HeaderNav isHome={true} variant="mobile" animateItems={true} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveClass('mobile-nav-item');
  });

  it('does not apply mobile-nav-item class when animateItems=false', () => {
    render(<HeaderNav isHome={true} variant="mobile" animateItems={false} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).not.toHaveClass('mobile-nav-item');
  });
});
