"use client"

import { cn } from "@/libs/utils"
import {Article} from "@/types/article";
import {ArticleCard} from "@/components/cards/ArticleCard";

const DEFAULT_MAX_ITEMS: number = 10;

interface NewsSectionProps {
    /**
     * Массив новостных статей для отображения
     */
    news: Article[]
    /**
     * Заголовок секции
     * @default "Новости и статьи"
     */
    title?: string
    /**
     * Конфигурация колонок для разных разрешений экрана
     * @default {
     *   mobile: 1,
     *   tablet: 2,
     *   desktop: 3
     * }
     */
    columns?: {
        mobile?: 1 | 2
        tablet?: 2 | 3
        desktop?: 3 | 4
    }
    /**
     * Отступы между карточками
     * @default "gap-6 md:gap-8"
     */
    gap?: string
    /**
     * Максимальное количество отображаемых статей (опционально)
     */
    maxItems?: number
    /**
     * Дополнительные классы для контейнера
     */
    className?: string
}

/**
 * NewsSection - Секция с сеткой новостных статей.
 *
 * Компонент отображает:
 * - Заголовок и описание секции
 * - Адаптивную сетку карточек статей (ArticleCard)
 * - Автоматическую обрезку по maxItems при необходимости
 *
 * Особенности:
 * - Полностью адаптивный дизайн
 * - Поддержка темной темы
 * - Гибкая настройка количества колонок
 * - Оптимизированная загрузка изображений
 * - Ограничение количества статей
 *
 * @example
 * // Базовое использование
 * <NewsSection articles={newsData} />
 *
 * @example
 * // С кастомизацией
 * <NewsSection
 *   title="Последние новости"
 *   description="Свежие статьи и события компании"
 *   articles={articles}
 *   columns={{
 *     mobile: 1,
 *     tablet: 2,
 *     desktop: 4
 *   }}
 *   gap="gap-4 md:gap-6"
 *   maxItems={6}
 *   className="my-16"
 * />
 */
export default function NewsSection({
                                news,
                                title = "Новости и статьи",
                                columns = {
                                    mobile: 1,
                                    tablet: 2,
                                    desktop: 3
                                },
                                gap = "gap-6 md:gap-8",
                                maxItems = DEFAULT_MAX_ITEMS,
                                className,
                            }: NewsSectionProps) {
    // Обрезаем массив если указан maxItems
    const displayedNews = news.slice(0, maxItems);

    // Генерация классов для сетки
    const gridClasses = cn(
        "grid",
        `sm:grid-cols-${columns.mobile ?? 1}`,
        `md:grid-cols-${columns.tablet ?? 2}`,
        `lg:grid-cols-${columns.desktop ?? 3}`,
        gap
    )

    return (
        <section className={cn(className)}>
            {/* Заголовок секции */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
            </div>

            {/* Сетка статей */}
            {
                displayedNews.length > 0
                ? (
                    <div className={gridClasses}>
                        {displayedNews.map((article, index) => (
                            <ArticleCard
                                key={article.id}
                                item={article}
                                index={index}
                                basePath="/news"
                            />
                        ))}
                    </div>
                )
                : (
                    <div className="flex items-center justify-center p-6 bg-gray-100 text-gray-400">
                        <p className="text-lg font-semibold">События отсутствуют</p>
                    </div>
                )
            }

        </section>
    )
}