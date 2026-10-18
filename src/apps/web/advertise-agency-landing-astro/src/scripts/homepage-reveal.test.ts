// Browser-state coverage verifies reveal fallback, navigation and cleanup.
// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';

type ObserverEntry = { isIntersecting: boolean; target: Element };

class ObserverMock {
  static instances: ObserverMock[] = [];
  callback: (entries: ObserverEntry[]) => void;
  disconnected = false;

  constructor(callback: (entries: ObserverEntry[]) => void) {
    this.callback = callback;
    ObserverMock.instances.push(this);
  }

  observe() {}
  unobserve() {}
  disconnect() {
    this.disconnected = true;
  }
  reveal(target: Element) {
    this.callback([{ isIntersecting: true, target }]);
  }
}

function mediaQuery(matches = false) {
  return {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  };
}

function markup() {
  document.body.innerHTML = `
    <main class="homepage-sections">
      <section id="first"><a href="#second">Next</a></section>
      <section id="second"><button>Action</button></section>
    </main>`;
  const sections = [...document.querySelectorAll('section')];
  sections.forEach((section, index) => {
    vi.spyOn(section, 'getBoundingClientRect').mockReturnValue({
      top: index === 0 ? 0 : 1000,
      bottom: index === 0 ? 500 : 1500,
    } as DOMRect);
  });
  return sections;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  ObserverMock.instances = [];
  window.history.replaceState({}, '', '/');
});

it('leaves sections readable when observers are unavailable', async () => {
  vi.stubGlobal('IntersectionObserver', undefined);
  vi.stubGlobal('matchMedia', () => mediaQuery());
  vi.resetModules();
  const { initializeHomepageReveal } = await import('./homepage-reveal');
  markup();

  initializeHomepageReveal();

  expect(document.querySelectorAll('[data-reveal-state]')).toHaveLength(0);
});

it(
  'reveals pending sections and cleans listeners after the final entry',
  async () => {
  vi.stubGlobal('IntersectionObserver', ObserverMock);
  vi.stubGlobal('matchMedia', () => mediaQuery());
  vi.resetModules();
  const { initializeHomepageReveal } = await import('./homepage-reveal');
  const sections = markup();

  initializeHomepageReveal();

  expect(sections[1]).toHaveAttribute('data-reveal-state', 'pending');
  ObserverMock.instances[0].reveal(sections[1]);
  expect(sections[1]).toHaveAttribute('data-reveal-state', 'revealed');
  expect(ObserverMock.instances[0].disconnected).toBe(true);
});

it('tears down the observer on pagehide', async () => {
  vi.stubGlobal('IntersectionObserver', ObserverMock);
  vi.stubGlobal('matchMedia', () => mediaQuery());
  vi.resetModules();
  const { initializeHomepageReveal } = await import('./homepage-reveal');
  const sections = markup();

  initializeHomepageReveal();
  window.dispatchEvent(new Event('pagehide'));

  expect(ObserverMock.instances[0].disconnected).toBe(true);
  expect(sections[1]).toHaveAttribute('data-reveal-state', 'pending');
});

it('does not initialize under reduced motion', async () => {
  vi.stubGlobal('IntersectionObserver', ObserverMock);
  vi.stubGlobal('matchMedia', () => mediaQuery(true));
  vi.resetModules();
  const { initializeHomepageReveal } = await import('./homepage-reveal');
  markup();

  initializeHomepageReveal();

  expect(ObserverMock.instances).toHaveLength(0);
});
