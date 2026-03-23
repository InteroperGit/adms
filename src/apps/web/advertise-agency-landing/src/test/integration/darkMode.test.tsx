import { useState, useEffect } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { ThemeContext } from '@/contexts/ThemeContext';
import { DarkModeToggle } from '@/components/sections/header/DarkModeToggle';
import { useTheme } from '@/hooks/useTheme';

// ---------------------------------------------------------------------------
// ThemeProvider — mirrors root.tsx Layout's theme state management.
// Writes to document.documentElement.classList so tests can assert on it,
// mirroring <html className={isDark ? 'dark' : ''}> in the real Layout.
// ---------------------------------------------------------------------------
function ThemeProvider({
  children,
  initialDark = false,
}: {
  children: React.ReactNode;
  initialDark?: boolean;
}) {
  const [isDark, setIsDark] = useState(initialDark);
  const toggle = () => setIsDark((prev) => !prev);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [isDark]);

  return <ThemeContext.Provider value={{ isDark, toggle }}>{children}</ThemeContext.Provider>;
}

// ---------------------------------------------------------------------------
// ThemeConsumer — reads ThemeContext via useTheme() and renders DarkModeToggle.
// This verifies the full chain: Provider → context → hook → component props.
// ---------------------------------------------------------------------------
function ThemeConsumer() {
  const { isDark, toggle } = useTheme();
  return <DarkModeToggle isDark={isDark} onToggle={toggle} />;
}

// ---------------------------------------------------------------------------
// Cleanup: ensure <html> dark class is absent between tests
// ---------------------------------------------------------------------------
afterEach(() => {
  document.documentElement.classList.remove('dark');
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ThemeContext dark-mode integration', () => {
  it('initial state is light: <html> does not have class "dark"', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggle to dark: adds class "dark" to <html>', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggle back to light: removes class "dark" from <html>', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    const btn = screen.getByRole('button');
    fireEvent.click(btn); // → dark
    fireEvent.click(btn); // → light again
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('DarkModeToggle aria-label reflects current theme state', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    const btn = screen.getByRole('button');
    // Light mode: label invites user to switch to dark
    expect(btn).toHaveAttribute('aria-label', 'Тёмный режим');
    fireEvent.click(btn);
    // Dark mode: label invites user to switch to light
    expect(btn).toHaveAttribute('aria-label', 'Светлый режим');
  });
});
