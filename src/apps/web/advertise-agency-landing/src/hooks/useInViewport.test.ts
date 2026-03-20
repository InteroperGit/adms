import { renderHook, act } from '@testing-library/react';
import { useInViewport } from './useInViewport';

type IOCallback = (entries: IntersectionObserverEntry[]) => void;
let ioCallback: IOCallback | null = null;

const mockObserver = {
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
};

beforeAll(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn((cb: IOCallback) => {
      ioCallback = cb;
      return mockObserver;
    })
  );
});

beforeEach(() => {
  ioCallback = null;
  mockObserver.observe.mockClear();
  mockObserver.disconnect.mockClear();
});

describe('useInViewport', () => {
  it('returns false initially', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useInViewport(ref));
    expect(result.current).toBe(false);
  });

  it('returns true when IntersectionObserver fires isIntersecting=true', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useInViewport(ref));

    act(() => {
      ioCallback?.([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(result.current).toBe(true);
  });

  it('returns false when element leaves viewport', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useInViewport(ref));

    act(() => {
      ioCallback?.([{ isIntersecting: true } as IntersectionObserverEntry]);
    });
    expect(result.current).toBe(true);

    act(() => {
      ioCallback?.([{ isIntersecting: false } as IntersectionObserverEntry]);
    });
    expect(result.current).toBe(false);
  });

  it('skips observer setup when ref.current is null', () => {
    const ref = { current: null };
    renderHook(() => useInViewport(ref));
    expect(mockObserver.observe).not.toHaveBeenCalled();
  });

  it('disconnects on unmount', () => {
    const ref = { current: document.createElement('div') };
    const { unmount } = renderHook(() => useInViewport(ref));
    unmount();
    expect(mockObserver.disconnect).toHaveBeenCalled();
  });
});
