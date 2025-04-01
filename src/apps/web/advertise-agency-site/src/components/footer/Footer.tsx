"use client"

import {FaVk, FaTelegram, FaWhatsapp} from "react-icons/fa"
import Logo from "@/components/misc/Logo";
import FooterSocialIcons from "@/components/footer/FooterSocialIcons";
import FooterContacts from "@/components/footer/FooterContacts";
import FooterCompanyLinks from "@/components/footer/FooterCompanyLinks";
import FooterServicesLinks from "@/components/footer/FooterServicesLinks";
import {servicesLinks} from "@/config/navigation";

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

    const companyLinks = [
        {name: "О нас", href: "/about"},
        {name: "Новости", href: "/news"},
        {name: "Статьи", href: "/articles"}
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

                    {/* Пустая ячейка */}
                    <div className="space-y-4"></div>

                    {/* Социальные сети с икноками */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Мы в социальных сетях:
                        </h3>
                        <FooterSocialIcons socialLinks={socialLinks} className="mt-4" />
                    </div>

                    {/* Ссылки Компания */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Компания
                        </h3>
                        <FooterCompanyLinks companyLinks={companyLinks} />
                    </div>

                    {/* Ссылки Услуги */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Услуги
                        </h3>
                        <FooterServicesLinks servicesLinks={servicesLinks} />
                    </div>

                    {/* Контакты */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Контакты
                        </h3>
                        <FooterContacts className="mt-4" />
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