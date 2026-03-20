import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';
import { describe, it, expect, vi } from 'vitest';
import { headerContent } from '@/types/sections/header/header.ts';

// Mock the headerContent data
vi.mock('../../types/sections/header/header', () => ({
  headerContent: {
    logo: {
      src: '/logo.png',
      href: '/',
    },
  },
}));

describe('Logo', () => {
  // 1. Rendering
  it('should render an <a> element as the root', () => {
    render(<Logo />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe('A');
  });

  it('should render an <img> element inside the <a> tag', () => {
    render(<Logo />);
    const linkElement = screen.getByRole('link');
    const imgElement = linkElement.querySelector('img');
    expect(imgElement).toBeInTheDocument();
  });

  it('should apply headerContent.logo.href to the href attribute of the <a> tag', () => {
    render(<Logo />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', headerContent.logo.href);
  });

  it('should apply headerContent.logo.src to the src attribute of the <img> tag', () => {
    render(<Logo />);
    const linkElement = screen.getByRole('link');
    const imgElement = linkElement.querySelector('img');
    expect(imgElement).toHaveAttribute('src', headerContent.logo.src);
  });

  it('should apply an empty alt attribute to the <img> tag', () => {
    render(<Logo />);
    const linkElement = screen.getByRole('link');
    const imgElement = linkElement.querySelector('img');
    expect(imgElement).toHaveAttribute('alt', '');
  });

  it('should apply default classes h-6 w-auto to the <img> tag', () => {
    render(<Logo />);
    const linkElement = screen.getByRole('link');
    const imgElement = linkElement.querySelector('img');
    expect(imgElement).toHaveClass('h-6');
    expect(imgElement).toHaveClass('w-auto');
  });

  // 2. Props - className
  it('should apply the provided className to the <a> element', () => {
    render(<Logo className="test-class" />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveClass('test-class');
  });

  it('should combine the provided className with the default inline-flex class', () => {
    render(<Logo className="another-class" />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveClass('inline-flex');
    expect(linkElement).toHaveClass('another-class');
  });

  it('should handle an empty className prop without errors', () => {
    render(<Logo className="" />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveClass('inline-flex'); // Default class should still be there
  });
});
