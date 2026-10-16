// Observable form behavior uses synthetic HTML and an intercepted endpoint.
import { afterEach, expect, it, vi } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/dom';
import { initializeInquiry } from './order-inquiry';
import fixtures from '../../../tests/fixtures/content/unit-contracts.json';

function setup(
  enabled = true,
  lettering = false,
  configure?: (form: HTMLFormElement) => void,
) {
  document.body.innerHTML = `
    <form data-enabled="${enabled}" data-endpoint="/fixture"
      data-timeout="1000">
      <fieldset disabled>
        <input id="name" name="name" required maxlength="5" value="Test">
        <span id="name-error" hidden></span>
        <input id="email" name="email" type="email" value="a@example.test">
        <span id="email-error" hidden></span>
        ${
          lettering
            ? `<select name="contactMethod">
          <option value="phone">Phone</option>
          <option value="email">Email</option>
        </select><span data-requirement="email"></span>`
            : ''
        }
        <input id="phone" name="phone" type="tel">
        <span id="phone-error" hidden></span>
        <input id="size" name="size" type="number" min="1">
        <span id="size-error" hidden></span>
        <textarea id="message" name="message" maxlength="20"></textarea>
        <span id="message-error" hidden></span>
        <input id="fileLink" name="fileLink" type="url">
        <span id="fileLink-error" hidden></span>
        <input id="consent" name="consent" type="checkbox" required checked>
        <span id="consent-error" hidden></span>
      </fieldset>
      <button type="submit">Send</button>
      <p role="status"></p>
    </form>`;
  const form = document.querySelector('form')!;
  form.dataset.feedback = JSON.stringify(fixtures['order-inquiry'].feedback);
  configure?.(form);
  initializeInquiry(form);
  return form;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  document.body.replaceChildren();
});

it.each([
  ['name', '', 'required'],
  ['name', 'Too long', 'tooLong'],
  ['email', 'invalid', 'email'],
  ['email', '', 'required'],
  ['phone', 'letters', null],
  ['phone', '123', null],
  ['size', '0', null],
  ['consent', '', 'required'],
  ['message', 'x'.repeat(21), 'tooLong'],
  ['fileLink', 'invalid', null],
])(
  'marks invalid %s, focuses it and clears corrected errors',
  (name, value, message) => {
    const form = setup();
    const input = form.elements.namedItem(name) as HTMLInputElement;
    // Email becomes required when the caller selects email contact.
    if (name === 'email') input.required = true;
    if (name === 'consent') input.checked = false;
    else input.value = value;
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    fireEvent.submit(form);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveFocus();
    const error = document.getElementById(`${name}-error`)!;
    expect(error.hidden).toBe(false);
    if (message) {
      const feedback = fixtures['order-inquiry'].feedback;
      expect(error.textContent).toBe(
        feedback[message as keyof typeof feedback],
      );
    }
    expect(fetch).not.toHaveBeenCalled();
    input.value =
      name === 'fileLink'
        ? 'https://example.test/file'
        : name === 'email'
          ? 'a@example.test'
          : name === 'phone'
            ? '1234567'
            : name === 'size'
              ? '1'
              : 'Test';
    input.checked = true;
    fireEvent.input(input);
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(error.hidden).toBe(true);
  },
);

it('disables unavailable delivery and tolerates incomplete markup', () => {
  expect(() => initializeInquiry(document.createElement('form'))).not.toThrow();
  const form = setup(false);
  fireEvent.submit(form);
  expect(form.querySelector('button')).toBeDisabled();
  expect(form.querySelector('[role="status"]')).toHaveTextContent(
    fixtures['order-inquiry'].feedback.unavailable,
  );
});

it(
  'updates conditional email validatio' + 'n and its label through reset',
  async () => {
    const form = setup(true, true);
    const method = form.elements.namedItem(
      'contactMethod',
    ) as HTMLSelectElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const label = form.querySelector('[data-requirement="email"]')!;
    expect(email.required).toBe(false);
    method.value = 'email';
    fireEvent.change(method);
    expect(email.required).toBe(true);
    expect(label.textContent).toBe(' *');
    email.value = '';
    fireEvent.submit(form);
    expect(email).toHaveAttribute('aria-invalid', 'true');
    form.reset();
    await Promise.resolve();
    expect(email.required).toBe(false);
    expect(label.textContent).toBe(' (необязательно)');
  },
);

