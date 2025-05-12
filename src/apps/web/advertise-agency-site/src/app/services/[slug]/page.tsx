import {PageSlugProps} from "@/types/page";
import {Metadata} from "next";
import {getArticleBySlug} from "@/libs/api/articlesApi";
import Article from "@/components/article/Article";
import React, {JSX} from "react";
import {getServiceArticleBySlug} from "@/libs/api/servicesApi";

const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;

// ✅ ISR: страница будет пересоздаваться максимум раз в 60 секунд
export const revalidate = 60;

/**
 * Функция для генерации метаданных страницы на основе параметров из запроса.
 * Используется для настройки SEO, Open Graph и Twitter данных для страницы.
 *
 * @param {PageSlugProps} props - Параметры, передаваемые компонентом, которые
 * включают параметры маршрута.
 * @param {PageSlugProps.params} props.params - Объект, содержащий параметры маршрута.
 * @param {string} props.params.slug - Уникальный идентификатор (slug) статьи для
 * поиска в базе данных.
 *
 * @returns {Promise<Metadata>} - Объект с метаданными, такими как title,
 * description, Open Graph и Twitter данные.
 *
 * Пример использования:
 * const metadata = await generateMetadata({ params: { slug: 'service-article-1' } });
 */
export const generateMetadata = async (props: PageSlugProps): Promise<Metadata> => {
    const { slug } = await props.params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return {
            title: 'Статья не найдена',
            description: 'Запрошенная статья не существует или была удалена',
        };
    }

    return {
        title: article.seo?.title || article.title,
        description: article.seo?.description || article.description,
        openGraph: {
            title: article.seo?.title || article.title,
            description: article.seo?.description || article.description,
            url: `https://rmaster35.ru/projects/${article.slug}`,
            siteName: 'РА Рекламастер',
            images: [
                {
                    url: article.seo?.ogImage?.url || article.cover?.formats?.large?.url || "",
                    width: article.cover?.width || DEFAULT_IMAGE_WIDTH,
                    height: article.cover?.height || DEFAULT_IMAGE_HEIGHT,
                    alt: article.cover?.alternativeText || article.title,
                },
            ],
            locale: 'ru_RU',
            type: 'article',
            publishedTime: article.publishedAt,
            modifiedTime: article.updatedAt,
        },
        twitter: {
            card: 'summary_large_image',
            title: article.seo?.title || article.title,
            description: article.seo?.description || article.description,
            images: [article.seo?.ogImage?.url || article.cover?.formats?.large?.url || ""],
        },
        alternates: {
            canonical: `https://rmaster35.ru/services/${article.slug}`,
        },
    };
}

/**
 * Страница "Статья об услуге", которая рендерит статью по slug, полученному
 * из параметров маршрута.
 *
 * @param {PageSlugProps} props - Параметры, передаваемые компонентом, которые
 * включают параметры маршрута.
 * @param {PageSlugProps.params} props.params - Объект, содержащий параметры маршрута.
 * @param {string} props.params.slug - Уникальный идентификатор (slug) статьи для
 * поиска в базе данных.
 *
 * @returns {JSX.Element} - Разметка страницы, которая отображает заголовок и
 * содержимое статьи.
 *
 * Пример использования:
 * <ServiceArticlePage params={{ slug: 'service-article-1' }} />
 */
const ServiceArticlePage = async (props: PageSlugProps): Promise<JSX.Element> => {
    const { slug } = await props.params;
    const article = await getServiceArticleBySlug(slug);

    if (!article) {
        return <div>Статья не найдена</div>;
    }

    return (
        <article>
            <h1 className="text-3xl font-bold mb-10">{article.title}</h1>
            <Article blocks={article.blocks || []} />
        </article>
    );
}

export default ServiceArticlePage;