import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { testimonials } from '@/lib/testimonials';
import { cn } from '@/lib/utils';
import { portfolioCaseMap } from '@/lib/portfolioCases';

export function PortfolioCasePage() {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? portfolioCaseMap[slug] : undefined;

  useEffect(() => {
    if (data) {
      document.title = data.meta.title;
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl) descEl.setAttribute('content', data.meta.description);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Страница не найдена</h1>
          <a href="/#portfolio" className="text-primary hover:underline">
            ← Вернуться к портфолио
          </a>
        </div>
      </div>
    );
  }

  const testimonial = data.testimonialId
    ? testimonials.find((t) => t.id === data.testimonialId)
    : undefined;

  return (
    <div className="min-h-screen bg-white font-sans text-foreground">
      {/* Page header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight text-primary">
              Рекламастер
            </a>
            <a
              href="/#portfolio"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={16} />
              Назад к портфолио
            </a>
          </div>
        </Container>
      </header>

      {/* Hero */}
      <section className={cn('bg-gradient-to-br py-24 text-white', data.gradient)}>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 border-0 bg-white/20 text-white backdrop-blur-sm">
              {data.category}
            </Badge>
            <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">{data.title}</h1>
            <p className="text-base text-white/80 md:text-lg">{data.description}</p>
          </div>
        </Container>
      </section>

      {/* Overview grid */}
      <section className="border-b border-border py-16">
        <Container>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {[
              { label: 'Клиент', value: data.overview.client },
              { label: 'Категория', value: data.category },
              { label: 'Год', value: data.overview.year },
              { label: 'Услуги', value: data.overview.services },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
                <p className="font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Challenge */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold md:text-3xl">Задача</h2>
            <p className="leading-relaxed text-muted-foreground">{data.challenge}</p>
          </div>
        </Container>
      </section>

      {/* Solution */}
      <section className="bg-muted/40 py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-2xl font-bold md:text-3xl">Решение</h2>
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-8">
              {data.solution.map(({ title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-white p-6 shadow-sm"
                >
                  <div
                    className={cn('mb-3 h-1 w-10 rounded-full bg-gradient-to-r', data.gradient)}
                  />
                  <h3 className="mb-2 font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Results */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-2xl font-bold md:text-3xl">Результаты</h2>
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              {data.results.map(({ metric, label, description }) => (
                <div
                  key={metric}
                  className={cn('rounded-2xl bg-gradient-to-br p-6 text-white', data.gradient)}
                >
                  <p className="text-4xl font-bold leading-none">{metric}</p>
                  <p className="mt-1 text-sm font-medium uppercase tracking-widest text-white/70">
                    {label}
                  </p>
                  <p className="mt-3 text-sm text-white/80">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery */}
      {data.images?.gallery && data.images.gallery.length > 0 && (
        <section className="bg-muted/40 py-16">
          <Container>
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-10 text-2xl font-bold md:text-3xl">Галерея</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {data.images.gallery.map((src, i) => (
                  <div
                    key={src}
                    className={cn(
                      'overflow-hidden rounded-2xl bg-muted',
                      data.images!.gallery!.length >= 3 && i === 0 ? 'sm:col-span-2' : ''
                    )}
                  >
                    <img
                      src={src}
                      alt={`${data.title} — фото ${i + 1}`}
                      className={cn(
                        'w-full object-cover',
                        data.images!.gallery!.length >= 3 && i === 0
                          ? 'h-64 sm:h-[480px]'
                          : 'h-52 sm:h-72'
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Testimonial */}
      {testimonial && (
        <section className="bg-muted/40 py-16">
          <Container>
            <div className="mx-auto max-w-2xl">
              <blockquote className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-6 text-lg leading-relaxed text-foreground">«{testimonial.text}»</p>
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white',
                      testimonial.avatarColor
                    )}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </blockquote>
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">Готовы к похожему результату?</h2>
            <p className="mb-8 text-muted-foreground">
              Расскажите о вашем проекте — мы предложим стратегию и назовём стоимость.
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <a href="/#contact">Обсудить ваш проект</a>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
