import { cn } from '@/lib/utils';
import { useFadeIn } from '@/hooks/useFadeIn';

interface FadeInSectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export function FadeInSection({ id, className, children }: FadeInSectionProps) {
  const { ref, isVisible } = useFadeIn();
  return (
    <section ref={ref} id={id} className={className}>
      <div className={cn('fade-in-section', isVisible && 'is-visible')}>{children}</div>
    </section>
  );
}
