// src/components/sections/footer/FooterBrand.tsx
import { SocialLinks } from '@/components/ui/SocialLinks';
import { Logo } from '@/components/ui/Logo';
import { footerContent } from '@/types/sections/footer/footer';
import { siteData } from '@/types/config/siteData';

export function FooterBrand() {
  return (
    <div className="sm:col-span-2 lg:col-span-1">
      <Logo className="mb-4" />
      <p className="mb-6 text-sm leading-relaxed text-white/50">
        {footerContent.description.replace('{description}', siteData.description)}
      </p>
      <SocialLinks
        phone={siteData.contact.phone}
        telegram={siteData.contact.telegram}
        vk={siteData.contact.vk}
        variant="dark"
      />
    </div>
  );
}
