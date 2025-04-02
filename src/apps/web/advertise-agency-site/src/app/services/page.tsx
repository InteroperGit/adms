"use client"

import {useUpdateBreadcrumbs} from "@/lib/breadcrumbs";
import {useEffect} from "react";
import HeroSection from "@/components/sections/HeroSection";
import {ServiceCard} from "@/components/cards/ServiceCard";
import {SpecialServiceItem} from "@/types/service-type";
import {SpecialServiceCard} from "@/components/cards/SpecialServiceCard";
import {CtaSection} from "@/components/sections/CtaSection";

const serviceCategories = [
    {
        title: "Наружная реклама",
        icon: "🖼️",
        services: [
            { name: "Вывески", href: "/services/outdoor/signboards" },
            { name: "Световые короба", href: "/services/outdoor/lightboxes" },
            { name: "Билборды", href: "/services/outdoor/billboards" },
            { name: "Указатели", href: "/services/outdoor/signs" }
        ]
    },
    {
        title: "Брендирование",
        icon: "🏷️",
        services: [
            { name: "Автотранспорт", href: "/services/branding/vehicles" },
            { name: "Одежда", href: "/services/branding/clothing" },
            { name: "Сувенирная продукция", href: "/services/branding/merch" }
        ]
    },
    {
        title: "Полиграфия",
        icon: "🖨️",
        services: [
            { name: "Визитки", href: "/services/printing/business-cards" },
            { name: "Брошюры", href: "/services/printing/brochures" },
            { name: "Плакаты", href: "/services/printing/posters" },
            { name: "Каталоги", href: "/services/printing/catalogs" }
        ]
    },
    {
        title: "Цифровые решения",
        icon: "🖥️",
        services: [
            { name: "Реклама в соцсетях", href: "/services/digital/smm" },
            { name: "Сайты", href: "/services/digital/websites" },
            { name: "Презентации", href: "/services/digital/presentations" }
        ]
    }
]

const specialServices: SpecialServiceItem[] = [
    {
        title: "Комплексное брендирование",
        description: "Полный цикл работ по созданию и внедрению фирменного стиля",
        features: [
            {
                name: "Анализ рынка",
                href: "/services/branding/market-analysis"
            },
            {
                name: "Разработка логотипа",
                href: "/services/branding/logo-design"
            },
            {
                name: "Гайдлайны",
                href: "/services/branding/guidelines"
            },
            {
                name: "Реализация",
                href: "/services/branding/implementation"
            }
        ]
    },
    {
        title: "Рекламные кампании",
        description: "От стратегии до запуска и анализа эффективности",
        features: [
            {
                name: "Медиапланирование",
                href: "/services/advertising/media-planning"
            },
            {
                name: "Продакшн",
                href: "/services/advertising/production"
            },
            {
                name: "Размещение",
                href: "/services/advertising/placement"
            },
            {
                name: "Аналитика",
                href: "/services/advertising/analytics"
            }
        ]
    }
]

export default function ServicesPage() {
    const updateBreadcrumbs = useUpdateBreadcrumbs()

    useEffect(() => {
        updateBreadcrumbs([
            { title: 'Главная', href: '/' },
            { title: 'Услуги' }
        ])
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Hero секция */}
            <HeroSection
                title={"Наши услуги"}
                description={"Полный спектр рекламных услуг для вашего бизнеса - от создания концепции до реализации"}
            />

            {/* Основной контент */}
            <div className="container mx-auto px-4 py-12">
                {/* Категории услуг */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {serviceCategories.map((category, index) => (
                        <ServiceCard
                            key={index}
                            category={category}
                            index={index}
                            accentColor="orange"
                        />
                    ))}
                </div>

                {/* Дополнительные услуги */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Специализированные решения</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {specialServices.map((service, index) => (
                            <SpecialServiceCard
                                key={index}
                                service={service}
                                index={index}
                                accentColor="orange"
                                gridColumns={2}
                                className="hover:shadow-lg"
                            />
                        ))}
                    </div>
                </div>

                {/* CTA блок */}
                <CtaSection
                    title="Не нашли нужную услугу?"
                    description="Расскажите нам о вашем проекте, и мы предложим оптимальное решение"
                    buttonText="Обсудить проект"
                    buttonHref="/contacts"
                    className="dark:bg-gray-900 dark:text-gray-100"
                />
            </div>
        </div>
    )
}