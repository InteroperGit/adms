// src/components/sections/contact/ContactInfo.tsx
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactItem } from '@/components/sections/contact/ContactItem';
import { WidgetIframe } from '@/components/ui/WidgetIframe';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { phoneHref } from '@/libs/utils';
import { contactContent } from '@/types/sections/contact/contact';
import { siteData } from '@/types/config/siteData';

/**
 * @component
 * @description Contact information section rendering phone, email, address with icons, optional map, and social links. Theme-aware for dark mode.
 * @param {object} props
 * @param {boolean} props.isDark - Whether dark mode is active (affects map styling)
 * @returns {JSX.Element} Flex container with contact items, map, and social links
 * @example <caption>Contact information</caption>
 * <ContactInfo isDark={isDark} />
 */
export function ContactInfo({ isDark }: { isDark: boolean }) {
  const { directTitle, contactLabels, socialTitle, mapTitle } = contactContent;
  const { phone, email, address, telegram, vk } = siteData.contact;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-6 text-xl font-semibold text-foreground">{directTitle}</h3>
        <ul className="space-y-5">
          <ContactItem
            icon={Phone}
            label={contactLabels.phone}
            value={phone}
            href={phoneHref(phone)}
          />
          <ContactItem
            icon={Mail}
            label={contactLabels.email}
            value={email}
            href={`mailto:${email}`}
          />
          <ContactItem icon={MapPin} label={contactLabels.address} value={address} />
        </ul>
        {siteData.yandexMapUrl && (
          <WidgetIframe
            src={siteData.yandexMapUrl}
            title={mapTitle}
            height={360}
            isDark={isDark}
            className="mt-6"
            loading="lazy"
          />
        )}
      </div>

      <div>
        <p className="mb-4 text-sm font-medium text-muted-foreground">{socialTitle}</p>
        <SocialLinks telegram={telegram} vk={vk} variant="light" />
      </div>
    </div>
  );
}
