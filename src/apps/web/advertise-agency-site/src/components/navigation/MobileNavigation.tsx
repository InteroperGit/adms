"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {Bars3Icon, PhoneIcon} from '@heroicons/react/24/outline'
import Link from "next/link"
import {NavigationLink} from "@/types/navigation";
import React, {JSX} from "react";
import {cn} from "@/libs/utils";
import {FaWhatsapp} from "react-icons/fa";

interface MobileNavigationProps {
    navLinks: NavigationLink[];
    className?: string;
}

const mobileMenu = (navLinks: NavigationLink[]): React.ReactNode => (
    <Sheet>
        <SheetTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className={`
                        md:hidden 
                        h-14 w-14                // Больший размер кнопки
                        border-2 border-gray-500  // Рамка
                        rounded-lg                // Скругленные углы
                        hover:bg-gray-100         // Эффект при наведении
                        dark:border-gray-600      // Для темной темы
                        dark:hover:bg-gray-800    // Для темной темы
                    `}
            >
                <Bars3Icon className="h-8 w-8 text-gray-700 dark:text-gray-300" /> {/* Увеличенная иконка */}
            </Button>
        </SheetTrigger>

        <SheetContent side="top">
            <SheetHeader className="mb-4">
                <SheetTitle className="text-center">Меню</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                    <Button
                        key={link.name}
                        asChild
                        variant="ghost"
                        className="justify-center"
                    >
                        {
                            link.href
                                ? (
                                    <Link href={link.href}>
                                        {link.title}
                                    </Link>
                                )
                                : (
                                    <span>{link.title}</span>
                                )
                        }

                    </Button>
                ))}
            </div>
        </SheetContent>
    </Sheet>
);

/**
 * MobileNavigation - Компонент мобильного меню для адаптивной навигации.
 *
 * Отображает скрытое боковое меню, которое появляется при клике на иконку "гамбургер".
 * Используется только на мобильных устройствах (скрывается на md-экранах и выше).
 *
 * Особенности:
 * - Реализован с использованием Radix UI Sheet для плавной анимации
 * - Полная поддержка темной темы
 * - Оптимизированная доступность (правильные ARIA-атрибуты)
 * - Адаптивный дизайн (автоматическое скрытие на десктопах)
 * - Конфигурируемые навигационные ссылки
 *
 * @param {Object[]} navLinks - Массив объектов с ссылками навигации
 * @param {string} navLinks[].name - Отображаемое название ссылки
 * @param {string} className - Дополнительные CSS
 * @param {string} navLinks[].href - URL-адрес ссылки
 *
 * @example
 * // Базовое использование
 * const links = [
 *   { name: 'Главная', href: '/' },
 *   { name: 'О нас', href: '/about' }
 * ];
 *
 * <MobileNavigation navLinks={links} />
 *
 * @example
 * // С кастомными стилями
 * <MobileNavigation
 *   navLinks={links}
 *   className="custom-class"
 * />
 */
const MobileNavigation: React.FC<MobileNavigationProps> = ({ navLinks, className }: MobileNavigationProps): JSX.Element => {
    return (
        <div className={cn("flex", "w-full justify-between px-4 py-2 bg-background border-t md:hidden", className)}>
            <Button
                asChild
                variant="ghost"
                size={"default"}
                className={"flex-1 flex-col gap-1 h-auto py-2"}
            >
                <Link
                    href="tel:+79115053503"
                    className={cn("flex items-center", "flex-col")}
                >
                    <PhoneIcon className="h-5 w-5" />
                    <span className="text-xs mt-1">Позвонить</span>
                </Link>
            </Button>

            {/* WhatsApp */}
            <Button
                asChild
                variant="ghost"
                size={"default"}
                className={"flex-2 flex-col gap-1 h-auto py-2"}
            >
                <Link
                    href="https://wa.me/79115050635"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("flex items-center", "flex-col")}
                >
                    <FaWhatsapp className="h-5 w-5 text-green-600 hover:text-green-700" />
                    <span className="text-xs mt-1">WhatsApp</span>
                </Link>
            </Button>

            {navLinks && navLinks.length > 0 && mobileMenu(navLinks)}
        </div>
    )
}

export default MobileNavigation;