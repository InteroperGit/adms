import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('@/hooks/useViewportAnimation', () => ({
  useViewportAnimation: () => [{ current: null }, true],
}));

vi.mock('./colorResolver', () => ({
  resolveChartColor: () => 'hsl(var(--primary))',
}));

import { PieChart } from './PieChart';
import type { ChartBlock } from '@/types/blocks';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi
      .fn()
      .mockReturnValue({ matches: false, addListener: vi.fn(), removeListener: vi.fn() }),
  });
});

const ITEMS = [
  { label: 'Design', value: 45 },
  { label: 'Development', value: 35 },
  { label: 'Marketing', value: 20 },
];

const makeBlock = (items: ChartBlock['items'] = ITEMS): ChartBlock => ({
  __component: 'chart',
  type: 'pie',
  items,
});

describe('PieChart', () => {
  it('renders an SVG element', () => {
    const { container } = render(<PieChart block={makeBlock()} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders one circle per item as SVG arcs', () => {
    const { container } = render(<PieChart block={makeBlock()} />);
    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(ITEMS.length);
  });

  it('renders legend items for each data entry', () => {
    render(<PieChart block={makeBlock()} />);
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
  });

  it('renders values in legend by default', () => {
    render(<PieChart block={makeBlock()} />);
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('renders suffix with values when provided', () => {
    const items = [
      { label: 'A', value: 60, suffix: '%' },
      { label: 'B', value: 40, suffix: '%' },
    ];
    render(<PieChart block={makeBlock(items)} />);
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('renders a legend list (ul)', () => {
    const { container } = render(<PieChart block={makeBlock()} />);
    expect(container.querySelector('ul')).toBeInTheDocument();
  });

  it('renders without crashing for single item', () => {
    expect(() =>
      render(<PieChart block={makeBlock([{ label: 'Only', value: 100 }])} />)
    ).not.toThrow();
  });

  it('handles empty items without crashing', () => {
    expect(() => render(<PieChart block={makeBlock([])} />)).not.toThrow();
  });
});
