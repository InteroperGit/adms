"use client"

import Link from "next/link"
import { cn } from "@/libs/utils"
import React from "react";
import { ServiceItem } from "@/types/service";
import Image from "next/image";

interface ServiceCardProps {
    /**
     * Данные категории услуг для отображения
     */
    service: ServiceItem
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
                                service,
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
            <div className="w-16 h-16 mb-4 relative border-2">
                {service.previewImage && (
                    <Image
                        src={service.previewImage.src}
                        alt={service.previewImage.alt || service.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                    />
                )}
            </div>

            {/* Заголовок категории */}
            <h2 className="text-xl font-bold mb-4">
                {service.title}
            </h2>

            {/* Список услуг */}
            <ul className="space-y-2 flex-1">
                {service.items?.map((subService, index) => (
                    <li key={index} className="flex items-start">
                        {/* Маркер списка */}
                        <span className={cn(
                            "mr-2 mt-0.5 flex-shrink-0",
                            accentColorClasses[accentColor]
                        )}>
                          ✓
                        </span>
                        {/* Вывод с проверкой наличия ссылки */}
                        {subService.href ? (
                            <Link
                                href={subService.href}
                                className={cn(
                                    "relative text-gray-700 dark:text-gray-300",
                                    "hover:text-primary dark:hover:text-primary-400",
                                    "transition-colors duration-200",
                                    "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px]", // Высота подчеркивания
                                    "after:w-0 after:bg-orange-500 dark:after:bg-orange-400", // Цвет подчеркивания
                                    "after:transition-all after:duration-300 hover:after:w-full" // Анимация расширения
                                )}
                            >
                                {subService.title}
                            </Link>
                        ) : (
                            <span className="text-gray-700 dark:text-gray-300">
                               {subService.title}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
