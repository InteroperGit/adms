import { ICON_MAP } from '@/types/shared/iconMap';
import type { CalloutBlock as CalloutBlockData } from '@/types/blocks';

interface CalloutBlockProps {
  block: CalloutBlockData;
}

interface CalloutContentProps {
  title?: string;
  text: string;
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

function SuccessCallout({ title, text }: CalloutContentProps) {
  const Icon = ICON_MAP['CheckCircle'];
  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50/50 px-5 py-4 dark:border-green-900 dark:from-neutral-900 dark:to-neutral-900">
      {/* Decorative sparkle dots */}
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
      <div className="flex gap-3">
        {Icon && <Icon size={22} className="mt-0.5 shrink-0 text-green-500 dark:text-green-400" />}
        <div>
          {title && (
            <p className="mb-1 font-semibold text-green-900 dark:text-green-200">{title}</p>
          )}
          <p className="text-sm leading-relaxed text-green-800 dark:text-green-300">{text}</p>
        </div>
      </div>
    </div>
  );
}

function InfoCallout({ title, text }: CalloutContentProps) {
  const Icon = ICON_MAP['Info'];
  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-blue-400 bg-blue-50 px-5 py-4 shadow-sm dark:bg-neutral-900">
      <div className="flex gap-3">
        {Icon && <Icon size={20} className="mt-0.5 shrink-0 text-blue-500 dark:text-blue-400" />}
        <div>
          {title && <p className="mb-1 font-semibold text-blue-900 dark:text-blue-200">{title}</p>}
          <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-300">{text}</p>
        </div>
      </div>
    </div>
  );
}

function NoteCallout({ title, text }: CalloutContentProps) {
  const Icon = ICON_MAP['StickyNote'];
  return (
    <div className="mx-auto max-w-3xl rounded-r-xl border-l-4 border-dashed border-border bg-muted/50 px-5 py-4 dark:bg-neutral-900">
      <div className="flex gap-3">
        {Icon && (
          <Icon size={20} className="mt-0.5 shrink-0 text-muted-foreground dark:text-neutral-400" />
        )}
        <div>
          {title && <p className="mb-1 font-semibold text-foreground dark:text-white">{title}</p>}
          <p className="text-sm leading-relaxed text-muted-foreground dark:text-neutral-300">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function WarningCallout({ title, text }: CalloutContentProps) {
  const Icon = ICON_MAP['AlertTriangle'];
  return (
    <div className="mx-auto max-w-3xl rounded-r-xl border-l-4 border-amber-400 bg-amber-50 px-5 py-4 dark:bg-neutral-900">
      <div className="flex gap-3">
        {Icon && <Icon size={20} className="mt-0.5 shrink-0 text-amber-500 dark:text-amber-400" />}
        <div>
          {title && (
            <p className="mb-1 font-semibold text-amber-900 dark:text-amber-200">{title}</p>
          )}
          <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300">{text}</p>
        </div>
      </div>
    </div>
  );
}

export function CalloutBlock({ block }: CalloutBlockProps) {
  const props = { title: block.title, text: block.text };
  switch (block.type) {
    case 'success':
      return <SuccessCallout {...props} />;
    case 'info':
      return <InfoCallout {...props} />;
    case 'note':
      return <NoteCallout {...props} />;
    default:
      return <WarningCallout {...props} />;
  }
}
