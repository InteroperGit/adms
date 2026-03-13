import {cn} from "@/lib/utils.ts";

interface YandexReviewsProps {
  orgId: string;
  isDark: boolean;
}

export function YandexReviews({ orgId, isDark }: YandexReviewsProps) {
  return (
    <div className={cn(
        "mx-auto max-w-3xl overflow-hidden rounded-2xl",
        isDark ? 'border border-primary' : 'sm:shadow-xl'
        )}>
      <iframe
        src={`https://yandex.ru/maps-reviews-widget/${orgId}?comments`}
        title="Отзывы на Яндекс.Картах"
        width="100%"
        height="650"
        style={{
            border: 'none',
            display: 'block',
            // Тёмная тема: инверсия + коррекция оттенка
            filter: isDark ? 'invert(1) hue-rotate(180deg) saturate(1.6) brightness(1.1) contrast(1.05)' : 'none',
        }}
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
