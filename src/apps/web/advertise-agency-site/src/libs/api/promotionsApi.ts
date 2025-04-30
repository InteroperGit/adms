import {PromotionItem} from "@/types/promotionItem";
import {StrapiPromotion} from "@/types/strapi/strapiPromotion";
import {convertStrapiImage} from "@/libs/converters/strapiImageConverter";

const STRAPI_URL = process.env.INTERNAL_STRAPI_URL;

/**
 * Получить список специальных предложений
 *
 * Выполняет запрос к Strapi API для получения всех объектов типа "promotions"
 * с вложенными связанными данными (через параметр `customPopulate=nested`).
 * Используется для отображения текущих акций/предложений на сайте, например, в карусели.
 *
 * Данные автоматически кэшируются и обновляются не чаще, чем раз в 60 секунд
 * благодаря опции `revalidate`.
 */
export async function getPromotions(): Promise<PromotionItem[]> {
    const res = await fetch(
        `${STRAPI_URL}/api/promotions?customPopulate=nested`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении статей: ${res.statusText}`);
    }

    const json = await res.json();
    return await Promise.all(
        json.data?.map((item: StrapiPromotion) => ({
                id: item.id,
                slug: item.slug,
                title: item.title,
                description: item.description,
                articleUrl: item.articleUrl,
                cover: item.cover ? convertStrapiImage(item.cover, STRAPI_URL) : undefined,
            } as PromotionItem
    )));
}