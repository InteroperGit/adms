import { getArticles } from '@/libs/api/articlesApi';
import HeroSection from '@/components/sections/HeroSection';
import ArticlesPagination from "@/components/misc/ArticlePagination";
import {ArticleCard} from "@/components/cards/ArticleCard";

const DEFAULT_PAGE_SIZE = 10;
const ARTICLE_URL_BASE_PATTERN = "/articles/page";

interface ArticlePageParams {
    page: string;
}

interface ArticlePageProps {
    params: Promise<ArticlePageParams>
}

export default async function ArticlesPage(props: ArticlePageProps) {
    const { page } = await props.params;
    const currentPage = parseInt(page || '1', 10);
    const pageSize = DEFAULT_PAGE_SIZE;

    const { articles, pagination } = await getArticles({ page: currentPage, pageSize });

    return (
        <div className="md:px-4">
            <HeroSection
                title="Статьи и полезные материалы"
                description="Экспертные статьи о рекламе, брендинге и маркетинге для вашего бизнеса"
            />

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                {articles.map((article, index) => (
                    <ArticleCard
                        key={article.id}
                        item={article}
                        index={index}
                        basePath="/articles"
                    />
                ))}
            </section>

            <section>
                {pagination.pageCount > 1
                    && <ArticlesPagination
                        urlBasePattern={ARTICLE_URL_BASE_PATTERN}
                        currentPage={currentPage}
                        totalPages={pagination.pageCount}
                    />
                }
            </section>
        </div>
    );
}
