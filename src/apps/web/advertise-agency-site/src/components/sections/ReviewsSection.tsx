// components/sections/ReviewsSection.tsx
"use client"

import { YandexReviews } from "@/components/reviews/YandexReviews"
import { GoogleReviews } from "@/components/reviews/GoogleReviews"
import {cn} from "@/libs/utils";

interface ReviewsSectionProps {
    googleCompanySrc?: string;
    yandexCompanyId?: string;
    className?: string;
}

/**
 * ReviewsSection — секция с отзывами из Google и Яндекс.
 *
 * Компонент принимает ссылки и идентификаторы компаний и выводит два блока отзывов:
 * - Google отзывы в iframe через переданный `googleCompanySrc`
 * - Яндекс отзывы через виджет с использованием `yandexCompanyId`
 *
 * Особенности:
 * - Адаптивное поведение: на мобильных устройствах отзывы отображаются в колонку, на десктопе — в ряд
 * - Поддержка темной темы
 * - Минимальная ширина и гибкая адаптация ширины блоков
 *
 * @param googleCompanySrc - URL iframe с отзывами Google
 * @param yandexCompanyId - ID организации в Яндекс Справочнике
 * @param className CSS-классы
 *
 * @example
 * <ReviewsSection
 *   googleCompanySrc="https://www.google.com/maps/embed?pb=..."
 *   yandexCompanyId="123456789012"
 * />
 */
export const ReviewsSection = ({ googleCompanySrc, yandexCompanyId, className }: ReviewsSectionProps ) => {
    return (
        <section className={cn(className ? className : "w-full px-4 py-8 bg-white dark:bg-gray-900")}>
            <div className="m-4">
                <h2 className="text-2xl font-bold mb-4">Отзывы о нас</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-2 justify-center items-stretch">
                {
                    !!googleCompanySrc && (
                        <div className="w-full max-w-[700px]">
                            <GoogleReviews companySrc={googleCompanySrc} />
                        </div>
                    )
                }

                {
                    !!yandexCompanyId && (
                        <div className="w-full max-w-[700px]">
                            <YandexReviews orgId={yandexCompanyId} />
                        </div>
                    )
                }
            </div>
        </section>
    )
}
