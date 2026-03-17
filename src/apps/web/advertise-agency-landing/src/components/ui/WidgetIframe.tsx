import { cn, DARK_IFRAME_FILTER } from '@/libs/utils';

interface YandexIframeProps {
  /**
   * The iframe source URL
   */
  src: string;
  /**
   * Iframe title attribute for accessibility
   */
  title: string;
  /**
   * Iframe height in pixels
   */
  height: number;
  /**
   * Whether dark mode is active; applies color inversion filters
   */
  isDark: boolean;
  /**
   * Optional CSS classes for the wrapper div
   */
  className?: string;
  /**
   * Iframe loading strategy; defaults to 'eager'
   */
  loading?: 'lazy' | 'eager';
}

/**
 * @component
 * @description Renders a common embed iframe (maps, reviews widget) with dark mode support and accessibility features. Applies color inversion filters and rounded borders.
 * @param {YandexIframeProps} props
 * @param {string} props.src - Iframe source URL (Yandex Maps or reviews widget URL)
 * @param {string} props.title - Iframe title for accessibility
 * @param {number} props.height - Iframe height in pixels
 * @param {boolean} props.isDark - Whether dark mode is active
 * @param {string} [props.className] - Optional wrapper classes
 * @param {'lazy' | 'eager'} [props.loading] - Iframe loading strategy (defaults to 'eager')
 * @returns {JSX.Element} Iframe wrapper with dark mode support and proper accessibility
 * @example <caption>Yandex reviews widget with lazy loading</caption>
 * <YandexIframe src="https://yandex.ru/maps-reviews-widget/..." title="Yandex.Maps reviews" height={650} isDark={true} loading="lazy" />
 */
export function WidgetIframe({
  src,
  title,
  height,
  isDark,
  className,
  loading = 'eager',
}: YandexIframeProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl',
        className,
        isDark ? 'border border-primary' : 'sm:shadow-lg'
      )}
    >
      <iframe
        src={src}
        title={title}
        width="100%"
        height={height}
        style={{
          border: 'none',
          display: 'block',
          filter: isDark ? DARK_IFRAME_FILTER : 'none',
        }}
        loading={loading}
        allowFullScreen
      />
    </div>
  );
}
