import { renderHook, act } from '@testing-library/react';
import React, { useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { useTheme } from '@/hooks/useTheme';

// ── localStorage mock (same pattern as useCookieConsent.test.ts) ──────────────
let lsStore: Record<string, string> = {};
const lsMock = {
  getItem: (key: string) => lsStore[key] ?? null,
  setItem: (key: string, value: string) => {
    lsStore[key] = value;
  },
  removeItem: (key: string) => {
    delete lsStore[key];
  },
  clear: () => {
    lsStore = {};
  },
};

beforeAll(() => {
  vi.stubGlobal('localStorage', lsMock);
});

beforeEach(() => {
  lsMock.clear();
});

// ── Helper: mirrors root.tsx Layout initializer logic ─────────────────────────
function resolveInitialDark(): boolean {
  const stored = localStorage.getItem('theme-mode');
  if (stored) {
    return stored === 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function makeWrapper(initialDark: boolean) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(initialDark);
    const toggle = () => setIsDark((prev) => !prev);
    return <ThemeContext.Provider value={{ isDark, toggle }}>{children}</ThemeContext.Provider>;
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ThemeContext — system preference default', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('isDark=true when system prefers dark and no localStorage value', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper(resolveInitialDark()),
    });
    expect(result.current.isDark).toBe(true);
  });
});

describe('ThemeContext — localStorage preference', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => ({
        matches: false, // system prefers light
        media: '',
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('isDark=true when localStorage says "dark" (overrides system light)', () => {
    lsMock.setItem('theme-mode', 'dark');
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper(resolveInitialDark()),
    });
    expect(result.current.isDark).toBe(true);
  });

  it('isDark=false when localStorage says "light"', () => {
    lsMock.setItem('theme-mode', 'light');
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper(resolveInitialDark()),
    });
    expect(result.current.isDark).toBe(false);
  });
});

describe('ThemeContext — toggle()', () => {
  it('flips isDark from false to true', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper(false),
    });
    expect(result.current.isDark).toBe(false);
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isDark).toBe(true);
  });

  it('flips isDark back to false on second call', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: makeWrapper(true),
    });
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isDark).toBe(false);
  });
});

describe('ThemeContext — multiple consumers', () => {
  it('two useTheme() calls in the same provider share identical state and toggle ref', () => {
    const { result } = renderHook(() => ({ a: useTheme(), b: useTheme() }), {
      wrapper: makeWrapper(false),
    });
    expect(result.current.a.isDark).toBe(result.current.b.isDark);
    expect(result.current.a.toggle).toBe(result.current.b.toggle);
  });
});
