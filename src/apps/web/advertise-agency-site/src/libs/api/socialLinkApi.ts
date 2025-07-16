import {SocialLink} from "@/types/socialLink";
import {StrapiSocialLink} from "@/types/strapi/strapiSocialLink";
import {getStrapiUrl} from "@/libs/envUtils";

const RUNNING_ON_SERVER = true;
const INNER_STRAPI_URL = getStrapiUrl(RUNNING_ON_SERVER);

/**
 * Функция для получения списка социальных ссылок с API Strapi.
 * Загружает данные о социальных ссылках, используя REST API Strapi, и преобразует их в формат,
 * совместимый с типом `SocialLink`.
 *
 * @returns {Promise<SocialLink[]>} - Обещание, которое возвращает массив объектов
 * `SocialLink`, содержащих информацию о социальных сетях, таких как название, описание,
 * ссылка и уникальный идентификатор.
 *
 * @throws {Error} - Выбрасывает ошибку, если не удается получить данные с API Strapi,
 * либо если URL API Strapi не задан в окружении.
 *
 * Пример использования:
 * const socialLinks = await getSocialLinks();
 */
export const getSocialLinks = async (): Promise<SocialLink[]> => {
    if (!INNER_STRAPI_URL) {
        throw new Error("URL API Strapi не задан.");
    }

    const res = await fetch(
        `${INNER_STRAPI_URL}/api/social-links?customPopulate=nested`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении социальных ссылок: ${res.statusText}`);
    }

    const json = await res.json();

    return json.data?.map((item: StrapiSocialLink) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        title: item.title,
        description: item.description,
        url: item.url,
    } as SocialLink));
}