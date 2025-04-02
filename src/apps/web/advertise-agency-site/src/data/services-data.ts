import {ServiceCategory, SpecialServiceItem} from "@/types/service";

export const serviceCategories: ServiceCategory[] = [
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

export const specialServices: SpecialServiceItem[] = [
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