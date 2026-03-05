import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { content } from '@/lib/content';

export function CallToAction() {
  const { callToAction } = content;

  return (
    <section className="relative overflow-hidden bg-primary py-20">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Decorative blurs */}
      <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-white">{callToAction.title}</h2>
          <p className="mb-8 text-white/75">{callToAction.subtitle}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full rounded-full bg-white px-8 text-primary hover:bg-white/90 hover:text-primary sm:w-auto"
            >
              <a href={callToAction.cta[0].href}>
                {callToAction.cta[0].label}
                <ArrowRight size={16} className="ml-2" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full rounded-full border-white/40 bg-transparent px-8 text-white hover:border-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <a href={callToAction.cta[1].href}>{callToAction.cta[1].label}</a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
