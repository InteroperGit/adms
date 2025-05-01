// components/sections/ClientsSection.tsx
"use client"

import { cn } from "@/libs/utils"
import Image from "next/image"
import {clients} from "@/data/clientsData";

interface ClientsSectionProps {
    className?: string
    title?: string
    /**
     * Количество колонок на разных разрешениях
     * @default { sm: 3, md: 4, lg: 6 }
     */
    columns?: {
        sm?: number
        md?: number
        lg?: number
    }
}

/**
 * ClientsSection - Секция с логотипами клиентов.
 *
 * Компонент отображает:
 * - Заголовок секции
 * - Сетку логотипов клиентов
 *
 * Особенности:
 * - Поддержка темной темы
 * - Адаптивное количество колонок
 * - Оптимизированные изображения
 *
 * @example
 * // Базовое использование
 * <ClientsSection />
 *
 * @example
 * // С кастомизацией
 * <ClientsSection
 *   title="Наши партнеры"
 *   columns={{ sm: 2, md: 3, lg: 5 }}
 *   className="my-12"
 * />
 */
export default function ClientsSection({
                                   title = "Наши клиенты",
                                   columns = { sm: 5, md: 6, lg: 8 },
                                   className
                               }: ClientsSectionProps) {
    const gridClasses = cn(
        "grid gap-4",
        `grid-cols-5 sm:grid-cols-${columns.sm ?? 5}`,
        `md:grid-cols-${columns.md ?? 6}`,
        `lg:grid-cols-${columns.lg ?? 8}`
    )

    return (
        <div className={cn("bg-white dark:bg-gray-800 p-6 rounded-lg", className)}>
            <h2 className="text-2xl font-bold mb-6 dark:text-gray-200">{title}</h2>

            <div className={gridClasses}>
                {clients.map((client, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-48 h-48 bg-white dark:bg-gray-700 rounded-lg",
                            "flex items-center justify-center p-3",
                            "transition-transform hover:scale-105"
                        )}
                    >
                        <Image
                            src={client.logo}
                            alt={client.name}
                            width={200}
                            height={200}
                            className="object-contain w-full h-full filter grayscale hover:grayscale-0 transition-all duration-500"
                            unoptimized
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}