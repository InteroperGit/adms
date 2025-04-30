import {PromotionItem} from "@/types/promotionItem";
import {StrapiPromotion} from "@/types/strapi/strapiPromotion";
import {convertStrapiImage} from "@/libs/converters/strapiImageConverter";

const STRAPI_URL = process.env.INTERNAL_STRAPI_URL;

/**
 * Получить список специальных предложений
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
                ...item,
                cover: item.cover ? convertStrapiImage(item.cover, STRAPI_URL) : undefined,
            }
    )));
}