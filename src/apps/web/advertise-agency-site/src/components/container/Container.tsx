import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * Компонент-контейнер для единообразного размещения контента на страницах.
 * Обеспечивает:
 * - Адаптивную ширину
 * - Центрирование на больших экранах
 * - Стандартные отступы
 * - Возможность кастомизации через className
 *
 * @param children - Содержимое контейнера
 * @param className - Дополнительные классы для кастомизации
 */
export function Container({
                              children,
                              className,
                          }: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("w-full sm:max-w-7xl sm:mx-auto px-4 py-12", className)}>
            {children}
        </div>
    );
}