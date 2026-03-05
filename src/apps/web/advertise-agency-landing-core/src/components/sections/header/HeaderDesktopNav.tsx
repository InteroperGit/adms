import { Button } from '@/components/ui/button';
import { content } from '@/lib/content';
import { cn } from '@/lib/utils';

interface Props {
  activeSection: string;
}

export function HeaderDesktopNav({ activeSection }: Props) {
  return (
    <>
      <nav className="hidden items-center gap-8 md:flex">
        {content.nav.map((link) => {
          const isActive = link.href === `#${activeSection}`;
          return (
            <a
              key={link.href}
              href={link.href}
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

      <div className="hidden md:block">
        <Button asChild size="sm" className="rounded-full px-6">
          <a href="#contact">{content.navCta}</a>
        </Button>
      </div>
    </>
  );
}
