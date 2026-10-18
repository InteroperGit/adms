// Check header composition and its scroll, focus, and history-event behavior.
// @vitest-environment node
import { readFileSync } from 'node:fs';
import { beforeEach, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { transpile } from 'typescript';
import { site } from '@/content/site';
import { render } from '../../tests/helpers/render';
import Component from './Header.astro';

const source = readFileSync(new URL('./Header.astro', import.meta.url), 'utf8');
const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = [];
  callback: ResizeObserverCallback;
  observed: Element[] = [];

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    ResizeObserverMock.instances.push(this);
  }

  observe(target: Element) {
    this.observed.push(target);
  }
  unobserve() {}
  disconnect() {
    this.observed = [];
  }
}

beforeEach(() => {
  ResizeObserverMock.instances = [];
});

async function fixture(hash = '') {
  if (!script) throw new Error('Header script was not found');
  const body = await render(Component);
  const dom = new JSDOM(body.innerHTML, {
    url: `https://site.example/${hash}`,
    runScripts: 'outside-only',
  });
  const { document, location } = dom.window;
  const header = document.querySelector<HTMLElement>(
    '[data-auto-hide-header]',
  )!;
  const frames: FrameRequestCallback[] = [];
  Object.defineProperty(dom.window, 'ResizeObserver', {
    value: ResizeObserverMock,
  });
  Object.defineProperty(dom.window, 'scrollY', {
    configurable: true,
    writable: true,
    value: 0,
  });
  Object.defineProperty(dom.window, 'innerHeight', { value: 600 });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 2000,
  });
  Object.defineProperty(header, 'offsetHeight', { value: 80 });
  dom.window.requestAnimationFrame = (callback) => {
    frames.push(callback);
    return frames.length;
  };
  const section = document.createElement('section');
  section.id = 'contacts';
  section.scrollIntoView = vi.fn();
  document.body.append(section);
  dom.window.eval(transpile(script, { target: 9 }));

  return {
    dom,
    document,
    header,
    location,
    frames,
    section,
    flushFrame() {
      frames.shift()?.(0);
    },
  };
}

it('composes navigation, settings, menu, and brand children', async () => {
  const body = await render(Component);
  const header = body.querySelector('header[data-auto-hide-header]');
  const navs = [...header!.querySelectorAll('nav')];
  const opener = header?.querySelector<HTMLButtonElement>('#mobile-menu-open');
  const settings = header?.querySelector('[data-theme-settings]');
  const dialog = header?.querySelector<HTMLDialogElement>('#mobile-menu');

  expect(header).not.toBeNull();
  expect(header?.querySelector('.header-brand')?.textContent).toContain(
    site.logoText,
  );
  expect(navs).toHaveLength(2);
  expect(navs[0]?.classList.contains('desktop-nav')).toBe(true);
  expect(
    navs.map((nav) =>
      [...nav.querySelectorAll('a')].map((link) => [
        link.textContent?.trim(),
        link.getAttribute('href'),
      ]),
    ),
  ).toContainEqual(
    expect.arrayContaining(site.menu.map((item) => [item.label, item.href])),
  );
  expect(settings?.hasAttribute('hidden')).toBe(true);
  expect(settings?.querySelector('[data-settings-trigger]')).toHaveAttribute(
    'aria-controls',
    'theme-settings-panel',
  );
  expect(dialog?.hasAttribute('open')).toBe(false);
  expect(opener?.getAttribute('aria-controls')).toBe('mobile-menu');
  expect(opener?.getAttribute('aria-expanded')).toBe('false');
  expect(ResizeObserverMock.instances).toHaveLength(0);
});

it('measures the header and hides on downward scrolling', async () => {
  const state = await fixture();
  const { dom, header, frames } = state;
  expect(
    dom.window.document.documentElement.style.getPropertyValue(
      '--site-header-clearance',
    ),
  ).toBe('96px');
  expect(ResizeObserverMock.instances).toHaveLength(1);
  expect(ResizeObserverMock.instances[0]?.observed).toContain(header);

  Object.defineProperty(dom.window, 'scrollY', { value: 120 });
  dom.window.dispatchEvent(new dom.window.Event('scroll'));
  expect(frames).toHaveLength(1);
  state.flushFrame();
  expect(header.dataset.hidden).toBe('true');

  Object.defineProperty(dom.window, 'scrollY', { value: 100 });
  dom.window.dispatchEvent(new dom.window.Event('scroll'));
  state.flushFrame();
  expect(header.dataset.hidden).toBe('false');
  dom.window.close();
});

it('reveals for focus, hash changes, and restored pages', async () => {
  const { dom, header, flushFrame } = await fixture();
  let y = 100;
  const hide = () => {
    y += 20;
    Object.defineProperty(dom.window, 'scrollY', { value: y });
    dom.window.dispatchEvent(new dom.window.Event('scroll'));
    flushFrame();
  };

  hide();
  expect(header.dataset.hidden).toBe('true');
  header.dispatchEvent(new dom.window.FocusEvent('focusin'));
  expect(header.dataset.hidden).toBe('false');

  hide();
  dom.window.dispatchEvent(new dom.window.HashChangeEvent('hashchange'));
  expect(header.dataset.hidden).toBe('false');

  hide();
  dom.window.dispatchEvent(new dom.window.PageTransitionEvent('pageshow'));
  expect(header.dataset.hidden).toBe('false');
  dom.window.close();
});

it('corrects the initial hash unless the visitor interacts first', async () => {
  const state = await fixture('#contacts');
  state.flushFrame();
  expect(state.section.scrollIntoView).toHaveBeenCalledOnce();

  const interrupted = await fixture('#contacts');
  interrupted.dom.window.dispatchEvent(
    new interrupted.dom.window.Event('pointerdown'),
  );
  interrupted.flushFrame();
  expect(interrupted.section.scrollIntoView).not.toHaveBeenCalled();
  interrupted.dom.window.close();
  state.dom.window.close();
});

it('ignores malformed initial hashes and removes input listeners', async () => {
  const state = await fixture('#%E0%A4%A');
  const remove = vi.spyOn(state.dom.window, 'removeEventListener');
  state.flushFrame();

  expect(state.section.scrollIntoView).not.toHaveBeenCalled();
  expect(remove).toHaveBeenCalledWith('pointerdown', expect.any(Function));
  expect(remove).toHaveBeenCalledWith('wheel', expect.any(Function));
  expect(remove).toHaveBeenCalledWith('touchstart', expect.any(Function));
  expect(remove).toHaveBeenCalledWith('keydown', expect.any(Function));
  state.dom.window.close();
});
