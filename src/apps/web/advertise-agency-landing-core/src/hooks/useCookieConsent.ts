// src/hooks/useCookieConsent.ts
import { useEffect, useState } from 'react';

type ConsentValue = 'all' | 'necessary' | null;
const STORAGE_KEY = 'cookie_consent';
const CONSENT_EVENT = 'cookie_consent_change';

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
