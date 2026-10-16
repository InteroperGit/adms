// Keep a colocated smoke contract for the ThemeToggle component.
// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './ThemeToggle.astro';
import { render } from '../../../tests/helpers/render';

it('renders a labelled radio group with system selected by default',
  async () => {
    const body = await render(Component);
    const radios = body.querySelectorAll<HTMLInputElement>(
      'input[type="radio"][data-theme-radio]',
    );

    expect(Component).toBeDefined();
    expect(body.querySelector('fieldset legend')).toBeInTheDocument();
    expect(radios).toHaveLength(3);
    expect([...radios].map((radio) => radio.value)).toEqual([
      'light', 'dark', 'system',
    ]);
    expect(body.querySelector('input[value="system"]'))
      .toBeChecked();
    expect(body.querySelectorAll('label[title]')).toHaveLength(3);
    expect(body.querySelectorAll('svg[aria-hidden="true"]'))
      .toHaveLength(3);
});
