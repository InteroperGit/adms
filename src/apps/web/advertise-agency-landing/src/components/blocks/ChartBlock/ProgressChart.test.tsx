import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('@/hooks/useViewportAnimation', () => ({
  useViewportAnimation: () => [{ current: null }, true],
}));

vi.mock('@/libs/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

import { ProgressChart } from './ProgressChart';
import type { ChartBlock } from '@/types/blocks';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi
      .fn()
      .mockReturnValue({ matches: false, addListener: vi.fn(), removeListener: vi.fn() }),
  });
});

const makeBlock = (items: ChartBlock['items'] = [], color?: ChartBlock['color']): ChartBlock => ({
  __component: 'chart',
  type: 'progress',
  items,
  color,
});

const ITEMS = [
  { label: 'SEO', value: 80 },
  { label: 'SMM', value: 60 },
  { label: 'PPC', value: 40 },
];

describe('ProgressChart', () => {
  it('renders a label for each item', () => {
    render(
      <ProgressChart block={makeBlock(ITEMS)} articleGradient="from-blue-500 to-purple-500" />
    );
    expect(screen.getByText('SEO')).toBeInTheDocument();
    expect(screen.getByText('SMM')).toBeInTheDocument();
    expect(screen.getByText('PPC')).toBeInTheDocument();
  });

  it('renders the value for each item', () => {
    render(
      <ProgressChart block={makeBlock(ITEMS)} articleGradient="from-blue-500 to-purple-500" />
    );
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('renders suffix alongside value when provided', () => {
    const items = [
      { label: 'Speed', value: 95, suffix: '%' },
      { label: 'Quality', value: 88, suffix: '%' },
    ];
    render(<ProgressChart block={makeBlock(items)} articleGradient="from-green-500 to-teal-500" />);
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('88%')).toBeInTheDocument();
  });

  it('renders correct number of progress bar rows', () => {
    const { container } = render(
      <ProgressChart block={makeBlock(ITEMS)} articleGradient="from-blue-500 to-purple-500" />
    );
    // Each row is a flex div with label + bar + value
    const rows = container.querySelectorAll('.flex.items-center.gap-3');
    expect(rows).toHaveLength(ITEMS.length);
  });

  it('renders 100% width bar for maximum value item when inView', () => {
    const { container } = render(
      <ProgressChart block={makeBlock(ITEMS)} articleGradient="from-blue-500 to-purple-500" />
    );
    // Max item is SEO=80, so its bar fill should be 100%
    const fills = container.querySelectorAll('.h-full.rounded-full');
    const widths = Array.from(fills).map((el) => (el as HTMLElement).style.width);
    expect(widths).toContain('100%');
  });

  it('renders 0% width for an item with value 0', () => {
    const items = [
      { label: 'Active', value: 50 },
      { label: 'Inactive', value: 0 },
    ];
    const { container } = render(
      <ProgressChart block={makeBlock(items)} articleGradient="from-blue-500 to-purple-500" />
    );
    const fills = container.querySelectorAll('.h-full.rounded-full');
    const widths = Array.from(fills).map((el) => (el as HTMLElement).style.width);
    expect(widths).toContain('0%');
  });

  it('renders without crashing for empty items', () => {
    expect(() =>
      render(<ProgressChart block={makeBlock([])} articleGradient="from-blue-500 to-purple-500" />)
    ).not.toThrow();
  });

  it('uses accent background class when color type is accent', () => {
    const { container } = render(
      <ProgressChart
        block={makeBlock([{ label: 'Test', value: 50 }], { type: 'accent' })}
        articleGradient="from-blue-500 to-purple-500"
      />
    );
    const fill = container.querySelector('.h-full.rounded-full');
    expect(fill?.className).toContain('bg-accent');
  });
});
