// Verify the settings popup markup and its browser behavior independently.
// @vitest-environment node
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import ts from 'typescript';
import Component from './Settings.astro';
import { render } from '../../../tests/helpers/render';

const sourcePath = join(process.cwd(), 'src/components/ui/Settings.astro');

async function runSettingsScript(dom: JSDOM) {
  const source = await readFile(sourcePath, 'utf8');
  const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  if (!script) throw new Error('Settings script was not found');
  const code = ts.transpile(script, { target: ts.ScriptTarget.ES2022 });
  dom.window.eval(code);
}

function fixture() {
  const dom = new JSDOM(
    '<header><div data-theme-settings>' +
      '<button data-settings-trigger aria-expanded="false"></button>' +
      '<div data-settings-panel hidden>' +
      '<input type="radio" value="system" checked></div>' +
      '</div></header><button id="outside"></button>' +
      '<button id="mobile-menu-open"></button>',
    { runScripts: 'outside-only' },
  );
  const bounds = (left: number, top: number, width: number, height: number) =>
    ({
      x: left,
      y: top,
      left,
      top,
      right: left + width,
      bottom: top + height,
      width,
      height,
      toJSON: () => ({}),
    }) as DOMRect;
  dom.window.ResizeObserver = class {
    callback: ResizeObserverCallback;
    observe = vi.fn();
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }
  } as unknown as typeof ResizeObserver;
  const trigger = dom.window.document.querySelector('button')!;
  const panel = dom.window.document.querySelector<HTMLElement>(
    '[data-settings-panel]',
  )!;
  trigger.getBoundingClientRect = () => bounds(700, 20, 44, 44);
  panel.getBoundingClientRect = () => bounds(0, 0, 240, 120);
  const header = dom.window.document.querySelector('header')!;
  header.getBoundingClientRect = () => bounds(0, 0, 800, 80);
  Object.defineProperty(dom.window, 'innerWidth', { value: 800 });
  Object.defineProperty(dom.window, 'innerHeight', { value: 600 });
  return { dom, panel, trigger };
}

it('renders the trigger and hidden theme choices', async () => {
  const body = await render(Component);
  expect(body.querySelector('[data-theme-settings]')).toHaveAttribute('hidden');
  expect(body.querySelector('[data-settings-trigger]')).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  expect(body.querySelector('[data-settings-panel]')).toHaveAttribute('hidden');
  expect(body.querySelectorAll('[data-theme-radio]')).toHaveLength(3);
});

it('opens, places, resizes and dismisses the settings panel', async () => {
  const { dom, panel, trigger } = fixture();
  await runSettingsScript(dom);
  trigger.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  expect(panel.hidden).toBe(false);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  expect(panel.style.left).toBe('504px');
  expect(panel.style.top).toBe('72px');
  Object.defineProperty(dom.window, 'innerWidth', { value: 600 });
  dom.window.dispatchEvent(new dom.window.Event('resize'));
  expect(panel.style.left).toBe('344px');
  dom.window.document
    .querySelector('#outside')
    ?.dispatchEvent(new dom.window.Event('pointerdown', { bubbles: true }));
  expect(panel.hidden).toBe(true);
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  dom.window.close();
});

it('supports keyboard focus, Escape and focus-boundary dismissal', async () => {
  const { dom, panel, trigger } = fixture();
  await runSettingsScript(dom);
  trigger.dispatchEvent(
    new dom.window.MouseEvent('click', {
      bubbles: true,
      detail: 0,
    }),
  );
  const radio = panel.querySelector<HTMLInputElement>('input')!;
  expect(dom.window.document.activeElement).toBe(radio);
  radio.dispatchEvent(
    new dom.window.KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    }),
  );
  expect(panel.hidden).toBe(true);
  expect(dom.window.document.activeElement).toBe(trigger);

  trigger.dispatchEvent(
    new dom.window.MouseEvent('click', {
      bubbles: true,
      detail: 1,
    }),
  );
  radio.focus();
  expect(panel.hidden).toBe(false);
  dom.window.document.querySelector<HTMLElement>('#outside')?.focus();
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(panel.hidden).toBe(true);

  trigger.dispatchEvent(
    new dom.window.MouseEvent('click', {
      bubbles: true,
      detail: 1,
    }),
  );
  dom.window.document
    .querySelector('#mobile-menu-open')
    ?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  expect(panel.hidden).toBe(true);
  dom.window.close();
});
