// @vitest-environment node
// Unregistered forms fall back to the general inquiry destination.
import { expect, it } from 'vitest';
import OrderFormBlock from './OrderFormBlock.astro';
import { render } from '../../../tests/helpers/render';

it('renders a safe inquiry fallback for an unregistered form', async () => {
  const body = await render(OrderFormBlock, { block: {
    type: 'order-form', formId: 'unknown', context: 'service',
  } });
  expect(body.querySelector('.inquiry-link'))
    .toHaveAttribute('href', '/#order-inquiry');
});
