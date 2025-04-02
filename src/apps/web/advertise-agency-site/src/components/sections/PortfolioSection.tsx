// components/sections/PortfolioSection.tsx
"use client"

import { PortfolioCard } from "@/components/cards/PortfolioCard"
import { cn } from "@/lib/utils"
import {ProjectPreview} from "@/types/project";
import {Category} from "@/types/category";

interface PortfolioSectionProps {
    /**
     * Массив проектов для отображения
     */
    projects: ProjectPreview[]
    /**
     * Массив категорий для отображения меток
     */
    categories: Category[]
    /**
     * Заголовок секции
     * @default "Наши работы"
     */
    title?: string
    /**
     * Описание секции
     */
    description?: string
    /**
     * Количество колонок на разных экранах
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
     * Дополнительные классы для контейнера
     */
    className?: string
}

/**
 * PortfolioSection - Секция портфолио с сеткой проектов.
 *
 * Компонент отображает:
 * - Заголовок и описание секции
 * - Адаптивную сетку карточек проектов (PortfolioCard)
 *
 * Особенности:
 * - Полностью адаптивный дизайн
 * - Поддержка темной темы
 * - Гибкая настройка количества колонок
 * - Оптимизированная загрузка изображений
 * - Кастомизируемые отступы
 *
 * @example
 * // Базовое использование
 * <PortfolioSection
 *   projects={projectsData}
 *   categories={categoriesData}
 * />
 *
 * @example
 * // С кастомизацией
 * <PortfolioSection
 *   title="Реализованные проекты"
 *   description="Лучшие работы за 2024 год"
 *   projects={projects}
 *   categories={categories}
 *   columns={{
 *     mobile: 1,
 *     tablet: 3,
 *     desktop: 4
 *   }}
 *   gap="gap-4 md:gap-6 lg:gap-8"
 *   className="my-12"
 * />
 */
export const PortfolioSection = ({
                                     projects,
                                     categories,
                                     title = "Наши работы",
                                     description,
                                     columns = {
                                         mobile: 1,
                                         tablet: 2,
                                         desktop: 3
                                     },
                                     gap = "gap-6 md:gap-8",
                                     className,
                                 }: PortfolioSectionProps) => {
    // Генерация классов для сетки на основе пропсов
    const gridClasses = cn(
        "grid",
        `grid-cols-${columns.mobile ?? 1}`,
        `sm:grid-cols-${columns.tablet ?? 2}`,
        `lg:grid-cols-${columns.desktop ?? 3}`,
        gap
    )

    return (
        <section className={cn(className)}>
            {/* Заголовок секции */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
            </div>

            {/* Сетка проектов */}
            <div className={gridClasses}>
                {projects.map((project, index) => (
                    <PortfolioCard
                        key={project.id}
                        project={project}
                        categories={categories}
                        index={index}
                    />
                ))}
            </div>
        </section>
    )
}