export interface SubMenuItem {
    title: string;
    links: NavigationLink[];
}

/**
 * Навигационная ссылка
 */
export interface NavigationLink {
    name: string;
    href: string;
    submenu?: SubMenuItem[];
}
