import {PromotionItem} from "@/types/misc";
import {promotions} from "@/data/promotion-data";

/**
 * Получить список специальных предложений
 */
export function getPromotions(): Promise<PromotionItem[]> {
    return Promise.resolve(promotions);
}