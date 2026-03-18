// src/components/sections/footer/FooterServices.tsx
import { footerContent } from '@/types/sections/footer/footer';
import { services } from '@/types/sections/services/services';
import { FooterSection } from './FooterSection';

const SERVICES_FOOTER = services.slice(0, 4);

/**
 * @component
 * @description Footer services column displaying up to 4 main services. Each service links to the services section (#services) anchor.
 * @returns {JSX.Element} Column with services title and list of service links
 * @example <caption>Footer services list</caption>
 * <FooterServices />
 */
export function FooterServices() {
  return (
    <FooterSection title={footerContent.servicesTitle}>
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
    </FooterSection>
  );
}
