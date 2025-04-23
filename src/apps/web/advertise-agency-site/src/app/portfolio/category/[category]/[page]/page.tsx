import {getServiceCategories, getServiceCategoryByName} from "@/libs/api/services-api";
import {PageCategoryParams, PageCategoryProps} from "@/types/page";
import {notFound} from "next/navigation";
import {cn} from "@/libs/utils";
import HeroSection from "@/components/sections/HeroSection";
import {ServiceCategory} from "@/types/service";
import ServiceCategoryFilter from "@/components/navigation/ServiceCategoryFilter";

const SERVICE_CATEGORY_ALL_NAME = "all";

export async function generateStaticParams(): Promise<PageCategoryParams[]> {
    try {
        const categories: ServiceCategory[] | null = await getServiceCategories("nonheader");

        if (!Array.isArray(categories)) {
            return [];
        }

        return categories?.map(category => ({
            category: category.name,
            page: "1"
        }));
    }
    catch (error) {
        console.error("Ошибка при генерации путей категорий:", error);
        return [];
    }
}

export default async function PortfolioPage(props: PageCategoryProps) {
        try {
            const { category } = await props.params;

            const serviceCategory: ServiceCategory | null = await getServiceCategoryByName(category);
            const categories: ServiceCategory[] | null = await getServiceCategories("nonheader");

            const serviceCategories: ServiceCategory[] = [
                { id: 1, name: SERVICE_CATEGORY_ALL_NAME, title: 'Все работы', href: `/portfolio/category/${SERVICE_CATEGORY_ALL_NAME}/1`},
                ...(categories ?? []).map(item => ({
                    id: item.id,
                    name: item.name,
                    title: item.title,
                    description: item.description,
                    href: item.href ? `/portfolio/category/${item.name}/1` : undefined,
                })),
            ]

            if (category !== SERVICE_CATEGORY_ALL_NAME && !serviceCategory) {
                notFound();
            }

            return (
                <div className={cn("bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen")}>
                    {/* Hero секция */}
                    <HeroSection
                        title={"Наши работы"}
                        description={category === SERVICE_CATEGORY_ALL_NAME
                            ? 'Реализованные проекты за последние годы'
                            : `Проекты в категории "${serviceCategory?.title}"`}
                    />

                    {/* Фильтры */}
                    <section className={cn("py-12 px-2 md:px-6")}>
                        <ServiceCategoryFilter
                            categories={serviceCategories}
                            activeCategory={category}
                        />
                    </section>
                </div>
            );
        } catch (error) {
            console.error("Ошибка при получении данных с сервера:", error);
            // Показываем ошибку при отказе от подключения или другим причинам
            return (
                <div className="min-h-screen flex items-center justify-center text-center p-4">
                    <h1 className="text-xl text-red-600">Сервис временно недоступен. Попробуйте позже.</h1>
                </div>
            );
        }
}