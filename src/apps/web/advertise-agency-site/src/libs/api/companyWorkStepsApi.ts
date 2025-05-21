import {CompanyWorkStep} from "@/types/companyWorkStep";
import {StrapiCompanyWorkStep} from "@/types/strapi/strapiCompanyWorkStep";
import {getStrapiUrl} from "@/libs/envUtils";

const STRAPI_URL = getStrapiUrl();

/**
 * Получить список шагов выполнения работы компании.
 * Этот метод выполняет запрос к API Strapi для получения всех шагов выполнения работы компании.
 * Запрос включает в себя параметр сортировки по полю `stepNumber`, чтобы результаты были отсортированы по возрастанию этого поля.
 * Метод обрабатывает ответ от API, конвертируя его в формат, соответствующий типу `CompanyWorkStep`,
 * и возвращает массив шагов, содержащий поля: `title`, `description` и `stepNumber`.
 */
export async function getCompanyWorkSteps(): Promise<CompanyWorkStep[]> {
    const res = await fetch(
        `${STRAPI_URL}/api/company-work-steps?customPopulate=nested&sort=stepNumber`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error(`Ошибка при получении рабочих шагов компании: ${res.statusText}`);
    }

    const json = await res.json();
    return Promise.all(
        json.data?.map((item: StrapiCompanyWorkStep) => ({
                title: item.title,
                description: item.description,
                stepNumber: item.stepNumber,
            } as CompanyWorkStep
        )));
}