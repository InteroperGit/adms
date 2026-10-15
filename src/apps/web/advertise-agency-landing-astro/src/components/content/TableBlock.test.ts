// @vitest-environment node
// Tables retain headers and a labelled keyboard-scroll region.
import { expect, it } from 'vitest';
import TableBlock from './TableBlock.astro';
import { render } from '../../../tests/helpers/render';

it('renders captioned columns and row values', async () => {
  const body = await render(TableBlock, { block: {
    type: 'table', caption: 'Comparison',
    columns: [{ key: 'name', label: 'Name' }, { key: 'value', label: 'Value' }],
    rows: [{ cells: ['A', '12'] }],
  } });
  expect(body.querySelector('table')).toHaveAccessibleName('Comparison');
  expect(body.querySelectorAll('th')).toHaveLength(2);
  expect(body.querySelector('tbody')).toHaveTextContent('12');
});
