// components/ui/LoadingMoreButton.tsx
"use client"

import { cn } from "@/libs/utils";
import { ReactNode } from "react";

interface LoadingMoreButtonProps {
    /**
     * Флаг состояния загрузки
     * - При true отображает индикатор загрузки
     * - При false показывает основной текст кнопки
     */
    isLoading: boolean;

    /**
     * Обработчик клика по кнопке
     */
    onClick: () => void;

    /**
     * Флаг неактивного состояния
     * - Блокирует взаимодействие с кнопкой
     * - Добавляет соответствующие стили
     */
    disabled?: boolean;

    /**
     * Основной текст кнопки (отображается когда не isLoading)
     * @default "Показать еще"
     */
    children?: ReactNode;

    /**
     * Текст во время загрузки (отображается когда isLoading)
     * @default "Загрузка..."
     */
    loadingText?: string;

    /**
     * Дополнительные классы для кастомизации стилей
     */
    className?: string;

    /**
     * Размер индикатора загрузки (в пикселях)
     * @default 20 (h-5 w-5 в Tailwind)
     */
    spinnerSize?: number;
}

/**
 * LoadingMoreButton - Интерактивная кнопка для подгрузки контента.
 *
 * Компонент используется для:
 * - Пагинации
 * - Ленивой загрузки
 * - Подгрузки дополнительных данных
 *
 * Особенности:
 * - Встроенный индикатор загрузки
 * - Поддержка темной темы через Tailwind
 * - Гибкая кастомизация текстов
 * - Анимации перехода состояний
 * - Оптимизированная доступность
 *
 * @example
 * // Базовое использование
 * <LoadingMoreButton
 *   isLoading={isLoading}
 *   onClick={loadMore}
 * />
 *
 * @example
 * // Полная кастомизация
 * <LoadingMoreButton
 *   isLoading={isFetching}
 *   onClick={handleLoad}
 *   disabled={!hasMore}
 *   loadingText="Идет загрузка..."
 *   className="my-4"
 *   spinnerSize={24}
 * >
 *   Загрузить больше
 * </LoadingMoreButton>
 */
export const LoadingMoreButton = ({
                                      isLoading,
                                      onClick,
                                      disabled = false,
                                      children = "Показать еще",
                                      loadingText = "Загрузка...",
                                      className,
                                      spinnerSize = 20,
                                  }: LoadingMoreButtonProps) => {
    // Рассчитываем классы для индикатора загрузки на основе размера
    const spinnerClass = `animate-spin rounded-full border-t-2 border-b-2 border-white`;

    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
            className={cn(
                "px-8 py-3 rounded-full font-medium",
                "bg-orange-600 text-white hover:bg-orange-700",
                "transition-colors duration-200 relative",
                "flex items-center justify-center mx-auto",
                "min-w-[200px]",
                "disabled:opacity-70 disabled:cursor-not-allowed",
                className
            )}
        >
            {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2">{loadingText}</span>
                  <div
                      className={cn(spinnerClass)}
                      style={{
                          width: `${spinnerSize}px`,
                          height: `${spinnerSize}px`,
                      }}
                  />
                </span>
            ) : (
                children
            )}
        </button>
    );
};