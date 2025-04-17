/**
 * Навигационная ссылка
 */
export interface NavigationLink {
    id: number;
    name: string;
    title: string;
    href?: string;
    order?: number;
    links?: NavigationLink[];
}
