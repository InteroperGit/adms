import { cn } from '@/libs/utils';

type Variant =
  | 'bg-to-muted'
  | 'muted-to-bg'
  | 'bg-to-dark'
  | 'dark-to-primary'
  | 'primary-to-muted'
  | 'muted-to-primary'
  | 'primary-to-bg'
  | 'muted-to-surface-dark';

type DividerShape = 'wave' | 'slant' | 'curve';

const VARIANTS: Record<Variant, { bg: string; fill: string }> = {
  'bg-to-muted': { bg: 'hsl(var(--background))', fill: 'hsl(var(--muted))' },
  'muted-to-bg': { bg: 'hsl(var(--muted))', fill: 'hsl(var(--background))' },
  'bg-to-dark': { bg: 'hsl(var(--background))', fill: 'hsl(var(--foreground))' },
  'dark-to-primary': { bg: 'hsl(var(--foreground))', fill: 'hsl(var(--primary))' },
  'primary-to-muted': { bg: 'hsl(var(--primary))', fill: 'hsl(var(--muted))' },
  'muted-to-primary': { bg: 'hsl(var(--muted))', fill: 'hsl(var(--primary))' },
  'primary-to-bg': { bg: 'hsl(var(--primary))', fill: 'hsl(var(--background))' },
  'muted-to-surface-dark': {
    bg: 'hsl(var(--muted))',
    fill: 'hsl(var(--surface-dark, var(--foreground)))',
  },
};

const SHAPES: Record<DividerShape, string> = {
  wave: 'M0,32 C480,64 960,0 1440,32 L1440,64 L0,64 Z',
  slant: 'M0,64 L1440,0 L1440,64 Z',
  curve: 'M0,48 Q720,0 1440,48 L1440,64 L0,64 Z',
};

interface SectionDividerProps {
  variant: Variant;
  /** Shape of the divider: wave, slant, or curve */
  shape?: DividerShape;
  /** Mirror the divider horizontally for visual variety */
  flipX?: boolean;
  className?: string;
}

/**
 * @component
 * @description Decorative SVG divider between sections with configurable shape, color gradient, and orientation
 * @param {SectionDividerProps} props
 * @param {Variant} props.variant - Predefined gradient variant (e.g., 'bg-to-muted', 'primary-to-bg')
 * @param {DividerShape} [props.shape='wave'] - SVG path shape: 'wave' (curved), 'slant' (diagonal), 'curve' (gentle arc)
 * @param {boolean} [props.flipX=false] - Flip divider horizontally for variety
 * @param {string} [props.className] - Additional classes
 * @returns {JSX.Element} Div with SVG divider using semantic color tokens
 * @example
 * <SectionDivider variant="bg-to-muted" shape="wave" flipX />
 * <SectionDivider variant="muted-to-primary" shape="slant" />
 */
export function SectionDivider({
  variant,
  shape = 'wave',
  flipX = false,
  className,
}: SectionDividerProps) {
  const { bg, fill } = VARIANTS[variant];
  const path = SHAPES[shape];

  return (
    <div aria-hidden="true" className={cn('h-16 w-full', className)} style={{ background: bg }}>
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className={cn('h-full w-full', flipX && '-scale-x-100')}
        xmlns="http://www.w3.org/2000/svg"
        data-testid="section-divider-svg"
      >
        <path d={path} fill={fill} />
      </svg>
    </div>
  );
}
