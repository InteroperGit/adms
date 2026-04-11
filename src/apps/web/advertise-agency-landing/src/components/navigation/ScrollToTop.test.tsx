import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScrollToTop } from './ScrollToTop';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('ScrollToTop', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is hidden when scrollY is below threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    render(<ScrollToTop threshold={300} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('is visible when scrollY exceeds threshold on mount', () => {
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    render(<ScrollToTop threshold={300} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('becomes visible after scroll event exceeds threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    render(<ScrollToTop threshold={300} />);
    expect(screen.queryByRole('button')).toBeNull();

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('hides again when scrolled back below threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    render(<ScrollToTop threshold={300} />);
    expect(screen.getByRole('button')).toBeInTheDocument();

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('clicking button calls window.scrollTo when no nav element found', async () => {
    const user = userEvent.setup();
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    render(<ScrollToTop threshold={300} navSelector="#nonexistent-nav" />);
    await user.click(screen.getByRole('button'));
    // matchMedia mock returns matches: false → reducedMotion is false → behavior is 'smooth'
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('clicking button calls scrollIntoView when nav element is found', async () => {
    const user = userEvent.setup();
    const mockScrollIntoView = vi.fn();
    const navEl = document.createElement('nav');
    navEl.scrollIntoView = mockScrollIntoView;
    document.body.appendChild(navEl);

    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    render(<ScrollToTop threshold={300} navSelector="nav" />);
    await user.click(screen.getByRole('button'));

    // matchMedia mock returns matches: false → reducedMotion is false → behavior is 'smooth'
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });

    document.body.removeChild(navEl);
  });
});
