import {CompanyAdvantageItem} from "@/types/companyAdvantageItem";
import {StrapiCompanyAdvantage} from "@/types/strapi/strapiCompanyAdvantage";
import {getStrapiUrl} from "@/libs/envUtils";

const STRAPI_URL = getStrapiUrl();

/**
 * Получить список преимуществ компании
 *
 * Выполняет запрос к Strapi API для получения всех объектов типа "company-advantages"
 * с вложенными связанными данными (используется `customPopulate=nested`).
 *
 * Используется для отображения преимуществ компании на сайте — например, в разделе "Почему мы?".
 * Каждый элемент преобразуется в тип `CompanyAdvantageItem` и включает id, slug, title и description.
 *
 * Данные кэшируются с повторной валидацией каждые 60 секунд.
 */
export async function getCompanyAdvantages(): Promise<CompanyAdvantageItem[]> {
    const res = await fetch(
        `${STRAPI_URL}/api/company-advantages?customPopulate=nested`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении статей: ${res.statusText}`);
    }

    const json = await res.json();
    return await Promise.all(
        json.data?.map((item: StrapiCompanyAdvantage) => ({
                id: item.id,
                slug: item.slug,
                title: item.title,
                description: item.description,
            } as CompanyAdvantageItem
        )));
}