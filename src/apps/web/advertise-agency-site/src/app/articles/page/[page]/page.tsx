import { getAllArticles } from '@/libs/api/articles-api';
import { ArticlePreviewCard } from '@/components/cards/ArticlePreviewCard';
import HeroSection from '@/components/sections/HeroSection';
import ArticlesPagination from "@/components/misc/ArticlePagination";

const DEFAULT_PAGE_SIZE = 10;

interface Params {
    page: string;
}

interface Props {
    params: Promise<Params>
}

export default async function ArticlesPage(props: Props) {
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                {articles.map((article, index) => (
                    <ArticlePreviewCard
                        key={article.id}
                        article={article}
                        priority={index < 3}
                    />
                ))}
            </div>

            <ArticlesPagination currentPage={currentPage} totalPages={pagination.pageCount} />
        </div>
    );
}
