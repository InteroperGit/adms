import { cn } from '@/lib/utils';

export function SkipToContent({ contentAnchor }: { contentAnchor: string }) {
  return (
    <a
      href={contentAnchor}
      className={cn(
        'sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100',
        'focus:rounded-lg focus:bg-background focus:px-4 focus:py-2',
        'focus:text-sm focus:font-medium focus:text-primary',
        'focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary'
      )}
    >
      Перейти к содержимому
    </a>
  );
}
