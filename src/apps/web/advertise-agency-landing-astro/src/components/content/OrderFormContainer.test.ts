// @vitest-environment node
// Form containers connect their heading and optional description accessibly.
import { expect, it } from 'vitest';
import OrderFormContainer from './OrderFormContainer.astro';
import { render } from '../../../tests/helpers/render';

it('renders labelled content and a caller slot', async () => {
  const body = await render(OrderFormContainer, {
    id: 'request', title: 'Request', description: 'Tell us more',
  }, { default: '<button>Send</button>' });
  const section = body.querySelector('section');
  expect(section).toHaveAttribute('aria-labelledby', 'request-title');
  expect(section).toHaveTextContent('Tell us more');
  expect(section).toHaveTextContent('Send');
});
