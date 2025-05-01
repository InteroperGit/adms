import {AboutCompany} from "@/types/aboutCompany";
import {StrapiAboutCompany} from "@/types/strapi/strapiAboutCompany";
import {convertStrapiImage} from "@/libs/converters/strapiImageConverter";

const STRAPI_URL = process.env.INTERNAL_STRAPI_URL;

/**
 * Получает данные о компании из Strapi CMS.
 *
 * Выполняет HTTP-запрос к эндпоинту `/api/about-company` с параметром `customPopulate=nested`,
 * который обеспечивает подгрузку вложенных структур (например, изображений).
 *
 * Метод возвращает промис с объектом `AboutCompany`, включающим:
 * - `id`: числовой идентификатор записи;
 * - `title`: заголовок секции (например, "О компании");
 * - `slug`: уникальный идентификатор записи;
 * - `description`: текстовое описание компании;
 * - `highlights`: массив строк с ключевыми особенностями компании;
 * - `images`: массив изображений, связанных с разделом.
 *
 * Применяется revalidate (ISR) с интервалом в 60 секунд, что позволяет сохранять данные в кеше
 * и периодически обновлять их без полной регенерации страницы.
 *
 * @throws {Error} если ответ от сервера не является успешным.
 *
 * @returns {Promise<AboutCompany>} объект с данными о компании.
 */
export async function getAboutCompany(): Promise<AboutCompany> {
    const res = await fetch(
        `${STRAPI_URL}/api/about?customPopulate=nested`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении статей: ${res.statusText}`);
    }

    const json = await res.json();
    const strapiAboutCompany = await json.data as StrapiAboutCompany;

    return {
        id: strapiAboutCompany.id,
        title: strapiAboutCompany.title,
        slug: strapiAboutCompany.slug,
        description: strapiAboutCompany.description,
        highlights: strapiAboutCompany.highlights,
        images: strapiAboutCompany.images.map((image) => convertStrapiImage(image, STRAPI_URL))
    } as AboutCompany;
}