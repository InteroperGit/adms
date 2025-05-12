import { cn } from "@/libs/utils"
import Image from "next/image"
import { Client } from "@/types/client";
import React, {JSX} from "react";

interface ClientsSectionProps {
    clients: Client[];
    title?: string;
    className?: string;
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
 *   className="my-12"
 * />
 */
const ClientsSection: React.FC<ClientsSectionProps> = ({
                                           clients,
                                           title = "Наши клиенты",
                                           className,
                                       }: ClientsSectionProps): JSX.Element => {
    // Используем правильные классы для сетки
    const gridClasses = cn(
        "flex flex-wrap justify-center gap-4", // Гибкая обертка с отступами между элементами
        "w-full", // ширина на 100% для всех устройств
        "sm:flex-col sm:justify-center", // Для мобильных устройств: один столбец
        `md:flex-row md:justify-start`, // Для md экранов: несколько колонок
        `lg:flex-row lg:justify-start` // Для lg экранов: несколько колонок
    )

    return (
        <div className={cn("bg-white dark:bg-gray-800 p-6 rounded-lg", className)}>
            <h2 className="text-2xl font-bold mb-6 dark:text-gray-200">{title}</h2>

            <div className={cn(gridClasses)}>
                {clients.map((client, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-48 h-48 bg-white dark:bg-gray-700 rounded-lg",
                            "border-2 border-gray-200",
                            "flex items-center justify-center",
                            "transition-transform hover:scale-105"
                        )}
                    >
                        <Image
                            src={client.logo?.url || ""}
                            alt={client.name}
                            width={40}
                            height={40}
                            className="w-40 h-40 object-contain filter grayscale hover:grayscale-0 transition-all duration-500"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ClientsSection;
