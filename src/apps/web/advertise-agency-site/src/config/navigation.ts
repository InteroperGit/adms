import {NavigationLink} from "@/types/navigation-link";
import {ServiceLink} from "@/types/service-type";

export const navLinks: NavigationLink[] = [
    { name: "Услуги", href: "/services" },
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