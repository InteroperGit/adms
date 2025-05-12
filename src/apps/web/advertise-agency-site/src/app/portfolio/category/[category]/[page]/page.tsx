import {JSX} from "react";
import {notFound} from "next/navigation";
import {cn} from "@/libs/utils";
import {getServiceCategories, getServiceCategoryByName} from "@/libs/api/servicesApi";
import {getProjectArticles, getProjectsArticlesCount, ProjectArticlesProps} from "@/libs/api/projectsApi";
import {PageCategoryParams, PageCategoryProps} from "@/types/page";
import HeroSection from "@/components/sections/HeroSection";
import {ServiceCategory} from "@/types/service";
import ServiceCategoryFilter from "@/components/navigation/ServiceCategoryFilter";
import ArticlesPagination from "@/components/misc/ArticlePagination";
import {Article} from "@/types/article";
import ArticleCard from "@/components/cards/ArticleCard";
import ServiceIsNotRespondedError from "@/components/error/ServiceIsNotRespondedError";
import {ALL_SERVICE_CATEGORY_NAME, DEFAULT_PORTFOLIO_PAGE_SIZE} from "@/config/constants";

const PORTFOLIO_PAGE_SIZE = process.env.PORTFOLIO_PAGE_SIZE && !isNaN(Number(process.env.PORTFOLIO_PAGE_SIZE))
    ? parseInt(process.env.PORTFOLIO_PAGE_SIZE, 10)
    : DEFAULT_PORTFOLIO_PAGE_SIZE;

/**
 * Функция для генерации статичных параметров (slug) для страницы категории,
 * используемая для статической генерации страниц с данными о проектах для
 * каждой категории.
 *
 * @returns {Promise<PageCategoryParams[]>} - Массив объектов, содержащих slug
 * для каждой категории и страницы в этой категории.
 *
 * Пример использования:
 * const params = await generateStaticParams();
 */
export const generateStaticParams = async (): Promise<PageCategoryParams[]> => {
    const categories: ServiceCategory[] | null = await getServiceCategories("nonheader");

    if (!Array.isArray(categories)) {
        throw new Error("categories is not an array");
    }

    const params = await Promise.all(categories?.map(async (category) => {
        const projectsCount = await getProjectsArticlesCount(category.name);

        if (projectsCount === null || projectsCount === undefined) {
            throw new Error(`Error fetching projects count for category: ${category.name}`);
        }

        // Рассчитываем количество страниц
        const totalPages = Math.ceil(projectsCount / PORTFOLIO_PAGE_SIZE);

        return Array.from({ length: totalPages }, (_, index) => ({
            category: category.name,
            page: (index + 1).toString()
        }));
    }));

    return params.flat();
}

/**
 * Основная компонента страницы портфолио, которая отвечает за рендеринг списка
 * проектов, фильтрацию по категории и пагинацию по страницам.
 *
 * @param {PageCategoryProps} props - Параметры, передаваемые компонентом, которые
 * включают параметры маршрута.
 * @param {PageCategoryParams} props.params - Объект с параметрами маршрута, включая
 * category (категория) и page (номер страницы).
 *
 * @returns {JSX.Element} - Разметка страницы, которая включает заголовок, фильтры,
 * список проектов и пагинацию.
 *
 * Пример использования:
 * <PortfolioPage params={{ category: 'web-design', page: '1' }} />
 */
const PortfolioPage = async (props: PageCategoryProps): Promise<JSX.Element> => {
    let category: string | null | undefined = undefined;
    let page: string = "1";
    let serviceCategory: ServiceCategory | null | undefined = undefined;
    let categories: ServiceCategory[] | null | undefined = undefined;
    let projectsCount: number | null | undefined = undefined;
    let pageCount: number = 0;
    let currentPage: number = 0;
    let projects: Article[];

    try {
        const params: PageCategoryParams = await props.params;
        category = params.category;
        page = params.page;
        serviceCategory = await getServiceCategoryByName(category);
        categories = await getServiceCategories("nonheader");
        projectsCount = await getProjectsArticlesCount(category);
        pageCount = Math.ceil(projectsCount / PORTFOLIO_PAGE_SIZE);
        currentPage = parseInt(page);
        const args = {
            category: category,
            page: currentPage,
            pageSize: PORTFOLIO_PAGE_SIZE,
        } as ProjectArticlesProps;
        const { articles } = await getProjectArticles(args);
        projects = articles;
    } catch (error) {
        console.error("Ошибка при получении данных с сервера:", error);
        return (
            <ServiceIsNotRespondedError />
        )
    }

    const PROJECT_URL_BASE_PATTERN = `/portfolio/category/${category}`;

    const isNotFound = (category !== ALL_SERVICE_CATEGORY_NAME && !serviceCategory)
        || (isNaN(currentPage) || !Number.isInteger(currentPage) || currentPage <= 0 || currentPage > pageCount)

    if (isNotFound) {
        notFound();
    }

    const serviceCategories: ServiceCategory[] = [
        { id: 1, name: ALL_SERVICE_CATEGORY_NAME, title: 'Все работы', href: `/portfolio/category/${ALL_SERVICE_CATEGORY_NAME}/1`},
        ...(categories ?? []).map(item => ({
            id: item.id,
            name: item.name,
            title: item.title,
            description: item.description,
            href: item.href ? `/portfolio/category/${item.name}/1` : undefined,
        })),
    ]

    const gridClasses = cn(
        "grid",
        `grid-cols-1`,
        `sm:grid-cols-2`,
        `lg:grid-cols-3`,
        "gap-6 md:gap-8"
    )

    return (
        <div className={cn("bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen")}>
            {/* Hero секция */}
            <HeroSection
                title={"Наши работы"}
                description={category === ALL_SERVICE_CATEGORY_NAME
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

            {/* Портфолио */}
            <section className={cn("mb-16")}>
                {/* Сетка проектов */}
                <div className={gridClasses}>
                    {projects.map((project, index) => (
                        <ArticleCard
                            key={project.id}
                            item={project}
                            index={index}
                        />
                    ))}
                </div>
            </section>

            {/* Pagination */}
            <section>
                {pageCount > 1
                    && <ArticlesPagination
                        urlBasePattern={PROJECT_URL_BASE_PATTERN}
                        currentPage={currentPage}
                        totalPages={pageCount}
                    />
                }
            </section>
        </div>
    );
}

export default PortfolioPage;