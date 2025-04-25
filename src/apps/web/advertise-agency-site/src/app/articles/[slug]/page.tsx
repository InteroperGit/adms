import {getArticleBySlug} from '@/libs/api/articlesApi';
import {ArticleParser} from "@/libs/articleParser";
import React from "react";
import {Metadata} from "next";
import {PageSlugProps} from "@/types/page";

const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;

// ✅ ISR: страница будет пересоздаваться максимум раз в 60 секунд
export const revalidate = 60;

/**
 * Сгенерировать метаданные
 * @param props
 */
export async function generateMetadata(props: PageSlugProps): Promise<Metadata> {
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
 * Страница "Статья"
 * @param props
 * @constructor
 */
export default async function ArticlePage(props: PageSlugProps) {
    const { slug } = await props.params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return <div>Статья не найдена</div>;
    }

    return (
        <article>
            <ArticleParser blocks={article.blocks || []} />
        </article>
    );
}