import { render, screen, cleanup } from '@testing-library/react';
import { ScrollProgress } from './ScrollProgress';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock browser APIs
const mockViewportHeight = 1000;
const mockScrollHeight = 3000; // Default to a long page (3x viewport)

const mockWindow = {
  scrollY: 0,
  innerHeight: mockViewportHeight,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

const mockDocument = {
  documentElement: {
    scrollHeight: mockScrollHeight,
  },
};

const mockMatchMedia = vi.fn().mockImplementation((query) => ({
  matches: false, // Default to no-reduced-motion
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Helper to set up the mock window and document properties
const setupMocks = (
  scrollY = 0,
  innerHeight = mockViewportHeight,
  scrollHeight = mockScrollHeight,
  reducedMotion = false
) => {
  mockWindow.scrollY = scrollY;
  mockWindow.innerHeight = innerHeight;
  mockDocument.documentElement.scrollHeight = scrollHeight;
  mockMatchMedia.mockImplementation((query) => ({
    matches: reducedMotion,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  Object.defineProperty(window, 'scrollY', { value: scrollY, writable: true });
  Object.defineProperty(window, 'innerHeight', { value: innerHeight, writable: true });
  Object.defineProperty(document, 'documentElement', {
    value: mockDocument.documentElement,
    writable: true,
  });
  Object.defineProperty(window, 'matchMedia', { value: mockMatchMedia, writable: true });
};

// Helper to dispatch scroll event
const dispatchScroll = (scrollY: number) => {
  mockWindow.scrollY = scrollY;
  window.dispatchEvent(new Event('scroll'));
};

// Helper to dispatch resize event
const dispatchResize = (innerHeight: number, scrollHeight: number) => {
  mockWindow.innerHeight = innerHeight;
  mockDocument.documentElement.scrollHeight = scrollHeight;
  window.dispatchEvent(new Event('resize'));
};

describe('ScrollProgress', () => {
  beforeEach(() => {
    cleanup(); // Clean up DOM between tests
    setupMocks(); // Reset mocks for each test
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 1. Does not render on short pages
  it('does not render the progress bar on pages shorter than 2x viewport height', () => {
    setupMocks(0, 1000, 1999); // scrollHeight < 2 * innerHeight
    render(<ScrollProgress />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  // 2. Renders on long pages
  it('renders the progress bar on pages longer than 2x viewport height', () => {
    setupMocks(0, 1000, 2001); // scrollHeight > 2 * innerHeight
    render(<ScrollProgress />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  // 3. Initial state (top of page)
  it('shows 0% progress at the very top of a long page', () => {
    setupMocks(0, 1000, 2500);
    render(<ScrollProgress />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 0%');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  // 4. Full state (bottom of page)
  it('shows 100% progress at the very bottom of a long page', () => {
    // Max scrollable height = scrollHeight - innerHeight
    const maxScroll = mockScrollHeight - mockViewportHeight;
    setupMocks(maxScroll, mockViewportHeight, mockScrollHeight);
    render(<ScrollProgress />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 100%');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });

  // 5. Intermediate scroll position
  it('shows correct percentage progress at an intermediate scroll position', () => {
    const scrollableHeight = mockScrollHeight - mockViewportHeight; // 3000 - 1000 = 2000
    const scrollY = scrollableHeight / 2; // 1000 (50% scrolled)
    setupMocks(scrollY, mockViewportHeight, mockScrollHeight);
    render(<ScrollProgress />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 50%');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });

  // 6. Responds to window resize (page length changes from short to long)
  it('appears when window is resized to make the page long enough', () => {
    setupMocks(0, 1000, 1500); // Initially short
    const { rerender } = render(<ScrollProgress />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    // Simulate resize making page long
    setupMocks(0, 500, 1500); // Now 1500 > 2 * 500
    rerender(<ScrollProgress />); // Trigger re-render to update component logic
    dispatchResize(500, 1500); // Dispatch event to ensure effects run
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  // 7. Responds to window resize (page length changes from long to short)
  it('disappears when window is resized to make the page too short', () => {
    setupMocks(0, 1000, 2500); // Initially long
    const { rerender } = render(<ScrollProgress />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Simulate resize making page short
    setupMocks(0, 1500, 2500); // Now 2500 < 2 * 1500
    rerender(<ScrollProgress />);
    dispatchResize(1500, 2500);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  // Test scroll event
  it('updates progress on scroll event', () => {
    setupMocks(0, 1000, 2500);
    render(<ScrollProgress />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 0%');

    const scrollableHeight = 2500 - 1000;
    const scrollY = scrollableHeight * 0.75; // 75% scroll
    dispatchScroll(scrollY);
    expect(progressBar).toHaveStyle('width: 75%');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });

  // 8. ARIA attributes
  it('applies correct ARIA attributes to the progress bar', () => {
    setupMocks(0, 1000, 2500);
    render(<ScrollProgress />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(progressBar).toHaveAttribute('aria-label', 'Page scroll progress');
  });

  // 9. Gradient applied
  it('applies gradient styling classes', () => {
    setupMocks(0, 1000, 2500);
    render(<ScrollProgress />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('bg-gradient-to-r');
    expect(progressBar).toHaveClass('from-primary');
    expect(progressBar).toHaveClass('to-accent');
  });

  // 10. Transition for width
  it('applies width transition classes by default', () => {
    setupMocks(0, 1000, 2500);
    render(<ScrollProgress />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('transition-[width]');
    expect(progressBar).toHaveClass('duration-150');
  });

  // 11. Prefers-reduced-motion
  it('does not apply transition classes when prefers-reduced-motion is enabled', () => {
    setupMocks(0, 1000, 2500, true); // reducedMotion = true
    render(<ScrollProgress />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).not.toHaveClass('transition-[width]');
    expect(progressBar).not.toHaveClass('duration-150');
  });

  // 12. Edge Case: page with total scrollable height of 0
  it('calculates 0% progress if scrollable height is 0 or less', () => {
    setupMocks(0, 1000, 1000); // scrollHeight - innerHeight = 0
    render(<ScrollProgress />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle('width: 0%');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });
});
