import { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cookiesContent } from '@/types/cookies';
import { CookieActions } from './CookieActions';

const STORAGE_KEY = 'cookie_consent';

type ConsentValue = 'all' | 'necessary';

export function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY));

  function save(value: ConsentValue) {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={cookiesContent.ariaLabel}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white px-4 py-5 shadow-lg sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm sm:rounded-2xl sm:border"
    >
      {/* Закрыть — только necessary */}
      <button
        onClick={() => save('necessary')}
        aria-label={cookiesContent.closeLabel}
        className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X size={16} />
      </button>

      {/* Текст */}
      <p className="mb-1 text-sm font-semibold text-foreground">{cookiesContent.title}</p>
      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
        {cookiesContent.text}{' '}
        <Link
          to={cookiesContent.privacyLink.href}
          className="underline underline-offset-2 transition-colors hover:text-foreground"
        >
          {cookiesContent.privacyLink.label}
        </Link>
        .
      </p>

      <CookieActions onAcceptAll={() => save('all')} onNecessaryOnly={() => save('necessary')} />
    </div>
  );
}
