import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useFadeIn } from './useFadeIn';

type IOCallback = (entries: IntersectionObserverEntry[]) => void;

const mockObserver = {
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
};

beforeAll(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn((cb: IOCallback) => {
      void cb;
      return mockObserver;
    })
  );
});

beforeEach(() => {
  mockObserver.observe.mockClear();
  mockObserver.disconnect.mockClear();
  vi.mocked(IntersectionObserver).mockClear();
});

function mockMatchMedia(reducedMotion = false) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion') ? reducedMotion : false,
    media: query,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

beforeEach(() => {
  mockMatchMedia(false);
});

describe('useFadeIn', () => {
  it('returns a ref and isVisible=false initially (no reduced motion, no element)', () => {
    const { result } = renderHook(() => useFadeIn());
    expect(result.current.ref).toBeDefined();
    expect(result.current.isVisible).toBe(false);
  });

  it('creates an IntersectionObserver when an element is attached to the ref', () => {
    const el = document.createElement('div');

    const wrapper = () => {
      const hookResult = useFadeIn();
      React.useLayoutEffect(() => {
        // @ts-expect-error force-assign
        hookResult.ref.current = el;
      }, []);
      return hookResult;
    };

    renderHook(wrapper);
    expect(IntersectionObserver).toHaveBeenCalled();
  });

  it('becomes visible immediately when prefers-reduced-motion is set', async () => {
    mockMatchMedia(true);

    const { result } = renderHook(() => useFadeIn());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.isVisible).toBe(true);
  });

  it('disconnects on unmount when observer was created', () => {
    const el = document.createElement('div');

    const wrapper = () => {
      const hookResult = useFadeIn();
      React.useLayoutEffect(() => {
        // @ts-expect-error force-assign
        hookResult.ref.current = el;
      }, []);
      return hookResult;
    };

    const { unmount } = renderHook(wrapper);
    unmount();
    expect(mockObserver.disconnect).toHaveBeenCalled();
  });
});
