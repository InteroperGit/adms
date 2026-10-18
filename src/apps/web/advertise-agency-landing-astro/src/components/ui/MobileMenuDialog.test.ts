// @vitest-environment node
import { readFileSync } from 'node:fs';
import { afterEach, expect, it, vi } from 'vitest';
import { fireEvent, getByRole } from '@testing-library/dom';
import { JSDOM } from 'jsdom';
import { transpile } from 'typescript';
import MobileMenuDialog from './MobileMenuDialog.astro';
import { render } from '../../../tests/helpers/render';

const source = readFileSync(
  new URL('./MobileMenuDialog.astro', import.meta.url),
  'utf8',
);
const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const windows: JSDOM[] = [];
const props = {
  items: [{ label: 'Services', href: '/#services' }],
  phone: '+7 999 123 45 67',
};

afterEach(() => {
  windows.splice(0).forEach((dom) => dom.window.close());
});

// Run actual script; mock only native modal APIs missing from jsdom.
async function setup(openerPresent = true, menuPresent = true) {
  const body = await render(MobileMenuDialog, props);
  const openerMarkup = openerPresent
    ? '<button id="mobile-menu-open" aria-expanded="false">Menu</button>'
    : '';
  const dom = new JSDOM(
    openerMarkup +
      (menuPresent ? body.innerHTML : '') +
      '<section id="services">Services section</section>',
    { url: 'https://example.test/', runScripts: 'outside-only' },
  );
  windows.push(dom);
  const { document } = dom.window;
  const menu = document.querySelector('dialog')!;
  const opener =
    document.querySelector<HTMLButtonElement>('#mobile-menu-open')!;
  if (menu) {
    menu.showModal = vi.fn(() => {
      menu.open = true;
      menu.querySelector<HTMLElement>('[autofocus]')?.focus();
    });
    menu.close = vi.fn(() => {
      menu.open = false;
      menu.dispatchEvent(new dom.window.Event('close'));
    });
    vi.spyOn(menu, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 288,
      bottom: 600,
      width: 288,
      height: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
  }
  expect(script).toBeTruthy();
  dom.window.eval(transpile(script!));
  return { dom, document, menu, opener };
}

it('renders accessible dialog controls and supplied mobile links', async () => {
  const body = await render(MobileMenuDialog, props);
  const menu = getByRole(body, 'dialog', { hidden: true });
  expect(menu).toHaveAttribute('id', 'mobile-menu');
  expect(menu).toHaveAttribute('aria-label', 'Меню сайта');
  expect(menu).not.toHaveAttribute('open');
  const close = getByRole(menu, 'button', { hidden: true });
  expect(close).toHaveAttribute('aria-label', 'Закрыть меню');
  expect(close).toHaveAttribute('autofocus');
  expect(menu.querySelector('a')).toHaveAttribute('href', '/#services');
  expect(menu.querySelector('a[href^="tel:"]')).toHaveAttribute(
    'href',
    'tel:+79991234567',
  );
});

it('opens, closes, updates expanded state and returns focus', async () => {
  const { document, menu, opener } = await setup();
  fireEvent.click(opener);
  expect(menu.showModal).toHaveBeenCalledOnce();
  expect(menu.open).toBe(true);
  expect(opener).toHaveAttribute('aria-expanded', 'true');
  expect(document.activeElement).toBe(menu.querySelector('button'));
  fireEvent.click(menu.querySelector('button')!);
  expect(menu.open).toBe(false);
  expect(opener).toHaveAttribute('aria-expanded', 'false');
  expect(document.activeElement).toBe(opener);
});

it('allows native Escape and handles its close event', async () => {
  const { dom, menu, opener } = await setup();
  fireEvent.click(opener);
  const escape = new dom.window.KeyboardEvent('keydown', {
    key: 'Escape',
    bubbles: true,
    cancelable: true,
  });
  expect(menu.dispatchEvent(escape)).toBe(true);
  const cancel = new dom.window.Event('cancel', { cancelable: true });
  expect(menu.dispatchEvent(cancel)).toBe(true);
  // jsdom does not implement the browser's default Escape action.
  menu.close();
  expect(opener).toHaveAttribute('aria-expanded', 'false');
  expect(dom.window.document.activeElement).toBe(opener);
});

it('wraps focus only at the first and last controls', async () => {
  const { document, menu, opener } = await setup();
  fireEvent.click(opener);
  const controls = menu.querySelectorAll<HTMLElement>('button, a[href]');
  const first = controls[0]!;
  const last = controls[controls.length - 1]!;
  first.focus();
  expect(fireEvent.keyDown(first, { key: 'Tab', shiftKey: true })).toBe(false);
  expect(document.activeElement).toBe(last);
  expect(fireEvent.keyDown(last, { key: 'Tab' })).toBe(false);
  expect(document.activeElement).toBe(first);
  controls[1]!.focus();
  expect(fireEvent.keyDown(controls[1]!, { key: 'Tab' })).toBe(true);
});

it.each([
  [300, 200],
  [-1, 200],
  [100, -1],
  [100, 601],
])('dismisses backdrop clicks at %i, %i', async (clientX, clientY) => {
  const { menu, opener } = await setup();
  fireEvent.click(opener);
  fireEvent.click(menu, { clientX, clientY });
  expect(menu.open).toBe(false);
});

it('keeps inside clicks open', async () => {
  const { menu, opener } = await setup();
  fireEvent.click(opener);
  fireEvent.click(menu, { clientX: 100, clientY: 100 });
  fireEvent.click(menu.querySelector('nav')!);
  expect(menu.open).toBe(true);
});

it.each([null, '0'])(
  'focuses hash sections with tabindex %s',
  async (index) => {
    const { document, menu, opener } = await setup();
    const section = document.getElementById('services')!;
    if (index !== null) section.setAttribute('tabindex', index);
    fireEvent.click(opener);
    const link = menu.querySelector('a')!;
    link.addEventListener('click', (event) => event.preventDefault());
    fireEvent.click(link);
    expect(menu.open).toBe(false);
    expect(document.activeElement).toBe(section);
    expect(section).toHaveAttribute('tabindex', index ?? '-1');
    opener.focus();
    expect(section.getAttribute('tabindex')).toBe(index);
  },
);

it.each(['ctrlKey', 'metaKey', 'shiftKey', 'altKey'])(
  'preserves modified navigation with %s',
  async (modifier) => {
    const { menu, opener } = await setup();
    fireEvent.click(opener);
    const link = menu.querySelector('a')!;
    link.addEventListener('click', (event) => event.preventDefault());
    fireEvent.click(link, { [modifier]: true });
    expect(menu.open).toBe(true);
    expect(menu.close).not.toHaveBeenCalled();
  },
);

it.each(['/projects/', '/#missing', 'tel:+79991234567'])(
  'closes without focusing a section for %s',
  async (href) => {
    const { document, menu, opener } = await setup();
    const link = menu.querySelector('a')!;
    link.href = href;
    link.addEventListener('click', (event) => event.preventDefault());
    fireEvent.click(opener);
    fireEvent.click(link);
    expect(menu.open).toBe(false);
    expect(document.activeElement).toBe(opener);
  },
);

it('closes on resize only when the opener disappears', async () => {
  const { dom, menu, opener } = await setup();
  const rects = vi.spyOn(opener, 'getClientRects');
  rects.mockReturnValue([{}] as unknown as DOMRectList);
  fireEvent.click(opener);
  dom.window.dispatchEvent(new dom.window.Event('resize'));
  expect(menu.open).toBe(true);
  rects.mockReturnValue([] as unknown as DOMRectList);
  dom.window.dispatchEvent(new dom.window.Event('resize'));
  expect(menu.open).toBe(false);
  dom.window.dispatchEvent(new dom.window.Event('resize'));
  expect(menu.close).toHaveBeenCalledOnce();
});

it.each([
  [false, true],
  [true, false],
  [false, false],
])('ignores missing elements (opener %s, menu %s)', async (opener, menu) => {
  const result = await setup(opener, menu);
  if (result.opener) fireEvent.click(result.opener);
  if (result.menu) expect(result.menu.showModal).not.toHaveBeenCalled();
});