it('prevents duplicate sends and resets after confirmed receipt', async () => {
  const form = setup();
  let resolve!: (value: unknown) => void;
  const fetch = vi.fn(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  vi.stubGlobal('fetch', fetch);
  fireEvent.submit(form);
  expect(form).toHaveAttribute('aria-busy', 'true');
  expect(form.querySelector('fieldset')).toBeDisabled();
  fireEvent.submit(form);
  expect(fetch).toHaveBeenCalledTimes(1);
  resolve({
    ok: true,
    json: async () => ({ accepted: true, receiptId: 'r1' }),
  });
  await waitFor(() => expect(form).not.toHaveAttribute('aria-busy'));
  expect(form.querySelector('[role="status"]')).toHaveTextContent(
    fixtures['order-inquiry'].feedback.success,
  );
  expect(form.querySelector('[role="status"]')).toHaveFocus();
  expect(form.querySelector('fieldset')).not.toBeDisabled();
});

it.each([
  null,
  {},
  true,
  'accepted',
  [],
  { accepted: false },
  { accepted: 'true', receiptId: 'r1' },
  { accepted: true },
  { accepted: true, receiptId: '' },
  { accepted: true, receiptId: ' \t ' },
  { accepted: true, receiptId: 1 },
])('retains input when acceptance is unconfirmed: %j', async (result) => {
  const form = setup();
  const message = form.elements.namedItem('message') as HTMLTextAreaElement;
  message.value = 'Keep my draft';
  const reset = vi.spyOn(form, 'reset');
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => result,
    }),
  );
  fireEvent.submit(form);
  await waitFor(() => expect(form).not.toHaveAttribute('aria-busy'));
  expect(reset).not.toHaveBeenCalled();
  expect(message.value).toBe('Keep my draft');
  expect(form.querySelector('[role="status"]')).toHaveTextContent(
    fixtures['order-inquiry'].feedback.failure,
  );
});

it.each(['fieldset', 'button', '[role="status"]'])(
  'leaves incomplete markup without %s unenhanced',
  (selector) => {
    const form = setup(true, false, (form) => {
      form.querySelector(selector)!.remove();
    });
    expect(form.noValidate).toBe(false);
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const event = new Event('submit', { cancelable: true });
    form.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  },
);

it('enhances controls and announces unavailable delivery with focus', () => {
  const fetch = vi.fn();
  vi.stubGlobal('fetch', fetch);
  const form = setup(false);
  const status = form.querySelector('[role="status"]')!;
  expect(form.noValidate).toBe(true);
  expect(form.querySelector('fieldset')).not.toBeDisabled();
  expect(status).toHaveAttribute('tabindex', '-1');
  expect(fireEvent.submit(form)).toBe(false);
  expect(status).toHaveTextContent(
    fixtures['order-inquiry'].feedback.unavailable,
  );
  expect(status).toHaveFocus();
  expect(fetch).not.toHaveBeenCalled();
});

it('marks all invalid fields and focuses the first one in DOM order', () => {
  const form = setup();
  const name = form.elements.namedItem('name') as HTMLInputElement;
  const consent = form.elements.namedItem('consent') as HTMLInputElement;
  name.value = '  ';
  consent.checked = false;
  fireEvent.submit(form);
  expect(name).toHaveFocus();
  expect(name).toHaveAttribute('aria-invalid', 'true');
  expect(consent).toHaveAttribute('aria-invalid', 'true');
  expect(form.querySelector('[role="status"]')).toHaveTextContent(
    fixtures['order-inquiry'].feedback.invalid,
  );
});

it(
  'handles validation without inline e' + 'rror or conditional label elements',
  () => {
    const form = setup(true, true, (form) => {
      form.querySelector('#name-error')!.remove();
      form.querySelector('[data-requirement="email"]')!.remove();
    });
    const name = form.elements.namedItem('name') as HTMLInputElement;
    name.value = '';
    fireEvent.submit(form);
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveFocus();
    const method = form.elements.namedItem(
      'contactMethod',
    ) as HTMLSelectElement;
    method.value = 'email';
    fireEvent.change(method);
    expect(form.elements.namedItem('email')).toBeRequired();
  },
);

