// components/portfolio/PortfolioItem.tsx
"use client"

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {ProjectPreview} from "@/types/project";

interface PortfolioItemProps {
    /**
     * Данные проекта
     */
    project: ProjectPreview;

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

/**
 * PortfolioItem - Карточка проекта в портфолио.
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
 *   project={item}
 *   className="custom-shadow"
 *   basePath="/projects"
 *   enableHoverEffects={false}
 * />
 */
export const PortfolioCard = ({
                                  project,
                                  index = 0,
                                  className,
                                  basePath = "/portfolio",
                                  enableHoverEffects = true,
                              }: PortfolioItemProps) => {
    return (
        <div
            key={project.id}
            className={cn(
                "group relative overflow-hidden rounded-lg shadow-md",
                "transition-all duration-300 h-full flex flex-col project-card",
                enableHoverEffects && "hover:shadow-xl",
                className
            )}
        >
            <Link
                href={`${basePath}/${project.id}`}
                className="flex-1 flex flex-col"
                aria-label={`Посмотреть проект ${project.title}`}
            >
                {/* Область изображения */}
                <div className={cn(
                    "aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-800 overflow-hidden flex-1"
                )}>
                    <Image
                        src={project.imageUrl}
                        alt={`Проект: ${project.title}`}
                        width={800}
                        height={600}
                        className={cn(
                            "object-cover w-full h-full transition-transform duration-500",
                            enableHoverEffects && "group-hover:scale-105"
                        )}
                        priority={index < 6}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                {/* Overlay с деталями (появляется при наведении) */}
                {enableHoverEffects && (
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        "flex items-end p-6 pointer-events-none"
                    )}>
                        <div className={cn(
                            "transform translate-y-4 group-hover:translate-y-0",
                            "transition-transform duration-300 w-full"
                        )}>
                            <h3 className={cn("text-white text-xl font-bold mb-1")}>
                                {project.title}
                            </h3>
                            <p className={cn("text-orange-200 text-sm")}>
                                {project.client} • {project.year}
                            </p>
                        </div>
                    </div>
                )}

                {/* Нижняя панель с информацией */}
                <div className={cn(
                    "p-4 bg-white dark:bg-gray-800",
                    "border-t border-gray-100 dark:border-gray-700"
                )}>
                    <h3 className={cn("font-bold line-clamp-1")}>
                        {project.title}
                    </h3>
                    <div className={cn("flex justify-between items-center mt-2")}>
                        <span className={cn(
                            "text-sm px-2 py-1 rounded",
                            "bg-orange-100 dark:bg-orange-900/30",
                            "text-orange-800 dark:text-orange-200"
                        )}>
                            {project.category?.name}
                        </span>
                        <span className={cn("text-sm text-gray-500 dark:text-gray-400")}>
                          {project.year}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};