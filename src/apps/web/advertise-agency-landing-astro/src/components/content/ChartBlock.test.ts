// @vitest-environment node
// Chart output keeps a readable data table when scripts are unavailable.
import { expect, it } from 'vitest';
import ChartBlock from './ChartBlock.astro';
import { render } from '../../../tests/helpers/render';

it('renders chart legend, bars and an accessible data table', async () => {
  const body = await render(ChartBlock, { block: {
    type: 'chart', chartType: 'bar', unit: '%', caption: 'Reach',
    series: [{ name: 'Views', points: [{ label: 'Jan', value: 24 }] }],
  } });
  expect(body.querySelector('.content-chart')).toBeInTheDocument();
  expect(body.querySelector('.content-chart__legend'))
    .toHaveTextContent('Views');
  expect(body.querySelector('.content-chart__bar-number'))
    .toHaveTextContent('24 %');
  expect(body.querySelector('table')).toHaveTextContent('Jan');
});

it('renders all series columns and marks missing points with an em dash',
  async () => {
    const body = await render(ChartBlock, { block: {
      type: 'chart', chartType: 'line', unit: 'units', caption: 'Orders',
      series: [
        { name: 'Online', points: [{ label: 'Jan', value: 3 }] },
        { name: 'Offline', points: [{ label: 'Feb', value: 5 }] },
      ],
    } });
    const table = body.querySelector('table');

    expect(body.querySelector('figcaption')).toHaveTextContent('Orders');
    expect(body.querySelectorAll('.content-chart__legend li'))
      .toHaveLength(2);
    expect(table?.querySelectorAll('thead th')).toHaveLength(3);
    expect(table).toHaveTextContent('Online');
    expect(table).toHaveTextContent('Offline');
    expect(table).toHaveTextContent('3 units');
    expect(table).toHaveTextContent('5 units');
    expect(table).toHaveTextContent('—');
  });

it('keeps the fallback structure usable when the series is empty', async () => {
  const body = await render(ChartBlock, { block: {
    type: 'chart', chartType: 'pie', series: [],
  } });

  expect(body.querySelector('.content-chart')).toBeInTheDocument();
  expect(body.querySelector('.content-chart__legend')).toBeNull();
  expect(body.querySelectorAll('.content-chart__bar-row')).toHaveLength(0);
  expect(body.querySelector('table')).toBeInTheDocument();
});

it('keeps unitless values and a stable authored chart id in the fallback',
  async () => {
    const body = await render(ChartBlock, { block: {
      type: 'chart', id: 'sales', chartType: 'bar', series: [{
        name: 'Sales', points: [{ label: 'Q1', value: 0 }],
      }],
    } });
    expect(body.querySelector('#chart-sales')).toBeInTheDocument();
    expect(body.querySelector('.content-chart__bar-number'))
      .toHaveTextContent('0');
    expect(body.querySelector('.content-chart__bar-number'))
      .not.toHaveTextContent('undefined');
  });
