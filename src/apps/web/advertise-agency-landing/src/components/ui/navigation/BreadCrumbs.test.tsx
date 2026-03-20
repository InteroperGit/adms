import { render, screen } from '@testing-library/react';
import { BreadCrumbs } from './BreadCrumbs';
import { describe, it, expect } from 'vitest';

describe('BreadCrumbs', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Case Study' },
  ];

  it('renders all crumb labels', () => {
    render(<BreadCrumbs items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Case Study')).toBeInTheDocument();
  });

  it('renders links for non-last items with href', () => {
    render(<BreadCrumbs items={items} />);
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');
    const portfolioLink = screen.getByRole('link', { name: 'Portfolio' });
    expect(portfolioLink).toHaveAttribute('href', '/portfolio');
  });

  it('last item is not a link', () => {
    render(<BreadCrumbs items={items} />);
    const links = screen.getAllByRole('link');
    const linkTexts = links.map((l) => l.textContent);
    expect(linkTexts).not.toContain('Case Study');
  });

  it('last item has aria-current="page"', () => {
    render(<BreadCrumbs items={items} />);
    const current = screen.getByText('Case Study');
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('renders separators between items', () => {
    render(<BreadCrumbs items={items} />);
    // Two separator spans for three items (between item 0–1 and 1–2)
    // Query the wrapping spans that contain the ChevronRight icon (not SVG children)
    const separators = document.querySelectorAll('nav > span > span[aria-hidden="true"]');
    expect(separators.length).toBe(2);
  });

  it('renders nav with aria-label="Breadcrumb"', () => {
    render(<BreadCrumbs items={items} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('item without href renders as span (not link), even if not last', () => {
    render(
      <BreadCrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'No Link' }, // no href, not last
          { label: 'Last' },
        ]}
      />
    );
    const links = screen.getAllByRole('link');
    const linkTexts = links.map((l) => l.textContent);
    expect(linkTexts).not.toContain('No Link');
  });
});
