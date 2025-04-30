import ServiceIsNotRespondedError from "@/components/error/ServiceIsNotRespondedError";
import {notFound} from "next/navigation";
import {getNewsArticles, getNewsArticlesCount, NewsArticlesProps} from "@/libs/api/newsApi";
import {DEFAULT_NEWS_PAGE_SIZE} from "@/config/constants";
import HeroSection from "@/components/sections/HeroSection";
import {cn} from "@/libs/utils";
import ArticlesPagination from "@/components/misc/ArticlePagination";
import {ArticleCard} from "@/components/cards/ArticleCard";
import {Article} from "@/types/article";

const URL_BASE_PATTERN = "/news/page";

interface NewsPageParams {
    page: string;
}

interface NewsPageProps {
    params: Promise<NewsPageParams>
}

export default async function NewsPage(props: NewsPageProps) {
    let page: string = "1";
    let currentPage: number = 0;
    let newsCount: number | null | undefined = undefined;
    let pageCount: number = 0;
    let news: Article[];

    try {
        const params = await props.params;
        page = params.page;
        currentPage = parseInt(page);
        newsCount = await getNewsArticlesCount();
        pageCount = Math.ceil(newsCount / DEFAULT_NEWS_PAGE_SIZE);
        const args = {
            page: currentPage,
            pageSize: DEFAULT_NEWS_PAGE_SIZE,
        } as NewsArticlesProps;
        const { articles } = await getNewsArticles(args);
        news = articles;
    }
    catch (error) {
        console.error("Ошибка при получении данных с сервера:", error);
        return (<ServiceIsNotRespondedError />);
    }

    const isNotFound = isNaN(currentPage)
        || !Number.isInteger(currentPage)
        || currentPage <= 0
        || currentPage > pageCount;

    if (isNotFound) {
        notFound();
    }

    return (
        <div className={cn("bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen")}>
            {/* Шапка страницы */}
            <HeroSection
                title={"Новости компании"}
                description={"Следите за нашими последними достижениями и обновлениями"}
            />

            {/* Основной контент */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                {news.map((item, index) => (
                    <ArticleCard
                        key={item.id}
                        item={item}
                        index={index}
                    />
                ))}
            </div>

            {/* Pagination */}
            <section>
                {pageCount > 1
                    && <ArticlesPagination
                        urlBasePattern={URL_BASE_PATTERN}
                        currentPage={currentPage}
                        totalPages={pageCount}
                    />
                }
            </section>
        </div>
    )
}