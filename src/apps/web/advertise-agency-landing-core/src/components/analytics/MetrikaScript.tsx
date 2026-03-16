import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { useCookieConsent, ConsentState } from '@/hooks/useCookieConsent';
import { siteData } from '@/types/config/siteData';

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

const SCRIPT_ID = 'yandex-metrika-script';

function injectMetrika(id: string) {
  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.type = 'text/javascript';
  script.innerHTML = `
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
    ym(${Number(id)},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
  `;
  document.head.appendChild(script);
}

function removeMetrika() {
  document.getElementById(SCRIPT_ID)?.remove();
  delete window.ym;
}

/**
 * @component
 * @description Yandex Metrika analytics script injection with cookie consent management and page tracking
 * @returns {JSX.Element|null} Noscript fallback image or null if no Metrika ID configured
 * @example
 * <MetrikaScript />
 */
export function MetrikaScript() {
  const metrikaId = siteData.yandexMetrikaId;
  const consent = useCookieConsent();
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!metrikaId) {
      return;
    }

    if (consent === ConsentState.ALL) {
      injectMetrika(metrikaId);
    } else if (consent !== null) {
      removeMetrika();
    }
  }, [consent, metrikaId]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!metrikaId || !window.ym) {
      return;
    }

    window.ym(Number(metrikaId), 'hit', location.pathname + location.search);
  }, [location.pathname, location.search, metrikaId]);

  if (!metrikaId) {
    return null;
  }

  return (
    <noscript>
      <div>
        <img
          src={`https://mc.yandex.ru/watch/${metrikaId}`}
          style={{ position: 'absolute', left: '-9999px' }}
          alt=""
          aria-hidden="true"
        />
      </div>
    </noscript>
  );
}
