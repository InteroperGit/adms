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

import { BarChart } from './BarChart';
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
  type: 'bar',
  items,
});

describe('BarChart', () => {
  it('renders the chart container div', () => {
    const { container } = render(<BarChart block={makeBlock()} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.style.height).toBe('300px');
  });

  it('renders Recharts BarChart when inView', () => {
    render(<BarChart block={makeBlock([{ label: 'A', value: 10 }])} />);
    expect(screen.getByTestId('recharts-bar-chart')).toBeInTheDocument();
  });

  it('renders one Bar element', () => {
    render(
      <BarChart
        block={makeBlock([
          { label: 'Q1', value: 100 },
          { label: 'Q2', value: 200 },
        ])}
      />
    );
    expect(screen.getAllByTestId('bar')).toHaveLength(1);
  });

  it('renders with empty items without crashing', () => {
    expect(() => render(<BarChart block={makeBlock([])} />)).not.toThrow();
  });
});
