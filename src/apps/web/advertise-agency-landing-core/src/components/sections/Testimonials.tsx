import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { testimonials } from '@/lib/testimonials'
import { cn } from '@/lib/utils'

export function Testimonials() {
  const [active, setActive] = useState(0)

  const prev = () => setActive((i) => (i === 0 ? testimonials.length - 1 : i - 1))
  const next = () => setActive((i) => (i === testimonials.length - 1 ? 0 : i + 1))

  const item = testimonials[active]

  return (
    <section id="testimonials" className="bg-muted py-24 md:py-32">
      <Container>
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Отзывы
          </div>
          <h2 className="mb-4">Что говорят клиенты</h2>
          <p className="text-muted-foreground">
            Нам доверяют компании из разных отраслей. Вот что они говорят о
            сотрудничестве с нами.
          </p>
        </div>

        {/* Carousel */}
        <div className="mx-auto max-w-3xl">
          <div className="relative rounded-2xl border border-border bg-white p-8 shadow-sm md:p-12">
            {/* Quote icon */}
            <div className="absolute right-6 top-6 text-primary/10 md:right-12 md:top-10">
              <Quote size={40} className="md:hidden" strokeWidth={1} />
              <Quote size={64} className="hidden md:block" strokeWidth={1} />
            </div>

            {/* Stars */}
            <div className="mb-6 flex gap-1">
              {Array.from({ length: item.rating }).map((_, i) => (
                <Star key={i} size={18} className="fill-primary text-primary" />
              ))}
            </div>

            {/* Quote text */}
            <blockquote className="mb-8 text-lg leading-relaxed text-foreground md:text-xl">
              «{item.text}»
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white',
                  item.avatarColor
                )}
              >
                {item.avatar}
              </div>
              <div>
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.role} · {item.company}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Отзыв ${i + 1}`}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    i === active
                      ? 'w-6 bg-primary'
                      : 'w-2 bg-border hover:bg-muted-foreground'
                  )}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Предыдущий отзыв"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                aria-label="Следующий отзыв"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* All reviews — desktop strip */}
        <div className="mt-12 hidden gap-4 lg:grid lg:grid-cols-5">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              className={cn(
                'rounded-xl border p-4 text-left transition-all duration-200',
                i === active
                  ? 'border-primary/30 bg-white shadow-sm'
                  : 'border-border bg-white/50 hover:border-primary/20 hover:bg-white'
              )}
            >
              <div className="mb-2 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={10} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                «{t.text}»
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white',
                    t.avatarColor
                  )}
                >
                  {t.avatar}
                </div>
                <span className="truncate text-xs font-medium text-foreground">
                  {t.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </Container>
    </section>
  )
}
