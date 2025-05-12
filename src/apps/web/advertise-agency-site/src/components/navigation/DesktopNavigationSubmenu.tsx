"use client"

import React, {JSX} from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/libs/utils"
import {NavigationLink} from "@/types/navigation";

interface Props {
    links: NavigationLink[]
}

/**
 * DesktopNavigationSubmenu — компонент для отображения подменю в навигационном меню.
 * Этот компонент отвечает за рендеринг списка ссылок, которые сгруппированы по категориям
 * и отображаются с плавной анимацией при открытии. Подменю имеет стилизованный фон, тени
 * и адаптивные сетки для разных экранов.
 *
 * Основные особенности:
 * 1. Использование анимации с помощью `motion.div` для плавного появления и скрытия подменю.
 * 2. Контент подменю разделён на колонки, количество которых зависит от количества ссылок.
 * 3. Каждая ссылка в подменю имеет анимацию изменения ширины подчеркивания при наведении.
 * 4. Используется `Tailwind CSS` для стилизации, включая бордеры, фон, скругления и тени.
 * 5. Адаптивное поведение: на больших экранах используется 4 колонки, на средних — 2.
 *
 * Этот компонент полезен для реализации сложных подменю в навигационных панелях, где
 * требуется отображение разных категорий с возможностью перехода по ссылкам.
 */
const DesktopNavigationSubmenu: React.FC<Props> = ({ links }): JSX.Element => {
    return (
        <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            exit={{ y: -20 }}
            transition={{
                duration: 0.25,
                ease: "easeInOut",
            }}
            className={cn(
                "absolute top-full mx-auto left-0 right-0",
                // Фон и скругления
                "bg-white dark:bg-background rounded-b-2xl shadow-md z-50",
                // Контрастные бордеры по бокам и снизу
                "border-l-2 border-r-2 border-b-2",                   // включаем остальные стороны
                "border-gray-300 dark:border-gray-700",          // контрастные цвета
                "w-full md:max-w-[600px] lg:max-w-[1000px]",
            )}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.1 }}
                className="flex justify-center px-6 py-6"
            >
                <div
                    className={cn(
                        "grid gap-6 w-full",
                        `lg:grid-cols-${Math.min(links.length, 4)}`,
                        `md:grid-cols-${Math.min(links.length, 2)}`,
                    )}
                >
                    {links.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                {col.title}
                            </h4>
                            <hr className="border-t border-gray-200 dark:border-gray-700 mb-3" />
                            <ul className="space-y-1 text-sm">
                                {col.links?.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href || ""}
                                            className={cn(
                                                "relative inline-block text-lg",
                                                "text-gray-700 dark:text-gray-300",
                                                "transition-colors duration-200",
                                                "hover:text-orange-500 dark:hover:text-orange-400",
                                                "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]",
                                                "after:w-0 after:bg-orange-500 dark:after:bg-orange-400",
                                                "after:transition-all after:duration-300 hover:after:w-full"
                                            )}
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}

export default DesktopNavigationSubmenu;
