import type { OrderInquiryContent } from '@/types/order-inquiry';
import {
  initializeSmartCaptcha,
  type SmartCaptchaControls,
} from './smart-captcha';

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export function initializeInquiry(form: HTMLFormElement): void {
  const fields = form.querySelector<HTMLFieldSetElement>('fieldset');
  const button = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const status = form.querySelector<HTMLElement>('[role="status"]');
  if (!fields || !button || !status) return;
  // Lettering forms require email only for the selected contact channel.
  // Keep this beside validation so every caller gets the same constraints.
  const method = form.elements.namedItem('contactMethod');
  const email = form.elements.namedItem('email');
  if (
    method instanceof HTMLSelectElement &&
    email instanceof HTMLInputElement
  ) {
    const updateContact = () => {
      email.required = method.value === 'email';
      const requirement = form.querySelector('[data-requirement="email"]');
      if (requirement) {
        requirement.textContent = email.required ? ' *' : ' (необязательно)';
      }
    };
    method.addEventListener('change', updateContact);
    // Native reset restores values after dispatching its reset event.
    form.addEventListener('reset', () => queueMicrotask(updateContact));
    updateContact();
  }
  // Status receives focus after async outcomes so keyboard users hear them.
  status.tabIndex = -1;

  const feedback: OrderInquiryContent['feedback'] = JSON.parse(
    form.dataset.feedback ?? '{}',
  );
  const enabled = form.dataset.enabled === 'true';
  const captchaContainer = form.querySelector<HTMLElement>(
    '[data-smartcaptcha]',
  );
  const captchaSiteKey = captchaContainer?.dataset.sitekey?.trim() ?? '';
  const captchaRequired = captchaContainer !== null;
  const controls = [
    ...fields.querySelectorAll<Control>(
      'input:not([type="hidden"]), textarea, select',
    ),
  ];
  let sending = false;
  let previousPayload = '';
  let requestId = '';
  let captcha: SmartCaptchaControls | undefined;

  function focusStatus() {
    status?.focus({ preventScroll: true });
  }

  function showError(control: Control): boolean {
    const error = form.querySelector<HTMLElement>(`#${control.id}-error`);
    let message = '';
    if (control instanceof HTMLInputElement && control.type === 'checkbox') {
      if (control.required && !control.checked) message = feedback.required;
    } else if (control.required && !control.value.trim()) {
      message = feedback.required;
    } else if (
      'maxLength' in control &&
      control.maxLength > 0 &&
      control.value.length > control.maxLength
    ) {
      message = feedback.tooLong;
    } else if (control.validity.typeMismatch) {
      message =
        control instanceof HTMLInputElement && control.type === 'email'
          ? feedback.email
          : control.validationMessage;
    } else if (
      control instanceof HTMLInputElement &&
      control.type === 'tel' &&
      control.value.trim() &&
      !/^\+?[\d\s().-]+$/.test(control.value.trim())
    ) {
      message = 'Укажите корректный номер телефона.';
    } else if (
      control instanceof HTMLInputElement &&
      control.type === 'tel' &&
      control.value.trim() &&
      !/^\d{7,15}$/.test(control.value.replace(/\D/g, ''))
    ) {
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
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    if (!enabled) {
      status.textContent = feedback.unavailable;
      focusStatus();
      return;
    }
    const valid = controls.map(showError).every(Boolean);
    if (!valid) {
      status.textContent = feedback.invalid;
      controls
        .find((control) => control.getAttribute('aria-invalid') === 'true')
        ?.focus();
      return;
    }

    const captchaField = form.querySelector<HTMLInputElement>(
      'input[name="captchaToken"]',
    );
    if (captchaRequired && !captchaField?.value) {
      status.textContent = feedback.captchaRequired;
      captchaContainer?.focus({ preventScroll: true });
      return;
    }

    const payload = Object.fromEntries(new FormData(form));
    // New CAPTCHA tokens leave the retry-stable inquiry identity unchanged.
    const identityPayload = { ...payload };
    delete identityPayload.captchaToken;
    const serialized = JSON.stringify(identityPayload);
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
        !result ||
        typeof result !== 'object' ||
        !('accepted' in result) ||
        result.accepted !== true ||
        !('receiptId' in result) ||
        typeof result.receiptId !== 'string' ||
        !result.receiptId.trim()
      )
        throw new Error('Acceptance not confirmed');
      form.reset();
      previousPayload = '';
      requestId = '';
      status.textContent = feedback.success;
      focusStatus();
    } catch {
      status.textContent = feedback.failure;
      focusStatus();
    } finally {
      captcha?.reset();
      window.clearTimeout(timeout);
      sending = false;
      fields.disabled = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });

  controls.forEach((control) =>
    control.addEventListener('input', () => {
      if (control.getAttribute('aria-invalid') === 'true') showError(control);
    }),
  );
  if (captchaRequired) {
    button.disabled = true;
    if (!captchaSiteKey || !captchaContainer) {
      status.textContent = enabled
        ? feedback.captchaUnavailable
        : feedback.unavailable;
    } else {
      status.textContent = feedback.captchaLoading;
      captchaContainer.addEventListener('captcha-token', () => {
        if (
          status.textContent === feedback.captchaExpired ||
          status.textContent === feedback.captchaUnavailable
        ) {
          status.textContent = '';
        }
      });
      void initializeSmartCaptcha(
        captchaContainer,
        captchaSiteKey,
        () => {
          status.textContent = feedback.captchaExpired;
        },
        () => {
          status.textContent = feedback.captchaUnavailable;
        },
      )
        .then((controls) => {
          captcha = controls;
          button.disabled = !enabled;
          status.textContent = enabled ? '' : feedback.unavailable;
        })
        .catch(() => {
          status.textContent = feedback.captchaUnavailable;
        });
    }
  }
  // Enhance only after the protective submit handler is registered.
  form.noValidate = true;
  fields.disabled = false;
  if (!captchaRequired) button.disabled = !enabled;
}
