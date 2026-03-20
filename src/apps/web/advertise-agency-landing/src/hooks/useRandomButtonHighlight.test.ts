import { renderHook, act } from '@testing-library/react';
import { useRandomButtonHighlight } from './useRandomButtonHighlight';

describe('useRandomButtonHighlight', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with null', () => {
    const { result } = renderHook(() => useRandomButtonHighlight(3));
    expect(result.current).toBeNull();
  });

  it('returns a number in [0, count) after initial delay', () => {
    const { result } = renderHook(() => useRandomButtonHighlight(3));
    act(() => vi.advanceTimersByTime(1)); // Allow initial setTimeout to fire
    expect(result.current).not.toBeNull();
    expect(result.current).toBeGreaterThanOrEqual(0);
    expect(result.current as number).toBeLessThan(3);
  });

  it('cycles back to null after the hold period', () => {
    const { result } = renderHook(() => useRandomButtonHighlight(3));
    act(() => vi.advanceTimersByTime(1)); // Allow initial setTimeout to fire
    expect(result.current).not.toBeNull();

    act(() => vi.advanceTimersByTime(5001)); // Advance past max hold duration by 1ms
    expect(result.current).toBeNull();
  });

  it('clears timeout on unmount without throwing', () => {
    const { unmount } = renderHook(() => useRandomButtonHighlight(3));
    expect(() => {
      act(() => unmount());
    }).not.toThrow();
  });

  it('returns 0 for count=1 (only valid index)', () => {
    const { result } = renderHook(() => useRandomButtonHighlight(1));
    act(() => vi.advanceTimersByTime(3000));
    if (result.current !== null) {
      expect(result.current).toBe(0);
    }
  });
});
