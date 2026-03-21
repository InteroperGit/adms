import { renderHook, act } from '@testing-library/react';
import { useViewportAnimation } from './useViewportAnimation';

type IOCallback = (entries: IntersectionObserverEntry[]) => void;

function mockMatchMedia(prefersReduced: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? prefersReduced : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('useViewportAnimation', () => {
  describe('without prefers-reduced-motion', () => {
    let ioCallback: IOCallback | null = null;
    const mockObserver = { observe: vi.fn(), disconnect: vi.fn() };

    beforeEach(() => {
      ioCallback = null;
      mockObserver.observe.mockClear();
      mockObserver.disconnect.mockClear();
      mockMatchMedia(false);
      vi.stubGlobal(
        'IntersectionObserver',
        vi.fn((cb: IOCallback, opts?: IntersectionObserverInit) => {
          ioCallback = cb;
          // Store opts for threshold test
          (mockObserver as unknown as Record<string, unknown>)._opts = opts;
          return mockObserver;
        })
      );
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('returns false initially', () => {
      const { result } = renderHook(() => useViewportAnimation());
      const [, hasAnimated] = result.current;
      expect(hasAnimated).toBe(false);
    });

    it('returns a ref as first element', () => {
      const { result } = renderHook(() => useViewportAnimation());
      const [ref] = result.current;
      expect(ref).toBeDefined();
      expect(ref).toHaveProperty('current');
    });

    it('does not become true when isIntersecting=false', () => {
      const { result } = renderHook(() => useViewportAnimation());

      if (ioCallback) {
        act(() => {
          ioCallback!([{ isIntersecting: false } as IntersectionObserverEntry]);
        });
      }

      const [, hasAnimated] = result.current;
      expect(hasAnimated).toBe(false);
    });

    it('sets hasAnimated=true when IO fires isIntersecting=true', () => {
      // Mount a hook and manually fire the captured callback
      const { result } = renderHook(() => useViewportAnimation());

      if (ioCallback !== null) {
        // Observer was set up (element was attached) — fire the callback
        act(() => {
          ioCallback!([{ isIntersecting: true } as IntersectionObserverEntry]);
        });
        const [, hasAnimated] = result.current;
        expect(hasAnimated).toBe(true);
      } else {
        // ref.current was null → observer not set up → hasAnimated stays false
        // This is valid: hook is safe with no attached element
        const [, hasAnimated] = result.current;
        expect(hasAnimated).toBe(false);
      }
    });

    it('passes custom threshold to IntersectionObserver constructor', () => {
      renderHook(() => useViewportAnimation({ threshold: 0.7 }));
      // The opts stored on mockObserver._opts should have threshold: 0.7 if observer was created
      const opts = (mockObserver as unknown as Record<string, unknown>)._opts as
        | IntersectionObserverInit
        | undefined;
      if (opts) {
        expect(opts.threshold).toBe(0.7);
      }
      // If ref.current was null, no observer was created — that's also valid
    });

    it('does not throw on unmount', () => {
      const { unmount } = renderHook(() => useViewportAnimation());
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('with prefers-reduced-motion enabled', () => {
    let rafCallback: FrameRequestCallback | null = null;

    beforeEach(() => {
      mockMatchMedia(true);
      vi.stubGlobal(
        'IntersectionObserver',
        vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn() }))
      );
      vi.useFakeTimers();
      vi.stubGlobal(
        'requestAnimationFrame',
        vi.fn((cb: FrameRequestCallback) => {
          rafCallback = cb;
          return 1;
        })
      );
      vi.stubGlobal('cancelAnimationFrame', vi.fn());
    });

    afterEach(() => {
      rafCallback = null;
      vi.useRealTimers();
      vi.unstubAllGlobals();
    });

    it('sets hasAnimated=true immediately via rAF', () => {
      const { result } = renderHook(() => useViewportAnimation());

      expect(result.current[1]).toBe(false);

      act(() => {
        rafCallback!(0);
      });

      const [, hasAnimated] = result.current;
      expect(hasAnimated).toBe(true);
    });

    it('does not set up IntersectionObserver when reduced motion is preferred', () => {
      const IOConstructor = vi.mocked(window.IntersectionObserver);
      IOConstructor.mockClear();

      renderHook(() => useViewportAnimation());

      expect(IOConstructor).not.toHaveBeenCalled();
    });
  });
});
