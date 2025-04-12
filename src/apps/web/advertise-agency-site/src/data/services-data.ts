import {ServiceItem} from "@/types/service";

export const mainServices: ServiceItem[] = [
    {
        name: "outdoor",
        title: "Наружная реклама",
        description: "Наружная реклама",
        items: [
            { name: "signboards", title: "Вывески", href: "/services/outdoor/signboards" },
            { name: "lightboxes", title: "Световые короба", href: "/services/outdoor/lightboxes" },
            { name: "billboards", title: "Билборды", href: "/services/outdoor/billboards" },
            { name: "signs", title: "Указатели", href: "/services/outdoor/signs" },
        ]
    },
    {
        name: "branding",
        title: "Брендирование",
        description: "Брендирование",
        items: [
            { name: "vehicles", title: "Автотранспорт", href: "/services/branding/vehicles" },
            { name: "clothing", title: "Одежда", href: "/services/branding/clothing" },
            { name: "merch", title: "Сувенирная продукция", href: "/services/branding/merch" }
        ]
    },
    {
        name: "polygraphy",
        title: "Полиграфия",
        description: "Полиграфия",
        items: [
            { name: "business-cards", title: "Визитки", href: "/services/printing/business-cards" },
            { name: "brochures", title: "Брошюры", href: "/services/printing/brochures" },
            { name: "posters", title: "Плакаты", href: "/services/printing/posters" },
            { name: "catalogs", title: "Каталоги", href: "/services/printing/catalogs" }
        ]
    },
]

export const specialServices: ServiceItem[] = [
    {
        name: 'complex-branding',
        title: "Комплексное брендирование",
        description: "Полный цикл работ по созданию и внедрению фирменного стиля",
        items: [
            { name: "market-analysis", title: "Анализ рынка", href: "/services/branding/market-analysis" },
            { name: "logo-design", title: "Разработка логотипа", href: "/services/branding/logo-design" },
            { name: "guidelines", title: "Гайдлайны", href: "/services/branding/guidelines" },
            { name: "implementation", title: "Реализация", href: "/services/branding/implementation" }
        ]
    },
    {
        name: "adv-campaigns",
        title: "Рекламные кампании",
        description: "От стратегии до запуска и анализа эффективности",
        items: [
            { name: "media-planning", title: "Медиапланирование", href: "/services/advertising/media-planning" },
            { name: "production", title: "Продакшн", href: "/services/advertising/production" },
            { name: "placement", title: "Размещение", href: "/services/advertising/placement" },
            { name: "analytics", title: "Аналитика", href: "/services/advertising/analytics" }
        ]
    }
]