import { cn } from '@/lib/utils';
import { ICON_MAP } from '@/types/shared/iconMap';
import type { CalloutBlock as CalloutBlockData } from '@/types/portfolio/blocks';

interface CalloutBlockProps {
  block: CalloutBlockData;
}

const TYPE_CONFIG = {
  info: {
    border: 'border-blue-400',
    bg: 'bg-blue-50',
    icon: 'Info',
    iconClass: 'text-blue-500',
    titleClass: 'text-blue-900',
    textClass: 'text-blue-800',
  },
  success: {
    border: 'border-green-400',
    bg: 'bg-green-50',
    icon: 'CheckCircle',
    iconClass: 'text-green-500',
    titleClass: 'text-green-900',
    textClass: 'text-green-800',
  },
  warning: {
    border: 'border-amber-400',
    bg: 'bg-amber-50',
    icon: 'AlertTriangle',
    iconClass: 'text-amber-500',
    titleClass: 'text-amber-900',
    textClass: 'text-amber-800',
  },
  note: {
    border: 'border-border',
    bg: 'bg-muted/50',
    icon: 'StickyNote',
    iconClass: 'text-muted-foreground',
    titleClass: 'text-foreground',
    textClass: 'text-muted-foreground',
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
