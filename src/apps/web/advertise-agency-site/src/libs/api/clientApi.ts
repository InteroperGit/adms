import {Client} from "@/types/client";
import {StrapiClient} from "@/types/strapi/strapiClient";
import {convertStrapiImage} from "@/libs/converters/strapiImageConverter";
import {getStrapiUrl} from "@/libs/envUtils";

const STRAPI_URL = getStrapiUrl();

/**
 * Получает список клиентов с сервера Strapi.
 *
 * Этот метод выполняет запрос к API Strapi, чтобы получить данные о клиентах, включая их логотипы и описание.
 * Он обрабатывает получение и преобразование данных, включая ссылки на изображения и правильное их отображение.
 *
 * @returns {Promise<Client[]>} Список клиентов, преобразованный в формат, подходящий для использования в приложении.
 * @throws {Error} Если не задан URL Strapi или произошла ошибка при запросе данных.
 *
 * Пример использования:
 * ```
 * const clients = await getClients();
 * console.log(clients);
 * ```
 */
export const getClients = async (): Promise<Client[]> => {
    if (!STRAPI_URL) {
        throw new Error("URL API Strapi не задан.");
    }

    const res = await fetch(
        `${STRAPI_URL}/api/clients?customPopulate=nested`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении клиентов: ${res.statusText}`);
    }

    const json = await res.json();

    return json.data?.map((item: StrapiClient) => ({
                id: item.id,
                name: item.name,
                title: item.title,
                description: item.description,
                logo: convertStrapiImage(item.logo, STRAPI_URL),
            } as Client
    ));
}