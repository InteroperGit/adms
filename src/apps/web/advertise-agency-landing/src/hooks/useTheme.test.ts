import { renderHook } from '@testing-library/react';
import React from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  it('returns isDark=false and toggle from default ThemeContext', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDark).toBe(false);
    expect(typeof result.current.toggle).toBe('function');
  });

  it('reflects a custom context value supplied via wrapper', () => {
    const toggle = vi.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeContext.Provider, { value: { isDark: true, toggle } }, children);

    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.isDark).toBe(true);
    expect(result.current.toggle).toBe(toggle);
  });
});
