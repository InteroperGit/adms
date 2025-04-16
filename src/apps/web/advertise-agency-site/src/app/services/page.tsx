import HeroSection from "@/components/sections/HeroSection";
import {CtaSection} from "@/components/sections/CtaSection";
import { getAllServiceCategories } from "@/libs/api/services-api";
import { ServiceCategoryPreviewCard } from "@/components/cards/ServiceCategoryPreviewCard";

export default async function ServicesPage() {
    const serviceCategories = await getAllServiceCategories();

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Hero секция */}
            <HeroSection
                title={"Наши услуги"}
                description={"Полный спектр рекламных услуг для вашего бизнеса - от создания концепции до реализации"}
            />

            {/* Основной контент */}
            <div className="px-5 my-16 space-y-24">
                {serviceCategories.map(category => (
                    <section key={category.id}>
                        {/* Заголовок основной категории */}
                        <h2 className="text-3xl font-bold mb-8">
                            {category.title || category.name}
                        </h2>

                        {/* Список карточек вложенных категорий */}
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {(category.items || []).map(subCategory => (
                                <ServiceCategoryPreviewCard
                                    key={subCategory.id}
                                    category={subCategory}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>

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