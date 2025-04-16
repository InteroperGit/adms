import {ServiceCategory} from "@/types/service";
import {convertStrapiImage} from "@/libs/converters/strapiImageConverter";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

function sanitizeCategory(category: ServiceCategory): ServiceCategory {
    const { cover, items, ...rest } = category;

    return {
        id: category.id,
        name: category.name,
        title: category.title,
        href: category.href,
        description: category.description,
        cover: convertStrapiImage(cover, STRAPI_URL),
        items: items?.map(sanitizeCategory) ?? [] // рекурсивно обрабатываем детей
    };
}

/**
 * Получить все категории услуг
 */
export async function getAllServiceCategories(): Promise<ServiceCategory[]> {
    const res = await fetch(
        `${STRAPI_URL}/api/service-categories?filters[is_header][$eq]=true&customPopulate=nested&pagination[pageSize]=100`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении категорий услуг: ${res.statusText}`);
    }

    const json = await res.json();
    return await Promise.all(
        json.data.map(sanitizeCategory)
    );
}