import { cn } from '@/libs/utils';

/**
 * @component
 * @description Accessibility skip link hidden until focused, allowing keyboard users to jump to main content
 * @param {Object} props
 * @param {string} props.contentAnchor - URL anchor (e.g., "#main-content") to link to
 * @returns {JSX.Element} Screen-reader-only link, visible on focus
 * @example
 * <SkipToContent contentAnchor="#main-content" />
 */
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
