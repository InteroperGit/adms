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
    const observer = { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    // Fire after observer is assigned to avoid temporal dead zone in useViewportAnimation
    Promise.resolve().then(() => cb([{ isIntersecting: true }]));
    return observer;
  });
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
  });
});

import { MetricsBlock } from './MetricsBlock';

const baseBlock = {
  __component: 'metrics' as const,
  items: [
    { metric: '120+', label: 'Projects', description: 'Completed projects' },
    { metric: '5', label: 'Years', description: 'In business' },
  ],
};

describe('MetricsBlock', () => {
  it('renders metric values', () => {
    render(<MetricsBlock block={baseBlock} caseGradient="from-blue-500 to-purple-500" />);
    // Static values shown before animation or as text
    expect(screen.getByText('120+')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders metric labels', () => {
    render(<MetricsBlock block={baseBlock} caseGradient="from-blue-500 to-purple-500" />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Years')).toBeInTheDocument();
  });

  it('renders metric descriptions', () => {
    render(<MetricsBlock block={baseBlock} caseGradient="from-blue-500 to-purple-500" />);
    expect(screen.getByText('Completed projects')).toBeInTheDocument();
    expect(screen.getByText('In business')).toBeInTheDocument();
  });

  it('renders optional title when provided', () => {
    render(
      <MetricsBlock
        block={{ ...baseBlock, title: 'Our Results' }}
        caseGradient="from-blue-500 to-purple-500"
      />
    );
    expect(screen.getByText('Our Results')).toBeInTheDocument();
  });

  it('does not render title element when not provided', () => {
    const { container } = render(
      <MetricsBlock block={baseBlock} caseGradient="from-blue-500 to-purple-500" />
    );
    expect(container.querySelector('h2')).not.toBeInTheDocument();
  });
});
