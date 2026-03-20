import { renderHook, act } from '@testing-library/react';
import { useCountUp } from './useCountUp';

describe('useCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts at 0', () => {
    const { result } = renderHook(() => useCountUp(100, true, 500));
    expect(result.current).toBe(0);
  });

  it('stays at 0 when animate=false', () => {
    const { result } = renderHook(() => useCountUp(100, false, 500));
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe(0);
  });

  it('reaches target after duration elapses', () => {
    const { result } = renderHook(() => useCountUp(100, true, 500));
    act(() => vi.advanceTimersByTime(600));
    expect(result.current).toBe(100);
  });

  it('respects delay before starting', () => {
    const { result } = renderHook(() => useCountUp(100, true, 500, 300));
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe(0);
    act(() => vi.advanceTimersByTime(700));
    expect(result.current).toBe(100);
  });

  it('does not animate further when animate flips to false', () => {
    const { result, rerender } = renderHook(
      ({ animate }: { animate: boolean }) => useCountUp(50, animate, 200),
      { initialProps: { animate: true } }
    );
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe(50);

    rerender({ animate: false });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe(50);
  });
});
