import { render } from '@testing-library/react';
import { HomeHashScroll } from './HomeHashScroll';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router';

describe('HomeHashScroll', () => {
  let mockScrollIntoView: ReturnType<typeof vi.fn>;
  let targetEl: HTMLElement;

  beforeEach(() => {
    mockScrollIntoView = vi.fn();
    targetEl = document.createElement('div');
    targetEl.id = 'services';
    targetEl.scrollIntoView = mockScrollIntoView;
    document.body.appendChild(targetEl);
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.removeChild(targetEl);
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders null (no DOM output)', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <HomeHashScroll />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('calls scrollIntoView when hash matches an element on home page', () => {
    render(
      <MemoryRouter initialEntries={['/#services']}>
        <HomeHashScroll />
      </MemoryRouter>
    );
    vi.runAllTimers();
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('does not call scrollIntoView when pathname is not "/"', () => {
    render(
      <MemoryRouter initialEntries={['/portfolio#services']}>
        <HomeHashScroll />
      </MemoryRouter>
    );
    vi.runAllTimers();
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it('does not call scrollIntoView when hash is absent', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HomeHashScroll />
      </MemoryRouter>
    );
    vi.runAllTimers();
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it('does not call scrollIntoView when hash target element does not exist', () => {
    render(
      <MemoryRouter initialEntries={['/#nonexistent']}>
        <HomeHashScroll />
      </MemoryRouter>
    );
    vi.runAllTimers();
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });
});
