import { cn } from '@/libs/utils';
import { useViewportAnimation } from '@/hooks/useViewportAnimation';
import type { CardsBlock as CardsBlockData } from '@/types/blocks';

interface CardsBlockProps {
  block: CardsBlockData;
  caseGradient: string;
}

/**
 * @component
 * @description Grid of informational cards with optional colored top bar accent, hover states, and stagger entrance
 * @param {CardsBlockProps} props
 * @param {CardsBlockData} props.block - Cards block with title, columns count and items
 * @param {string} props.caseGradient - Fallback gradient for colored cards
 * @returns {JSX.Element} Cards grid with title
 * @example
 * <CardsBlock block={cardsData} caseGradient="from-blue-500 to-purple-500" />
 */
const COLS_CLASS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const;

const HIDDEN_STYLE: React.CSSProperties = { opacity: 0 };
const STAGGER_ANIMATION_BASE = {
  animationName: 'stagger-fade-in',
  animationDuration: '0.5s',
  animationTimingFunction: 'ease-out',
  animationFillMode: 'both',
} satisfies React.CSSProperties;

export function CardsBlock({ block, caseGradient }: CardsBlockProps) {
  const color = block.color;
  const isGradient = color?.type === 'gradient';
  const isSolid = color?.type === 'solid';
  const isPrimary = color?.type === 'primary';
  const isAccent = color?.type === 'accent';
  const gradientStops = color?.value ?? caseGradient;
  const cols = block.columns ?? 3;

  const [ref, hasAnimated] = useViewportAnimation({ threshold: 0.1 });

  return (
    <div className="mx-auto max-w-4xl">
      {block.title && <h2 className="mb-8 text-2xl font-bold md:text-3xl">{block.title}</h2>}
      <div ref={ref} className={cn('grid gap-4 sm:gap-6', COLS_CLASS[cols])}>
        {block.items.map(({ title, description }, index) => (
          <div
            key={title}
            className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
            style={
              hasAnimated
                ? { ...STAGGER_ANIMATION_BASE, animationDelay: `${index * 80}ms` }
                : HIDDEN_STYLE
            }
          >
            {isGradient && (
              <div
                className={cn(
                  'mb-3 h-1.5 w-12 rounded-full bg-gradient-to-r transition-all duration-300 group-hover:w-16',
                  gradientStops
                )}
              />
            )}
            {(isSolid || isPrimary) && (
              <div className="mb-3 h-1.5 w-12 rounded-full bg-primary transition-all duration-300 group-hover:w-16" />
            )}
            {isAccent && (
              <div className="mb-3 h-1.5 w-12 rounded-full bg-accent transition-all duration-300 group-hover:w-16" />
            )}
            <h3 className="mb-2 font-semibold transition-colors duration-200 group-hover:text-primary">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
