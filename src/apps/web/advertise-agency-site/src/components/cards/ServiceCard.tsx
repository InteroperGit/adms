// components/cards/ServiceCard.tsx
"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import React from "react";
import {ServiceItem} from "@/types/service";

interface ServiceCategory {
    /**
     * Иконка категории (React-компонент или текст)
     */
    icon: React.ReactNode
    /**
     * Название категории услуг
     */
    title: string
    /**
     * Массив услуг в категории
     */
    services: ServiceItem[]
}

interface ServiceCardProps {
    /**
     * Данные категории услуг для отображения
     */
    category: ServiceCategory
    /**
     * Индекс элемента в списке (для ключа)
     */
    index: number
    /**
     * Дополнительные классы для контейнера
     */
    className?: string
    /**
     * Цвет акцента для ссылок
     * @default "orange"
     */
    accentColor?: "orange" | "blue" | "green"
}

/**
 * ServiceCard - Карточка категории услуг.
 *
 * Отображает:
 * - Иконку категории
 * - Заголовок категории
 * - Список услуг с ссылками
 *
 * Особенности:
 * - Поддержка темной темы
 * - Hover-эффекты
 * - Настраиваемый цвет акцента
 * - Адаптивный дизайн
 *
 * @example
 * // Базовое использование
 * <ServiceCard
 *   category={categoryData}
 *   index={index}
 * />
 *
 * @example
 * // С кастомизацией
 * <ServiceCard
 *   category={category}
 *   index={0}
 *   className="custom-shadow"
 *   accentColor="blue"
 * />
 */
export const ServiceCard = ({
                                category,
                                index,
                                className,
                                accentColor = "orange",
                            }: ServiceCardProps) => {
    // Динамические классы для цветов акцента
    const accentColorClasses = {
        orange: "text-orange-600 dark:text-orange-400",
        blue: "text-blue-600 dark:text-blue-400",
        green: "text-green-600 dark:text-green-400",
    }

    return (
        <div
            key={index}
            className={cn(
                "bg-gray-50 dark:bg-gray-800 rounded-lg p-6",
                "border border-gray-200 dark:border-gray-700",
                "hover:shadow-lg transition-shadow duration-300",
                "flex flex-col h-full",
                className
            )}
        >
            {/* Блок иконки */}
            <div className="text-4xl mb-4">
                {category.icon}
            </div>

            {/* Заголовок категории */}
            <h2 className="text-xl font-bold mb-4">
                {category.title}
            </h2>

            {/* Список услуг */}
            <ul className="space-y-2 flex-1">
                {category.services.map((service, index) => (
                    <li key={index} className="flex items-start">
                        {/* Маркер списка */}
                        <span className={cn(
                            "mr-2 mt-0.5 flex-shrink-0",
                            accentColorClasses[accentColor]
                        )}>
                          ✓
                        </span>
                        {/* Вывод с проверкой наличия ссылки */}
                        {service.href ? (
                            <Link
                                href={service.href}
                                className={cn(
                                    "text-gray-700 dark:text-gray-300",
                                    "hover:underline hover:text-primary dark:hover:text-primary-400",
                                    "transition-colors duration-200"
                                )}
                            >
                                {service.name}
                            </Link>
                        ) : (
                            <span className="text-gray-700 dark:text-gray-300">
                               {service.name}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}