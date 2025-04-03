import {getAllArticles, getArticleBySlug} from '@/lib/api/articles';
import {ArticleParser} from "@/lib/article-parser";
import {useUpdateBreadcrumbs} from "@/lib/breadcrumbs";
import React from "react";

interface Params {
    slug: string;
}

export async function generateStaticParams() {
    const articles = await getAllArticles();
    return articles.map(article => ({
        slug: article.slug,
    }));
}

export default async function ArticlePage({ params }: { params: Params }) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return <div>Статья не найдена</div>;
    }

    //const updateBreadcrumbs = useUpdateBreadcrumbs()

    const breadcrumbs: { title: string, href?: string}[] = [
        { title: 'Главная', href: '/' },
        { title: 'Статьи', href: '/articles' },
        { title: article.title }
    ];

    //updateBreadcrumbs(breadcrumbs);

    return (
        <article>
            <h1 className="text-3xl font-bold mb-10">{article.title}</h1>
            <ArticleParser blocks={article.content} />
        </article>
    );
}