"use client"

import Link from 'next/link'
import {useUpdateBreadcrumbs} from "@/lib/breadcrumbs";
import {useEffect} from "react";

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
            <div className="bg-orange-600 dark:bg-orange-800 text-white py-20 px-6 text-center">
                <h1 className="text-4xl font-bold mb-4">Наши услуги</h1>
                <p className="text-xl max-w-2xl mx-auto">
                    Полный спектр рекламных услуг для вашего бизнеса - от создания концепции до реализации
                </p>
            </div>

            {/* Основной контент */}
            <div className="container mx-auto px-4 py-12">
                {/* Категории услуг */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {serviceCategories.map((category, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700 hover:shadow-lg transition-shadow"
                        >
                            <div className="text-4xl mb-4">{category.icon}</div>
                            <h2 className="text-xl font-bold mb-4">{category.title}</h2>
                            <ul className="space-y-2">
                                {category.services.map((service, i) => (
                                    <li key={i}>
                                        <Link
                                            href={service.href}
                                            className="text-orange-600 dark:text-orange-400 hover:underline flex items-center"
                                        >
                                            <span className="mr-2">→</span>
                                            {service.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Дополнительные услуги */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Специализированные решения</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                title: "Комплексное брендирование",
                                description: "Полный цикл работ по созданию и внедрению фирменного стиля",
                                features: ["Анализ рынка", "Разработка логотипа", "Гайдлайны", "Реализация"]
                            },
                            {
                                title: "Рекламные кампании",
                                description: "От стратегии до запуска и анализа эффективности",
                                features: ["Медиапланирование", "Продакшн", "Размещение", "Аналитика"]
                            }
                        ].map((service, i) => (
                            <div
                                key={i}
                                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700"
                            >
                                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                                <ul className="grid grid-cols-2 gap-2">
                                    {service.features.map((feature, j) => (
                                        <li key={j} className="flex items-start">
                                            <span className="text-orange-500 dark:text-orange-400 mr-2">✓</span>
                                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA блок */}
                <div className="bg-orange-50 dark:bg-orange-900/20 p-8 rounded-lg border border-orange-100 dark:border-orange-800 text-center">
                    <h2 className="text-2xl font-bold mb-4">Не нашли нужную услугу?</h2>
                    <p className="mb-6 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                        Расскажите нам о вашем проекте, и мы предложим оптимальное решение
                    </p>
                    <button className="bg-orange-600 dark:bg-orange-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 dark:hover:bg-orange-800 transition">
                        Обсудить проект
                    </button>
                </div>
            </div>
        </div>
    )
}