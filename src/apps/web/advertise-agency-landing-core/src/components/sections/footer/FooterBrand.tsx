// src/components/sections/footer/FooterBrand.tsx
import { SocialLinks } from '@/components/ui/SocialLinks';
import { content } from '@/lib/content';
import { siteData } from '@/lib/siteData';

export function FooterBrand() {
  return (
    <div className="sm:col-span-2 lg:col-span-1">
      <a href="#" className="mb-4 inline-flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
          {content.logo.letter}
        </span>
        <span
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-lg font-bold tracking-tight text-white"
        >
          {siteData.name}
        </span>
      </a>
      <p className="mb-6 text-sm leading-relaxed text-white/50">
        {content.footer.description.replace('{description}', siteData.description)}
      </p>
      <SocialLinks telegram={siteData.contact.telegram} vk={siteData.contact.vk} variant="dark" />
    </div>
  );
}
