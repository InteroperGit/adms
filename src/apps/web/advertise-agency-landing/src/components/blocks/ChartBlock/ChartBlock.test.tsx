import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('./BarChart', () => ({
  BarChart: () => <div data-testid="bar-chart" />,
}));

vi.mock('./HorizontalBarChart', () => ({
  HorizontalBarChart: () => <div data-testid="horizontal-bar-chart" />,
}));

vi.mock('./ProgressChart', () => ({
  ProgressChart: () => <div data-testid="progress-chart" />,
}));

vi.mock('./LineChart', () => ({
  LineChart: () => <div data-testid="line-chart" />,
}));

vi.mock('./PieChart', () => ({
  PieChart: () => <div data-testid="pie-chart" />,
}));

import { ChartBlock } from './index';

const GRADIENT = 'from-blue-500 to-purple-500';

describe('ChartBlock', () => {
  it('routes to BarChart for type bar', () => {
    render(
      <ChartBlock
        block={{ __component: 'chart', type: 'bar', items: [] }}
        caseGradient={GRADIENT}
      />
    );
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('routes to HorizontalBarChart for type horizontal-bar', () => {
    render(
      <ChartBlock
        block={{ __component: 'chart', type: 'horizontal-bar', items: [] }}
        caseGradient={GRADIENT}
      />
    );
    expect(screen.getByTestId('horizontal-bar-chart')).toBeInTheDocument();
  });

  it('routes to ProgressChart for type progress', () => {
    render(
      <ChartBlock
        block={{ __component: 'chart', type: 'progress', items: [] }}
        caseGradient={GRADIENT}
      />
    );
    expect(screen.getByTestId('progress-chart')).toBeInTheDocument();
  });

  it('routes to LineChart for type line', () => {
    render(
      <ChartBlock
        block={{ __component: 'chart', type: 'line', items: [] }}
        caseGradient={GRADIENT}
      />
    );
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('routes to PieChart for type pie', () => {
    render(
      <ChartBlock
        block={{ __component: 'chart', type: 'pie', items: [] }}
        caseGradient={GRADIENT}
      />
    );
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('renders optional title when provided', () => {
    render(
      <ChartBlock
        block={{ __component: 'chart', type: 'bar', title: 'Revenue Chart', items: [] }}
        caseGradient={GRADIENT}
      />
    );
    expect(screen.getByText('Revenue Chart')).toBeInTheDocument();
  });

  it('does not render title when not provided', () => {
    const { container } = render(
      <ChartBlock
        block={{ __component: 'chart', type: 'bar', items: [] }}
        caseGradient={GRADIENT}
      />
    );
    expect(container.querySelector('h2')).not.toBeInTheDocument();
  });
});
