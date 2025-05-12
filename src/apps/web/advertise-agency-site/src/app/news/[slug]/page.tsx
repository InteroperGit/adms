import {PageSlugParams, PageSlugProps} from "@/types/page";
import {Metadata} from "next";
import {getProjectArticleBySlug} from "@/libs/api/projectsApi";
import {DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH} from "@/config/constants";
import Article from "@/components/article/Article";
import React, {JSX} from "react";
import {getNewsArticleBySlug, getNewsSlugs} from "@/libs/api/newsApi";
import {notFound} from "next/navigation";

/**
 * Функция для генерации метаданных страницы на основе параметров из запроса.
 * Используется для настройки SEO, Open Graph и Twitter данных для страницы.
 *
 * @param {PageSlugProps} props - Параметры, передаваемые компонентом, которые включают параметры маршрута.
 * @param {PageSlugProps.params} props.params - Объект, содержащий параметры маршрута.
 * @param {string} props.params.slug - Уникальный идентификатор (slug) новости для поиска в базе данных.
 *
 * @returns {Promise<Metadata>} - Объект с метаданными, такими как title, description, Open Graph и Twitter данные.
 *
 * Пример использования:
 * const metadata = await generateMetadata({ params: { slug: 'news-article-1' } });
 */
export const generateMetadata = async (props: PageSlugProps): Promise<Metadata> => {
    const { slug } = await props.params;
    const news = await getProjectArticleBySlug(slug);

    if (!news) {
        return {
            title: 'Новость не найдена',
            description: 'Запрошенная новость не существует или была удалена',
        };
    }

    return {
        title: news.seo?.title || news.title,
        description: news.seo?.description || news.description,
        openGraph: {
            title: news.seo?.title || news.title,
            description: news.seo?.description || news.description,
            url: `https://rmaster35.ru/news/${news.slug}`,
            siteName: 'РА Рекламастер',
            images: [
                {
                    url: news.seo?.ogImage?.url || news.cover?.url || "",
                    width: news.seo?.ogImage?.width || DEFAULT_IMAGE_WIDTH,
                    height: news.seo?.ogImage?.height || DEFAULT_IMAGE_HEIGHT,
                    alt: news.cover?.alternativeText || news.title,
                },
            ],
            locale: 'ru_RU',
            type: 'article',
            publishedTime: news.publishedAt,
            modifiedTime: news.updatedAt,
        },
        twitter: {
            card: 'summary_large_image',
            title: news.seo?.title || news.title,
            description: news.seo?.description || news.description,
            images: [news.seo?.ogImage?.url || news.cover?.url || ""],
        },
        alternates: {
            canonical: `https://rmaster35.ru/news/${news.slug}`,
        },
    };
}

/**
 * Функция для генерации статичных параметров (slug) для страницы.
 * Используется для статической генерации страниц с данными о новостях.
 *
 * @returns {Promise<PageSlugParams[]>} - Массив объектов, содержащих slug для каждой новости.
 *
 * Пример использования:
 * const params = await generateStaticParams();
 */
export const generateStaticParams = async (): Promise<PageSlugParams[]> => {
    const slugs = await getNewsSlugs();
    return slugs.map((slug) => ({ slug }))
}

/**
 * Основная компонента страницы новостей, которая отвечает за рендеринг статьи
 * на основе данных, полученных через slug, и отображение содержимого новости.
 *
 * @param {PageSlugProps} props - Параметры, передаваемые компонентом, которые включают параметры маршрута.
 * @param {PageSlugProps.params} props.params - Объект, содержащий параметры маршрута.
 * @param {string} props.params.slug - Уникальный идентификатор (slug) новости для поиска в базе данных.
 *
 * @returns {JSX.Element} - Разметка статьи, которая отображает заголовок и содержимое новости.
 *
 * Пример использования:
 * <NewsPage params={{ slug: 'news-article-1' }} />
 */
const NewsPage = async (props: PageSlugProps): Promise<JSX.Element> => {
    const { slug } = await props.params;
    const news = await getNewsArticleBySlug(slug);

    if (!news) {
        return notFound();
    }

    return (
        <article className="mx-5">
            <h1 className="text-3xl font-bold mb-10">{news.title}</h1>
            <Article blocks={news.blocks || []} />
        </article>
    );
}

export default NewsPage;