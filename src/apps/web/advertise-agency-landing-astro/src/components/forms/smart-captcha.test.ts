// The widget adapter binds one-time Yandex tokens to a single form.
import { afterEach, expect, it, vi } from 'vitest';
import { initializeSmartCaptcha } from './smart-captcha';

afterEach(() => {
  delete window.smartCaptcha;
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

it('renders a Russian widget and supplies its token to the form', async () => {
  document.body.innerHTML = '<form><div data-smartcaptcha></div></form>';
  const container = document.querySelector<HTMLElement>('[data-smartcaptcha]')!;
  let onToken: ((token: string) => void) | undefined;
  const api = {
    render: vi.fn((_container, options) => {
      onToken = options.callback;
      return 'widget-1';
    }),
    reset: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  };
  window.smartCaptcha = api;

  const controls = await initializeSmartCaptcha(
    container,
    'public-test-key',
    vi.fn(),
    vi.fn(),
  );

  expect(api.render).toHaveBeenCalledWith(container, {
    sitekey: 'public-test-key',
    hl: 'ru',
    callback: expect.any(Function),
  });
  onToken?.('synthetic-token');
  expect(
    document.querySelector<HTMLInputElement>('form input[name="captchaToken"]')
      ?.value,
  ).toBe('synthetic-token');
  expect(controls.getToken()).toBe('synthetic-token');
});

it('clears expired tokens, reports failure and resets the widget', async () => {
  document.body.innerHTML = '<form><div data-smartcaptcha></div></form>';
  const container = document.querySelector<HTMLElement>('[data-smartcaptcha]')!;
  const subscriptions = new Map<string, () => void>();
  const expired = vi.fn();
  const failure = vi.fn();
  const api = {
    render: vi.fn(() => 'widget-2'),
    reset: vi.fn(),
    subscribe: vi.fn((_id, event, callback) => {
      subscriptions.set(event, callback);
      return vi.fn();
    }),
  };
  window.smartCaptcha = api;

  const controls = await initializeSmartCaptcha(
    container,
    'public-test-key',
    expired,
    failure,
  );
  const token = document.querySelector<HTMLInputElement>(
    'input[name="captchaToken"]',
  )!;
  token.value = 'expired-token';
  subscriptions.get('token-expired')?.();
  expect(token.value).toBe('');
  expect(expired).toHaveBeenCalledOnce();
  subscriptions.get('network-error')?.();
  subscriptions.get('javascript-error')?.();
  expect(failure).toHaveBeenCalledTimes(2);

  token.value = 'another-token';
  controls.reset();
  expect(token.value).toBe('');
  expect(api.reset).toHaveBeenCalledWith('widget-2');
});
