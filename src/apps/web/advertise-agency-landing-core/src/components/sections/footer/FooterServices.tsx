// src/components/sections/footer/FooterServices.tsx
import { footerContent } from '@/types/footer';
import { services } from '@/types/services';

const SERVICES_FOOTER = services.slice(0, 4);

export function FooterServices() {
  return (
    <div>
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/40">
        {footerContent.servicesTitle}
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
  );
}
