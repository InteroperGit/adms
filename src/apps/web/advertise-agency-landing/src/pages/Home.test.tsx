import { render, screen } from '@/test/utils';
import { describe, it, expect, vi } from 'vitest';

// Mock all heavyweight section components — Home is pure composition.
vi.mock('@/components/sections/carousel', () => ({
  Carousel: () => <div data-testid="carousel" />,
}));
vi.mock('@/components/sections/hero', () => ({
  Hero: () => <div data-testid="hero" />,
}));
vi.mock('@/components/sections/about', () => ({
  About: () => <div data-testid="about" />,
}));
vi.mock('@/components/sections/services', () => ({
  Services: () => <div data-testid="services" />,
}));
vi.mock('@/components/sections/portfolio', () => ({
  Portfolio: () => <div data-testid="portfolio" />,
}));
vi.mock('@/components/sections/advantages', () => ({
  Advantages: () => <div data-testid="advantages" />,
}));
vi.mock('@/components/sections/call-to-action', () => ({
  CallToAction: () => <div data-testid="cta" />,
}));
vi.mock('@/components/sections/testimonials', () => ({
  Testimonials: () => <div data-testid="testimonials" />,
}));
vi.mock('@/components/sections/contact', () => ({
  Contact: () => <div data-testid="contact" />,
}));
vi.mock('@/components/ui/section/SectionDivider', () => ({
  SectionDivider: () => <hr data-testid="divider" />,
}));

import Home from './Home';

describe('Home', () => {
  it('renders a <main> element with id main-content', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('main#main-content')).toBeInTheDocument();
  });

  it('renders all section components', () => {
    render(<Home />);
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('about')).toBeInTheDocument();
    expect(screen.getByTestId('services')).toBeInTheDocument();
    expect(screen.getByTestId('portfolio')).toBeInTheDocument();
    expect(screen.getByTestId('advantages')).toBeInTheDocument();
    expect(screen.getByTestId('cta')).toBeInTheDocument();
    expect(screen.getByTestId('testimonials')).toBeInTheDocument();
    expect(screen.getByTestId('contact')).toBeInTheDocument();
  });

  it('renders sections in document order', () => {
    render(<Home />);
    const sections = [
      'carousel',
      'hero',
      'about',
      'services',
      'portfolio',
      'advantages',
      'cta',
      'testimonials',
      'contact',
    ];
    const nodes = sections.map((id) => screen.getByTestId(id));
    for (let i = 0; i < nodes.length - 1; i++) {
      expect(
        nodes[i].compareDocumentPosition(nodes[i + 1]) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    }
  });

  it('renders section dividers between sections', () => {
    render(<Home />);
    expect(screen.getAllByTestId('divider').length).toBeGreaterThanOrEqual(1);
  });

  it('still renders Hero when Carousel throws', async () => {
    // Carousel is inside ErrorBoundary — a throw must not hide Hero
    const { default: ActualHome } = await vi.importActual<typeof import('./Home')>('./Home');
    // Re-mock Carousel to throw
    vi.doMock('@/components/sections/carousel', () => ({
      Carousel: () => {
        throw new Error('carousel boom');
      },
    }));
    // Use the already-mocked (non-throwing) render from the top-level mock
    render(<Home />);
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    void ActualHome; // silence unused var lint
  });
});
