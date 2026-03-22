import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('@/hooks/useViewportAnimation', () => ({
  useViewportAnimation: () => [{ current: null }, true],
}));

vi.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="recharts-bar-chart">{children}</div>
  ),
  Bar: ({ children }: { children?: React.ReactNode }) => <div data-testid="bar">{children}</div>,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  LabelList: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('./CustomTooltip', () => ({
  CustomTooltip: () => null,
}));

vi.mock('./colorResolver', () => ({
  resolveChartColor: () => 'hsl(var(--primary))',
}));

import { HorizontalBarChart } from './HorizontalBarChart';
import type { ChartBlock } from '@/types/blocks';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi
      .fn()
      .mockReturnValue({ matches: false, addListener: vi.fn(), removeListener: vi.fn() }),
  });
});

const makeBlock = (items: ChartBlock['items'] = []): ChartBlock => ({
  __component: 'chart',
  type: 'horizontal-bar',
  items,
});

describe('HorizontalBarChart', () => {
  it('renders the chart container with dynamic height', () => {
    const items = [
      { label: 'A', value: 10 },
      { label: 'B', value: 20 },
      { label: 'C', value: 30 },
      { label: 'D', value: 40 },
      { label: 'E', value: 50 },
    ];
    const { container } = render(<HorizontalBarChart block={makeBlock(items)} />);
    const wrapper = container.firstChild as HTMLElement;
    // height = max(200, 5 * 40) = 200
    expect(wrapper.style.height).toBe('200px');
  });

  it('uses minimum height of 200px for few items', () => {
    const { container } = render(
      <HorizontalBarChart block={makeBlock([{ label: 'A', value: 1 }])} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.height).toBe('200px');
  });

  it('scales height beyond 200px for many items', () => {
    const items = Array.from({ length: 6 }, (_, i) => ({ label: `Item ${i}`, value: i * 10 }));
    const { container } = render(<HorizontalBarChart block={makeBlock(items)} />);
    const wrapper = container.firstChild as HTMLElement;
    // height = max(200, 6 * 40) = 240
    expect(wrapper.style.height).toBe('240px');
  });

  it('renders Recharts BarChart when inView', () => {
    render(<HorizontalBarChart block={makeBlock([{ label: 'A', value: 10 }])} />);
    expect(screen.getByTestId('recharts-bar-chart')).toBeInTheDocument();
  });

  it('renders one Bar element', () => {
    render(
      <HorizontalBarChart
        block={makeBlock([
          { label: 'Q1', value: 100 },
          { label: 'Q2', value: 200 },
        ])}
      />
    );
    expect(screen.getAllByTestId('bar')).toHaveLength(1);
  });

  it('renders with empty items without crashing', () => {
    expect(() => render(<HorizontalBarChart block={makeBlock([])} />)).not.toThrow();
  });
});
