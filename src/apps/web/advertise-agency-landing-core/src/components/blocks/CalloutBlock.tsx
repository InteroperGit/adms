import { cn } from '@/libs/utils';
import { ICON_MAP } from '@/types/shared/iconMap';
import type { CalloutBlock as CalloutBlockData } from '@/types/portfolio/blocks';

interface CalloutBlockProps {
  block: CalloutBlockData;
}

/**
 * @component
 * @description Styled callout/alert box with info, success, warning or note styling and optional icon
 * @param {CalloutBlockProps} props
 * @param {CalloutBlockData} props.block - Callout data with type, title and text
 * @returns {JSX.Element} Colored box with left border and icon
 * @example
 * <CalloutBlock block={{ type: "warning", title: "Important", text: "Please note this." }} />
 */
const TYPE_CONFIG = {
  info: {
    border: 'border-blue-400',
    bg: 'bg-blue-50 dark:bg-neutral-900',
    icon: 'Info',
    iconClass: 'text-blue-500 dark:text-blue-400',
    titleClass: 'text-blue-900 dark:text-blue-200',
    textClass: 'text-blue-800 dark:text-blue-300',
  },
  success: {
    border: 'border-green-400',
    bg: 'bg-green-50 dark:bg-neutral-900',
    icon: 'CheckCircle',
    iconClass: 'text-green-500 dark:text-green-400',
    titleClass: 'text-green-900 dark:text-green-200',
    textClass: 'text-green-800 dark:text-green-300',
  },
  warning: {
    border: 'border-amber-400',
    bg: 'bg-amber-50 dark:bg-neutral-900',
    icon: 'AlertTriangle',
    iconClass: 'text-amber-500 dark:text-amber-400',
    titleClass: 'text-amber-900 dark:text-amber-200',
    textClass: 'text-amber-800 dark:text-amber-300',
  },
  note: {
    border: 'border-border',
    bg: 'bg-muted/50 dark:bg-neutral-900',
    icon: 'StickyNote',
    iconClass: 'text-muted-foreground dark:text-neutral-400',
    titleClass: 'text-foreground dark:text-white',
    textClass: 'text-muted-foreground dark:text-neutral-300',
  },
} as const;

export function CalloutBlock({ block }: CalloutBlockProps) {
  const cfg = TYPE_CONFIG[block.type];
  const Icon = ICON_MAP[cfg.icon];

  return (
    <div className={cn('mx-auto max-w-3xl rounded-r-xl border-l-4 px-5 py-4', cfg.border, cfg.bg)}>
      <div className="flex gap-3">
        {Icon && <Icon size={20} className={cn('mt-0.5 shrink-0', cfg.iconClass)} />}
        <div>
          {block.title && <p className={cn('mb-1 font-semibold', cfg.titleClass)}>{block.title}</p>}
          <p className={cn('text-sm leading-relaxed', cfg.textClass)}>{block.text}</p>
        </div>
      </div>
    </div>
  );
}
