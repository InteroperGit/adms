import { ArrowRight, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';

const STATS = [
  { icon: Award, value: '10+', label: 'лет на рынке' },
  { icon: TrendingUp, value: '500+', label: 'реализованных проектов' },
  { icon: Users, value: '300+', label: 'довольных клиентов' },
];

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16 md:pt-20">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-orange-50 to-violet-50" />

      {/* Decorative blurred circles */}
      <div className="absolute -left-32 -top-32 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 -z-10 h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-2xl" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <Container className="py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary sm:px-4 sm:py-1.5 sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Рекламное агентство полного цикла
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-foreground">
            Реклама, которая{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                продаёт
              </span>
              <span
                className="absolute -bottom-1 left-0 -z-0 h-3 w-full rounded-sm bg-primary/10"
                aria-hidden="true"
              />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-xl">
            Разрабатываем комплексные рекламные стратегии, создаём креативные концепции и запускаем
            кампании, которые приносят реальный результат вашему бизнесу.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-8">
              <a href="#contact">
                Обсудить проект
                <ArrowRight size={16} />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 hover:bg-muted hover:text-primary"
            >
              <a href="#portfolio">Наши работы</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-6 border-t border-border pt-12 sm:grid-cols-3">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={20} />
                </div>
                <span
                  style={{ fontFamily: 'var(--font-heading)' }}
                  className="text-3xl font-bold text-foreground"
                >
                  {value}
                </span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
