import {getServiceCategories, getServiceCategoryByName} from "@/libs/api/servicesApi";
import {PageCategoryParams, PageCategoryProps} from "@/types/page";
import {notFound} from "next/navigation";
import {cn} from "@/libs/utils";
import HeroSection from "@/components/sections/HeroSection";
import {ServiceCategory} from "@/types/service";
import ServiceCategoryFilter from "@/components/navigation/ServiceCategoryFilter";
import {getProjectArticles, getProjectsArticlesCount, ProjectArticlesProps} from "@/libs/api/projectsApi";
import ArticlesPagination from "@/components/misc/ArticlePagination";
import {Article} from "@/types/article";
import {ArticleCard} from "@/components/cards/ArticleCard";
import {ALL_SERVICE_CATEGORY_NAME, DEFAULT_PORTFOLIO_PAGE_SIZE} from "@/config/constants";
import ServiceIsNotRespondedError from "@/components/error/ServiceIsNotRespondedError";

export async function generateStaticParams(): Promise<PageCategoryParams[]> {
    const categories: ServiceCategory[] | null = await getServiceCategories("nonheader");

    if (!Array.isArray(categories)) {
        return [];
    }

    return categories?.map(category => ({
        category: category.name,
        page: "1"
    }));
}

export default async function PortfolioPage(props: PageCategoryProps) {
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
        pageCount = Math.ceil(projectsCount / DEFAULT_PORTFOLIO_PAGE_SIZE);
        currentPage = parseInt(page);
        const args = {
            category: category,
            page: currentPage,
            pageSize: DEFAULT_PORTFOLIO_PAGE_SIZE,
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