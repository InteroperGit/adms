import { renderHook, act } from '@testing-library/react';
import { useSwipe } from './useSwipe';

function makeTouchEvent(clientX: number): React.TouchEvent {
  return {
    touches: [{ clientX }],
    changedTouches: [{ clientX }],
  } as unknown as React.TouchEvent;
}

describe('useSwipe', () => {
  it('calls onLeft when swiping left beyond threshold', () => {
    const onLeft = vi.fn();
    const onRight = vi.fn();
    const { result } = renderHook(() => useSwipe(onLeft, onRight, 50));

    act(() => {
      result.current.onTouchStart(makeTouchEvent(200));
      result.current.onTouchEnd(makeTouchEvent(100)); // delta=100 → left
    });

    expect(onLeft).toHaveBeenCalledTimes(1);
    expect(onRight).not.toHaveBeenCalled();
  });

  it('calls onRight when swiping right beyond threshold', () => {
    const onLeft = vi.fn();
    const onRight = vi.fn();
    const { result } = renderHook(() => useSwipe(onLeft, onRight, 50));

    act(() => {
      result.current.onTouchStart(makeTouchEvent(100));
      result.current.onTouchEnd(makeTouchEvent(200)); // delta=-100 → right
    });

    expect(onRight).toHaveBeenCalledTimes(1);
    expect(onLeft).not.toHaveBeenCalled();
  });

  it('does not fire when movement is below threshold', () => {
    const onLeft = vi.fn();
    const onRight = vi.fn();
    const { result } = renderHook(() => useSwipe(onLeft, onRight, 50));

    act(() => {
      result.current.onTouchStart(makeTouchEvent(100));
      result.current.onTouchEnd(makeTouchEvent(130)); // delta=30 < 50
    });

    expect(onLeft).not.toHaveBeenCalled();
    expect(onRight).not.toHaveBeenCalled();
  });

  it('sets didSwipe.current=true on valid swipe', () => {
    const { result } = renderHook(() => useSwipe(vi.fn(), vi.fn(), 50));

    act(() => {
      result.current.onTouchStart(makeTouchEvent(200));
      result.current.onTouchEnd(makeTouchEvent(100));
    });

    expect(result.current.didSwipe.current).toBe(true);
  });

  it('does not fire when touchEnd called without prior touchStart', () => {
    const onLeft = vi.fn();
    const { result } = renderHook(() => useSwipe(onLeft, vi.fn(), 50));

    act(() => {
      result.current.onTouchEnd(makeTouchEvent(100));
    });

    expect(onLeft).not.toHaveBeenCalled();
  });
});
