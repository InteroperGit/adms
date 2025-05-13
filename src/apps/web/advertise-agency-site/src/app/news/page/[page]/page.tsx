import ServiceIsNotRespondedError from "@/components/error/ServiceIsNotRespondedError";
import {notFound} from "next/navigation";
import {getNewsArticles, getNewsArticlesCount, NewsArticlesProps} from "@/libs/api/newsApi";
import {DEFAULT_NEWS_PAGE_SIZE} from "@/config/constants";
import HeroSection from "@/components/sections/HeroSection";
import {cn} from "@/libs/utils";
import ArticlesPagination from "@/components/misc/ArticlePagination";
import ArticleCard from "@/components/cards/ArticleCard";
import {Article} from "@/types/article";
import {JSX} from "react";

const URL_BASE_PATTERN = "/news/page";

/**
 * Параметры маршрута, включая номер текущей страницы.
 *
 * @param {Promise<NewsPageParams>} params - Обещание, которое возвращает параметры маршрута.
 */
interface NewsPageProps {
    params: Promise<NewsPageParams>;
}

/**
 * Интерфейс для параметров маршрута страницы новостей.
 *
 * @param {string} page - Номер страницы в формате строки.
 */
interface NewsPageParams {
    page: string;
}

// Компонент для отображения сообщения "Статьи не найдены"
const NoNewsFound: React.FC = (): JSX.Element => {
    return (
        <div className="flex justify-center items-center min-h-[300px]">
            <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                    Новости не найдены
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                    К сожалению, новости не найдены
                </p>
            </div>
        </div>
    );
}

/**
 * Компонент страницы новостей, который отображает список новостей с пагинацией.
 * Загружает новости с сервера, отображает их на странице и обеспечивает
 * пагинацию по страницам.
 *
 * @param {NewsPageProps} props - Параметры, передаваемые компонентом.
 * @param {Promise<NewsPageParams>} props.params - Обещание, которое возвращает
 * параметры маршрута, включая номер текущей страницы.
 * @param {string} props.params.page - Строка, представляющая номер текущей страницы.
 *
 * @returns {JSX.Element} - Разметка страницы, включающая шапку страницы, список
 * новостей и компонент пагинации.
 *
 * Пример использования:
 * <NewsPage params={{ page: '2' }} />
 */
const NewsPage = async (props: NewsPageProps): Promise<JSX.Element> => {
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

    if (newsCount === 0) {
        return <NoNewsFound />;
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
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

export default NewsPage;