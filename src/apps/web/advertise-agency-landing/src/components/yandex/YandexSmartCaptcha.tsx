import { useEffect, useRef } from 'react';

type YandexSmartCaptchaProps = {
  siteKey: string;
  onTokenChange?: (token: string) => void;
  onTokenExpired?: () => void;
  test?: boolean;
  lang?: 'ru' | 'en' | 'be' | 'kk' | 'tt' | 'uk' | 'uz' | 'tr';
  invisible?: boolean;
};

declare global {
  interface Window {
    smartCaptcha?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          callback?: (token: string) => void;
          expiredCallback?: () => void;
          hl?: string;
          test?: boolean;
          invisible?: boolean;
        }
      ) => number;
      reset: (widgetId?: number) => void;
      destroy: (widgetId?: number) => void;
    };
  }
}

/**
 * React wrapper for the Yandex SmartCaptcha widget.
 *
 * Renders the SmartCaptcha widget inside the component and notifies the parent
 * when the user successfully passes verification.
 *
 * The component is designed to work with the official Yandex SmartCaptcha API
 * and to be safe in React development mode, including Strict Mode double-mount
 * behavior.
 *
 * @remarks
 * - The captcha token should be sent to the backend for server-side validation.
 * - The token is short-lived and should not be treated as a permanent proof.
 * - If `siteKey` is missing, the widget is not rendered.
 *
 * @example
 * <YandexSmartCaptcha
 *   siteKey={import.meta.env.VITE_SMARTCAPTCHA_SITEKEY}
 *   onTokenChange={(token) => setCaptchaToken(token)}
 * />
 *
 * @param props - Component props.
 * @param props.siteKey - Client-side SmartCaptcha key required to initialize the widget.
 * @param props.onTokenChange - Called when verification succeeds and a token is received.
 * @param props.test - Enables SmartCaptcha test mode. Defaults to `false`.
 * @param props.lang - Widget language code. Defaults to `'ru'`.
 * @param props.invisible - Enables invisible captcha mode. Defaults to `false`.
 *
 * @returns A React element that mounts the SmartCaptcha widget.
 *
 * @see https://yandex.cloud/en/docs/smartcaptcha/concepts/react
 * @see https://yandex.cloud/en/docs/smartcaptcha/concepts/widget-methods
 */
export function YandexSmartCaptcha({
  siteKey,
  onTokenChange,
  onTokenExpired,
  test = false,
  lang = 'ru',
  invisible = false,
}: YandexSmartCaptchaProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const destroyedRef = useRef(false);

  useEffect(() => {
    if (!siteKey || !containerRef.current) {
      return;
    }

    if (!window.smartCaptcha) {
      return;
    }

    if (widgetIdRef.current !== null) {
      return;
    }

    destroyedRef.current = false;

    widgetIdRef.current = window.smartCaptcha.render(containerRef.current, {
      sitekey: siteKey,
      hl: lang,
      test,
      invisible,
      callback: (token: string) => {
        onTokenChange?.(token);
      },
      expiredCallback: () => {
        onTokenExpired?.();
      },
    });

    return () => {
      if (destroyedRef.current) {
        return;
      }

      destroyedRef.current = true;

      if (widgetIdRef.current !== null && window.smartCaptcha) {
        try {
          window.smartCaptcha.destroy(widgetIdRef.current);
        } catch {
          // ignore cleanup errors
        }
      }

      widgetIdRef.current = null;
    };
  }, [siteKey, lang, test, invisible, onTokenChange, onTokenExpired]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current !== null && window.smartCaptcha) {
        try {
          window.smartCaptcha.destroy(widgetIdRef.current);
        } catch {
          // ignore cleanup errors
        }
      }
      widgetIdRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="smart-captcha" />;
}
