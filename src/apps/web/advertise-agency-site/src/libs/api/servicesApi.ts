import {ServiceCategory} from "@/types/service";
import {convertStrapiImage} from "@/libs/converters/strapiImageConverter";
import {Article} from "@/types/article";
import {StrapiArticle} from "@/types/strapi/strapiArticle";
import {convertStrapiArticleToArticle} from "@/libs/converters/strapiArticleConverter";
import {getStrapiUrl} from "@/libs/envUtils";

const RUNNING_ON_SERVER = true;
const INNER_STRAPI_URL = getStrapiUrl(RUNNING_ON_SERVER);
const PUBLIC_STRAPI_URL = getStrapiUrl(!RUNNING_ON_SERVER);

const sortFunction = ((a: ServiceCategory, b: ServiceCategory) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
})

function sanitizeCategory(category?: ServiceCategory): ServiceCategory | undefined {
    if (!category) {
        return undefined;
    }

    const { cover, items } = category;

    return {
        id: category.id,
        name: category.name,
        title: category.title,
        description: category.description,
        href: category.href,
        order: category.order,
        cover: convertStrapiImage(cover, PUBLIC_STRAPI_URL),
        items: items?.map(sanitizeCategory).filter((category) => !!category) ?? [] // рекурсивно обрабатываем детей
    };
}

/**
 * Получить все категории услуг
 */
export async function getServiceCategories(filter: "all" | "header" | "nonheader" = "all"): Promise<ServiceCategory[]> {
    const url = filter === "all"
        ? `${INNER_STRAPI_URL}/api/service-categories?customPopulate=nested&pagination[pageSize]=100`
        : filter === "header"
            ? `${INNER_STRAPI_URL}/api/service-categories?filters[isHeader][$eq]=true&customPopulate=nested&pagination[pageSize]=100`
            : `${INNER_STRAPI_URL}/api/service-categories?filters[$or][0][isHeader][$eq]=false&filters[$or][1][isHeader][$null]=true&customPopulate=nested&pagination[pageSize]=100`

    const res = await fetch(
        url,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        console.error(`Ошибка при получении категорий услуг: ${res.statusText}`);
        throw new Error("Failed to fetch service categories");
    }

    const json = await res.json();

    if (!json || !Array.isArray(json.data)) {
        console.error("Не удалось загрузить категории услуг");
        throw new Error("Failed to fetch service categories");
    }

    const serviceCategories = await Promise.all(
        json?.data.map(sanitizeCategory)
    );

    const sortedServiceCategories = [...serviceCategories].sort(sortFunction);
    sortedServiceCategories.forEach((serviceCategory: ServiceCategory) => {
        if (Array.isArray(serviceCategory.items)) {
            serviceCategory.items.sort(sortFunction);
        }
    });

    return sortedServiceCategories;
}

/**
 * Получить категорию услуг по имени (name)
 * @param name - Название категории (например, "indoor")
 * @returns Объект категории или undefined, если не найдено
 */
export async function getServiceCategoryByName(name: string): Promise<ServiceCategory | undefined> {
    const res = await fetch(
        `${INNER_STRAPI_URL}/api/service-categories?filters[name][$eq]=${name}&populate=*`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        console.error(`Ошибка при получении категории "${name}": ${res.statusText}`);
        throw new Error("Failed to fetch service category by name");
    }

    const json = await res.json();
    const categories = json.data as ServiceCategory[];

    return sanitizeCategory(categories?.[0]);
}

/**
 * Получить статью по slug
 * @param requestSlug
 */
export async function getServiceArticleBySlug(requestSlug: string): Promise<Article | undefined> {
    const res = await fetch(
        `${INNER_STRAPI_URL}/api/service-articles?filters[slug][$eq]=${requestSlug}&customPopulate=nested`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении статей: ${res.statusText}`);
    }

    const json = await res.json();
    const strapiArticles: StrapiArticle[] = json.data;

    if (strapiArticles.length === 0) {
        return undefined;
    }

    const strapiArticle = strapiArticles[0];
    return convertStrapiArticleToArticle(strapiArticle, PUBLIC_STRAPI_URL);
}