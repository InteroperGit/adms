import { cn } from '@/lib/utils';

type Variant =
  | 'white-to-muted'
  | 'muted-to-white'
  | 'white-to-dark'
  | 'dark-to-primary'
  | 'primary-to-muted';

const VARIANTS: Record<Variant, { bg: string; fill: string }> = {
  'white-to-muted': { bg: 'hsl(var(--background))', fill: 'hsl(var(--muted))' },
  'muted-to-white': { bg: 'hsl(var(--muted))', fill: 'hsl(var(--background))' },
  'white-to-dark': { bg: 'hsl(var(--background))', fill: 'hsl(var(--foreground))' },
  'dark-to-primary': { bg: 'hsl(var(--foreground))', fill: 'hsl(var(--primary))' },
  'primary-to-muted': { bg: 'hsl(var(--primary))', fill: 'hsl(var(--muted))' },
};

interface SectionDividerProps {
  variant: Variant;
  /** Mirror the wave horizontally for visual variety */
  flipX?: boolean;
  className?: string;
}

export function SectionDivider({ variant, flipX = false, className }: SectionDividerProps) {
  const { bg, fill } = VARIANTS[variant];
  return (
    <div aria-hidden="true" className={cn('h-16 w-full', className)} style={{ background: bg }}>
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className={cn('h-full w-full', flipX && '-scale-x-100')}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,32 C480,64 960,0 1440,32 L1440,64 L0,64 Z" fill={fill} />
      </svg>
    </div>
  );
}
