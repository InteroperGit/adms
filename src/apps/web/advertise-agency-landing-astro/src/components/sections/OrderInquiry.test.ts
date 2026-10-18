// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Component from './OrderInquiry.astro';
import { render } from '../../../tests/helpers/render';

it('renders the general inquiry shell with protected fields and status',
  async () => {
    const body = await render(Component, {});
    const form = body.querySelector('form[data-inquiry]')!;
    expect(Component).toBeDefined();
    expect(form).toHaveAttribute('method', 'post');
    expect(form.querySelector('fieldset')).toBeDisabled();
    expect(form.querySelector('button[type="submit"]')).toBeDisabled();
    expect(form.querySelector('[role="status"]')).toHaveAttribute(
      'aria-live', 'polite',
    );
    expect(form.querySelector('input[name="name"]')).toBeRequired();
    expect(form.querySelector('textarea[name="message"]')).toBeRequired();
    expect(form.querySelector('input[name="consent"]')).toBeRequired();
    expect(getByRole(body, 'link', { name: /privacy/i }))
      .toHaveAttribute('href', '/privacy-policy');
  });

it('exposes labels, hints and error associations for every control',
  async () => {
    const body = await render(Component, {});
    const form = body.querySelector('form[data-inquiry]')!;
    const controls = form.querySelectorAll('input, textarea');
    expect(controls).toHaveLength(5);
    controls.forEach((control) => {
      expect(control).toHaveAttribute('id');
      expect(control).toHaveAttribute('aria-describedby');
    });
    expect(form.querySelector('#inquiry-name-hint')).toBeInTheDocument();
    expect(form.querySelector('#inquiry-message-error'))
      .toHaveAttribute('hidden');
  });
