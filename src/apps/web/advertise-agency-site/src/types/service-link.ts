export type ServiceSubItem = {
    name: string;
    href: string;
};

/**
 * Ссылка на услугу
 */
export type ServiceLink = {
    name: string,
    href: string,
    subItems?: ServiceSubItem[]
}