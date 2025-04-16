import {ServiceCategory} from "@/types/service";
import {convertStrapiImage} from "@/libs/converters/strapiImageConverter";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

const sortFunction = ((a: ServiceCategory, b: ServiceCategory) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
})

function sanitizeCategory(category: ServiceCategory): ServiceCategory {
    const { cover, items } = category;

    return {
        id: category.id,
        name: category.name,
        title: category.title,
        description: category.description,
        href: category.href,
        order: category.order,
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
    const serviceCategories = await Promise.all(
        json.data.map(sanitizeCategory)
    );

    const sortedServiceCategories = [...serviceCategories].sort(sortFunction);
    sortedServiceCategories.forEach((serviceCategory: ServiceCategory) => {
        if (Array.isArray(serviceCategory.items)) {
            serviceCategory.items.sort(sortFunction);
        }
    });

    return sortedServiceCategories;
}