"use client"

import {cn} from "@/libs/utils";

interface YandexReviewsProps {
    /** Идентификатор организации в Яндекс */
    orgId: string;
    className?: string;
}

/**
 * Компонент YandexReviews отображает iframe с отзывами из Яндекс.Карт
 */
export const YandexReviews = ({ orgId, className }: YandexReviewsProps) => {
    return (
        <div className={cn(className ? className : "w-full max-w-5xl mx-auto p-4")}>
            <iframe
                src={`https://yandex.ru/maps-reviews-widget/${orgId}?comments`}
                width="100%"
                height="1200px"
                style={{ border: "none", overflow: "hidden" }}
                title="Отзывы на Яндексе"
                loading="lazy"
                className="rounded-xl border-0 shadow"
            />
        </div>
    )
}
