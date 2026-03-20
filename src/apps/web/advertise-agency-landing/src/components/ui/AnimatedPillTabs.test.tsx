/// <reference types="vitest/globals" />
import { render, screen } from '@testing-library/react';
import { AnimatedPillTabs } from './AnimatedPillTabs';
import { useAnimatedPillPosition } from '@/hooks/useAnimatedPillPosition.ts';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the useAnimatedPillPosition hook
vi.mock('../../hooks/useAnimatedPillPosition', () => ({
  useAnimatedPillPosition: vi.fn(),
}));

const mockUseAnimatedPillPosition = useAnimatedPillPosition as ReturnType<typeof vi.fn>;

describe('AnimatedPillTabs', () => {
  const mockRenderItem = (item: { label: React.ReactNode; value: string }, isActive: boolean) => (
    <button data-testid={`tab-item-${item.value}`} data-is-active={isActive.toString()}>
      {item.label}
    </button>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock: returns position + isAnimating (matches actual hook return shape)
    mockUseAnimatedPillPosition.mockReturnValue({
      position: { left: 0, width: 0, height: 0 },
      isAnimating: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 1. Basic Rendering
  it('renders without errors with a minimal set of items', () => {
    const items = [{ label: 'Tab 1', value: 'tab1' }];
    render(<AnimatedPillTabs items={items} activeValue="tab1" renderItem={mockRenderItem} />);
    expect(screen.getByTestId('tab-item-tab1')).toBeInTheDocument();
  });

  // 2. Multiple Items Rendering
  it('ensures all provided items are rendered correctly', () => {
    const items = [
      { label: 'Tab A', value: 'a' },
      { label: 'Tab B', value: 'b' },
      { label: 'Tab C', value: 'c' },
    ];
    render(<AnimatedPillTabs items={items} activeValue="b" renderItem={mockRenderItem} />);
    expect(screen.getByTestId('tab-item-a')).toBeInTheDocument();
    expect(screen.getByTestId('tab-item-b')).toBeInTheDocument();
    expect(screen.getByTestId('tab-item-c')).toBeInTheDocument();
  });

  // 3. renderItem Functionality
  it('verifies that renderItem prop correctly renders content with isActive and index', () => {
    const items = [{ label: 'Test Tab', value: 'test' }];
    const customRenderItem = (
      item: { label: React.ReactNode; value: string },
      isActive: boolean,
      index: number
    ) => (
      <span data-is-active={isActive.toString()} data-index={index}>
        {item.label}
      </span>
    );
    render(<AnimatedPillTabs items={items} activeValue="test" renderItem={customRenderItem} />);
    const renderedSpan = screen.getByText('Test Tab');
    expect(renderedSpan).toHaveAttribute('data-is-active', 'true');
    expect(renderedSpan).toHaveAttribute('data-index', '0');
  });

  // 4. activeValue Changes
  it('updates the active tab when activeValue prop changes', () => {
    let active = '1';
    const items = [
      { label: 'One', value: '1' },
      { label: 'Two', value: '2' },
    ];
    const { rerender } = render(
      <AnimatedPillTabs items={items} activeValue={active} renderItem={mockRenderItem} />
    );

    expect(screen.getByTestId('tab-item-1')).toHaveAttribute('data-is-active', 'true');
    expect(screen.getByTestId('tab-item-2')).toHaveAttribute('data-is-active', 'false');

    active = '2';
    rerender(<AnimatedPillTabs items={items} activeValue={active} renderItem={mockRenderItem} />);

    expect(screen.getByTestId('tab-item-1')).toHaveAttribute('data-is-active', 'false');
    expect(screen.getByTestId('tab-item-2')).toHaveAttribute('data-is-active', 'true');
  });

  // 5. Empty items Array
  it('renders only the container div without tab items when items array is empty', () => {
    render(<AnimatedPillTabs items={[]} activeValue="" renderItem={mockRenderItem} />);
    expect(screen.queryByTestId(/tab-item/)).not.toBeInTheDocument();
  });

  // 6. activeValue Not Found
  it('ensures isActive is false for all items when activeValue is not found', () => {
    const items = [{ label: 'Existing', value: 'exist' }];
    render(
      <AnimatedPillTabs items={items} activeValue="nonexistent" renderItem={mockRenderItem} />
    );
    expect(screen.getByTestId('tab-item-exist')).toHaveAttribute('data-is-active', 'false');
  });

  // 7. Pill Position via mock
  it('verifies that the pill receives correct position styles from useAnimatedPillPosition hook', () => {
    const mockPosition = { left: 10, width: 50, height: 30 };
    mockUseAnimatedPillPosition.mockReturnValue({
      position: mockPosition,
      isAnimating: false,
    });

    const items = [{ label: 'Tab 1', value: 'tab1' }];
    const { container } = render(
      <AnimatedPillTabs items={items} activeValue="tab1" renderItem={mockRenderItem} />
    );
    // The pill is the first div inside the container (absolute positioned)
    const pill = container.querySelector('.absolute.rounded-full.bg-primary');
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveStyle(`left: ${mockPosition.left}px`);
    expect(pill).toHaveStyle(`width: ${mockPosition.width}px`);
    expect(pill).toHaveStyle(`height: ${mockPosition.height}px`);
  });

  // 8. Pill Animation on activeValue Change (via mock)
  it('applies transition classes when isAnimating is true', () => {
    mockUseAnimatedPillPosition.mockReturnValue({
      position: { left: 0, width: 0, height: 0 },
      isAnimating: true,
    });

    const items = [{ label: 'Tab 1', value: 'tab1' }];
    const { container } = render(
      <AnimatedPillTabs items={items} activeValue="tab1" renderItem={mockRenderItem} />
    );
    const pill = container.querySelector('.absolute.rounded-full.bg-primary');
    expect(pill).toHaveClass('transition-all');
    expect(pill).toHaveClass('duration-300');
    expect(pill).toHaveClass('ease-out');
  });

  // 9. Hook is called
  it('calls useAnimatedPillPosition during render', () => {
    const items = [{ label: 'Tab 1', value: 'tab1' }];
    render(<AnimatedPillTabs items={items} activeValue="tab1" renderItem={mockRenderItem} />);
    expect(mockUseAnimatedPillPosition).toHaveBeenCalled();
  });
});
