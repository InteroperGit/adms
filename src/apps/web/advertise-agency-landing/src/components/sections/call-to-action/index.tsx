import { Container } from '@/components/layout/Container';
import { callToActionContent } from '@/types/sections/call-to-action/callToAction';
import { CtaButtons } from './CtaButtons';

/**
 * @component
 * @description Full-width call-to-action section with prominent title, subtitle, and dual CTA buttons. High-visibility hero-like design with primary brand color, atmospheric depth via decorative blobs and dot pattern.
 * @returns {JSX.Element} Full-width section with centered text, CTA buttons, and visual depth elements
 * @example <caption>Call-to-action section</caption>
 * <CallToAction />
 */
export function CallToAction() {
  const callToAction = callToActionContent;

  return (
    <section className="relative overflow-hidden bg-primary py-24 md:py-32">
      {/* Decorative blobs */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full blur-2xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full blur-3xl" />

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgb(255, 255, 255) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-white">{callToAction.title}</h2>
          <p className="mb-8 text-white/75">{callToAction.subtitle}</p>
          <CtaButtons cta={callToAction.cta} />
        </div>
      </Container>
    </section>
  );
}
