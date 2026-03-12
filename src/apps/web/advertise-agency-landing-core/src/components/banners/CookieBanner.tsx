import { useState, useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cookiesContent } from '@/types/config/cookies';
import { ConsentState } from '@/hooks/useCookieConsent';
import { CookieActions } from './CookieActions';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'cookie_consent';

export function CookieBanner() {
  // getServerSnapshot returns true (consent assumed) so SSG renders no banner in HTML.
  // On the client, getSnapshot reads actual localStorage — no hydration mismatch.
  const hasConsent = useSyncExternalStore(
    () => () => {},
    () => !!localStorage.getItem(STORAGE_KEY),
    () => true
  );
  const [dismissed, setDismissed] = useState(false);
  const visible = !hasConsent && !dismissed;

  function save(value: (typeof ConsentState)[keyof typeof ConsentState]) {
    localStorage.setItem(STORAGE_KEY, value);
    setDismissed(true);
  }

  if (!visible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label={cookiesContent.ariaLabel}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-white px-4 py-5 shadow-lg',
        'border-t border-border',
        'sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm sm:rounded-2xl sm:border'
      )}
    >
      {/* Закрыть — только necessary */}
      <button
        onClick={() => save(ConsentState.NECESSARY)}
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

      <CookieActions
        onAcceptAll={() => save(ConsentState.ALL)}
        onNecessaryOnly={() => save(ConsentState.NECESSARY)}
      />
    </div>
  );
}
