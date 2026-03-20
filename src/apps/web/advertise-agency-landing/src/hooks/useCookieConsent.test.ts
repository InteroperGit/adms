import { renderHook, act } from '@testing-library/react';
import { useCookieConsent, STORAGE_KEY, CONSENT_EVENT } from './useCookieConsent';

let localStorageStore: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => localStorageStore[key] ?? null,
  setItem: (key: string, value: string) => {
    localStorageStore[key] = value;
  },
  removeItem: (key: string) => {
    delete localStorageStore[key];
  },
  clear: () => {
    localStorageStore = {};
  },
};

beforeAll(() => {
  vi.stubGlobal('localStorage', localStorageMock);
});

beforeEach(() => {
  localStorageMock.clear();
});

describe('useCookieConsent', () => {
  it('returns null when no consent is stored', () => {
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current).toBeNull();
  });

  it('reads "all" from localStorage', () => {
    localStorageMock.setItem(STORAGE_KEY, 'all');
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current).toBe('all');
  });

  it('reads "necessary" from localStorage', () => {
    localStorageMock.setItem(STORAGE_KEY, 'necessary');
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current).toBe('necessary');
  });

  it('updates consent state when CONSENT_EVENT fires', () => {
    const { result } = renderHook(() => useCookieConsent());
    expect(result.current).toBeNull();

    act(() => {
      const event = new CustomEvent(CONSENT_EVENT, { detail: 'all' });
      window.dispatchEvent(event);
    });

    expect(result.current).toBe('all');
  });

  it('removes event listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useCookieConsent());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith(CONSENT_EVENT, expect.any(Function));
    removeSpy.mockRestore();
  });
});
