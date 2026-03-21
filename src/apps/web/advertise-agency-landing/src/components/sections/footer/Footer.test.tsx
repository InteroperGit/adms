import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('./FooterBrand', () => ({
  FooterBrand: () => <div data-testid="footer-brand" />,
}));

vi.mock('./FooterNav', () => ({
  FooterNav: () => <div data-testid="footer-nav" />,
}));

vi.mock('./FooterServices', () => ({
  FooterServices: () => <div data-testid="footer-services" />,
}));

vi.mock('./FooterContact', () => ({
  FooterContact: () => <div data-testid="footer-contact" />,
}));

vi.mock('./FooterBottom', () => ({
  FooterBottom: () => <div data-testid="footer-bottom" />,
}));

import { Footer } from './index';

describe('Footer', () => {
  it('renders footer element', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('renders brand column', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer-brand')).toBeInTheDocument();
  });

  it('renders navigation column', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer-nav')).toBeInTheDocument();
  });

  it('renders services column', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer-services')).toBeInTheDocument();
  });

  it('renders contact column', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer-contact')).toBeInTheDocument();
  });

  it('renders bottom bar', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer-bottom')).toBeInTheDocument();
  });
});
