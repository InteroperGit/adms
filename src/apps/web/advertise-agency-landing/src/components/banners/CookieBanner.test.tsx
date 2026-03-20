import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { STORAGE_KEY } from '@/hooks/useCookieConsent';
import { CookieBanner } from './CookieBanner';

// jsdom may not implement localStorage fully — provide a stub
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    Object.keys(store).forEach((k) => delete store[k]);
  }),
};
vi.stubGlobal('localStorage', localStorageMock);

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

function renderBanner() {
  return render(
    <MemoryRouter>
      <CookieBanner />
    </MemoryRouter>
  );
}

describe('CookieBanner', () => {
  it('renders banner when no consent is stored', () => {
    renderBanner();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders privacy policy link', () => {
    renderBanner();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('does not render when consent already given', () => {
    localStorage.setItem(STORAGE_KEY, 'all');
    renderBanner();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('hides banner after clicking accept button', () => {
    vi.useFakeTimers();
    renderBanner();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
