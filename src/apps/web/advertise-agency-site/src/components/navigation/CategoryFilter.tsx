"use client";

import { cn } from "@/libs/utils";
import { ServiceCategory } from "@/types/service";

// Новый параметр loading
interface CategoryFilterProps {
    categories: ServiceCategory[];
    activeCategory: string;
    onCategoryChange: (slug: string) => void;
    loading: boolean;
    className?: string;
}

const CONTAINER_CLASSES = "flex flex-wrap justify-center gap-2 md:gap-4 mb-12";
const SKELETON_ITEM_CLASSES = "w-32 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full";

function renderSkeletons() {
    return (
        <div className={cn(CONTAINER_CLASSES)}>
            <div className={cn(SKELETON_ITEM_CLASSES)} />
            <div className={cn(SKELETON_ITEM_CLASSES)} />
            <div className={cn(SKELETON_ITEM_CLASSES)} />
        </div>
    )
}

/**
 * CategoryFilter - Интерактивный компонент для фильтрации контента по категориям.
 *
 * Представляет собой горизонтальный список кнопок-категорий с возможностью выбора.
 * Применяется для фильтрации данных (например, в портфолио, каталоге или блоге).
 *
 * Основные особенности:
 * - Поддержка светлой/темной темы (через Tailwind dark: модификатор)
 * - Адаптивный дизайн (mobile-first)
 * - Анимация переключения состояний
 * - Кастомизация через className
 * - Интеграция с системой управления состоянием (внешний стейт)
 *
 * @param {Object[]} categories - Массив категорий для отображения
 * @param {number} categories[].id - Уникальный идентификатор категории
 * @param {string} categories[].name - Отображаемое название категории
 * @param {string} categories[].slug - Уникальный ключ категории (для сравнения)
 * @param {string} activeCategory - Текущая активная категория (сравнивается со slug)
 * @param {(slug: string) => void} onCategoryChange - Колбэк при изменении категории
 * @param {boolean} loading - Если true, показываем скелетон вместо контента
 * @param {string} [className] - Дополнительные CSS-классы для контейнера
 *
 * @example
 * // Базовое использование
 * <CategoryFilter
 *   categories={[{ id: 1, name: 'Все', slug: 'all' }, { id: 2, name: 'Дизайн', slug: 'design' }]}
 *   activeCategory="all"
 *   onCategoryChange={(slug) => setFilter(slug)}
 *   loading={isLoading}
 * />
 *
 * @example
 * // С кастомизацией стилей
 * <CategoryFilter
 *   categories={categories}
 *   activeCategory={currentCategory}
 *   onCategoryChange={handleChange}
 *   loading={isLoading}
 *   className="my-4 justify-start"
 * />
 */
const CategoryFilter = ({
                            categories,
                            activeCategory,
                            onCategoryChange,
                            loading,
                            className,
                        }: CategoryFilterProps) => {
    return loading
        ? renderSkeletons()
        : (
            <div className={cn(CONTAINER_CLASSES, className)}>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.name)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm md:text-base transition-colors duration-200",
                            activeCategory === category.name
                                ? "bg-orange-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                    >
                        {category.title}
                    </button>
                ))}
            </div>
        );
};

export default CategoryFilter;
