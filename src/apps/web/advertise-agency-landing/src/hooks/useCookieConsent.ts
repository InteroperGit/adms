// src/hooks/useCookieConsent.ts
import { useEffect, useState } from 'react';

export const ConsentState = {
  ALL: 'all',
  NECESSARY: 'necessary',
} as const;

export type ConsentValue = (typeof ConsentState)[keyof typeof ConsentState] | null;

export const STORAGE_KEY = 'cookie_consent';
export const CONSENT_EVENT = 'cookie_consent_change';

/**
 * @description Retrieves the current cookie consent preference from localStorage, listening
 * for updates triggered by the CookieBanner component. Returns the consent state without
 * requiring a page reload. Consent values are 'all' (accept all cookies), 'necessary' (required
 * cookies only), or null (no preference set).
 *
 * @returns {ConsentValue} Current consent preference: 'all', 'necessary', or null
 *
 * @example
 * function Analytics() {
 *   const consent = useCookieConsent();
 *
 *   useEffect(() => {
 *     if (consent === 'all') {
 *       initializeTrackingPixel();
 *     }
 *   }, [consent]);
 *
 *   return <div>{consent ? `Consent: ${consent}` : 'No preference set'}</div>;
 * }
 */
export function useCookieConsent(): ConsentValue {
  const [consent, setConsent] = useState<ConsentValue>(() =>
    typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) as ConsentValue) : null
  );

  useEffect(() => {
    // Слушаем событие из CookieBanner — обновляем без перезагрузки
    function onConsentChange(e: Event) {
      const value = (e as CustomEvent<ConsentValue>).detail;
      setConsent(value);
    }

    window.addEventListener(CONSENT_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_EVENT, onConsentChange);
  }, []);

  return consent;
}
