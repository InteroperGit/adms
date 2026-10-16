// Browser API mocks shared by scripts and component tests.
import { vi } from 'vitest';

export interface BrowserMockOptions {
  reducedMotion?: boolean;
  fetchResponse?: Partial<Response>;
}

export interface BrowserMocks {
  matchMedia: (query: string) => MediaQueryList;
  fetch: ReturnType<typeof vi.fn>;
  intersectionObservers: MockIntersectionObserver[];
  resizeObservers: MockResizeObserver[];
  restore: () => void;
}

export class MockIntersectionObserver {
  readonly callback: IntersectionObserverCallback;
  readonly observed = new Set<Element>();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(element: Element) { this.observed.add(element); }
  unobserve(element: Element) { this.observed.delete(element); }
  disconnect() { this.observed.clear(); }

  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(entries as IntersectionObserverEntry[], this as unknown as
      IntersectionObserver);
  }
}

export class MockResizeObserver {
  readonly callback: ResizeObserverCallback;
  readonly observed = new Set<Element>();

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(element: Element) { this.observed.add(element); }
  unobserve(element: Element) { this.observed.delete(element); }
  disconnect() { this.observed.clear(); }

  trigger(entries: Partial<ResizeObserverEntry>[]) {
    this.callback(entries as ResizeObserverEntry[], this as unknown as
      ResizeObserver);
  }
}

/** Install deterministic browser APIs and return trigger handles. */
export function installBrowserMocks(
  options: BrowserMockOptions = {},
): BrowserMocks {
  const intersectionObservers: MockIntersectionObserver[] = [];
  const resizeObservers: MockResizeObserver[] = [];
  const matchMedia = vi.fn((query: string) => ({
    matches: options.reducedMotion ?? false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }) as unknown as MediaQueryList);
  const fetch = vi.fn(async () => new Response(null, {
    status: 200,
    ...options.fetchResponse,
  }));

  vi.stubGlobal('matchMedia', matchMedia);
  vi.stubGlobal('fetch', fetch);
  vi.stubGlobal('IntersectionObserver', class extends MockIntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
      super(callback);
      intersectionObservers.push(this);
    }
  });
  vi.stubGlobal('ResizeObserver', class extends MockResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      super(callback);
      resizeObservers.push(this);
    }
  });

  return {
    matchMedia, fetch, intersectionObservers, resizeObservers,
    restore: () => vi.unstubAllGlobals(),
  };
}

/** Clear browser state between tests that use storage or DOM globals. */
export function resetBrowserState() {
  if (typeof window === 'undefined') return;
  if (typeof window.localStorage?.clear === 'function') {
    window.localStorage.clear();
  }
  if (typeof window.sessionStorage?.clear === 'function') {
    window.sessionStorage.clear();
  }
  document.body.replaceChildren();
}
