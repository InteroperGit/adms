import {NavigationLink} from "@/types/navigation";
import {getStrapiUrl} from "@/libs/envUtils";

const RUNNING_ON_SERVER = true;
const STRAPI_URL = getStrapiUrl(RUNNING_ON_SERVER);

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

    if (!json || !Array.isArray(json.data)) {
        console.error("Не удалось загрузить навигационные ссылки");
        throw new Error("Failed to fetch navigation links");
    }

    const navigationLinks: NavigationLink[] = await Promise.all(json.data.map(sanitizeLink));
    const sortedNavigationLinks: NavigationLink[] | undefined = navigationLinks.sort(sortFunction);
    return sortedNavigationLinks || [];
}