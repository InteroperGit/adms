// @vitest-environment node
import { expect, it } from 'vitest';
import Component from './Faq.astro';
import { render } from '../../../tests/helpers/render';

it('omits the FAQ section when no approved answers are visible', async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(body.querySelector('#faq')).toBeNull();
  expect(body.querySelectorAll('details.faq-item')).toHaveLength(0);
});
