import {getArticleBySlug} from '@/libs/api/articlesApi';
import Article from "@/components/article/Article";
import React, {JSX} from "react";
import {Metadata} from "next";
import {PageSlugProps} from "@/types/page";

const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;

// ✅ ISR: страница будет пересоздаваться максимум раз в 60 секунд
export const revalidate = 60;

/**
 * Генерация метаданных страницы на основе данных статьи.
 *
 * Этот метод выполняет запрос к API для получения статьи по ее slug
 * (идентификатору). На основе полученных данных генерируются метаданные
 * для страницы, такие как:
 * - Заголовок страницы (title)
 * - Описание страницы (description)
 * - Метаданные Open Graph для социальных сетей
 * - Метаданные для Twitter
 * - Канонический URL страницы
 *
 * В случае, если статья не найдена, возвращаются дефолтные значения для
 * метаданных.
 *
 * @param {PageSlugProps} props - параметры страницы, содержащие slug статьи.
 * @returns {Promise<Metadata>} Объект метаданных, включающий информацию для
 * SEO, Open Graph, Twitter и другие данные.
 *
 * @example
 * const metadata = await generateMetadata(props);
 * console.log(metadata);
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
            canonical: `https://rmaster35.ru/articles/${article.slug}`,
        },
    };
}

/**
 * Страница отображения статьи.
 *
 * Этот компонент выполняет запрос к API для получения полной статьи по ее
 * slug. Если статья найдена, она отображается с использованием компонента
 * `Article`, который рендерит содержимое блоков статьи. Если статья не
 * найдена, выводится сообщение "Статья не найдена".
 *
 * @param {PageSlugProps} props - параметры страницы, содержащие slug статьи.
 * @returns {JSX.Element} Разметка страницы статьи, либо сообщение о том, что
 * статья не найдена.
 *
 * @example
 * <ArticlePage slug="example-article" />
 */
const ArticlePage = async (props: PageSlugProps): Promise<JSX.Element> => {
    const { slug } = await props.params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return <div>Статья не найдена</div>;
    }

    return (
        <article>
            <Article blocks={article.blocks || []} />
        </article>
    );
}

export default ArticlePage;