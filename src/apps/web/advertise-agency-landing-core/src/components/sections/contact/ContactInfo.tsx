// src/components/sections/contact/ContactInfo.tsx
import { Mail, MapPin, Phone } from 'lucide-react';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { content } from '@/lib/content';
import { siteData } from '@/lib/siteData';

export function ContactInfo() {
  const { directTitle, contactLabels, socialTitle } = content.contact;
  const { phone, email, address, telegram, vk } = siteData.contact;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-6 text-xl font-semibold text-foreground">{directTitle}</h3>
        <ul className="space-y-5">
          <li className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {contactLabels.phone}
              </p>
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="mt-0.5 block font-semibold text-foreground hover:text-primary"
              >
                {phone}
              </a>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {contactLabels.email}
              </p>
              <a
                href={`mailto:${email}`}
                className="mt-0.5 block font-semibold text-foreground hover:text-primary"
              >
                {email}
              </a>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {contactLabels.address}
              </p>
              <p className="mt-0.5 font-semibold text-foreground">{address}</p>
            </div>
          </li>
        </ul>
      </div>

      <div>
        <p className="mb-4 text-sm font-medium text-muted-foreground">{socialTitle}</p>
        <SocialLinks telegram={telegram} vk={vk} />
      </div>
    </div>
  );
}
