import {getAllArticles, getArticleBySlug} from '@/libs/api/articles';
import {ArticleParser} from "@/libs/article-parser";
import React from "react";
import {Metadata} from "next";
import {PromisePageProps} from "@/types/page";

const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;

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
                    url: article.seo?.ogImage || article.coverImage?.url || "#",
                    width: article.coverImage?.width || DEFAULT_IMAGE_WIDTH,
                    height: article.coverImage?.height || DEFAULT_IMAGE_HEIGHT,
                    alt: article.coverImage?.alt || article.title,
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
            images: [article.seo?.ogImage || article.coverImage?.url || "#"],
        },
        alternates: {
            canonical: `https://rmaster35.ru/projects/${article.slug}`,
        },
    };
}

export async function generateStaticParams() {
    const articles = await getAllArticles();
    return articles.map(article => ({
        slug: article.slug,
    }));
}

export default async function ArticlePage(props: PromisePageProps) {
    const { slug } = await props.params;
    const article = await getArticleBySlug(slug);

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