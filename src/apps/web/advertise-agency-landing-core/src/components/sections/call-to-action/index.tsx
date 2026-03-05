import { Container } from '@/components/layout/Container';
import { content } from '@/types/content';
import { CtaButtons } from './CtaButtons';

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
          <CtaButtons cta={[callToAction.cta[0], callToAction.cta[1]]} />
        </div>
      </Container>
    </section>
  );
}
