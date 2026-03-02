import { Container } from '@/components/layout/Container'
import { useScrolled } from '@/hooks/useScrolled'
import { SITE_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { HeaderDesktopNav } from './HeaderDesktopNav'
import { HeaderMobileNav } from './HeaderMobileNav'

export function Header() {
  const scrolled = useScrolled()

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/90 shadow-sm backdrop-blur-md' : 'bg-transparent'
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 text-foreground hover:text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              Р
            </span>
            <span
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-lg font-bold tracking-tight"
            >
              {SITE_NAME}
            </span>
          </a>

          <HeaderDesktopNav />
          <HeaderMobileNav />
        </div>
      </Container>
    </header>
  )
}
