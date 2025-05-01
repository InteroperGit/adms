import {PageSlugParams, PageSlugProps} from "@/types/page";
import {Metadata} from "next";
import {getProjectArticleBySlug} from "@/libs/api/projectsApi";
import {DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH} from "@/config/constants";
import Article from "@/components/article/Article";
import React from "react";
import {getNewsArticleBySlug, getNewsSlugs} from "@/libs/api/newsApi";
import {notFound} from "next/navigation";

export async function generateMetadata(props: PageSlugProps): Promise<Metadata> {
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

export async function generateStaticParams(): Promise<PageSlugParams[]> {
    const slugs = await getNewsSlugs();
    return slugs.map((slug) => ({ slug }))
}

export default async function NewsPage(props: PageSlugProps) {
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