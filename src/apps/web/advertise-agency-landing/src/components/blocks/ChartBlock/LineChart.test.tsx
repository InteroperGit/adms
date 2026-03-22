import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('@/hooks/useViewportAnimation', () => ({
  useViewportAnimation: () => [{ current: null }, true],
}));

vi.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="recharts-line-chart">{children}</div>
  ),
  Line: ({ children }: { children?: React.ReactNode }) => <div data-testid="line">{children}</div>,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  LabelList: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('./CustomTooltip', () => ({
  CustomTooltip: () => null,
}));

vi.mock('./colorResolver', () => ({
  resolveChartColor: () => 'hsl(var(--primary))',
}));

import { LineChart } from './LineChart';
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
  type: 'line',
  items,
});

describe('LineChart', () => {
  it('renders the chart container div with height 300', () => {
    const { container } = render(<LineChart block={makeBlock()} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.height).toBe('300px');
  });

  it('renders Recharts LineChart when inView', () => {
    render(<LineChart block={makeBlock([{ label: 'Jan', value: 10 }])} />);
    expect(screen.getByTestId('recharts-line-chart')).toBeInTheDocument();
  });

  it('renders one Line element for single series', () => {
    render(
      <LineChart
        block={makeBlock([
          { label: 'Jan', value: 10 },
          { label: 'Feb', value: 20 },
        ])}
      />
    );
    expect(screen.getAllByTestId('line')).toHaveLength(1);
  });

  it('renders with empty items without crashing', () => {
    expect(() => render(<LineChart block={makeBlock([])} />)).not.toThrow();
  });

  it('renders with suffix on items', () => {
    expect(() =>
      render(
        <LineChart
          block={makeBlock([
            { label: 'Q1', value: 100, suffix: '%' },
            { label: 'Q2', value: 80, suffix: '%' },
          ])}
        />
      )
    ).not.toThrow();
  });
});
