// Observable form behavior uses synthetic HTML and an intercepted endpoint.
import { afterEach, expect, it, vi } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/dom';
import { initializeInquiry } from '../../src/components/forms/order-inquiry';
import fixtures from '../fixtures/content/unit-contracts.json';

function setup(enabled = true, lettering = false) {
  document.body.innerHTML = `
    <form data-enabled="${enabled}" data-endpoint="/fixture"
      data-timeout="1000">
      <fieldset disabled>
        <input id="name" name="name" required maxlength="5" value="Test">
        <span id="name-error" hidden></span>
        <input id="email" name="email" type="email" value="a@example.test">
        <span id="email-error" hidden></span>
        ${lettering ? `<select name="contactMethod">
          <option value="phone">Phone</option>
          <option value="email">Email</option>
        </select><span data-requirement="email"></span>` : ''}
        <input id="phone" name="phone" type="tel">
        <span id="phone-error" hidden></span>
        <input id="size" name="size" type="number" min="1">
        <span id="size-error" hidden></span>
        <input id="consent" name="consent" type="checkbox" required checked>
        <span id="consent-error" hidden></span>
      </fieldset>
      <button type="submit">Send</button>
      <p role="status"></p>
    </form>`;
  const form = document.querySelector('form')!;
  form.dataset.feedback = JSON.stringify(fixtures['order-inquiry'].feedback);
  initializeInquiry(form);
  return form;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  document.body.replaceChildren();
});

it.each([
  ['name', '', 'required'], ['name', 'Too long', 'tooLong'],
  ['email', 'invalid', 'email'], ['email', '', 'required'],
  ['phone', 'letters', null], ['phone', '123', null],
  ['size', '0', null], ['consent', '', 'required'],
])('marks invalid %s, focuses it and clears corrected errors',
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
    input.value = name === 'email' ? 'a@example.test'
      : name === 'phone' ? '1234567' : name === 'size' ? '1' : 'Test';
    input.checked = true;
    fireEvent.input(input);
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(error.hidden).toBe(true);
  });

it('disables unavailable delivery and tolerates incomplete markup', () => {
  expect(() => initializeInquiry(document.createElement('form'))).not.toThrow();
  const form = setup(false);
  fireEvent.submit(form);
  expect(form.querySelector('button')).toBeDisabled();
  expect(form.querySelector('[role="status"]')).toHaveTextContent(
    fixtures['order-inquiry'].feedback.unavailable,
  );
});

it('updates conditional email validation and its label through reset',
  async () => {
    const form = setup(true, true);
    const method = form.elements.namedItem('contactMethod') as
      HTMLSelectElement;
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
  });

it('prevents duplicate sends and resets after confirmed receipt', async () => {
  const form = setup();
  let resolve!: (value: unknown) => void;
  const fetch = vi.fn(() => new Promise(done => { resolve = done; }));
  vi.stubGlobal('fetch', fetch);
  fireEvent.submit(form);
  expect(form).toHaveAttribute('aria-busy', 'true');
  expect(form.querySelector('fieldset')).toBeDisabled();
  fireEvent.submit(form);
  expect(fetch).toHaveBeenCalledTimes(1);
  resolve({ ok: true,
    json: async () => ({ accepted: true, receiptId: 'r1' }) });
  await waitFor(() => expect(form).not.toHaveAttribute('aria-busy'));
  expect(form.querySelector('[role="status"]')).toHaveTextContent(
    fixtures['order-inquiry'].feedback.success,
  );
  expect(form.querySelector('[role="status"]')).toHaveFocus();
  expect(form.querySelector('fieldset')).not.toBeDisabled();
});

it.each([null, {}, { accepted: false }, { accepted: true, receiptId: '' },
  { accepted: true, receiptId: 1 }])
('retains input when acceptance is unconfirmed: %j', async result => {
  const form = setup();
  const reset = vi.spyOn(form, 'reset');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true, json: async () => result,
  }));
  fireEvent.submit(form);
  await waitFor(() => expect(form).not.toHaveAttribute('aria-busy'));
  expect(reset).not.toHaveBeenCalled();
  expect(form.querySelector('[role="status"]')).toHaveTextContent(
    fixtures['order-inquiry'].feedback.failure,
  );
});

it('reuses request IDs for retries and replaces them after edits', async () => {
  const form = setup();
  const fetch = vi.fn().mockRejectedValueOnce(new Error('Offline'))
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
  vi.stubGlobal('fetch', vi.fn((_url, options) => new Promise((_, reject) => {
    options.signal.addEventListener('abort', () =>
      reject(new Error('Timeout')));
  })));
  fireEvent.submit(form);
  await vi.advanceTimersByTimeAsync(1000);
  expect(form).not.toHaveAttribute('aria-busy');
  expect(form.querySelector('button')).not.toBeDisabled();
  expect(form.querySelector('[role="status"]')).toHaveTextContent(
    fixtures['order-inquiry'].feedback.failure,
  );
});
