// src/components/sections/contact/ContactForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ContactSuccess } from './ContactSuccess';
import { ContactFormFields } from './ContactFormFields';
import type { FormState } from './ContactFormFields';
import { ContactConsent } from './ContactConsent';
import { contactContent } from '@/types/sections/contact/contact';
import { resolveIcon } from '@/types/shared/iconMap';

const EMPTY: FormState = { name: '', contact: '', message: '' };
const LoaderIcon = resolveIcon('Loader2');

/**
 * @component
 * @description Main contact form section with name, contact, message fields, consent checkbox, and success state. Requires consent before submission.
 * @returns {JSX.Element} Form container with fields, consent, and submit button, or success message after submission
 * @example <caption>Contact section form</caption>
 * <ContactForm />
 */

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { form: f } = contactContent;

  function validateField(field: keyof FormState, value: string): string {
    if (field === 'name') {
      return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
    }
    if (field === 'contact') {
      const isEmpty = !value.trim();
      const hasValidFormat = /[@\d]/.test(value);
      if (isEmpty) {
        return 'Contact is required';
      }
      if (!hasValidFormat) {
        return 'Please enter a valid email or phone number';
      }
      return '';
    }
    if (field === 'message') {
      return value.trim().length < 10 ? 'Message must be at least 10 characters' : '';
    }
    return '';
  }

  function handleFieldChange(field: keyof FormState, value: string) {
    setForm({ ...form, [field]: value });
    // Clear error on change if it was previously invalid
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  }

  function handleFieldBlur(field: keyof FormState) {
    const error = validateField(field, form[field]);
    setErrors({ ...errors, [field]: error });
  }

  function isFormValid(): boolean {
    return (
      !validateField('name', form.name) &&
      !validateField('contact', form.contact) &&
      !validateField('message', form.message)
    );
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!consent || !isFormValid()) {
      // Validate all fields on submit attempt
      setErrors({
        name: validateField('name', form.name),
        contact: validateField('contact', form.contact),
        message: validateField('message', form.message),
      });
      return;
    }

    // Simulate submission
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      setForm(EMPTY);
      setErrors(EMPTY);
      setConsent(false);
    }, 1200);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      {submitted ? (
        <ContactSuccess onReset={() => setSubmitted(false)} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <ContactFormFields
            form={form}
            errors={errors}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />

          <ContactConsent checked={consent} onChange={setConsent} />

          <Button
            type="submit"
            size="lg"
            disabled={!consent || isLoading}
            className="w-full rounded-full cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                {LoaderIcon && <LoaderIcon size={16} className="animate-spin" />}
                {f.sending}
              </span>
            ) : (
              f.submit
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">{f.disclaimer}</p>
        </form>
      )}
    </div>
  );
}
