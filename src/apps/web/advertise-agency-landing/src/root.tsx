import { useState, useEffect } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { theme } from '@/types/config/theme';
import { ThemeContext } from '@/contexts/ThemeContext';
import './index.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — virtual module declared by themePlugin
import 'virtual:theme-vars.css';

// Runs synchronously before React hydration to apply saved dark-mode preference
// without a flash of the wrong colour scheme.
const ANTI_FOUC_SCRIPT = `(function(){try{var m=localStorage.getItem('theme-mode');if(m==='dark'||(m===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`;

export function Layout({ children }: { children: React.ReactNode }) {
  const themeColor = theme.colors.primary ? `hsl(${theme.colors.primary})` : '';

  // Dark mode state lives here — in root.tsx's Layout, which React Router v7 guarantees
  // never remounts during navigation. Driving className declaratively on <html> means React
  // owns the attribute, so it can never be lost mid-navigation regardless of what happens
  // in the Outlet subtree. The anti-FOUC script above handles the pre-hydration flash.
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
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return (
    <html lang="ru" className={isDark ? 'dark' : ''} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content={themeColor} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Anti-FOUC: must execute before any paint to prevent dark-mode flash */}
        <script dangerouslySetInnerHTML={{ __html: ANTI_FOUC_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {theme.fontUrls.map((url) => (
          <link key={url} rel="stylesheet" href={url} />
        ))}
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeContext.Provider value={{ isDark, toggle }}>{children}</ThemeContext.Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
