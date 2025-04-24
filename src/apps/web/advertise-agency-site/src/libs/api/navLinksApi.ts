import {NavigationLink} from "@/types/navigation";

const STRAPI_URL = process.env.INTERNAL_STRAPI_URL;

const sortFunction = ((a: NavigationLink, b: NavigationLink) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
})

function sanitizeLink(link: NavigationLink): NavigationLink {
    return {
        id: link.id,
        name: link.name,
        title: link.title,
        href: link.href,
        order: link.order ?? 0,
        links: link.links?.map(sanitizeLink).sort(sortFunction)
    } as NavigationLink;
}

/**
 * Загрухить данные о навигационных ссылках из Strapi
 */
export async function fetchNavigationLinks(): Promise<NavigationLink[]> {
    const res = await fetch(`${STRAPI_URL}/api/navigation-links?filters[isHeader][$eq]=true&customPopulate=nested`, {
        next: { revalidate: 60 }, // ISR
    });
    const json = await res.json();
    const navigationLinks: NavigationLink[] = await Promise.all(json.data.map(sanitizeLink));
    const sortedNavigationLinks: NavigationLink[] | undefined = navigationLinks.sort(sortFunction);
    return sortedNavigationLinks || [];
}