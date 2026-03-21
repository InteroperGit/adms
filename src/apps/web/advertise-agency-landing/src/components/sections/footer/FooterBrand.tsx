// src/components/sections/footer/FooterBrand.tsx
import { SocialLinks } from '@/components/ui/SocialLinks';
import { Logo } from '@/components/ui/Logo';
import { footerContent } from '@/types/sections/footer/footer';
import { siteData } from '@/types/config/siteData';
import { interpolate } from '@/libs/utils';

/**
 * @component
 * @description Footer brand column displaying logo, company description, and social media links. Uses dark-mode social link variant.
 * @returns {JSX.Element} Column layout with logo, description text, and social icons
 * @example <caption>Footer brand section</caption>
 * <FooterBrand />
 */
export function FooterBrand() {
  return (
    <div className="sm:col-span-2 lg:col-span-1">
      <div className="mb-6">
        <Logo className="mb-4" />
        <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent" />
      </div>
      <p className="mb-8 text-sm leading-relaxed text-white/60">
        {interpolate(footerContent.description, { description: siteData.description })}
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
