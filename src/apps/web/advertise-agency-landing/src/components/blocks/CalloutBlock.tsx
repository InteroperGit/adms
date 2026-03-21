import { cn } from '@/libs/utils';
import { ICON_MAP } from '@/types/shared/iconMap';
import type { CalloutBlock as CalloutBlockData } from '@/types/blocks';

interface CalloutBlockProps {
  block: CalloutBlockData;
}

interface CalloutConfig {
  wrapper: string;
  iconName: string;
  iconSize: number;
  iconClass: string;
  titleClass: string;
  textClass: string;
  /** Render three decorative dot accents (used for the success variant only). */
  dots?: true;
}

const CONFIGS: Record<string, CalloutConfig> = {
  success: {
    wrapper: cn(
      'relative mx-auto max-w-3xl overflow-hidden rounded-xl px-5 py-4',
      'border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50/50',
      'dark:border-green-900 dark:from-neutral-900 dark:to-neutral-900'
    ),
    iconName: 'CheckCircle',
    iconSize: 22,
    iconClass: 'mt-0.5 shrink-0 text-green-500 dark:text-green-400',
    titleClass: 'mb-1 font-semibold text-green-900 dark:text-green-200',
    textClass: 'text-sm leading-relaxed text-green-800 dark:text-green-300',
    dots: true,
  },
  info: {
    wrapper: cn(
      'mx-auto max-w-3xl rounded-xl px-5 py-4 shadow-sm',
      'border border-blue-400 bg-blue-50 dark:bg-neutral-900'
    ),
    iconName: 'Info',
    iconSize: 20,
    iconClass: 'mt-0.5 shrink-0 text-blue-500 dark:text-blue-400',
    titleClass: 'mb-1 font-semibold text-blue-900 dark:text-blue-200',
    textClass: 'text-sm leading-relaxed text-blue-800 dark:text-blue-300',
  },
  note: {
    wrapper: cn(
      'mx-auto max-w-3xl rounded-r-xl px-5 py-4',
      'border-l-4 border-dashed border-border bg-muted/50 dark:bg-neutral-900'
    ),
    iconName: 'StickyNote',
    iconSize: 20,
    iconClass: 'mt-0.5 shrink-0 text-muted-foreground dark:text-neutral-400',
    titleClass: 'mb-1 font-semibold text-foreground dark:text-white',
    textClass: 'text-sm leading-relaxed text-muted-foreground dark:text-neutral-300',
  },
  warning: {
    wrapper: cn(
      'mx-auto max-w-3xl rounded-r-xl px-5 py-4',
      'border-l-4 border-amber-400 bg-amber-50 dark:bg-neutral-900'
    ),
    iconName: 'AlertTriangle',
    iconSize: 20,
    iconClass: 'mt-0.5 shrink-0 text-amber-500 dark:text-amber-400',
    titleClass: 'mb-1 font-semibold text-amber-900 dark:text-amber-200',
    textClass: 'text-sm leading-relaxed text-amber-800 dark:text-amber-300',
  },
};

/**
 * @component
 * @description Styled callout/alert box. Dispatches to one of four visual variants based on
 * `block.type`. All variants share the same structure: wrapper → optional decorative dots
 * (success only) → icon + title + text. Color tokens, icon, and border style differ per variant.
 *
 * | type      | appearance                                              |
 * |-----------|--------------------------------------------------------|
 * | `success` | Green gradient, checkmark icon, decorative dot accents |
 * | `info`    | Blue border + bg, info icon                            |
 * | `note`    | Dashed left border, neutral bg, sticky-note icon       |
 * | `warning` | Amber left border + bg, triangle alert icon (default) |
 *
 * @param {CalloutBlockProps} props
 * @param {CalloutBlockData} props.block - Callout data with `type`, optional `title`, and `text`
 * @returns {JSX.Element} Colored callout box with icon and optional title
 * @example
 * <CalloutBlock block={{ type: "warning", title: "Important", text: "Please note this." }} />
 */
export function CalloutBlock({ block }: CalloutBlockProps) {
  const cfg = CONFIGS[block.type] ?? CONFIGS.warning;
  const Icon = ICON_MAP[cfg.iconName];

  return (
    <div className={cfg.wrapper}>
      {cfg.dots && (
        <>
          <div
            className="pointer-events-none absolute right-3 top-3 h-2 w-2 rounded-full bg-green-300/40"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-3 right-8 h-1.5 w-1.5 rounded-full bg-green-300/40"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-4 left-4 h-1 w-1 rounded-full bg-emerald-300/40"
            aria-hidden="true"
          />
        </>
      )}
      <div className="flex gap-3">
        {Icon && <Icon size={cfg.iconSize} className={cfg.iconClass} />}
        <div>
          {block.title && <p className={cfg.titleClass}>{block.title}</p>}
          <p className={cfg.textClass}>{block.text}</p>
        </div>
      </div>
    </div>
  );
}
