import {getAllArticles, getArticleBySlug} from '@/libs/api/articles';
import {ArticleParser} from "@/libs/article-parser";
// import {useUpdateBreadcrumbs} from "@/libs/breadcrumbs";
import React from "react";
import {Metadata} from "next";

interface Params {
    slug: string;
}

interface PageProps {
    params: Promise<Params>
}

export const metadata: Metadata = {
    title: '...',
}

export async function generateStaticParams() {
    const articles = await getAllArticles();
    return articles.map(article => ({
        slug: article.slug,
    }));
}

export default async function ArticlePage(props: PageProps) {
    const { slug } = await props.params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return <div>Статья не найдена</div>;
    }

    //const updateBreadcrumbs = useUpdateBreadcrumbs()

    /*const breadcrumbs: { title: string, href?: string}[] = [
        { title: 'Главная', href: '/' },
        { title: 'Статьи', href: '/articles' },
        { title: article.title }
    ];*/

    //updateBreadcrumbs(breadcrumbs);

    return (
        <article>
            <h1 className="text-3xl font-bold mb-10">{article.title}</h1>
            <ArticleParser blocks={article.content} />
        </article>
    );
}