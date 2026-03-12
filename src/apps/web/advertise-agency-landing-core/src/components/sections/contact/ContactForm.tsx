// src/components/sections/contact/ContactForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ContactSuccess } from './ContactSuccess';
import { ContactFormFields } from './ContactFormFields';
import { ContactConsent } from './ContactConsent';
import { contactContent } from '@/types/sections/contact';

type FormState = { name: string; contact: string; message: string };
const EMPTY: FormState = { name: '', contact: '', message: '' };

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);
  const { form: f } = contactContent;

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!consent) {
      return;
    }
    setSubmitted(true);
    setForm(EMPTY);
    setConsent(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      {submitted ? (
        <ContactSuccess onReset={() => setSubmitted(false)} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <ContactFormFields
            form={form}
            onChange={(field, value) => setForm({ ...form, [field]: value })}
          />

          <ContactConsent checked={consent} onChange={setConsent} />

          <Button
            type="submit"
            size="lg"
            disabled={!consent}
            className="w-full rounded-full cursor-pointer disabled:cursor-not-allowed"
          >
            {f.submit}
          </Button>

          <p className="text-center text-xs text-muted-foreground">{f.disclaimer}</p>
        </form>
      )}
    </div>
  );
}
