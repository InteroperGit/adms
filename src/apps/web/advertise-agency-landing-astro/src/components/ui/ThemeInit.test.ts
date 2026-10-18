// Test the blocking theme script apart from rendered component markup.
// @vitest-environment node
import { afterEach, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import Component from './ThemeInit.astro';
import { render } from '../../../tests/helpers/render';

const windows: JSDOM[] = [];

async function inlineScript() {
  const body = await render(Component);
  const script = body.ownerDocument.querySelector('script')?.textContent;
  if (!script) throw new Error('Rendered theme script was not found');
  return script;
}

async function setup(
  storage: Record<string, string> = {},
  dark = false,
  blocked = false,
) {
  const dom = new JSDOM(
    '<html><body><div data-theme-control hidden></div>' +
      '<input type="radio" data-theme-radio value="light">' +
      '<input type="radio" data-theme-radio value="dark">' +
      '<input type="radio" data-theme-radio value="system"></body></html>',
    { runScripts: 'outside-only', url: 'https://example.test' },
  );
  windows.push(dom);
  const store = dom.window.localStorage;
  Object.entries(storage).forEach(([key, value]) => {
    store.setItem(key, value);
  });
  if (blocked) {
    Object.defineProperty(dom.window, 'localStorage', {
      get: () => {
        throw new Error('blocked');
      },
    });
  }
  const mediaListeners: EventListener[] = [];
  const media = {
    matches: dark,
    addEventListener: (_: string, listener: EventListener) => {
      mediaListeners.push(listener);
    },
  };
  Object.defineProperty(dom.window, 'matchMedia', { value: () => media });
  dom.window.eval(await inlineScript());
  return { dom, media, mediaListeners, store };
}

afterEach(() => {
  windows.splice(0).forEach((dom) => dom.window.close());
});

it('renders only an inline head script without component markup', async () => {
  const body = await render(Component);
  expect(body.childElementCount).toBe(0);
  expect(Component).toBeDefined();
  expect(body.ownerDocument.querySelector('script')?.textContent).toContain(
    'localStorage.getItem(key)',
  );
});

it('applies saved preferences before readiness', async () => {
  const { dom } = await setup({ 'site-theme': 'dark' });
  const root = dom.window.document.documentElement;
  expect(root.dataset.theme).toBe('dark');
  expect(root.style.colorScheme).toBe('dark');
  expect(
    dom.window.document.querySelector<HTMLInputElement>('[value="dark"]')
      ?.checked,
  ).toBe(true);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  expect(
    dom.window.document.querySelector('[data-theme-control]'),
  ).not.toHaveAttribute('hidden');
  dom.window.close();
});

it.each(['invalid', null])(
  'uses system mode for invalid stored values (%s)',
  async (stored) => {
    const { dom } = await setup(
      stored === null ? {} : { 'site-theme': stored },
      true,
    );
    expect(dom.window.document.documentElement.dataset.theme).toBe('dark');
    expect(
      dom.window.document.querySelector<HTMLInputElement>('[value="system"]')
        ?.checked,
    ).toBe(true);
  },
);

it.each([
  ['light', false, 'light'],
  ['system', true, 'dark'],
  ['system', false, 'light'],
])(
  'resolves the %s preference with media dark=%s',
  async (preference, dark, expected) => {
    const { dom } = await setup({ 'site-theme': preference }, dark);
    expect(dom.window.document.documentElement.dataset.theme).toBe(expected);
  },
);

it('follows media changes only while system mode is selected', async () => {
  const { dom, media, mediaListeners } = await setup({}, false);
  const listener = mediaListeners[0];
  media.matches = true;
  listener(new dom.window.Event('change'));
  expect(dom.window.document.documentElement.dataset.theme).toBe('dark');
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  const dark =
    dom.window.document.querySelector<HTMLInputElement>('[value="dark"]')!;
  dark.checked = true;
  dark.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  expect(dom.window.document.documentElement.dataset.theme).toBe('dark');
  expect(dom.window.localStorage.getItem('site-theme')).toBe('dark');
  media.matches = false;
  listener(new dom.window.Event('change'));
  expect(dom.window.document.documentElement.dataset.theme).toBe('dark');
});

it('accepts cross-tab changes and ignores unrelated storage keys', async () => {
  const { dom } = await setup({ 'site-theme': 'light' });
  const storageArea = dom.window.localStorage;
  const event = (key: string | null, newValue: string | null) =>
    new dom.window.StorageEvent('storage', {
      key,
      newValue,
      storageArea,
    });
  dom.window.dispatchEvent(event('other', 'dark'));
  expect(dom.window.document.documentElement.dataset.theme).toBe('light');
  dom.window.dispatchEvent(event('site-theme', 'dark'));
  expect(dom.window.document.documentElement.dataset.theme).toBe('dark');
  dom.window.dispatchEvent(event(null, null));
  expect(dom.window.document.documentElement.dataset.theme).toBe('light');
  expect(
    dom.window.document.querySelector<HTMLInputElement>('[value="system"]')
      ?.checked,
  ).toBe(true);
});

it('keeps controls usable with blocked storage', async () => {
  const { dom } = await setup({}, false, true);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  const dark =
    dom.window.document.querySelector<HTMLInputElement>('[value="dark"]')!;
  dark.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  expect(dom.window.document.documentElement.dataset.theme).toBe('dark');
  expect(dark.checked).toBe(true);
});
