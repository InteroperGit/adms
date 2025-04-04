"use client"

import React from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import { usePathname } from "next/navigation"
import {navLinks} from "@/config/navigation";

/**
 * DesktopNavigation - Компонент горизонтального меню навигации для десктопных устройств.
 *
 * Отображает панель навигации в верхней части страницы с:
 * - Ссылками на основные разделы сайта
 * - Визуальным выделением активного раздела
 * - Поддержкой темной темы
 * - Адаптивным скрытием на мобильных устройствах
 *
 * Особенности:
 * - Автоматически определяет активный раздел по текущему URL
 * - Использует semantic-тег <nav> для доступности
 * - Центрированное расположение элементов
 * - Горизонтальный разделитель в верхней части
 * - Анимация перехода между состояниями
 *
 * @example
 * // Базовое использование (с импортированными ссылками)
 * <DesktopNavigation />
 *
 * @example
 * // С кастомными ссылками
 * const customLinks = [
 *   { name: 'Главная', href: '/' },
 *   { name: 'Блог', href: '/blog' }
 * ];
 *
 * <DesktopNavigation navLinks={customLinks} />
 */
export default function DesktopNavigation() {
    const pathname = usePathname()

    return (
        <div className="border-b border-gray-200 dark:border-gray-800"> {/* Добавленная линия */}
            <div className="container mx-auto px-4">
                {/* Десктопное меню - выровнено по центру */}
                <nav className="hidden md:flex justify-center w-full py-4"> {/* Добавлен padding */}
                    <div className="flex items-center space-x-2">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <Button
                                    variant={pathname.startsWith(link.href) ? "secondary" : "ghost"}
                                    className="hover:text-primary"
                                >
                                    {link.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    );
}