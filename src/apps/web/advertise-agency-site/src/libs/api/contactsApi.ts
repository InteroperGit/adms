import {ContactItem} from "@/types/contacts";
import {StrapiContactItem} from "@/types/strapi/strapiContacts";
import {getStrapiUrl} from "@/libs/envUtils";

const RUNNING_ON_SERVER = true;
const STRAPI_URL = getStrapiUrl(RUNNING_ON_SERVER);

/**
 * Функция для получения списка контактных элементов с API Strapi.
 * Загружает данные о контактных элементах через REST API Strapi, обрабатывает их и преобразует
 * в формат, совместимый с типом `ContactItem`.
 *
 * @returns {Promise<ContactItem[]>} - Обещание, которое возвращает массив объектов `ContactItem`,
 * содержащих информацию о каждом контакте, таких как имя, slug, информация о контакте, URL и порядок.
 *
 * @throws {Error} - Выбрасывает ошибку, если не удается получить данные с API Strapi,
 * либо если URL API Strapi не задан в окружении.
 *
 * Пример использования:
 * const contacts = await getContacts();
 */
export const getContacts = async (): Promise<ContactItem[]> => {
    if (!STRAPI_URL) {
        throw new Error("URL API Strapi не задан.");
    }

    const res = await fetch(
        `${STRAPI_URL}/api/contact-items?customPopulate=nested`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении контактов: ${res.statusText}`);
    }

    const json = await res.json();

    return json.data?.map((item: StrapiContactItem) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        title: item.title,
        info: item.info,
        url: item.url,
        order: item.order,
    } as ContactItem))
    .sort((contact: ContactItem) => contact.order);
}