it('submits exact FormData with context and safe fetch options', async () => {
  const form = setup(true, true, (form) => {
    const context = document.createElement('input');
    context.type = 'hidden';
    context.name = 'serviceId';
    context.value = 'svetovye-bukvy';
    form.querySelector('fieldset')!.append(context);
  });
  const requestId = '12345678-1234-4123-8123-123456789abc';
  vi.spyOn(crypto, 'randomUUID').mockReturnValue(requestId);
  const fetch = vi.fn().mockResolvedValue({ ok: false });
  vi.stubGlobal('fetch', fetch);
  (form.elements.namedItem('message') as HTMLTextAreaElement).value =
    'Keep my draft';
  const event = new Event('submit', { cancelable: true });
  form.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
  expect(fetch).toHaveBeenCalledWith('/fixture', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test',
      email: 'a@example.test',
      contactMethod: 'phone',
      phone: '',
      size: '',
      message: 'Keep my draft',
      fileLink: '',
      consent: 'on',
      serviceId: 'svetovye-bukvy',
      requestId,
    }),
    signal: expect.any(AbortSignal),
    credentials: 'omit',
    redirect: 'error',
  });
  expect(form).toHaveAttribute('aria-busy', 'true');
  expect(form.querySelector('button')).toBeDisabled();
  expect(form.querySelector('[role="status"]')).toHaveTextContent(
    fixtures['order-inquiry'].feedback.sending,
  );
  await waitFor(() => expect(form).not.toHaveAttribute('aria-busy'));
});

it.each(['http', 'network', 'json', 'abort', 'uuid'])(
  'restores state and preserves the draft after %s failure',
  async (kind) => {
    const form = setup();
    const message = form.elements.namedItem('message') as HTMLTextAreaElement;
    message.value = 'Keep my draft';
    const reset = vi.spyOn(form, 'reset');
    const fetch = vi.fn().mockImplementation(async () => {
      if (kind === 'network') throw new TypeError('Offline');
      if (kind === 'abort') throw new DOMException('Aborted', 'AbortError');
      return {
        ok: kind !== 'http',
        json: async () => {
          throw new SyntaxError('Invalid JSON');
        },
      };
    });
    vi.stubGlobal('fetch', fetch);
    if (kind === 'uuid') {
      vi.spyOn(crypto, 'randomUUID').mockImplementation(() => {
        throw new Error('UUID unavailable');
      });
    }
    fireEvent.submit(form);
    await waitFor(() => expect(form).not.toHaveAttribute('aria-busy'));
    expect(form.querySelector('fieldset')).not.toBeDisabled();
    expect(form.querySelector('button')).not.toBeDisabled();
    expect(message.value).toBe('Keep my draft');
    expect(reset).not.toHaveBeenCalled();
    const status = form.querySelector('[role="status"]')!;
    expect(status).toHaveTextContent(
      fixtures['order-inquiry'].feedback.failure,
    );
    expect(status).toHaveFocus();
  },
);

it(
  'resets only after confirmed receipt' + ' and renews IDs after success',
  async () => {
    const form = setup();
    const message = form.elements.namedItem('message') as HTMLTextAreaElement;
    message.value = 'Keep my draft';
    const reset = vi.spyOn(form, 'reset');
    const uuid = vi
      .spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('12345678-1234-4123-8123-123456789abc')
      .mockReturnValueOnce('22345678-1234-4123-8123-123456789abc');
    let accept!: (value: unknown) => void;
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        new Promise((resolve) => {
          accept = resolve;
        }),
    });
    vi.stubGlobal('fetch', fetch);
    fireEvent.submit(form);
    await waitFor(() => expect(accept).toEqual(expect.any(Function)));
    expect(reset).not.toHaveBeenCalled();
    expect(message.value).toBe('Keep my draft');
    fireEvent.submit(form);
    expect(fetch).toHaveBeenCalledOnce();
    accept({ accepted: true, receiptId: 'receipt-1' });
    await waitFor(() => expect(form).not.toHaveAttribute('aria-busy'));
    expect(reset).toHaveBeenCalledOnce();
    expect(message.value).toBe('');
    const status = form.querySelector('[role="status"]')!;
    expect(status).toHaveTextContent(
      fixtures['order-inquiry'].feedback.success,
    );
    expect(status).toHaveFocus();
    message.value = 'Keep my draft';
    fetch.mockResolvedValueOnce({ ok: false });
    fireEvent.submit(form);
    await waitFor(() => expect(form).not.toHaveAttribute('aria-busy'));
    expect(uuid).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetch.mock.calls[0][1].body).requestId).not.toBe(
      JSON.parse(fetch.mock.calls[1][1].body).requestId,
    );
  },
);

