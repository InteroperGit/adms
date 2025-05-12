"use client"

import Link from "next/link";
import { cn } from "@/libs/utils";
import {Article} from "@/types/article";
import ContentImage from "@/components/image/ContentImage";
import {JSX} from "react";

/**
 * Форматирует дату публикации статьи в виде "полное название месяца, год".
 *
 * @param articleDate - строка даты (ISO 8601) из projectArticle.publishAt.
 * @param locale - локаль для форматирования (по умолчанию 'ru-RU').
 * @returns отформатированная строка, например: "апрель 2024".
 */
export const formatArticleDate = (articleDate?: string, locale: string = 'ru-RU'): string => {
    if (!articleDate) {
        return "";
    }

    const date = new Date(articleDate);

    if (isNaN(date.getTime())) {
        throw new Error(`Некорректная дата: ${articleDate}`);
    }

    return date.toLocaleDateString(locale, {
        month: 'long',
        year: 'numeric',
    });
}

interface PortfolioItemProps {
    /**
     * Данные проекта
     */
    item: Article;

    /**
     * Индекс элемента в списке (для оптимизации загрузки изображений)
     */
    index?: number;

    /**
     * Дополнительные классы для контейнера
     */
    className?: string;

    /**
     * Базовый путь для ссылки
     * @default "/portfolio"
     */
    basePath?: string;

    /**
     * Включить hover-эффекты
     * @default true
     */
    enableHoverEffects?: boolean;
}

// Компонент области изображения
const ImageSection = ({
                          image,
                          index,
                          enableHoverEffects,
                      }: {
    image: Article["cover"];
    index: number;
    enableHoverEffects: boolean;
}): JSX.Element => {
    return (
        <div className="basis-2/3 overflow-hidden flex items-center justify-center">
            <ContentImage
                image={image}
                priority={index < 6}
                className={cn(
                    "object-contain w-full h-full transition-transform duration-500",
                    enableHoverEffects && "group-hover:scale-105"
                )}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    );
}

// Оверлей с деталями
const OverlayDetails = ({
                            title,
                            articleDate,
                        }: {
    title: string;
    articleDate: string;
}): JSX.Element => {
    return (
        <div
            className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                "flex items-end p-6 pointer-events-none"
            )}
        >
            <div
                className={cn(
                    "transform translate-y-4 group-hover:translate-y-0",
                    "transition-transform duration-300 w-full"
                )}
            >
                <h3 className="text-white text-xl font-bold mb-1">{title}</h3>
                <p className="text-orange-200 text-sm">{articleDate}</p>
            </div>
        </div>
    );
}

// Нижняя секция информации
const InfoSection = ({
                         title,
                         description,
                         category,
                         articleDate,
                     }: {
    title: string;
    description: string;
    category?: string;
    articleDate: string;
}): JSX.Element => {
    return (
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-bold line-clamp-1">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{description}</p>
            <div className="flex justify-between items-center mt-2">
            <span
                className={cn(
                    "text-sm px-2 py-1 rounded",
                    "bg-orange-100 dark:bg-orange-900/30",
                    "text-orange-800 dark:text-orange-200"
                )}
            >
                {category}
            </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{articleDate}</span>
            </div>
        </div>
    );
}

/**
 * PortfolioItem - Карточка статьи.
 *
 * Отображает:
 * - Изображение проекта с hover-эффектом
 * - Название и клиента
 * - Категорию и год реализации
 * - Анимированные overlay-эффекты при наведении
 *
 * Особенности:
 * - Оптимизированная загрузка изображений (priority для первых элементов)
 * - Поддержка темной темы
 * - Адаптивный дизайн
 * - Анимации на CSS transitions
 * - Семантическая верстка
 *
 * @example
 * // Базовое использование
 * <PortfolioItem
 *   project={projectData}
 *   categories={categoriesList}
 *   index={index}
 * />
 *
 * @example
 * // С кастомизацией
 * <PortfolioItem
 *   item={item}
 *   index=0
 *   className="custom-shadow"
 *   basePath="/projects"
 *   enableHoverEffects={false}
 * />
 */
const ArticleCard = ({
                                  item,
                                  index = 0,
                                  className,
                                  basePath = "/portfolio",
                                  enableHoverEffects = true,
                              }: PortfolioItemProps): JSX.Element => {

    const projectUrl = `${basePath}/${item.slug}`
    const articleDate = formatArticleDate(item.publishedAt);

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-lg shadow-md",
                "transition-all duration-300 h-full flex flex-col project-card",
                "border border-gray-150",
                enableHoverEffects && "hover:shadow-xl",
                className
            )}
        >
            <Link
                href={`${projectUrl}`}
                className="flex-1 flex flex-col"
                aria-label={`Посмотреть проект ${item.title}`}
            >
                {/* Область изображения */}
                <ImageSection
                    image={item.cover}
                    index={index}
                    enableHoverEffects={enableHoverEffects}
                />

                {/* Overlay с деталями (появляется при наведении) */}
                {enableHoverEffects && (
                    <OverlayDetails
                        title={item.title}
                        articleDate={articleDate}
                    />
                )}

                {/* Нижняя панель с информацией */}
                <InfoSection
                    title={item.title}
                    description={item.description}
                    category={item.category?.title}
                    articleDate={articleDate}
                />
            </Link>
        </div>
    );
};

export default ArticleCard;