"use client"

import { cn } from "@/lib/utils";

interface HeroSectionProps {
    title: string;
    description: string;
    className?: string;
}

/**
 * HeroSection - Компонент для создания герой-секции (верхний блок страницы).
 *
 * Этот компонент представляет собой визуально выделенную секцию в верхней части страницы,
 * которая обычно содержит основной заголовок и краткое описание страницы или раздела.
 *
 * Особенности:
 * - Поддерживает светлую и темную тему
 * - Адаптивный дизайн (mobile-first)
 * - Центрированное текстовое содержимое
 * - Возможность кастомизации через className
 *
 * @param {string} title - Основной заголовок секции (h1)
 * @param {string} description - Описание под заголовком
 * @param {string} [className] - Дополнительные CSS-классы для кастомизации
 *
 * Пример использования:
 * @example
 * <HeroSection
 *   title="Наши работы"
 *   description="Лучшие проекты за последние годы"
 *   className="mb-10"
 * />
 */
export default function HeroSection({
                                title,
                                description,
                                className,
                            }: HeroSectionProps) {
    return (
        <section className={cn(
            "relative bg-orange-50 dark:bg-orange-900/20 py-20 px-6",
            className
        )}>
            <div className="container mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
                <p className="text-xl max-w-2xl mx-auto">{description}</p>
            </div>
        </section>
    );
};