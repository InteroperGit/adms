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

it('keeps empty cells, labels numeric columns and escapes authored values',
  async () => {
    const body = await render(TableBlock, { block: {
      type: 'table', caption: '',
      columns: [
        { key: 'name', label: 'Name' }, { key: 'value', label: 'Value' },
      ],
      rows: [{ cells: ['<b>A</b>', '12'] }, { cells: ['', '13'] }],
    } });
    expect(body.querySelector('caption')).toBeNull();
    expect(body.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(body.querySelectorAll('th.numeric')).toHaveLength(1);
    expect(body.querySelector('b')).toBeNull();
    expect(body.querySelectorAll('td')).toHaveLength(4);
    expect(body.querySelectorAll('td')[2]).toHaveTextContent('');
  });
