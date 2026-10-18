// Native radio semantics remain usable without custom keyboard handlers.
// @vitest-environment node
import { expect, it } from 'vitest';
import { getByRole } from '@testing-library/dom';
import Component from './ThemeToggle.astro';
import { render } from '../../../tests/helpers/render';

it('renders labelled radios with system selected by default', async () => {
  const body = await render(Component);
  const radios = body.querySelectorAll<HTMLInputElement>(
    'input[type="radio"][data-theme-radio]',
  );

  expect(
    getByRole(body, 'group', { name: 'Тема оформления' }),
  ).toBeInTheDocument();
  for (const name of ['Светлая', 'Тёмная', 'Системная']) {
    expect(getByRole(body, 'radio', { name })).toBeEnabled();
  }
  expect(radios).toHaveLength(3);
  expect([...radios].map((radio) => radio.value)).toEqual([
    'light',
    'dark',
    'system',
  ]);
  expect([...radios].every((radio) => radio.name === 'site-theme')).toBe(true);
  expect([...radios].filter((radio) => radio.checked)).toHaveLength(1);
  expect(body.querySelector('input[value="system"]')).toBeChecked();
  expect(body.querySelectorAll('label[title]')).toHaveLength(3);
  expect(body.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(3);
});
