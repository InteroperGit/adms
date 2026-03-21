import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi
      .fn()
      .mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
  });
  const mockIntersectionObserver = vi.fn().mockImplementation((cb) => {
    cb([{ isIntersecting: false }]);
    return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
  });
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
  });
});

import { CardsBlock } from './CardsBlock';

const baseBlock = {
  __component: 'cards' as const,
  items: [
    { title: 'Card One', description: 'First card description' },
    { title: 'Card Two', description: 'Second card description' },
  ],
};

describe('CardsBlock', () => {
  it('renders card titles', () => {
    render(<CardsBlock block={baseBlock} caseGradient="from-blue-500 to-purple-500" />);
    expect(screen.getByText('Card One')).toBeInTheDocument();
    expect(screen.getByText('Card Two')).toBeInTheDocument();
  });

  it('renders card descriptions', () => {
    render(<CardsBlock block={baseBlock} caseGradient="from-blue-500 to-purple-500" />);
    expect(screen.getByText('First card description')).toBeInTheDocument();
    expect(screen.getByText('Second card description')).toBeInTheDocument();
  });

  it('renders optional title when provided', () => {
    render(
      <CardsBlock
        block={{ ...baseBlock, title: 'Our Services' }}
        caseGradient="from-blue-500 to-purple-500"
      />
    );
    expect(screen.getByText('Our Services')).toBeInTheDocument();
  });

  it('does not render title when not provided', () => {
    const { container } = render(
      <CardsBlock block={baseBlock} caseGradient="from-blue-500 to-purple-500" />
    );
    expect(container.querySelector('h2')).not.toBeInTheDocument();
  });

  it('applies hover transition classes to card items', () => {
    const { container } = render(
      <CardsBlock block={baseBlock} caseGradient="from-blue-500 to-purple-500" />
    );
    const cards = container.querySelectorAll('.transition-all');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('hides items initially (opacity-0) before scroll animation', () => {
    const { container } = render(
      <CardsBlock block={baseBlock} caseGradient="from-blue-500 to-purple-500" />
    );
    // Cards start with HIDDEN_STYLE (opacity: 0) since IntersectionObserver fires isIntersecting: false
    const cardDivs = container.querySelectorAll('[style]');
    const hiddenCards = Array.from(cardDivs).filter(
      (el) => (el as HTMLElement).style.opacity === '0'
    );
    expect(hiddenCards.length).toBeGreaterThan(0);
  });
});
