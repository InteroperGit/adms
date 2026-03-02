import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'
import { PORTFOLIO_CATEGORIES, PORTFOLIO_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('Все')

  const filtered =
    activeCategory === 'Все'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory)

  return (
    <section id="portfolio" className="bg-white py-24 md:py-32">
      <Container>
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Портфолио
          </div>
          <h2 className="mb-4">Наши работы</h2>
          <p className="text-muted-foreground">
            Избранные проекты из разных отраслей — от локального бизнеса до
            федеральных брендов.
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {PORTFOLIO_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-medium transition-all duration-200',
                activeCategory === category
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              {/* Thumbnail placeholder */}
              <div
                className={cn(
                  'relative h-52 bg-gradient-to-br',
                  item.gradient
                )}
              >
                {/* Overlay pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                {/* Category badge on image */}
                <div className="absolute left-4 top-4">
                  <Badge className="border-0 bg-white/20 text-white backdrop-blur-sm">
                    {item.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground">
                  {item.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="mb-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Link */}
                <a
                  href={item.href ?? '#contact'}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-gap duration-200 hover:gap-2.5"
                >
                  Подробнее
                  <ArrowRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <a href="#contact">Обсудить ваш проект</a>
          </Button>
        </div>
      </Container>
    </section>
  )
}
