import { useState } from 'react'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Container } from '@/components/layout/Container'
import { CONTACT_INFO } from '@/lib/constants'

type FormState = { name: string; contact: string; message: string }
const EMPTY: FormState = { name: '', contact: '', message: '' }

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setForm(EMPTY)
  }

  return (
    <section id="contact" className="bg-muted/40 py-24 md:py-32">
      <Container>
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Контакты
          </div>
          <h2 className="mb-4">Обсудим ваш проект?</h2>
          <p className="text-muted-foreground">
            Оставьте заявку — перезвоним в течение рабочего дня, выслушаем задачу
            и предложим решение.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — form */}
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Send size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Заявка отправлена!
                </h3>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Мы получили вашу заявку и свяжемся с вами в ближайшее рабочее
                  время.
                </p>
                <Button
                  variant="outline"
                  className="mt-2 rounded-full"
                  onClick={() => setSubmitted(false)}
                >
                  Отправить ещё
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Ваше имя
                  </label>
                  <Input
                    id="name"
                    placeholder="Иван Иванов"
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
                    Телефон или email
                  </label>
                  <Input
                    id="contact"
                    placeholder="+7 (999) 000-00-00 или mail@example.com"
                    required
                    value={form.contact}
                    onChange={(e) =>
                      setForm({ ...form, contact: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Расскажите о задаче
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Кратко опишите ваш бизнес и что хотите получить..."
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full"
                >
                  Отправить заявку
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных
                  данных
                </p>
              </form>
            )}
          </div>

          {/* Right — contact info */}
          <div className="flex flex-col justify-center gap-8">
            <div>
              <h3 className="mb-6 text-xl font-semibold text-foreground">
                Свяжитесь с нами напрямую
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Телефон
                    </p>
                    <a
                      href={`tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`}
                      className="mt-0.5 block font-semibold text-foreground hover:text-primary"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Email
                    </p>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="mt-0.5 block font-semibold text-foreground hover:text-primary"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Адрес
                    </p>
                    <p className="mt-0.5 font-semibold text-foreground">
                      {CONTACT_INFO.address}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Social links */}
            <div>
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                Мы в соцсетях
              </p>
              <div className="flex gap-3">
                <a
                  href={CONTACT_INFO.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  <Send size={16} />
                </a>
                <a
                  href={CONTACT_INFO.vk}
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
                Часы работы
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Пн — Пт</span>
                  <span className="font-medium text-foreground">9:00 — 19:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Суббота</span>
                  <span className="font-medium text-foreground">10:00 — 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Воскресенье</span>
                  <span className="font-medium text-foreground">Выходной</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
