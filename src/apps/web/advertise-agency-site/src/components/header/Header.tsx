'use client'

import { cn } from '@/libs/utils'
import Logo from '@/components/misc/Logo'
import Toolbar from '@/components/navigation/Toolbar'
import { HeaderContacts } from '@/components/header/HeaderContacts'
import {JSX} from "react";
import {ContactItem} from "@/types/contacts";

interface HeaderProps {
    contacts: ContactItem[];
}

/**
 * Header — компонент, который представляет собой верхнюю панель сайта, содержащую логотип, контактную информацию и панель навигации.
 * Этот компонент отображается в верхней части страницы и включает в себя:
 * 1. Логотип компании, который является кликабельным.
 * 2. Контактную информацию, включая адрес, рабочие часы, телефон и email.
 * 3. Панель инструментов (Toolbar), которая обычно содержит меню навигации.
 *
 * Основные особенности:
 * 1. Использование утилитных классов из Tailwind CSS для стилизации.
 * 2. Применение эффекта размытия фона с использованием `backdrop-blur`, чтобы сделать фон полупрозрачным.
 * 3. Компонент адаптивен, меняет высоту и отступы в зависимости от размера экрана.
 * 4. Контактная информация и панель инструментов находятся в одной строке и автоматически выравниваются с помощью Flexbox.
 *
 * Этот компонент используется на страницах для отображения основной навигации и контактной информации на сайте.
 */
const Header = ({ contacts }: HeaderProps): JSX.Element | null => {
    return (
        <header
            className={cn(
                'top-0 z-50 w-full border-b',
                'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
                'transition-all duration-300 ease-in-out'
            )}
        >
            <div
                className={cn(
                    'flex items-center justify-between px-4 sm:px-6 lg:px-8',
                    'h-16 sm:h-20 lg:h-24'
                )}
            >
                <Logo />
                <HeaderContacts
                    address={contacts?.find(item => item.slug === "address")?.info || ""}
                    workHours={contacts?.find(item => item.slug === "workHours")?.info || ""}
                    phone={contacts?.find(item => item.slug === "phone1")?.info || ""}
                    email={contacts?.find(item => item.slug === "email")?.info || ""}
                    className="mr-5"
                />
                <Toolbar />
            </div>
        </header>
    )
}

export default Header;
