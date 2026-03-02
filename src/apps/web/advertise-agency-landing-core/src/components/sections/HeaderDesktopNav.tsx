import { Button } from '@/components/ui/button'
import { NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  activeSection: string
}

export function HeaderDesktopNav({ activeSection }: Props) {
  return (
    <>
      <nav className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => {
          const isActive = link.href === `#${activeSection}`
          return (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-foreground',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </a>
          )
        })}
      </nav>

      <div className="hidden md:block">
        <Button asChild size="sm" className="rounded-full px-6">
          <a href="#contact">Связаться</a>
        </Button>
      </div>
    </>
  )
}
