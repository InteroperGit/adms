import {NavigationLink} from "@/types/navigation";
import {ServiceLink} from "@/types/service";

export const navLinks: NavigationLink[] = [
    {
        name: "Услуги",
        href: "/services",
        submenu: [{
            title: "Наружная реклама",
            links: [
                { name: "Световые короба", href: "/services/outdoor/light-boxes" },
                { name: "Световые буквы", href: "/services/outdoor/light-letters" },
                { name: "Кронштейны", href: "/services/outdoor/brackets" },
                { name: "Согласование", href: "/services/outdoor/approval" }
            ]
        }, {
            title: "Брендирование",
            links: [
                { name: "Брендирование авто", href: "/services/branding/car" },
                { name: "Брендирование интерьера", href: "/services/branding/interior" },
                { name: "Брендирование канцтоваров", href: "/services/branding/stationery" }
            ]
        }, {
            title: "Полиграфия",
            links: [
                { name: "Листовая печать", href: "/services/printing/sheet" },
                { name: "Широкоформатная печать", href: "/services/printing/large-format" },
                { name: "Цифровая печать", href: "/services/printing/digital" },
                { name: "Офсетная печать", href: "/services/printing/offset" },
                { name: "УФ-печать", href: "/services/printing/uv" }
            ]
        }],
    },
    { name: "Портфолио", href: "/portfolio" },
    { name: "Статьи", href: '/articles' },
    { name: "Новости", href: "/news" },
    { name: "Контакты", href: "/contacts" }
]

export const servicesLinks: ServiceLink[] = [
    {
        name: "Наружная реклама",
        href: '/services/outdoor',
        subItems: [
            { name: "световые короба", href: "/services/outdoor/light-boxes" },
            { name: "световые буквы", href: "/services/outdoor/light-letters" },
            { name: "кронштейны", href: "/services/outdoor/brackets" },
            { name: "согласование", href: "/services/outdoor/approval" }
        ]
    },
    {
        name: "Брендирование",
        href: '/services/branding',
        subItems: [
            { name: "брендирование авто", href: "/services/branding/car" },
            { name: "брендирование интерьера", href: "/services/branding/interior" },
            { name: "брендирование канцтоваров", href: "/services/branding/stationery" }
        ]
    },
    {
        name: "Полиграфия",
        href: '/services/printing',
        subItems: [
            { name: "листовая печать", href: "/services/printing/sheet" },
            { name: "широкоформатная печать", href: "/services/printing/large-format" },
            { name: "цифровая печать", href: "/services/printing/digital" },
            { name: "офсетная печать", href: "/services/printing/offset" },
            { name: "уф-печать", href: "/services/printing/uv" }
        ]
    }
]