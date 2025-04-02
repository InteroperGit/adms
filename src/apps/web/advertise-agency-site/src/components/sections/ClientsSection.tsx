// components/sections/ClientsSection.tsx
"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

// Массив с логотипами (можно заменить на свои)
const clients = [
    {
        name: "Google",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
    },
    {
        name: "Microsoft",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg"
    },
    {
        name: "Apple",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
    },
    {
        name: "Amazon",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
    },
    {
        name: "Facebook",
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
    },
]

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
export const ClientsSection = ({
                                   className,
                                   title = "Наши клиенты",
                                   columns = { sm: 3, md: 4, lg: 6 },
                               }: ClientsSectionProps) => {
    // Генерация классов для сетки
    const gridClasses = cn(
        "grid gap-4",
        `grid-cols-2 sm:grid-cols-${columns.sm ?? 3}`,
        `md:grid-cols-${columns.md ?? 4}`,
        `lg:grid-cols-${columns.lg ?? 6}`
    )

    return (
        <div className={cn(
            "bg-white dark:bg-gray-800",
            "p-6 rounded-lg",
            className
        )}>
            <h2 className="text-2xl font-bold mb-6 dark:text-gray-200">{title}</h2>

            <div className={gridClasses}>
                {clients.map((client, i) => (
                    <div
                        key={i}
                        className={cn("h-20 bg-white dark:bg-gray-700 rounded-lg ",
                            "border border-gray-100 dark:border-gray-600",
                            "flex items-center justify-center p-3 shadow-md")}
                    >
                        <Image
                            src={client.logo}
                            alt={client.name}
                            width={120}
                            height={60}
                            className="object-contain h-full w-full"
                            unoptimized // Для SVG можно отключить оптимизацию
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}