// Render real Astro output without executing browser scripts or fetching media.
import {
  experimental_AstroContainer as AstroContainer,
} from 'astro/container';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import { JSDOM } from 'jsdom';

export async function render(
  component: AstroComponentFactory,
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
) {
  const container = await AstroContainer.create();
  const html = await container.renderToString(component, { props, slots });
  const dom = new JSDOM(html);
  const body = dom.window.document.body;
  // Keep only the document alive; these tests need no window resources.
  dom.window.close();
  return body;
}
