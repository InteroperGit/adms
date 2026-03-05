// src/components/sections/contact/ContactForm.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ContactSuccess } from './ContactSuccess';
import { content } from '@/lib/content';

type FormState = { name: string; contact: string; message: string };
const EMPTY: FormState = { name: '', contact: '', message: '' };

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);
  const { form: f } = content.contact;

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!consent) return;
    setSubmitted(true);
    setForm(EMPTY);
    setConsent(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
      {submitted ? (
        <ContactSuccess onReset={() => setSubmitted(false)} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
              {f.name.label}
            </label>
            <Input
              id="name"
              placeholder={f.name.placeholder}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="contact" className="mb-1.5 block text-sm font-medium text-foreground">
              {f.contact.label}
            </label>
            <Input
              id="contact"
              placeholder={f.contact.placeholder}
              required
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
              {f.message.label}
            </label>
            <Textarea
              id="message"
              placeholder={f.message.placeholder}
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
              required
            />
            <label htmlFor="consent" className="text-xs leading-relaxed text-muted-foreground">
              {f.consent}{' '}
              {f.consentLinks.map((link, i) => (
                <span key={link.href}>
                  {i > 0 && ` ${f.consentJoiner} `}
                  <Link
                    to={link.href}
                    className="underline underline-offset-2 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </label>
          </div>

          <Button type="submit" size="lg" className="w-full rounded-full">
            {f.submit}
          </Button>

          <p className="text-center text-xs text-muted-foreground">{f.disclaimer}</p>
        </form>
      )}
    </div>
  );
}