it(
  'aborts at the configured timeout an' + 'd clears the timeout after failure',
  async () => {
    vi.useFakeTimers();
    const abort = vi.spyOn(AbortController.prototype, 'abort');
    const form = setup();
    const message = form.elements.namedItem('message') as HTMLTextAreaElement;
    message.value = 'Keep my draft';
    const timeout = vi.spyOn(window, 'setTimeout');
    const clearTimeout = vi.spyOn(window, 'clearTimeout');
    let signal!: AbortSignal;
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url, options) =>
          new Promise((_, reject) => {
            signal = options.signal;
            signal.addEventListener('abort', () => {
              reject(new DOMException('Aborted', 'AbortError'));
            });
          }),
      ),
    );
    fireEvent.submit(form);
    await vi.advanceTimersByTimeAsync(999);
    expect(signal.aborted).toBe(false);
    expect(form).toHaveAttribute('aria-busy', 'true');
    await vi.advanceTimersByTimeAsync(1);
    expect(abort).toHaveBeenCalledOnce();
    expect(signal.aborted).toBe(true);
    expect(form).not.toHaveAttribute('aria-busy');
    expect(form.querySelector('fieldset')).not.toBeDisabled();
    expect(form.querySelector('button')).not.toBeDisabled();
    expect(message.value).toBe('Keep my draft');
    expect(form.querySelector('[role="status"]')).toHaveFocus();
    expect(clearTimeout).toHaveBeenCalledWith(timeout.mock.results[0].value);
  },
);

it.each([true, false])(
  'clears the abort timer after settled HTTP ok=%s',
  async (ok) => {
    vi.useFakeTimers();
    const abort = vi.spyOn(AbortController.prototype, 'abort');
    const form = setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok,
        json: async () => ({
          accepted: true,
          receiptId: 'receipt-1',
        }),
      }),
    );
    fireEvent.submit(form);
    await vi.advanceTimersByTimeAsync(0);
    expect(form).not.toHaveAttribute('aria-busy');
    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(1000);
    expect(abort).not.toHaveBeenCalled();
  },
);

it('reuses request IDs for retries and replaces them after edits', async () => {
  const form = setup();
  const fetch = vi
    .fn()
    .mockRejectedValueOnce(new Error('Offline'))
    .mockResolvedValue({ ok: false });
  vi.stubGlobal('fetch', fetch);
  const send = async () => {
    fireEvent.submit(form);
    await waitFor(() => expect(form).not.toHaveAttribute('aria-busy'));
  };
  await send();
  await send();
  const payload = (index: number) =>
    JSON.parse(fetch.mock.calls[index][1].body);
  expect(payload(0).requestId).toBe(payload(1).requestId);
  (form.elements.namedItem('name') as HTMLInputElement).value = 'Edit';
  await send();
  expect(payload(2).requestId).not.toBe(payload(1).requestId);
});

it('aborts timed out submissions and restores controls', async () => {
  vi.useFakeTimers();
  const form = setup();
  vi.stubGlobal(
    'fetch',
    vi.fn(
      (_url, options) =>
        new Promise((_, reject) => {
          options.signal.addEventListener('abort', () =>
            reject(new Error('Timeout')),
          );
        }),
    ),
  );
  fireEvent.submit(form);
  await vi.advanceTimersByTimeAsync(1000);
  expect(form).not.toHaveAttribute('aria-busy');
  expect(form.querySelector('button')).not.toBeDisabled();
  expect(form.querySelector('[role="status"]')).toHaveTextContent(
    fixtures['order-inquiry'].feedback.failure,
  );
});
