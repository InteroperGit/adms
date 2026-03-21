import { renderHook, act } from '@testing-library/react';
import { useAnimatedPillPosition } from './useAnimatedPillPosition';

const mockObserver = {
  observe: vi.fn(),
  disconnect: vi.fn(),
};

beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    vi.fn(() => mockObserver)
  );
});

beforeEach(() => {
  mockObserver.observe.mockClear();
  mockObserver.disconnect.mockClear();
});

function makeRect(rect: Partial<DOMRect>): DOMRect {
  return {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    right: 0,
    bottom: 0,
    x: 0,
    y: 0,
    toJSON: () => '',
    ...rect,
  };
}

describe('useAnimatedPillPosition', () => {
  it('returns zero position when no active item is present', () => {
    const containerRef = { current: null as HTMLDivElement | null };
    const itemRefs = { current: [] as (HTMLElement | null)[] };

    const { result } = renderHook(() => useAnimatedPillPosition(containerRef, itemRefs, 0));

    expect(result.current.position).toEqual({ top: 0, left: 0, width: 0, height: 0 });
    expect(result.current.isAnimating).toBe(false);
  });

  it('returns correct position relative to container when active item is found', () => {
    const container = document.createElement('div');
    const button = document.createElement('button');

    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(makeRect({ top: 10, left: 20 }));
    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(
      makeRect({ top: 30, left: 80, width: 100, height: 40 })
    );

    const containerRef = { current: container };
    const itemRefs = { current: [button] };

    const { result } = renderHook(() => useAnimatedPillPosition(containerRef, itemRefs, 0));

    expect(result.current.position).toEqual({
      top: 20, // 30 - 10
      left: 60, // 80 - 20
      width: 100,
      height: 40,
    });
  });

  it('does not animate on the first render', () => {
    const container = document.createElement('div');
    const button = document.createElement('button');

    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(makeRect({}));
    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(makeRect({ width: 80, height: 32 }));

    const containerRef = { current: container };
    const itemRefs = { current: [button] };

    const { result } = renderHook(() => useAnimatedPillPosition(containerRef, itemRefs, 0));

    // First render — isAnimating should be false
    expect(result.current.isAnimating).toBe(false);
  });

  it('sets isAnimating to true when activeIndex changes after first render', () => {
    const container = document.createElement('div');
    const btn0 = document.createElement('button');
    const btn1 = document.createElement('button');

    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(makeRect({}));
    vi.spyOn(btn0, 'getBoundingClientRect').mockReturnValue(makeRect({ width: 80, height: 32 }));
    vi.spyOn(btn1, 'getBoundingClientRect').mockReturnValue(
      makeRect({ left: 100, width: 90, height: 32 })
    );

    const containerRef = { current: container };
    const itemRefs = { current: [btn0, btn1] };

    const { result, rerender } = renderHook(
      ({ idx }: { idx: number }) => useAnimatedPillPosition(containerRef, itemRefs, idx),
      { initialProps: { idx: 0 } }
    );

    expect(result.current.isAnimating).toBe(false);

    act(() => {
      rerender({ idx: 1 });
    });

    expect(result.current.isAnimating).toBe(true);
  });
});
