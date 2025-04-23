import {PromotionItem} from "@/types/misc";
import {promotions} from "@/data/promotionData";

/**
 * Получить список специальных предложений
 */
export function getPromotions(): Promise<PromotionItem[]> {
    return Promise.resolve(promotions);
}