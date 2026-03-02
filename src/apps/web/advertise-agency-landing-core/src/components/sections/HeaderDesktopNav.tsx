import { Button } from '@/components/ui/button'
import { NAV_LINKS } from '@/lib/constants'

export function HeaderDesktopNav() {
  return (
    <>
      <nav className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="hidden md:block">
        <Button asChild size="sm" className="rounded-full px-6">
          <a href="#contact">Get a Quote</a>
        </Button>
      </div>
    </>
  )
}
