import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Container } from '@/components/layout/Container';
import { content } from '@/lib/content';
import { siteData } from '@/lib/siteData';

type FormState = { name: string; contact: string; message: string };
const EMPTY: FormState = { name: '', contact: '', message: '' };

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!consent) {
      return;
    } // + защита на случай обхода

    setSubmitted(true);
    setForm(EMPTY);
    setConsent(false); // + сброс чекбокса
  }

  return (
    <section id="contact" className="bg-muted/40 py-24 md:py-32">
      <Container>
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            {content.contact.label}
          </div>
          <h2 className="mb-4">{content.contact.title}</h2>
          <p className="text-muted-foreground">{content.contact.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-end">
          {/* Left — form */}
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Send size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {content.contact.form.success.title}
                </h3>
                <p className="max-w-xs text-sm text-muted-foreground">
                  {content.contact.form.success.text}
                </p>
                <Button
                  variant="outline"
                  className="mt-2 rounded-full"
                  onClick={() => setSubmitted(false)}
                >
                  {content.contact.form.success.reset}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {content.contact.form.name.label}
                  </label>
                  <Input
                    id="name"
                    placeholder={content.contact.form.name.placeholder}
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {content.contact.form.contact.label}
                  </label>
                  <Input
                    id="contact"
                    placeholder={content.contact.form.contact.placeholder}
                    required
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    {content.contact.form.message.label}
                  </label>
                  <Textarea
                    id="message"
                    placeholder={content.contact.form.message.placeholder}
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                {/* Чекбокс согласия */}
                <div className="flex items-start gap-3">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
                    required
                  />
                  <label
                    htmlFor="consent"
                    className="text-xs leading-relaxed text-muted-foreground"
                  >
                    {content.contact.form.consent}{' '}
                    {content.contact.form.consentLinks.map((link, i) => (
                      <span key={link.href}>
                        {i > 0 && ` ${content.contact.form.consentJoiner} `}
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
                  {content.contact.form.submit}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  {content.contact.form.disclaimer}
                </p>
              </form>
            )}
          </div>

          {/* Right — contact info */}
          <div className="flex flex-col justify-center gap-8">
            <div>
              <h3 className="mb-6 text-xl font-semibold text-foreground">
                {content.contact.directTitle}
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {content.contact.contactLabels.phone}
                    </p>
                    <a
                      href={`tel:${siteData.contact.phone.replace(/\D/g, '')}`}
                      className="mt-0.5 block font-semibold text-foreground hover:text-primary"
                    >
                      {siteData.contact.phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {content.contact.contactLabels.email}
                    </p>
                    <a
                      href={`mailto:${siteData.contact.email}`}
                      className="mt-0.5 block font-semibold text-foreground hover:text-primary"
                    >
                      {siteData.contact.email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {content.contact.contactLabels.address}
                    </p>
                    <p className="mt-0.5 font-semibold text-foreground">
                      {siteData.contact.address}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Social links */}
            <div>
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                {content.contact.socialTitle}
              </p>
              <div className="flex gap-3">
                <a
                  href={siteData.contact.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  <Send size={16} />
                </a>
                <a
                  href={siteData.contact.vk}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ВКонтакте"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.08 13.37h-1.57c-.6 0-.78-.48-1.85-1.57-1-.93-1.4-.93-1.64-.93s-.3.06-.3.4v1.44c0 .29-.1.46-1.1.46-1.6 0-3.38-.98-4.63-2.8C5.9 10.1 5.34 8.27 5.34 7.9c0-.23.06-.44.38-.44h1.57c.29 0 .4.13.51.44.55 1.6 1.48 3 1.87 3s.45-.18.45-.93V8.6c-.05-.84-.48-.91-.48-1.2 0-.19.16-.38.42-.38h2.47c.23 0 .31.12.31.4v2.72c0 .23.1.31.16.31.33 0 .63-.31 1.25-1.05.77-.97 1.32-2.47 1.32-2.47.07-.2.2-.38.5-.38h1.57c.47 0 .57.24.47.56-.2.94-2.08 3.56-2.08 3.56-.17.27-.22.4 0 .7.16.22.68.68 1.03 1.09.64.72 1.12 1.33 1.25 1.75.12.42-.1.63-.5.63z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Working hours */}
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
              <p className="mb-3 text-sm font-semibold text-foreground">
                {content.contact.hoursTitle}
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {content.contact.dayLabels.weekdays}
                  </span>
                  <span className="font-medium text-foreground">
                    {siteData.contact.workingHours.weekdays}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {content.contact.dayLabels.saturday}
                  </span>
                  <span className="font-medium text-foreground">
                    {siteData.contact.workingHours.saturday}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{content.contact.dayLabels.sunday}</span>
                  <span className="font-medium text-foreground">
                    {siteData.contact.workingHours.sunday}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
