import { cn } from '@/lib/utils';

interface ContactMapProps {
  url: string;
  className?: string;
  isDark?: boolean;
}

/**
 * @component
 * @description Embeds a Yandex Maps iframe with optional dark mode styling (color inversion). Used in contact section to show business location.
 * @param {ContactMapProps} props
 * @param {string} props.url - Yandex Maps embed URL
 * @param {string} [props.className] - Optional CSS classes for styling
 * @param {boolean} [props.isDark] - Whether dark mode is active; applies color inversion filters
 * @returns {JSX.Element} Iframe wrapper with rounded borders and optional dark theme filters
 * @example <caption>Embedded map with dark mode</caption>
 * <ContactMap url="https://yandex.com/maps/..." isDark={true} className="mt-6" />
 */
export function ContactMap({ url, className, isDark }: ContactMapProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl',
        className,
        isDark ? 'border border-primary' : 'sm:shadow-lg'
      )}
    >
      <iframe
        src={url}
        title="Мы на карте"
        width="100%"
        height="360"
        style={{
          border: 'none',
          display: 'block',
          filter: isDark
            ? 'invert(1) hue-rotate(180deg) saturate(1.6) brightness(1.1) contrast(1.05)'
            : 'none',
        }}
        allowFullScreen
      />
    </div>
  );
}
