// Exercise cookie choices, storage failures, and observer cleanup in jsdom.
// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fireEvent } from '@testing-library/dom';
import { beforeEach, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { transpile } from 'typescript';
import { render } from '../../tests/helpers/render';
import Component from './CookieBanner.astro';

const source = readFileSync(
  new URL('./CookieBanner.astro', import.meta.url),
  'utf8',
);
const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
let observers: ResizeObserverMock[] = [];

class ResizeObserverMock {
  callback: ResizeObserverCallback;
  observed: Element[] = [];
  disconnect = vi.fn(() => {
    this.observed = [];
  });

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    observers.push(this);
  }

  observe(target: Element) {
    this.observed.push(target);
  }
}

async function setup(
  consent?: string,
  observerAvailable = true,
  configureStorage?: (storage: Storage) => void,
) {
  if (!script) throw new Error('CookieBanner script was not found');
  const body = await render(Component);
  const dom = new JSDOM(body.innerHTML, {
    url: 'https://site.example/',
    runScripts: 'outside-only',
  });
  const banner =
    dom.window.document.querySelector<HTMLElement>('#cookie-banner')!;
  let height = 72;
  banner.getBoundingClientRect = () => ({ height }) as DOMRect;
  if (consent) dom.window.localStorage.setItem('cookieConsent', consent);
  configureStorage?.(dom.window.localStorage);
  Object.defineProperty(dom.window, 'ResizeObserver', {
    value: observerAvailable ? ResizeObserverMock : undefined,
  });
  dom.window.eval(transpile(script, { target: 9 }));

  return {
    dom,
    banner,
    get height() {
      return height;
    },
    set height(value: number) {
      height = value;
    },
    choice(value: string) {
      return banner.querySelector<HTMLButtonElement>(
        `[data-cookie-choice="${value}"]`,
      )!;
    },
  };
}

beforeEach(() => {
  observers = [];
});

it('renders policy links and choices without a focus trap', async () => {
  const body = await render(Component);
  const banner = body.querySelector('#cookie-banner');
  const choices = [
    ...banner!.querySelectorAll<HTMLButtonElement>('[data-cookie-choice]'),
  ];
  const lastChoice = choices.at(-1)!;
  const tab = new body.ownerDocument.defaultView!.KeyboardEvent('keydown', {
    key: 'Tab',
    bubbles: true,
    cancelable: true,
  });

  expect(banner?.getAttribute('aria-label')).toBe('Предпочтения cookie');
  expect(banner?.getAttribute('role')).toBeNull();
  expect(banner?.hasAttribute('tabindex')).toBe(false);
  expect(choices.map((button) => button.dataset.cookieChoice)).toEqual([
    'declined',
    'accepted',
  ]);
  expect(banner?.querySelector('a[href="/privacy-policy"]')).not.toBeNull();
  expect(banner?.querySelector('a[href="/terms-of-use"]')).not.toBeNull();
  expect(lastChoice.dispatchEvent(tab)).toBe(true);
  expect(tab.defaultPrevented).toBe(false);
});

it('shows a fresh banner and reserves its measured height', async () => {
  const state = await setup();
  expect(state.banner.hidden).toBe(false);
  expect(state.dom.window.document.body.style.paddingBottom).toBe('72px');
  expect(observers).toHaveLength(1);
  expect(observers[0]?.observed).toEqual([state.banner]);
  state.dom.window.close();
});

it.each(['accepted', 'declined'])(
  'suppresses the banner for a saved %s choice',
  async (choice) => {
    const state = await setup(choice);
    expect(state.banner.hidden).toBe(true);
    expect(state.dom.window.document.body.style.paddingBottom).toBe('');
    expect(observers).toHaveLength(0);
    state.dom.window.close();
  },
);

it.each(['accepted', 'declined'])(
  'saves a %s choice and releases reserved space',
  async (choice) => {
    const state = await setup();
    fireEvent.click(state.choice(choice));
    expect(state.dom.window.localStorage.getItem('cookieConsent')).toBe(choice);
    expect(state.banner.hidden).toBe(true);
    expect(state.dom.window.document.body.style.paddingBottom).toBe('');
    expect(observers[0]?.disconnect).toHaveBeenCalledOnce();
    state.dom.window.close();
  },
);

it('continues when storage reads and writes are blocked', async () => {
  const state = await setup(undefined, true, (storage) => {
    vi.spyOn(storage, 'getItem').mockImplementation(() => {
      throw new Error('Read blocked');
    });
    vi.spyOn(storage, 'setItem').mockImplementation(() => {
      throw new Error('Write blocked');
    });
  });
  expect(state.banner.hidden).toBe(false);
  expect(state.dom.window.document.body.style.paddingBottom).toBe('72px');
  expect(() => fireEvent.click(state.choice('accepted'))).not.toThrow();
  expect(state.banner.hidden).toBe(true);
  expect(state.dom.window.document.body.style.paddingBottom).toBe('');
  expect(observers[0]?.disconnect).toHaveBeenCalledOnce();
  state.dom.window.close();
});

it('dismisses when persistence fails after initialization', async () => {
  const state = await setup();
  vi.spyOn(state.dom.window.Storage.prototype, 'setItem').mockImplementation(
    () => {
      throw new Error('Write blocked');
    },
  );
  expect(() => fireEvent.click(state.choice('declined'))).not.toThrow();
  expect(state.banner.hidden).toBe(true);
  expect(state.dom.window.document.body.style.paddingBottom).toBe('');
  expect(observers[0]?.disconnect).toHaveBeenCalledOnce();
  state.dom.window.close();
});

it('updates reserved space when the banner height changes', async () => {
  const state = await setup();
  state.height = 96;
  observers[0]?.callback([], observers[0] as unknown as ResizeObserver);
  expect(state.dom.window.document.body.style.paddingBottom).toBe('96px');
  state.dom.window.close();
});

it('disconnects its observer when the page is hidden', async () => {
  const state = await setup();
  state.dom.window.dispatchEvent(
    new state.dom.window.PageTransitionEvent('pagehide'),
  );
  expect(observers[0]?.disconnect).toHaveBeenCalledOnce();
  state.dom.window.close();
});

it('still allows dismissal when ResizeObserver is unavailable', async () => {
  const state = await setup(undefined, false);
  expect(state.banner.hidden).toBe(false);
  expect(state.dom.window.document.body.style.paddingBottom).toBe('72px');
  expect(observers).toHaveLength(0);
  fireEvent.click(state.choice('accepted'));
  expect(state.banner.hidden).toBe(true);
  expect(state.dom.window.document.body.style.paddingBottom).toBe('');
  state.dom.window.close();
});
