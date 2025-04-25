import { getAllArticles } from '@/libs/api/articlesApi';
import { ArticlePreviewCard } from '@/components/cards/ArticlePreviewCard';
import HeroSection from '@/components/sections/HeroSection';
import ArticlesPagination from "@/components/misc/ArticlePagination";

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

    const { articles, pagination } = await getAllArticles({ page: currentPage, pageSize });

    return (
        <div className="md:px-4">
            <HeroSection
                title="Статьи и полезные материалы"
                description="Экспертные статьи о рекламе, брендинге и маркетинге для вашего бизнеса"
            />

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                {articles.map((article, index) => (
                    <ArticlePreviewCard
                        key={article.id}
                        article={article}
                        priority={index < 3}
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
