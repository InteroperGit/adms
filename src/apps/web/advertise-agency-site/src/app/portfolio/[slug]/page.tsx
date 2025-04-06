import {getAllProjects, getProjectBySlug} from '@/libs/api/projects';
import {ArticleParser} from "@/libs/article-parser";
import React from "react";
import {Metadata} from "next";
import {PromisePageProps} from "@/types/page";

export async function generateMetadata(props: PromisePageProps): Promise<Metadata> {
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
        description: project.seo?.description || project.excerpt,
        keywords: project.seo?.keywords || project.tags?.join(', '),
        openGraph: {
            title: project.seo?.title || project.title,
            description: project.seo?.description || project.excerpt,
            url: `https://rmaster35.ru/projects/${project.slug}`,
            siteName: 'РА Рекламастер',
            images: [
                {
                    url: project.seo?.ogImage || project.coverImage.url,
                    width: project.coverImage.width || 1200,
                    height: project.coverImage.height || 630,
                    alt: project.coverImage.alt || project.title,
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
            description: project.seo?.description || project.excerpt,
            images: [project.seo?.ogImage || project.coverImage.url],
        },
        alternates: {
            canonical: `https://rmaster35.ru/projects/${project.slug}`,
        },
    };
}

export async function generateStaticParams() {
    const projects = await getAllProjects();
    return projects.map(project => ({
        slug: project.slug,
    }));
}

export default async function ProjectPage(props: PromisePageProps) {
    const { slug } = await props.params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        return <div>Проект не найден</div>;
    }

    return (
        <article className="mx-5">
            <h1 className="text-3xl font-bold mb-10">{project.title}</h1>
            <ArticleParser blocks={project.content} />
        </article>
    );
}