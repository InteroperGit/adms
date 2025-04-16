import {PromisePageProps} from "@/types/page";
import {Metadata} from "next";
import {getArticleBySlug} from "@/libs/api/articles-api";
import {ArticleParser} from "@/libs/article-parser";
import React from "react";
import {getServiceArticleBySlug} from "@/libs/api/services-api";

const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;

// ✅ ISR: страница будет пересоздаваться максимум раз в 60 секунд
export const revalidate = 60;

/**
 * Сгенерировать метаданные
 * @param props
 */
export async function generateMetadata(props: PromisePageProps): Promise<Metadata> {
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
        keywords: article.seo?.keywords || article.tags?.join(', '),
        openGraph: {
            title: article.seo?.title || article.title,
            description: article.seo?.description || article.description,
            url: `https://rmaster35.ru/projects/${article.slug}`,
            siteName: 'РА Рекламастер',
            images: [
                {
                    url: article.seo?.ogImage || article.cover?.formats?.large?.url || "",
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
            images: [article.seo?.ogImage || article.cover?.formats?.large?.url || ""],
        },
        alternates: {
            canonical: `https://rmaster35.ru/projects/${article.slug}`,
        },
    };
}

/**
 * Страница "Статья об услуге"
 * @param props
 * @constructor
 */
export default async function ServiceArticlePage(props: PromisePageProps) {
    const { slug } = await props.params;
    const article = await getServiceArticleBySlug(slug);

    if (!article) {
        return <div>Статья не найдена</div>;
    }

    return (
        <article>
            <h1 className="text-3xl font-bold mb-10">{article.title}</h1>
            <ArticleParser blocks={article.blocks || []} />
        </article>
    );
}