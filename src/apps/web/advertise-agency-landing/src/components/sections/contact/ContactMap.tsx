import { WidgetIframe } from '@/components/ui/WidgetIframe.tsx';

interface ContactMapProps {
  url: string;
  title: string;
  className?: string;
  isDark?: boolean;
}

/**
 * @component
 * @description Embeds a Yandex Maps iframe with optional dark mode styling (color inversion). Used in contact section to show business location.
 * @param {ContactMapProps} props
 * @param {string} props.url - Yandex Maps embed URL
 * @param {string} props.title - Iframe title attribute for accessibility
 * @param {string} [props.className] - Optional CSS classes for styling
 * @param {boolean} [props.isDark] - Whether dark mode is active; applies color inversion filters
 * @returns {JSX.Element} Iframe wrapper with rounded borders and optional dark theme filters
 * @example <caption>Embedded map with dark mode</caption>
 * <ContactMap url="https://yandex.com/maps/..." title="Our location" isDark={true} className="mt-6" />
 */
export function ContactMap({ url, title, className, isDark = false }: ContactMapProps) {
  return (
    <WidgetIframe
      src={url}
      title={title}
      height={360}
      isDark={isDark}
      className={className}
      loading="lazy"
    />
  );
}
