// src/components/sections/contact/ContactInfo.tsx
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactItem } from '@/components/sections/contact/ContactItem';
import { ContactMap } from '@/components/sections/contact/ContactMap';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { contactContent } from '@/types/contact';
import { siteData } from '@/types/siteData';

export function ContactInfo() {
  const { directTitle, contactLabels, socialTitle } = contactContent;
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
            href={`tel:${phone.replace(/\D/g, '')}`}
          />
          <ContactItem
            icon={Mail}
            label={contactLabels.email}
            value={email}
            href={`mailto:${email}`}
          />
          <ContactItem icon={MapPin} label={contactLabels.address} value={address} />
        </ul>
        {siteData.yandexMapUrl && <ContactMap url={siteData.yandexMapUrl} className="mt-6" />}
      </div>

      <div>
        <p className="mb-4 text-sm font-medium text-muted-foreground">{socialTitle}</p>
        <SocialLinks telegram={telegram} vk={vk} />
      </div>
    </div>
  );
}
