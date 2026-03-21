import { renderHook, act } from '@testing-library/react';
import { useRandomButtonHighlight } from './useRandomButtonHighlight';

describe('useRandomButtonHighlight', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Pin Math.random to 0 so rand(min, max) always returns min:
    //   rand(2000, 5000) → 2000 (hold duration)
    //   rand(1000, 4000) → 1000 (pause duration)
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('starts with null', () => {
    const { result } = renderHook(() => useRandomButtonHighlight(3));
    expect(result.current).toBeNull();
  });

  it('returns a number in [0, count) after initial delay', () => {
    const { result } = renderHook(() => useRandomButtonHighlight(3));
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).not.toBeNull();
    expect(result.current).toBeGreaterThanOrEqual(0);
    expect(result.current as number).toBeLessThan(3);
  });

  it('cycles back to null after the hold period', () => {
    const { result } = renderHook(() => useRandomButtonHighlight(3));
    // Initial delay = 0 in test env; fire cycle()
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).not.toBeNull();

    // Advance exactly the hold duration (2000ms) — null is set, pause timer starts
    act(() => vi.advanceTimersByTime(2000));
    expect(result.current).toBeNull();
  });

  it('cycles to a new index after the pause period', () => {
    const { result } = renderHook(() => useRandomButtonHighlight(3));
    act(() => vi.advanceTimersByTime(1)); // trigger first cycle
    act(() => vi.advanceTimersByTime(2000)); // hold expires → null
    expect(result.current).toBeNull();

    // Advance exactly the pause duration (1000ms) — cycle() fires again
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).not.toBeNull();
  });

  it('clears timeout on unmount without throwing', () => {
    const { unmount } = renderHook(() => useRandomButtonHighlight(3));
    expect(() => {
      act(() => unmount());
    }).not.toThrow();
  });

  it('returns 0 for count=1 (only valid index)', () => {
    const { result } = renderHook(() => useRandomButtonHighlight(1));
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe(0);
  });
});
