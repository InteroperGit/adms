import {getProjectArticleBySlug, getProjectSlugs} from '@/libs/api/projectsApi';
import Article from "@/components/article/Article";
import React, {JSX} from "react";
import {Metadata} from "next";
import {PageSlugParams, PageSlugProps} from "@/types/page";
import {DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH} from "@/config/constants";
import {notFound} from "next/navigation";

/**
* Функция для генерации метаданных страницы на основе параметров из запроса.
* Используется для настройки SEO, Open Graph и Twitter данных для страницы.
*
* @param {PageSlugProps} props - Параметры, передаваемые компонентом, которые
* включают параметры маршрута.
* @param {PageSlugProps.params} props.params - Объект, содержащий параметры маршрута.
* @param {string} props.params.slug - Уникальный идентификатор (slug) проекта для
* поиска в базе данных.
*
* @returns {Promise<Metadata>} - Объект с метаданными, такими как title,
* description, Open Graph и Twitter данные.
*
* Пример использования:
    * const metadata = await generateMetadata({ params: { slug: 'project-1' } });
*/
export const generateMetadata = async (props: PageSlugProps): Promise<Metadata> => {
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

/**
 * Функция для генерации статичных параметров (slug) для страницы проекта,
 * используемая для статической генерации страниц с данными о проектах.
 *
 * @returns {Promise<PageSlugParams[]>} - Массив объектов, содержащих slug для
 * каждого проекта.
 *
 * Пример использования:
 * const params = await generateStaticParams();
 */
export const generateStaticParams = async (): Promise<PageSlugParams[]> => {
    const slugs = await getProjectSlugs();
    return slugs.map((slug) => ({ slug }))
}

/**
 * Основная компонента страницы проекта, которая отвечает за рендеринг статьи
 * на основе данных, полученных через slug, и отображение содержимого проекта.
 *
 * @param {PageSlugProps} props - Параметры, передаваемые компонентом, которые
 * включают параметры маршрута.
 * @param {PageSlugProps.params} props.params - Объект, содержащий параметры маршрута.
 * @param {string} props.params.slug - Уникальный идентификатор (slug) проекта для
 * поиска в базе данных.
 *
 * @returns {JSX.Element} - Разметка страницы, которая отображает заголовок и
 * содержимое проекта.
 *
 * Пример использования:
 * <ProjectPage params={{ slug: 'project-1' }} />
 */
const ProjectPage = async (props: PageSlugProps): Promise<JSX.Element> => {
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

export default ProjectPage;