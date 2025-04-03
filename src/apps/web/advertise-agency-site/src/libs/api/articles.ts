import {articles} from "@/data/article-data";
import {Article} from "@/types/article";

export function getAllArticles(): Promise<Article[]> {
    return Promise.resolve(articles);
}

export const getArticleBySlug = (requestSlug: string): Promise<Article | undefined> => {
    return Promise.resolve(articles.find(({ slug }) => requestSlug === slug));
}