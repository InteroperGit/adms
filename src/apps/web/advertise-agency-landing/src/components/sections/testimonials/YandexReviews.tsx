import { WidgetIframe } from '@/components/ui/WidgetIframe.tsx';

interface YandexReviewsProps {
  orgId: string;
  title: string;
  isDark: boolean;
}

/**
 * @component
 * @description Embeds Yandex Maps reviews widget iframe with dark mode support. Applies color inversion filters for dark theme to maintain readability.
 * @param {YandexReviewsProps} props
 * @param {string} props.orgId - Yandex Maps organization ID for reviews widget
 * @param {string} props.title - Iframe title attribute for accessibility
 * @param {boolean} props.isDark - Whether dark mode is active; applies color filters and border styling
 * @returns {JSX.Element} Iframe wrapper with rounded borders containing Yandex reviews widget
 * @example <caption>Yandex reviews in dark mode</caption>
 * <YandexReviews orgId="12345678" title="Yandex.Maps reviews" isDark={true} />
 */
export function YandexReviews({ orgId, title, isDark }: YandexReviewsProps) {
  return (
    <WidgetIframe
      src={`https://yandex.ru/maps-reviews-widget/${orgId}?comments`}
      title={title}
      height={650}
      isDark={isDark}
      className="mx-auto max-w-3xl"
      loading="lazy"
    />
  );
}
