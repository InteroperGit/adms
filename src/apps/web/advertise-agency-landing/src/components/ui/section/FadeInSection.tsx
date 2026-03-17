import { cn } from '@/libs/utils';
import { useFadeIn } from '@/hooks/useFadeIn';

interface FadeInSectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * @component
 * @description Section wrapper with scroll-triggered fade-in animation via intersection observer
 * @param {FadeInSectionProps} props
 * @param {string} [props.id] - Optional section id for anchoring
 * @param {string} [props.className] - Additional section classes
 * @param {React.ReactNode} props.children - Content to fade in
 * @returns {JSX.Element} Section with useFadeIn hook applying animation classes
 * @example
 * <FadeInSection id="services" className="py-12">
 *   <h2>Services</h2>
 * </FadeInSection>
 */
export function FadeInSection({ id, className, children }: FadeInSectionProps) {
  const { ref, isVisible } = useFadeIn();
  return (
    <section ref={ref} id={id} className={className}>
      <div className={cn('fade-in-section', isVisible && 'is-visible')}>{children}</div>
    </section>
  );
}
