import {NavigationLink} from "@/types/navigation";

export const navLinks: NavigationLink[] = [
    {
        id: 1,
        name: "services",
        title: "Услуги",
        href: "/services",
        links: [{
            id: 1,
            name: "outdoor",
            title: "Наружная реклама",
            links: [
                {
                    id: 1,
                    name: "light-letters",
                    title: "Световые буквы",
                    href: "/services/outdoor/light-letters",
                },
                {
                    id: 2,
                    name: "light-boxes",
                    title: "Световые короба и консоли",
                    href: "/services/outdoor/light-boxes",
                },
                {
                    id: 3,
                    name: "brackets",
                    title: "Кронштейны",
                    href: "/services/outdoor/brackets",
                },
                {
                    id: 4,
                    name: "banners",
                    title: "Баннеры",
                    href: "/services/outdoor/banners",
                },
                {
                    id: 5,
                    name: "technical-design",
                    title: "Проектирование",
                    href: "/services/outdoor/technical-design",
                },
                {
                    id: 6,
                    name: "approval",
                    title: "Согласование",
                    href: "/services/outdoor/approval",
                },
                {
                    id: 7,
                    name: "installation",
                    title: "Монтаж",
                    href: "/services/outdoor/installation",
                },
            ],
        }, {
            id: 2,
            name: "indoor",
            title: "Внутренняя реклама",
            links: [
                {
                    id: 1,
                    name: "interior-logos",
                    title: "Интерьерные логотипы",
                    href: "/services/indoor/interior-logos",
                },
                {
                    id: 2,
                    name: "navigation",
                    title: "Навигация, указатели",
                    href: "/services/indoor/navigation",
                },
                {
                    id: 3,
                    name: "stands-signs",
                    title: "Стенды и таблички",
                    href: "/services/indoor/stands-signs",
                },
                {
                    id: 4,
                    name: "opening-hours",
                    title: "Режимы работы",
                    href: "/services/indoor/opening-hours",
                },
                {
                    id: 5,
                    name: "neon-signs",
                    title: "Неоновые вывески",
                    href: "/services/indoor/neon-signs",
                },
                {
                    id: 6,
                    name: "pavilion-decoration",
                    title: "Оформление павильонов",
                    href: "/services/indoor/pavilion-decoration",
                },
                {
                    id: 7,
                    name: "exhibition-decoration",
                    title: "Оформление выставочных стендов",
                    href: "/services/indoor/exhibition-decoration",
                },
            ],
        }, {
            id: 3,
            name: "branding",
            title: "Брендирование",
            links: [
                {
                    id: 1,
                    name: "vehicle-branding",
                    title: "Автотранспорт",
                    href: "/services/branding/vehicle-branding",
                },
                {
                    id: 2,
                    name: "souvenir-products",
                    title: "Сувернирная продукция",
                    href: "/services/branding/souvenir-products",
                },
                {
                    id: 3,
                    name: "clothing",
                    title: "Одежда",
                    href: "/services/branding/clothing",
                },
            ],
        }, {
            id: 4,
            name: "printing",
            title: "Полиграфия",
            links: [
                {
                    id: 1,
                    name: "order-247",
                    title: "Заказать 24/7",
                    href: "/services/printing/order-247",
                },
                {
                    id: 2,
                    name: "business-cards",
                    title: "Визитки",
                    href: "/services/printing/business-cards",
                },
                {
                    id: 3,
                    name: "flyers",
                    title: "Листовки",
                    href: "/services/printing/flyers",
                },
                {
                    id: 4,
                    name: "euro-booklets",
                    title: "Евробуклеты",
                    href: "/services/printing/euro-booklets",
                },
                {
                    id: 5,
                    name: "postcards",
                    title: "Открытки",
                    href: "/services/printing/postcards",
                },
            ],
        }],
    }, {
        id: 2,
        name: "portfolio",
        title: "Портфолио",
        href: "/portfolio",
        links: [{
            id: 1,
            name: "outdoor",
            title: "Наружная реклама",
            links: [
                {
                    id: 1,
                    name: "light-letters",
                    title: "Световые буквы",
                    href: "/portfolio/outdoor/light-letters",
                },
                {
                    id: 2,
                    name: "light-boxes",
                    title: "Световые короба и консоли",
                    href: "/portfolio/outdoor/light-boxes",
                },
                {
                    id: 3,
                    name: "brackets",
                    title: "Кронштейны",
                    href: "/portfolio/outdoor/brackets",
                },
                {
                    id: 4,
                    name: "banners",
                    title: "Баннеры",
                    href: "/portfolio/outdoor/banners",
                },
                {
                    id: 5,
                    name: "technical-design",
                    title: "Проектирование",
                    href: "/portfolio/outdoor/technical-design",
                },
                {
                    id: 6,
                    name: "approval",
                    title: "Согласование",
                    href: "/portfolio/outdoor/approval",
                },
                {
                    id: 7,
                    name: "installation",
                    title: "Монтаж",
                    href: "/portfolio/outdoor/installation",
                },
            ],
        }, {
            id: 2,
            name: "indoor",
            title: "Внутренняя реклама",
            links: [
                {
                    id: 1,
                    name: "interior-logos",
                    title: "Интерьерные логотипы",
                    href: "/portfolio/indoor/interior-logos",
                },
                {
                    id: 2,
                    name: "navigation",
                    title: "Навигация, указатели",
                    href: "/portfolio/indoor/navigation",
                },
                {
                    id: 3,
                    name: "stands-signs",
                    title: "Стенды и таблички",
                    href: "/portfolio/indoor/stands-signs",
                },
                {
                    id: 4,
                    name: "opening-hours",
                    title: "Режимы работы",
                    href: "/portfolio/indoor/opening-hours",
                },
                {
                    id: 5,
                    name: "neon-signs",
                    title: "Неоновые вывески",
                    href: "/portfolio/indoor/neon-signs",
                },
                {
                    id: 6,
                    name: "pavilion-decoration",
                    title: "Оформление павильонов",
                    href: "/portfolio/indoor/pavilion-decoration",
                },
                {
                    id: 7,
                    name: "exhibition-decoration",
                    title: "Оформление выставочных стендов",
                    href: "/portfolio/indoor/exhibition-decoration",
                },
            ],
        }, {
            id: 3,
            name: "branding",
            title: "Брендирование",
            links: [
                {
                    id: 1,
                    name: "vehicle-branding",
                    title: "Автотранспорт",
                    href: "/portfolio/branding/vehicle-branding",
                },
                {
                    id: 2,
                    name: "souvenir-products",
                    title: "Сувернирная продукция",
                    href: "/portfolio/branding/souvenir-products",
                },
                {
                    id: 3,
                    name: "clothing",
                    title: "Одежда",
                    href: "/portfolio/branding/clothing",
                },
            ],
        }, {
            id: 4,
            name: "printing",
            title: "Полиграфия",
            links: [
                {
                    id: 1,
                    name: "order-247",
                    title: "Заказать 24/7",
                    href: "/portfolio/printing/order-247",
                },
                {
                    id: 2,
                    name: "business-cards",
                    title: "Визитки",
                    href: "/portfolio/printing/business-cards",
                },
                {
                    id: 3,
                    name: "flyers",
                    title: "Листовки",
                    href: "/portfolio/printing/flyers",
                },
                {
                    id: 4,
                    name: "euro-booklets",
                    title: "Евробуклеты",
                    href: "/portfolio/printing/euro-booklets",
                },
                {
                    id: 5,
                    name: "postcards",
                    title: "Открытки",
                    href: "/portfolio/printing/postcards",
                },
            ],
        }],
    },
    {
        id: 4,
        name: "articles",
        title: "Статьи",
        href: '/articles/page/1'
    },
    {
        id: 5,
        name: "news",
        title: "Новости",
        href: "/news"
    },
    {
        id: 6,
        name: "contacts",
        title: "Контакты",
        href: "/contacts"
    }
]
