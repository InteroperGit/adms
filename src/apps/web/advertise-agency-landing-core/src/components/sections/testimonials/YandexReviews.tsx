interface YandexReviewsProps {
  orgId: string;
}

export function YandexReviews({ orgId }: YandexReviewsProps) {
  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl sm:shadow-xl">
      <iframe
        src={`https://yandex.ru/maps-reviews-widget/${orgId}?comments`}
        title="Отзывы на Яндекс.Картах"
        width="100%"
        height="650"
        style={{ border: 'none', display: 'block' }}
        allowFullScreen
      />
    </div>
  );
}
