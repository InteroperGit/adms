import { Container } from '@/components/layout/Container';
import { callToActionContent } from '@/types/sections/call-to-action/callToAction';
import { CtaButtons } from './CtaButtons';

/**
 * @component
 * @description Full-width call-to-action section with prominent title, subtitle, and dual CTA buttons. High-visibility hero-like design with primary brand color.
 * @returns {JSX.Element} Full-width section with centered text and CTA buttons
 * @example <caption>Call-to-action section</caption>
 * <CallToAction />
 */
export function CallToAction() {
  const callToAction = callToActionContent;

  return (
    <section className="bg-primary py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-white">{callToAction.title}</h2>
          <p className="mb-8 text-white/75">{callToAction.subtitle}</p>
          <CtaButtons cta={callToAction.cta} />
        </div>
      </Container>
    </section>
  );
}
