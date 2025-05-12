"use client"

import {cn} from "@/libs/utils";
import React, {JSX} from "react";

interface YandexReviewsProps {
    /** Идентификатор организации в Яндекс */
    orgId: string;
    className?: string;
}

/**
 * YandexReviews — компонент для отображения отзывов о компании с использованием
 * виджета Яндекс.Карт. Он встраивает внешний iframe с отзывами, предоставляя
 * пользователю возможность просматривать рейтинг и отзывы.
 *
 * Основные особенности:
 * 1. Компонент принимает `orgId` — идентификатор организации в Яндекс.Картах,
 *    для генерации ссылки на страницу отзывов.
 * 2. Поддерживает возможность кастомизации внешнего вида через `className`.
 * 3. Встроенный iframe с отзывами компании, который поддерживает адаптивность по
 *    ширине и фиксированную высоту.
 * 4. Обеспечивает безопасность загрузки с настройкой `loading="lazy"`, что улучшает
 *    производительность.
 *
 * Этот компонент полезен для встраивания отзывов о компании с Яндекс.Карт на
 * сайт, позволяя пользователям ознакомиться с множеством отзывов в одном месте.
 */
const YandexReviews: React.FC<YandexReviewsProps> = ({ orgId, className }: YandexReviewsProps): JSX.Element => {
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

export default YandexReviews;
