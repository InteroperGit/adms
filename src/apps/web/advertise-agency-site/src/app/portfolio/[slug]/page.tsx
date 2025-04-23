import {getAllProjects, getProjectBySlug} from '@/libs/api/projectsApi';
import {ArticleParser} from "@/libs/articleParser";
import React from "react";
import {Metadata} from "next";
import {PageSlugParams, PageSlugProps} from "@/types/page";

const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;

export async function generateMetadata(props: PageSlugProps): Promise<Metadata> {
    const { slug } = await props.params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        return {
            title: 'Проект не найден',
            description: 'Запрошенный проект не существует или был удален',
        };
    }

    return {
        title: project.seo?.title || project.title,
        description: project.seo?.description || project.description,
        keywords: project.seo?.keywords || project.tags?.join(', '),
        openGraph: {
            title: project.seo?.title || project.title,
            description: project.seo?.description || project.description,
            url: `https://rmaster35.ru/projects/${project.slug}`,
            siteName: 'РА Рекламастер',
            images: [
                {
                    url: project.seo?.ogImage || project.cover?.url || "",
                    width: project.cover?.width || DEFAULT_IMAGE_WIDTH,
                    height: project.cover?.height || DEFAULT_IMAGE_HEIGHT,
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
            images: [project.seo?.ogImage || project.cover?.url || ""],
        },
        alternates: {
            canonical: `https://rmaster35.ru/projects/${project.slug}`,
        },
    };
}

export async function generateStaticParams(): Promise<PageSlugParams[]> {
    const projects = await getAllProjects();
    return projects.map(project => ({
        slug: project.slug,
    }));
}

export default async function ProjectPage(props: PageSlugProps) {
    const { slug } = await props.params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        return <div>Проект не найден</div>;
    }

    return (
        <article className="mx-5">
            <h1 className="text-3xl font-bold mb-10">{project.title}</h1>
            <ArticleParser blocks={project.blocks || []} />
        </article>
    );
}