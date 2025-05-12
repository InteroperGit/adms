"use client";

import Link from "next/link";
import { cn } from "@/libs/utils";
import { ServiceCategory } from "@/types/service";
import {JSX} from "react";

interface ServiceCategoryFilterProps {
    categories: ServiceCategory[];
    activeCategory: string;
    className?: string;
}

const CONTAINER_CLASSES = "flex flex-wrap justify-center gap-2 md:gap-4 mb-12";

/**
 * ServiceCategoryFilter - Фильтр категорий услуг на основе ссылок.
 *
 * Используется для навигации по категориям через URL.
 *
 * Особенности:
 * - Поддержка активной категории
 * - Адаптивный дизайн
 * - Ссылки вместо кнопок
 *
 * @param {ServiceCategory[]} categories - Категории услуг
 * @param {string} activeCategory - Текущий активный slug (или name)
 * @param {string} [className] - Кастомные классы для обёртки
 */
const ServiceCategoryFilter: React.FC<ServiceCategoryFilterProps> = ({
                                   categories,
                                   activeCategory,
                                   className,
                               }: ServiceCategoryFilterProps): JSX.Element => {
    return (
        <div className={cn(CONTAINER_CLASSES, className)}>
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={category.href || "#"}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm md:text-base transition-colors duration-200",
                        activeCategory === category.name
                            ? "bg-orange-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                >
                    {category.title}
                </Link>
            ))}
        </div>
    );
};

export default ServiceCategoryFilter;
