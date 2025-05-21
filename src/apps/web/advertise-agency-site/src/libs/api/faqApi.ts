import {Faq, FaqItem} from "@/types/faq";
import {StrapiFaq, StrapiFaqItem} from "@/types/strapi/strapiFaq";
import {getStrapiUrl} from "@/libs/envUtils";

const STRAPI_URL = getStrapiUrl();

/**
 * Получить список FAQ.
 * Этот метод выполняет запрос к API Strapi для получения данных раздела FAQ.
 * Запрос включает в себя параметр `customPopulate=nested`, чтобы извлечь вложенные данные, если таковые имеются.
 * После получения ответа от API метод конвертирует данные в формат, соответствующий типу `Faq`, который содержит массив элементов FAQ.
 * Каждый элемент в массиве представляет собой вопрос и ответ, и преобразуется в тип `FaqItem`.
 * Возвращаемый результат представляет собой объект `Faq`, содержащий массив с вопросами и ответами.
 */
export async function getFaq(): Promise<Faq> {
    if (!STRAPI_URL) {
        throw new Error("URL API Strapi не задан.");
    }

    const res = await fetch(
        `${STRAPI_URL}/api/faq?customPopulate=nested`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении FAQ: ${res.statusText}`);
    }

    const json = await res.json();
    const faq: StrapiFaq = await json.data;
    return {
        items: faq?.items?.map((item: StrapiFaqItem) => ({
            question: item.question,
            answer: item.answer,
        } as FaqItem)),
    } as Faq
}