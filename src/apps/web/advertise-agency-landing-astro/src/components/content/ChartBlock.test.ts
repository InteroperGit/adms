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
