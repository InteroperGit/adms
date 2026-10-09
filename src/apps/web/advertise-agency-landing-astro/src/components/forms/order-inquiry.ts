import type { OrderInquiryContent } from '@/types/order-inquiry';

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export function initializeInquiry(form: HTMLFormElement): void {
  const fields = form.querySelector<HTMLFieldSetElement>('fieldset');
  const button = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const status = form.querySelector<HTMLElement>('[role="status"]');
  if (!fields || !button || !status) return;

  const feedback: OrderInquiryContent['feedback'] = JSON.parse(
    form.dataset.feedback ?? '{}',
  );
  const enabled = form.dataset.enabled === 'true';
  const controls = [...fields.querySelectorAll<Control>(
    'input:not([type="hidden"]), textarea, select',
  )];
  let sending = false;
  let previousPayload = '';
  let requestId = '';

  function showError(control: Control): boolean {
    const error = form.querySelector<HTMLElement>(`#${control.id}-error`);
    let message = '';
    if (control instanceof HTMLInputElement && control.type === 'checkbox') {
      if (control.required && !control.checked) message = feedback.required;
    } else if (control.required && !control.value.trim()) {
      message = feedback.required;
    } else if ('maxLength' in control && control.maxLength > 0 &&
      control.value.length > control.maxLength) {
      message = feedback.tooLong;
    } else if (control.validity.typeMismatch) {
      message = control instanceof HTMLInputElement && control.type === 'email'
        ? feedback.email : control.validationMessage;
    } else if (control instanceof HTMLInputElement
      && control.type === 'tel' && control.value.trim()
      && !/^\+?[\d\s().-]+$/.test(control.value.trim())) {
      message = 'Укажите корректный номер телефона.';
    } else if (control instanceof HTMLInputElement
      && control.type === 'tel' && control.value.trim()
      && !/^\d{7,15}$/.test(control.value.replace(/\D/g, ''))) {
      message = 'Укажите номер телефона: от 7 до 15 цифр.';
    } else if (!control.validity.valid) {
      // Numeric ranges, steps and other native constraints remain enforced.
      message = control.validationMessage;
    }
    control.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) {
      error.textContent = message;
      error.hidden = !message;
    }
    return !message;
  }

  // Cancel native submission even when delivery is unavailable.
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    if (!enabled) {
      status.textContent = feedback.unavailable;
      return;
    }
    const valid = controls.map(showError).every(Boolean);
    if (!valid) {
      status.textContent = feedback.invalid;
      controls.find(control =>
        control.getAttribute('aria-invalid') === 'true',
      )?.focus();
      return;
    }

    const payload = Object.fromEntries(new FormData(form));
    // Reuse the ID on retries so the backend can deduplicate acceptance.
    const serialized = JSON.stringify(payload);
    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      Number(form.dataset.timeout),
    );
    sending = true;
    fields.disabled = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.textContent = feedback.sending;
    try {
      if (serialized !== previousPayload) {
        requestId = crypto.randomUUID();
        previousPayload = serialized;
      }
      const response = await fetch(form.dataset.endpoint ?? '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, requestId }),
        signal: controller.signal,
        credentials: 'omit',
        redirect: 'error',
      });
      if (!response.ok) throw new Error('Delivery rejected');
      const result: unknown = await response.json();
      if (
        !result || typeof result !== 'object' ||
        !('accepted' in result) || result.accepted !== true ||
        !('receiptId' in result) ||
        typeof result.receiptId !== 'string' || !result.receiptId.trim()
      ) throw new Error('Acceptance not confirmed');
      form.reset();
      previousPayload = '';
      requestId = '';
      status.textContent = feedback.success;
    } catch {
      status.textContent = feedback.failure;
    } finally {
      window.clearTimeout(timeout);
      sending = false;
      fields.disabled = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });

  controls.forEach(control => control.addEventListener('input', () => {
    if (control.getAttribute('aria-invalid') === 'true') showError(control);
  }));
  // Enhance only after the protective submit handler is registered.
  form.noValidate = true;
  fields.disabled = false;
  button.disabled = !enabled;
}
