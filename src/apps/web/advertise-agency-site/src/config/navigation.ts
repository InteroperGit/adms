import {NavigationLink} from "@/types/navigation";

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
    {
        name: "Портфолио",
        href: "/portfolio",
        submenu: [{
            title: "Наружная реклама",
            links: [
                { name: "Световые короба", href: "/portfolio/outdoor/light-boxes" },
                { name: "Световые буквы", href: "/portfolio/outdoor/light-letters" },
                { name: "Кронштейны", href: "/portfolio/outdoor/brackets" },
                { name: "Согласование", href: "/portfolio/outdoor/approval" }
            ]
        }, {
            title: "Брендирование",
            links: [
                { name: "Брендирование авто", href: "/portfolio/branding/car" },
                { name: "Брендирование интерьера", href: "/portfolio/branding/interior" },
                { name: "Брендирование канцтоваров", href: "/portfolio/branding/stationery" }
            ]
        }, {
            title: "Полиграфия",
            links: [
                { name: "Листовая печать", href: "/portfolio/printing/sheet" },
                { name: "Широкоформатная печать", href: "/portfolio/printing/large-format" },
                { name: "Цифровая печать", href: "/portfolio/printing/digital" },
                { name: "Офсетная печать", href: "/portfolio/printing/offset" },
                { name: "УФ-печать", href: "/portfolio/printing/uv" }
            ]
        }],
    },
    { name: "Статьи", href: '/articles/page/1' },
    { name: "Новости", href: "/news" },
    { name: "Контакты", href: "/contacts" }
]
