"use client"

import React, {JSX} from "react"
import {cn} from "@/libs/utils";

interface GoogleReviewsProps {
    companySrc: string;
    className?: string;
}

/**
 * GoogleReviews — компонент для отображения отзывов о компании с использованием
 * Google Reviews. Он встраивает внешний iframe с отзывами, предоставляя пользователю
 * возможность просматривать рейтинг и отзывы.
 *
 * Основные особенности:
 * 1. Компонент принимает `companySrc`, который является ссылкой на страницу отзывов
 *    компании на Google.
 * 2. Поддерживает возможность кастомизации внешнего вида через `className`.
 * 3. Встроенный iframe с отзывами компании, который поддерживает адаптивность по
 *    ширине и фиксированную высоту.
 * 4. Обеспечивает безопасность загрузки с настройкой `referrerPolicy` и `loading="lazy"`,
 *    что улучшает производительность.
 *
 * Этот компонент полезен для встраивания отзывов о компании на сайт, позволяя
 * пользователям быстро ознакомиться с множеством отзывов в одном месте.
 */
const GoogleReviews: React.FC<GoogleReviewsProps> = ({ companySrc, className }: GoogleReviewsProps): JSX.Element => {
    return (
        <div className={cn(className ? className : "w-full max-w-5xl mx-auto p-4")}>
            <iframe
                src={`${companySrc}`}
                width="100%"
                height="1200"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl border-0 shadow"
            />
        </div>
    )
}

export default GoogleReviews;
