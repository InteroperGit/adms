import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { Separator } from '@/components/ui/separator'
import { NAV_LINKS } from '@/lib/constants'
import { services } from '@/lib/services'
import { siteData } from '@/lib/siteData'

const SERVICES_FOOTER = services.slice(0, 4)

export function Footer() {
  const year = new Date().getFullYear()

  return (
      <footer style={{ backgroundColor: 'hsl(var(--foreground))' }}>
        <Container>
          {/* Main grid */}
          <div className="grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 sm:gap-10 sm:py-16 lg:grid-cols-4">

            {/* Col 1 — brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <a href="#" className="mb-4 inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                Р
              </span>
                <span
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="text-lg font-bold tracking-tight text-white"
                >
                {siteData.name}
              </span>
              </a>
              <p className="mb-6 text-sm leading-relaxed text-white/50">
                {siteData.description}. Рекламное агентство полного цикла — стратегия,
                дизайн, digital и наружная реклама.
              </p>
              {/* Social */}
              <div className="flex gap-3">
                <a
                    href={siteData.contact.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                >
                  <Send size={15} />
                </a>
                <a
                    href={siteData.contact.vk}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="ВКонтакте"
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.08 13.37h-1.57c-.6 0-.78-.48-1.85-1.57-1-.93-1.4-.93-1.64-.93s-.3.06-.3.4v1.44c0 .29-.1.46-1.1.46-1.6 0-3.38-.98-4.63-2.8C5.9 10.1 5.34 8.27 5.34 7.9c0-.23.06-.44.38-.44h1.57c.29 0 .4.13.51.44.55 1.6 1.48 3 1.87 3s.45-.18.45-.93V8.6c-.05-.84-.48-.91-.48-1.2 0-.19.16-.38.42-.38h2.47c.23 0 .31.12.31.4v2.72c0 .23.1.31.16.31.33 0 .63-.31 1.25-1.05.77-.97 1.32-2.47 1.32-2.47.07-.2.2-.38.5-.38h1.57c.47 0 .57.24.47.56-.2.94-2.08 3.56-2.08 3.56-.17.27-.22.4 0 .7.16.22.68.68 1.03 1.09.64.72 1.12 1.33 1.25 1.75.12.42-.1.63-.5.63z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 — navigation */}
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/40">
                Навигация
              </p>
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <a
                          href={link.href}
                          className="text-sm text-white/60 transition-colors hover:text-primary"
                      >
                        {link.label}
                      </a>
                    </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — services */}
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/40">
                Услуги
              </p>
              <ul className="space-y-3">
                {SERVICES_FOOTER.map((service) => (
                    <li key={service.title}>
                      <a
                          href="#services"
                          className="text-sm text-white/60 transition-colors hover:text-primary"
                      >
                        {service.title}
                      </a>
                    </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — contacts */}
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/40">
                Контакты
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone size={15} className="mt-0.5 shrink-0 text-primary" />
                  <a
                      href={`tel:${siteData.contact.phone.replace(/\D/g, '')}`}
                      className="text-sm text-white/60 transition-colors hover:text-primary"
                  >
                    {siteData.contact.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={15} className="mt-0.5 shrink-0 text-primary" />
                  <a
                      href={`mailto:${siteData.contact.email}`}
                      className="text-sm text-white/60 transition-colors hover:text-primary"
                  >
                    {siteData.contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
                  <span className="text-sm text-white/60">
                  {siteData.contact.address}
                </span>
                </li>
              </ul>
            </div>

          </div>

          <Separator className="bg-white/10" />

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/35 sm:flex-row">
            <p>© {year} {siteData.name}. Все права защищены.</p>

            {/* Юридические ссылки */}
            <nav className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 sm:justify-start">
              <Link
                  to="/privacy-policy"
                  className="transition-colors hover:text-white/70 whitespace-nowrap"
              >
                Политика конфиденциальности
              </Link>

              <span className="text-white/15 hidden sm:inline">|</span>

              <Link
                  to="/consent"
                  className="transition-colors hover:text-white/70 whitespace-nowrap"
              >
                Согласие на обработку данных
              </Link>

              <span className="text-white/15 hidden sm:inline">|</span>

              <Link
                  to="/user-agreement"
                  className="transition-colors hover:text-white/70 whitespace-nowrap"
              >
                Пользовательское соглашение
              </Link>
            </nav>

            <p>Реклама, которая работает.</p>
          </div>
        </Container>
      </footer>
  )
}
