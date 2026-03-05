// src/components/sections/footer/FooterContact.tsx
import { Mail, MapPin, Phone } from 'lucide-react';
import { content } from '@/lib/content';
import { siteData } from '@/lib/siteData';

export function FooterContact() {
  const { phone, email, address } = siteData.contact;

  return (
    <div>
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/40">
        {content.footer.contactsTitle}
      </p>
      <ul className="space-y-4">
        <li className="flex items-start gap-3">
          <Phone size={15} className="mt-0.5 shrink-0 text-primary" />
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className="text-sm text-white/60 transition-colors hover:text-primary"
          >
            {phone}
          </a>
        </li>
        <li className="flex items-start gap-3">
          <Mail size={15} className="mt-0.5 shrink-0 text-primary" />
          <a
            href={`mailto:${email}`}
            className="text-sm text-white/60 transition-colors hover:text-primary"
          >
            {email}
          </a>
        </li>
        <li className="flex items-start gap-3">
          <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
          <span className="text-sm text-white/60">{address}</span>
        </li>
      </ul>
    </div>
  );
}
