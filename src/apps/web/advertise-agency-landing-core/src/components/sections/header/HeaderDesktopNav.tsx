import { Button } from '@/components/ui/button';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { headerContent } from '@/types/sections/header';
import { siteData } from '@/types/config/siteData';
import { resolveIcon } from '@/types/shared/iconMap';
import { cn } from '@/lib/utils';

const PhoneIcon = resolveIcon('Phone');

interface Props {
  activeSection: string;
  isHome: boolean;
  forcedActiveHref: string;
}

export function HeaderDesktopNav({ activeSection, isHome, forcedActiveHref }: Props) {
  return (
    <>
      <nav className="hidden items-center gap-8 md:flex">
        {headerContent.nav.map((link) => {
          const isActive = link.href === `#${activeSection}` || link.href === forcedActiveHref;
          const href = isHome ? link.href : `/${link.href}`;
          return (
            <a
              key={link.href}
              href={href}
              className={cn(
                'group relative text-sm font-medium transition-colors hover:text-foreground',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}

              {/* Линия подчёркивания */}
              <span
                className={cn(
                  'absolute -bottom-0.5 left-0 h-px transition-all duration-300 ease-out',
                  'bg-primary',
                  isActive
                    ? 'w-full' // активная — всегда видна
                    : 'w-0 group-hover:w-full' // неактивная — появляется при наведении
                )}
              />
            </a>
          );
        })}
      </nav>

      <div className="hidden items-center gap-3 md:flex">
        <a
          href={`tel:${siteData.contact.phone}`}
          aria-label="Позвонить"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-green-700/30 bg-green-700/5 text-green-700 shadow-sm transition-colors hover:bg-green-700/15"
        >
          {PhoneIcon && <PhoneIcon size={16} />}
        </a>
        <SocialLinks
          telegram={siteData.contact.telegram}
          vk={siteData.contact.vk}
          variant="colored"
        />
        <Button asChild size="sm" className="h-11 rounded-full px-6">
          <a href={isHome ? '#contact' : '/#contact'}>{headerContent.navCta}</a>
        </Button>
      </div>
    </>
  );
}
