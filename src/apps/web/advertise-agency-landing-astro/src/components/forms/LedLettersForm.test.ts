// @vitest-environment node
// The lettering form exposes required contact fields and its service payload.
import { expect, it } from 'vitest';
import { getByRole, getAllByRole } from '@testing-library/dom';
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

it('uses the default service and exposes the full accessible field groups',
  async () => {
    const body = await render(LedLettersForm, {});
    const form = body.querySelector('form[data-led-letters]')!;
    expect(form).toHaveAttribute('method', 'post');
    expect(form).toHaveAttribute('data-enabled');
    expect(form).toHaveAttribute('data-endpoint');
    expect(form).toHaveAttribute('data-timeout');
    expect(form.querySelector('input[name="serviceId"]'))
      .toHaveValue('svetovye-bukvy');
    expect(form.querySelector('input[name="projectId"]')).toBeNull();
    expect(getByRole(body, 'heading', { name: /световые буквы/i }))
      .toBeInTheDocument();
    expect(getAllByRole(form, 'group')).toHaveLength(4);
    expect(form.querySelector('input[name="name"]')).toBeRequired();
    expect(form.querySelector('input[name="phone"]')).toBeRequired();
    expect(form.querySelector('input[name="consent"]')).toBeRequired();
    expect(form.querySelector('input[name="email"]')).not.toBeRequired();
  });

it('keeps the submit control disabled until client initialization',
  async () => {
  const body = await render(LedLettersForm, { serviceId: 'custom-service' });
  const form = body.querySelector('form[data-led-letters]')!;
  expect(form.querySelector('input[name="serviceId"]'))
    .toHaveValue('custom-service');
  expect(form.querySelector('button[type="submit"]')).toBeDisabled();
  expect(form.querySelector('[role="status"]')).toHaveAttribute(
    'aria-live', 'polite',
  );
  expect(form.querySelector('a[href="/privacy-policy"]'))
    .toBeInTheDocument();
  expect(form.querySelector('a[href="/terms-of-use"]'))
    .toBeInTheDocument();
});
