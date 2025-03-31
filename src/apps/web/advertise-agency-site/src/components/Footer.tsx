"use client"

import Link from "next/link"
import {FaVk, FaTelegram, FaWhatsapp} from "react-icons/fa"
import {PhoneIcon, MapPinIcon} from "@heroicons/react/24/outline"
import {EnvelopeIcon} from "@heroicons/react/24/solid"
import Logo from "@/components/Logo";
import {cn} from "@/lib/utils";

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const socialLinks = [
        {
            icon: <FaVk className="h-5 w-5"/>,
            href: "#",
            label: "VK",
            color: "hover:text-[#4680C2]" // VK синий
        },
        {
            icon: <FaTelegram className="h-5 w-5"/>,
            href: "#",
            label: "Telegram",
            color: "hover:text-[#2AABEE]" // Telegram голубой
        },
        {
            icon: <FaWhatsapp className="h-5 w-5"/>,
            href: "#",
            label: "WhatsApp",
            color: "hover:text-[#25D366]" // WhatsApp зеленый
        },
    ]

    const footerLinks = [
        {
            title: "Компания",
            links: [
                {name: "О нас", href: "/about"},
                {name: "Команда", href: "/team"},
                {name: "Вакансии", href: "/careers"}
            ]
        },
        {
            title: "Услуги",
            links: [
                {name: "Наружная реклама", href: "/services/outdoor"},
                {name: "Полиграфия", href: "/services/printing"},
                {name: "Брендирование", href: "/services/branding"}
            ]
        }
    ]

    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t">
            <div className="container px-4 py-12 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grud-cols-4 gap-8">
                    {/* Лого */}
                    <div className="space-y-4">
                        <Logo />
                        <p className="text-gray-600 dark:text-gray-400">
                            Профессиональные решения для вашего бизнеса
                        </p>
                    </div>

                    <div className="space-y-4"></div>

                    {/* Социальные сети с икноками */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Мы в социальных сетях:
                        </h3>
                        <div className="flex space-x-5">
                            {socialLinks.map((social, index) => (
                                <Link
                                    key={index}
                                    href={social.href}
                                    className={cn(
                                        // Базовые стили
                                        "p-2 rounded-full",
                                        "text-gray-500 dark:text-gray-400",

                                        // Эффекты при наведении
                                        "hover:scale-110",
                                        "hover:bg-opacity-10",
                                        social.color,

                                        // Темная тема
                                        `dark:${social.color.replace('hover:', 'hover:dark:')}`,

                                        // Анимация
                                        "transition-all duration-300 ease-in-out",

                                        // Фокус-состояния для доступности
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                        "focus-visible:ring-current"
                                    )}
                                    aria-label={social.label}>
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Навигационные ссылки */}
                    {footerLinks.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href}
                                              className={`text-gray-600 hover:text-gray-900 dark:text-gray-400 
                                              dark:hover:text-white transition-colors hover:underline 
                                              hover:underline-offset-4 hover:decoration-current`}>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Контакты */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Контакты
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex items-start space-x-2">
                                <PhoneIcon className="h-5 w-5 text-gray-500 mt-0.5"/>
                                <span className="text-gray-600 dark:text-gray-400">
                                    +7 911 505 35 03
                                </span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <EnvelopeIcon className="h-5 w-5 text-gray-500 mt-0.5"/>
                                <span className="text-gray-600 dark:text-gray-400">
                                    info@rmaster35.ru
                                </span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5"/>
                                <span className="text-gray-600 dark:text-gray-400">
                                    г. Череповец, ул. Металлургов, д. 9
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Копирайт */}
                <div
                    className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    © {currentYear} Рекламастер. Все права защищены.
                </div>
            </div>
        </footer>
    )
}