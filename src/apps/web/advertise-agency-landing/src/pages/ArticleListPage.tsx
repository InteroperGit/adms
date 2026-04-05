import { useState } from 'react';
import { useLocation } from 'react-router';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { Pagination } from '@/components/articles/Pagination';
import { ArticleListItem } from '@/components/articles/ArticleListItem';
import { BreadCrumbs } from '@/components/ui/navigation/BreadCrumbs';
import { NotFound } from '@/pages/NotFound';
import type { ArticleType, BaseArticle } from '@/types/articles/article';
import {
  allPortfolioArticles,
  allServiceArticles,
  allNewsArticles,
  allBlogArticles,
} from '@/types/articles/allArticles';
import { siteData } from '@/types/config/siteData';
import { portfolioConfig } from '@/types/config/portfolioConfig';
import { newsConfig } from '@/types/config/newsConfig';
import { blogConfig } from '@/types/config/blogConfig';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const ARTICLES_BY_TYPE: Record<ArticleType, BaseArticle[]> = {
  portfolio: allPortfolioArticles,
  service: allServiceArticles,
  news: allNewsArticles,
  blog: allBlogArticles,
};

const TYPE_LABEL: Record<ArticleType, string> = {
  portfolio: 'Портфолио',
  service: 'Услуги',
  news: 'Новости',
  blog: 'Блог',
};

const PER_PAGE = 20;

const GRID_DESCRIPTION_MAP: Partial<Record<ArticleType, string>> = {
  portfolio: portfolioConfig.gridDescription,
  news: newsConfig.gridDescription,
  blog: blogConfig.gridDescription,
};

function articleHref(
  type: ArticleType,
  article: { slug: string; category: string; publishedAt?: string }
): string {
  if (type === 'service') {
    return `/services/${article.slug}`;
  }
  const pub = article.publishedAt ?? '2024-01-01T00:00:00Z';
  const d = new Date(pub);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  switch (type) {
    case 'portfolio':
      return `/portfolio/${article.category.toLowerCase()}/${year}/${month}/${article.slug}`;
    case 'news':
      return `/news/${year}/${month}/${article.slug}`;
    case 'blog':
      return `/blog/${year}/${month}/${article.slug}`;
  }
}

/**
 * Generic article listing page — renders a paginated list of articles filtered by type.
 *
 * Used for /news, /blog, and the portfolio root listing.
 * Type is determined by the route pattern that includes this page.
 *
 * @component
 * @returns {JSX.Element} Breadcrumbs + section with article list and pagination.
 */
export function ArticleListPage() {
  const location = useLocation();
  const pathname = location.pathname.replace(/^\/|\/$/g, '');
  // Extract type from path: "news", "blog", or infer "portfolio"
  const detectedType = ARTICLES_BY_TYPE[pathname as ArticleType]
    ? (pathname as ArticleType)
    : 'news';

  const type = detectedType;
  const items = ARTICLES_BY_TYPE[type];
  const totalPages = Math.ceil(items.length / PER_PAGE);

  const [page, setPage] = useState(1);
  const start = (page - 1) * PER_PAGE;
  const pageItems = items.slice(start, start + PER_PAGE);

  useDocumentTitle(`${TYPE_LABEL[type]} — ${siteData.name}`);

  if (!ARTICLES_BY_TYPE[detectedType]) {
    return <NotFound backLabel="На главную" backHref="/" />;
  }

  return (
    <>
      <BreadCrumbs
        items={[{ label: siteData.homeLabel, href: '/' }, { label: TYPE_LABEL[type] }]}
      />
      <section className="bg-background py-24 md:py-32">
        <Container>
          <SectionHeader
            label={TYPE_LABEL[type]}
            title={TYPE_LABEL[type]}
            description={GRID_DESCRIPTION_MAP[type]}
            className="mb-12"
          />

          <div className="divide-y divide-border/30 overflow-hidden rounded-xl border border-border/50 bg-card">
            {pageItems.map((article) => (
              <ArticleListItem
                key={article.slug}
                article={article}
                href={articleHref(type, article)}
                type={type}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              current={page}
              total={totalPages}
              prevLabel="← Назад"
              nextLabel="Вперёд →"
              pageLabel="{current} из {total}"
              onPrev={() => setPage((p) => p - 1)}
              onNext={() => setPage((p) => p + 1)}
            />
          )}
        </Container>
      </section>
    </>
  );
}

export default ArticleListPage;
