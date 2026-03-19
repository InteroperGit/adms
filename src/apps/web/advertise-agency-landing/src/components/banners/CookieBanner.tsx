import { useState, useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router';
import { cookiesContent } from '@/types/config/cookies';
import { ConsentState, STORAGE_KEY, CONSENT_EVENT } from '@/hooks/useCookieConsent';
import { CookieActions } from './CookieActions';
import { cn } from '@/libs/utils';

/**
 * @component
 * @description Cookie consent banner with privacy policy link and action buttons, hides after consent or dismissal
 * @returns {JSX.Element|null} Dialog element with banner or null if dismissed/consented
 * @example
 * <CookieBanner />
 */
export function CookieBanner() {
  // getServerSnapshot returns true (consent assumed) so SSG renders no banner in HTML.
  // On the client, getSnapshot reads actual localStorage — no hydration mismatch.
  const hasConsent = useSyncExternalStore(
    () => () => {},
    () => !!localStorage.getItem(STORAGE_KEY),
    () => true
  );
  const [dismissed, setDismissed] = useState(false);
  const [closing, setClosing] = useState(false);
  const visible = !hasConsent && !dismissed;

  function save(value: (typeof ConsentState)[keyof typeof ConsentState]) {
    setClosing(true);
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, value);
      window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
      setDismissed(true);
      clearTimeout(timeout);
    }, 200);
  }

  if (!visible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label={cookiesContent.ariaLabel}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-background px-4 py-5 shadow-lg',
        'border-t border-border',
        'sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm sm:rounded-2xl sm:border',
        closing
          ? 'animate-[slide-up_0.2s_ease-out_reverse]'
          : 'animate-[slide-up_0.4s_ease-out_1s_both]'
      )}
    >
      {/* Закрыть — только necessary */}
      <button
        onClick={() => save(ConsentState.NECESSARY)}
        aria-label={cookiesContent.closeLabel}
        className={cn(
          'absolute right-4 top-4 text-muted-foreground',
          'transition-colors hover:text-foreground'
        )}
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
