// @vitest-environment node
// The lettering form exposes required contact fields and its service payload.
import { expect, it } from 'vitest';
import LedLettersForm from './LedLettersForm.astro';
import { render } from '../../../tests/helpers/render';

it('renders the lettering form with required contact controls', async () => {
  const body = await render(LedLettersForm, { projectId: 42 });
  expect(body.querySelector('form[data-led-letters]')).toBeInTheDocument();
  expect(body.querySelector('input[name="name"]')).toBeRequired();
  expect(body.querySelector('input[name="phone"]')).toBeRequired();
  expect(body.querySelector('input[name="projectId"]'))
    .toHaveValue('42');
});
