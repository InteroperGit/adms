// src/components/sections/footer/FooterContact.tsx
import { ICON_MAP, type IconComponent } from '@/types/iconMap';
import { content } from '@/types/content';
import { siteData } from '@/types/siteData';

interface FooterContactItem {
  icon: IconComponent;
  value: string;
  href?: string;
}

export function FooterContact() {
  const { phone, email, address } = siteData.contact;

  const items: FooterContactItem[] = [
    { icon: ICON_MAP.Phone, value: phone, href: `tel:${phone.replace(/\D/g, '')}` },
    { icon: ICON_MAP.Mail, value: email, href: `mailto:${email}` },
    { icon: ICON_MAP.MapPin, value: address },
  ];

  return (
    <div>
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/40">
        {content.footer.contactsTitle}
      </p>
      <ul className="space-y-4">
        {items.map(({ icon: Icon, value, href }) => (
          <li key={value} className="flex items-start gap-3">
            <Icon size={15} className="mt-0.5 shrink-0 text-primary" />
            {href ? (
              <a href={href} className="text-sm text-white/60 transition-colors hover:text-primary">
                {value}
              </a>
            ) : (
              <span className="text-sm text-white/60">{value}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
