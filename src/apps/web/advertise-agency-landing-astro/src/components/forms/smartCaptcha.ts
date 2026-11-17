// Load Yandex SmartCaptcha once and bind a token to one inquiry form.

interface SmartCaptchaApi {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      hl: "ru";
      callback: (token: string) => void;
    },
  ): string | number;
  reset(widgetId: string | number): void;
  subscribe(
    widgetId: string | number,
    event: string,
    callback: () => void,
  ): () => void;
}

declare global {
  interface Window {
    smartCaptcha?: SmartCaptchaApi;
  }
}

export interface SmartCaptchaControls {
  getToken(): string;
  reset(): void;
}

let apiPromise: Promise<SmartCaptchaApi> | undefined;
let loadSequence = 0;

function loadApi(): Promise<SmartCaptchaApi> {
  if (window.smartCaptcha) return Promise.resolve(window.smartCaptcha);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    loadSequence += 1;
    const callbackName = "onSmartCaptchaReady" + loadSequence;
    const host = window as unknown as Record<string, unknown>;
    const script = document.createElement("script");
    let settled = false;

    const finish = (api?: SmartCaptchaApi) => {
      if (settled) return;
      settled = true;
      delete host[callbackName];
      if (api) resolve(api);
      else {
        apiPromise = undefined;
        reject(new Error("Yandex SmartCaptcha did not initialize"));
      }
    };

    host[callbackName] = () => finish(window.smartCaptcha);
    script.src =
      "https://smartcaptcha.cloud.yandex.ru/captcha.js" +
      "?render=onload&onload=" +
      callbackName;
    script.async = true;
    script.defer = true;
    script.onerror = () => finish();
    document.head.append(script);
  });

  return apiPromise;
}

export async function initializeSmartCaptcha(
  container: HTMLElement,
  siteKey: string,
  onTokenExpired: () => void,
  onFailure: () => void,
): Promise<SmartCaptchaControls> {
  const api = await loadApi();
  const token = document.createElement("input");
  token.type = "hidden";
  token.name = "captchaToken";
  container.closest("form")?.append(token);

  const widgetId = api.render(container, {
    sitekey: siteKey,
    hl: "ru",
    callback: (value) => {
      token.value = value;
      token.dispatchEvent(new Event("captcha-token", { bubbles: true }));
    },
  });

  api.subscribe(widgetId, "token-expired", () => {
    token.value = "";
    onTokenExpired();
  });
  api.subscribe(widgetId, "network-error", onFailure);
  api.subscribe(widgetId, "javascript-error", onFailure);

  return {
    getToken: () => token.value,
    reset: () => {
      token.value = "";
      api.reset(widgetId);
    },
  };
}
