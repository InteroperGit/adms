import {getProjectArticleBySlug, getProjectSlugs} from '@/libs/api/projectsApi';
import Article from "@/components/article/Article";
import React from "react";
import {Metadata} from "next";
import {PageSlugParams, PageSlugProps} from "@/types/page";
import {DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH} from "@/config/constants";
import {notFound} from "next/navigation";

export async function generateMetadata(props: PageSlugProps): Promise<Metadata> {
    const { slug } = await props.params;
    const project = await getProjectArticleBySlug(slug);

    if (!project) {
        return {
            title: 'Проект не найден',
            description: 'Запрошенный проект не существует или был удален',
        };
    }

    return {
        title: project.seo?.title || project.title,
        description: project.seo?.description || project.description,
        openGraph: {
            title: project.seo?.title || project.title,
            description: project.seo?.description || project.description,
            url: `https://rmaster35.ru/portfolio/${project.slug}`,
            siteName: 'РА Рекламастер',
            images: [
                {
                    url: project.seo?.ogImage?.url || project.cover?.url || "",
                    width: project.seo?.ogImage?.width || DEFAULT_IMAGE_WIDTH,
                    height: project.seo?.ogImage?.height || DEFAULT_IMAGE_HEIGHT,
                    alt: project.cover?.alternativeText || project.title,
                },
            ],
            locale: 'ru_RU',
            type: 'article',
            publishedTime: project.publishedAt,
            modifiedTime: project.updatedAt,
        },
        twitter: {
            card: 'summary_large_image',
            title: project.seo?.title || project.title,
            description: project.seo?.description || project.description,
            images: [project.seo?.ogImage?.url || project.cover?.url || ""],
        },
        alternates: {
            canonical: `https://rmaster35.ru/portfolio/${project.slug}`,
        },
    };
}

export async function generateStaticParams(): Promise<PageSlugParams[]> {
    const slugs = await getProjectSlugs();
    return slugs.map((slug) => ({ slug }))
}

export default async function ProjectPage(props: PageSlugProps) {
    const { slug } = await props.params;
    const project = await getProjectArticleBySlug(slug);

    if (!project) {
        return notFound();
    }

    return (
        <article className="mx-5">
            <h1 className="text-3xl font-bold mb-10">{project.title}</h1>
            <Article blocks={project.blocks || []} />
        </article>
    );
}