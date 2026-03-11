import { Button } from '@/components/ui/button';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { headerContent } from '@/types/sections/header';
import { siteData } from '@/types/config/siteData';
import { resolveIcon } from '@/types/shared/iconMap';
import { cn } from '@/lib/utils';

const PhoneIcon = resolveIcon('Phone');

interface Props {
  activeHref: string;
  isHome: boolean;
  /** 0=Phone, 1=Telegram, 2=VK, 3=CTA — null when no button is highlighted */
  highlightedActionIndex: number | null;
}

export function HeaderDesktopNav({ activeHref, isHome, highlightedActionIndex }: Props) {
  return (
    <>
      <nav className="hidden items-center gap-8 md:flex">
        {headerContent.nav.map((link) => {
          const isActive = link.href === activeHref;
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
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl border',
            'border-green-700/30 bg-green-700/5 text-green-700 shadow-sm',
            'transition-colors hover:bg-green-700/15',
            highlightedActionIndex === 0 && 'animate-pulse-green'
          )}
        >
          {PhoneIcon && <PhoneIcon size={16} />}
        </a>
        <SocialLinks
          telegram={siteData.contact.telegram}
          vk={siteData.contact.vk}
          variant="colored"
          highlightedIndex={
            highlightedActionIndex === 1 ? 0 : highlightedActionIndex === 2 ? 1 : null
          }
        />
        <Button
          asChild
          size="sm"
          className={cn(
            'h-11 rounded-full px-6',
            highlightedActionIndex === 3 && 'animate-cta-pulse'
          )}
        >
          <a href={isHome ? '#contact' : '/#contact'}>{headerContent.navCta}</a>
        </Button>
      </div>
    </>
  );
}
