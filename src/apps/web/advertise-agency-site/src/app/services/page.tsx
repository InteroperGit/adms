import HeroSection from "@/components/sections/HeroSection";
import CtaSection from "@/components/sections/CtaSection";
import { getServiceCategories } from "@/libs/api/servicesApi";
import ServiceCategoryCard from "@/components/cards/ServiceCategoryCard";
import ServiceIsNotRespondedError from "@/components/error/ServiceIsNotRespondedError";
import {ServiceCategory} from "@/types/service";

/**
 * Страница "Услуги", которая отображает список категорий услуг и вложенных
 * категорий для предоставления информации о предлагаемых услугах.
 *
 * @returns {JSX.Element} - Разметка страницы, которая включает Hero секцию с
 * описанием, список категорий и вложенных категорий, а также CTA блок с кнопкой.
 *
 * Пример использования:
 * <ServicesPage />
 */
const ServicesPage = async () => {
    let serviceCategories: ServiceCategory[];

    try {
        serviceCategories = await getServiceCategories("header");
    }
    catch (error) {
        console.error("Ошибка при получении данных с сервера:", error);
        return (
            <ServiceIsNotRespondedError />
        )
    }

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Hero секция */}
            <HeroSection
                title={"Наши услуги"}
                description={"Полный спектр рекламных услуг для вашего бизнеса - от создания концепции до реализации"}
            />

            {/* Основной контент */}
            <section className="px-5 my-16 space-y-24">
                {serviceCategories.map(category => (
                    <div key={category.id}>
                        {/* Заголовок основной категории */}
                        <h2 className="text-3xl font-bold mb-8">
                            {category.title || category.name}
                        </h2>

                        {/* Список карточек вложенных категорий */}
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {(category.items || []).map(subCategory => (
                                <ServiceCategoryCard
                                    key={subCategory.id}
                                    category={subCategory}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* CTA блок */}
            <CtaSection
                title="Не нашли нужную услугу?"
                description="Расскажите нам о вашем проекте, и мы предложим оптимальное решение"
                buttonText="Обсудить проект"
                buttonHref="/contacts"
                className="dark:bg-gray-900 dark:text-gray-100 my-16"
            />
        </div>
    )
}

export default ServicesPage;