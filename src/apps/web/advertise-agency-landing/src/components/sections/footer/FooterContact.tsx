// src/components/sections/footer/FooterContact.tsx
import { ICON_MAP, type IconComponent } from '@/types/shared/iconMap';
import { footerContent } from '@/types/sections/footer/footer';
import { phoneHref } from '@/libs/utils';
import { siteData } from '@/types/config/siteData';
import { FooterSection } from './FooterSection';

interface FooterContactItem {
  icon: IconComponent;
  value: string;
  href?: string;
}

/**
 * @component
 * @description Footer contact column displaying phone, email, and address with icons. Phone and email are clickable links (tel: and mailto:); address is plain text.
 * @returns {JSX.Element} Column with contacts title and list of contact items with icons
 * @example <caption>Footer contact information</caption>
 * <FooterContact />
 */
export function FooterContact() {
  const { phone, email, address } = siteData.contact;

  const items: FooterContactItem[] = [
    { icon: ICON_MAP.Phone, value: phone, href: phoneHref(phone) },
    { icon: ICON_MAP.Mail, value: email, href: `mailto:${email}` },
    { icon: ICON_MAP.MapPin, value: address },
  ];

  return (
    <FooterSection title={footerContent.contactsTitle} spacing="space-y-4">
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
    </FooterSection>
  );
}
