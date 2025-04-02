"use client"

import { ArticlePreviewCard } from "@/components/cards/ArticlePreviewCard"
import { cn } from "@/lib/utils"

interface NewsArticle {
    id: string
    title: string
    excerpt: string
    category: string
    date: string
    readTime: string
    imageUrl: string
    slug: string
}

interface NewsSectionProps {
    /**
     * Массив новостных статей для отображения
     */
    articles: NewsArticle[]
    /**
     * Заголовок секции
     * @default "Новости и статьи"
     */
    title?: string
    /**
     * Описание секции
     */
    description?: string
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
export const NewsSection = ({
                                articles,
                                title = "Новости и статьи",
                                description,
                                columns = {
                                    mobile: 1,
                                    tablet: 2,
                                    desktop: 3
                                },
                                gap = "gap-6 md:gap-8",
                                maxItems,
                                className,
                            }: NewsSectionProps) => {
    // Обрезаем массив если указан maxItems
    const displayedArticles = maxItems ? articles.slice(0, maxItems) : articles

    // Генерация классов для сетки
    const gridClasses = cn(
        "grid",
        `grid-cols-${columns.mobile ?? 1}`,
        `sm:grid-cols-${columns.tablet ?? 2}`,
        `lg:grid-cols-${columns.desktop ?? 3}`,
        gap
    )

    return (
        <section className={cn("container mx-auto px-4 py-12", className)}>
            {/* Заголовок секции */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{title}</h2>
                {description && (
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {description}
                    </p>
                )}
            </div>

            {/* Сетка статей */}
            <div className={gridClasses}>
                {displayedArticles.map((article, index) => (
                    <ArticlePreviewCard
                        key={article.id}
                        article={article}
                        priority={index < 3} // Приоритетная загрузка первых 3 изображений
                    />
                ))}
            </div>
        </section>
    )
}