// components/cards/SpecialServiceCard.tsx
"use client"

import { cn } from "@/libs/utils"
import {SpecialServiceItem} from "@/types/service";
import Link from "next/link";

interface SpecialServiceCardProps {
    /**
     * Данные услуги для отображения
     */
    service: SpecialServiceItem
    /**
     * Уникальный ключ элемента в списке
     */
    index: number
    /**
     * Дополнительные классы для контейнера
     */
    className?: string
    /**
     * Цвет акцента для маркеров списка
     * @default "orange"
     */
    accentColor?: "orange" | "blue" | "green" | "purple"
    /**
     * Максимальное количество колонок для списка особенностей
     * @default 2
     */
    gridColumns?: 1 | 2 | 3
}

/**
 * SpecialServiceCard - Карточка для отображения специальных услуг с особенностями.
 *
 * Компонент отображает:
 * - Название услуги
 * - Краткое описание
 * - Список особенностей в grid-сетке
 *
 * Особенности:
 * - Поддержка темной темы
 * - Настраиваемое количество колонок
 * - Кастомизируемый цвет акцента
 * - Адаптивный дизайн
 * - Семантическая разметка
 *
 * @example
 * // Базовое использование
 * <SpecialServiceCard
 *   service={serviceData}
 *   index={index}
 * />
 *
 * @example
 * // С кастомизацией
 * <SpecialServiceCard
 *   service={specialService}
 *   index={0}
 *   accentColor="blue"
 *   gridColumns={3}
 *   className="hover:shadow-md"
 * />
 */
export const SpecialServiceCard = ({
                                       service,
                                       index,
                                       className,
                                       accentColor = "orange",
                                       gridColumns = 2,
                                   }: SpecialServiceCardProps) => {
    // Динамические классы для цветов акцента
    const accentColorClasses = {
        orange: "text-orange-500 dark:text-orange-400",
        blue: "text-blue-500 dark:text-blue-400",
        green: "text-green-500 dark:text-green-400",
        purple: "text-purple-500 dark:text-purple-400",
    }

    // Динамические классы для grid-сетки
    const gridColumnsClasses = {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
    }

    return (
        <div
            key={index}
            className={cn(
                "bg-gray-50 dark:bg-gray-800",
                "p-6 rounded-lg border border-gray-200 dark:border-gray-700",
                "transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600",
                className
            )}
        >
            {/* Заголовок услуги */}
            <h3 className="text-xl font-bold mb-2">
                {service.title}
            </h3>

            {/* Описание услуги */}
            <p className="text-gray-600 dark:text-gray-300 mb-4">
                {service.description}
            </p>

            {/* Список особенностей */}
            <ul className={cn(
                "grid gap-2",
                gridColumnsClasses[gridColumns]
            )}>
                {service.features.map((feature, j) => (
                    <li key={j} className="flex items-start">
                        {/* Маркер списка */}
                        <span className={cn(
                            "mr-2 mt-0.5 flex-shrink-0",
                            accentColorClasses[accentColor]
                        )}>
                          ✓
                        </span>
                        {/* Вывод с проверкой наличия ссылки */}
                        {feature.href ? (
                            <Link
                                href={feature.href}
                                className={cn(
                                    "text-gray-700 dark:text-gray-300",
                                    "hover:underline hover:text-primary dark:hover:text-primary-400",
                                    "transition-colors duration-200"
                                )}
                            >
                                {feature.name}
                            </Link>
                        ) : (
                            <span className="text-gray-700 dark:text-gray-300">
                               {feature.name}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}