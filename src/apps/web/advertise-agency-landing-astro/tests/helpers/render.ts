// Render real Astro output without executing browser scripts or fetching media.
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import { JSDOM } from 'jsdom';

interface DocumentOptions {
  props?: Record<string, unknown>;
  slots?: Record<string, string>;
  url?: string;
  params?: Record<string, string | undefined>;
  site?: string;
}

/** Render a whole route with its head and explicit Astro request context. */
export async function renderDocument(
  // Astro's generated route types may infer never for a route without props.
  component: AstroComponentFactory | ((props: never) => unknown),
  options: DocumentOptions = {},
) {
  const { site, url = 'https://request.test/', ...renderOptions } = options;
  const container = await AstroContainer.create({
    astroConfig: { site },
  });
  const html = await container.renderToString(
    component as AstroComponentFactory,
    {
      ...renderOptions,
      request: new Request(url),
      partial: false,
    },
  );
  // Scripts and network resources stay disabled: assertions see no-JS HTML.
  const dom = new JSDOM(html, { url });
  const document = dom.window.document;
  dom.window.close();
  return document;
}

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
