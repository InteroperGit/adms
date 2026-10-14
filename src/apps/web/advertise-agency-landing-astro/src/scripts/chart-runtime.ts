// Loaded only for visible charts; the native data table is always available.
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import * as echarts from 'echarts/core';

interface ChartPoint {
  label: string;
  value: number;
}

interface ChartSeries {
  name: string;
  points: ChartPoint[];
}

interface ChartData {
  chartType: 'bar' | 'line' | 'pie';
  unit?: string;
  series: ChartSeries[];
}

// Register only the components used by the supported article chart contract.
echarts.use([
  BarChart, LineChart, PieChart, GridComponent, LegendComponent,
  TooltipComponent, CanvasRenderer,
]);

export function renderChart(element: HTMLElement): void {
  if (!element.isConnected || echarts.getInstanceByDom(element)) return;
  const data: ChartData = JSON.parse(element.dataset.chart ?? '{}');
  const chart = echarts.init(element, undefined, { renderer: 'canvas' });
  const labels = [...new Set(data.series.flatMap((series) =>
    series.points.map((point) => point.label),
  ))];
  const isPie = data.chartType === 'pie';
  const colors = [
    '#0f766e', '#c2410c', '#2563eb', '#9333ea', '#be123c', '#4d7c0f',
  ];
  chart.setOption({
    color: colors,
    animation: !matchMedia('(prefers-reduced-motion: reduce)').matches,
    tooltip: { trigger: isPie ? 'item' : 'axis' },
    legend: data.series.length > 1 ? {
      type: 'scroll',
      bottom: 0,
      pageTextStyle: { color: 'inherit' },
    } : undefined,
    grid: isPie ? undefined : {
      containLabel: true,
      left: 12,
      right: 12,
      bottom: data.series.length > 1 ? 42 : 20,
    },
    xAxis: isPie ? undefined : {
      type: 'category',
      data: labels,
      axisLabel: {
        interval: 0,
        hideOverlap: true,
        rotate: element.clientWidth < 520 ? 28 : 0,
      },
    },
    yAxis: isPie ? undefined : { type: 'value', name: data.unit },
    series: isPie
      ? [{
          type: 'pie',
          radius: ['35%', '70%'],
          data: data.series[0]?.points.map((point) => ({
            name: point.label, value: point.value,
          })) ?? [],
        }]
      : data.series.map((series) => ({
          name: series.name,
          type: data.chartType,
          data: labels.map((label) => series.points.find((point) =>
            point.label === label)?.value ?? null),
        })),
  });
  // Container-driven resizing supports responsive columns without polling.
  const observer = new ResizeObserver(() => {
    chart.resize();
    if (!isPie) {
      chart.setOption({
        xAxis: {
          axisLabel: {
            rotate: element.clientWidth < 520 ? 28 : 0,
          },
        },
      });
    }
  });
  observer.observe(element);
  window.addEventListener('pagehide', (event) => {
    // Back/Forward cache restores the same canvas and observer together.
    if (event.persisted) return;
    observer.disconnect();
    chart.dispose();
  });
}
