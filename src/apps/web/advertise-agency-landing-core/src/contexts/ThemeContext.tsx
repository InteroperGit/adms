import { createContext, useState, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components -- context + provider are intentionally co-located
export const ThemeContext = createContext({ isDark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }
        const stored = localStorage.getItem('theme-mode');
        if (stored) {
            return stored === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark(p => !p) }}>
            {children}
        </ThemeContext.Provider>
    );
}

