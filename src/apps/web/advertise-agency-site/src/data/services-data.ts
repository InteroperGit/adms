import {ServiceItem} from "@/types/service";

export const services: ServiceItem[] = [
    {
        name: "outdoor",
        title: "Наружная реклама",
        items: [
            {
                name: "light-letters",
                title: "Световые буквы",
                href: "/services/outdoor/light-letters",
            },
            {
                name: "light-boxes",
                title: "Световые короба и консоли",
                href: "/services/outdoor/light-boxes",
            },
            {
                name: "brackets",
                title: "Кронштейны",
                href: "/services/outdoor/brackets",
            },
            {
                name: "banners",
                title: "Баннеры",
                href: "/services/outdoor/banners",
            },
            {
                name: "technical-design",
                title: "Проектирование",
                href: "/services/outdoor/technical-design",
            },
            {
                name: "approval",
                title: "Согласование",
                href: "/services/outdoor/approval",
            },
            {
                name: "installation",
                title: "Монтаж",
                href: "/services/outdoor/installation",
            },
        ],
    },
    {
        name: "indoor",
        title: "Внутренняя реклама",
        items: [
            {
                name: "interior-logos",
                title: "Интерьерные логотипы",
                href: "/services/indoor/interior-logos",
            },
            {
                name: "navigation",
                title: "Навигация, указатели",
                href: "/services/indoor/navigation",
            },
            {
                name: "stands-signs",
                title: "Стенды и таблички",
                href: "/services/indoor/stands-signs",
            },
            {
                name: "opening-hours",
                title: "Режимы работы",
                href: "/services/indoor/opening-hours",
            },
            {
                name: "neon-signs",
                title: "Неоновые вывески",
                href: "/services/indoor/neon-signs",
            },
            {
                name: "pavilion-decoration",
                title: "Оформление павильонов",
                href: "/services/indoor/pavilion-decoration",
            },
            {
                name: "exhibition-decoration",
                title: "Оформление выставочных стендов",
                href: "/services/indoor/exhibition-decoration",
            },
        ],
    },
    {
        name: "branding",
        title: "Брендирование",
        items: [
            {
                name: "vehicle-branding",
                title: "Автотранспорт",
                href: "/services/branding/vehicle-branding",
            },
            {
                name: "souvenir-products",
                title: "Сувернирная продукция",
                href: "/services/branding/souvenir-products",
            },
            {
                name: "clothing",
                title: "Одежда",
                href: "/services/branding/clothing",
            },
        ],
    },
    {
        name: "printing",
        title: "Полиграфия",
        items: [
            {
                name: "order-247",
                title: "Заказать 24/7",
                href: "/services/printing/order-247",
            },
            {
                name: "business-cards",
                title: "Визитки",
                href: "/services/printing/business-cards",
            },
            {
                name: "flyers",
                title: "Листовки",
                href: "/services/printing/flyers",
            },
            {
                name: "euro-booklets",
                title: "Евробуклеты",
                href: "/services/printing/euro-booklets",
            },
            {
                name: "postcards",
                title: "Открытки",
                href: "/services/printing/postcards",
            },
        ],
    },
];