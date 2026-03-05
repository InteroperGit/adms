import { Container } from '@/components/layout/Container';
import { content } from '@/types/content';
import { HeroCTA } from './HeroCTA';
import { HeroStats } from './HeroStats';

export function Hero() {
  const { hero } = content;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16 md:pt-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-orange-50 to-violet-50" />
      <div className="absolute -left-32 -top-32 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 -z-10 h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-2xl" />
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary sm:px-4 sm:py-1.5 sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {hero.badge}
          </div>

          <h1 className="mb-6 text-foreground">
            {hero.title}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {hero.titleHighlight}
              </span>
              <span
                className="absolute -bottom-1 left-0 -z-0 h-3 w-full rounded-sm bg-primary/10"
                aria-hidden="true"
              />
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-xl">
            {hero.subtitle}
          </p>

          <HeroCTA cta={hero.cta} />
          <HeroStats stats={hero.stats} />
        </div>
      </Container>
    </section>
  );
}
