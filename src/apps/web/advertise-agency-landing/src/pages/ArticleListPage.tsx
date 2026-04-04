import { useState } from 'react';
import { useLocation, Link } from 'react-router';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { Pagination } from '@/components/articles/Pagination';
import { BreadCrumbs } from '@/components/ui/navigation/BreadCrumbs';
import { NotFound } from '@/pages/NotFound';
import type { ArticleType } from '@/types/articles/article';
import {
  allPortfolioArticles,
  allServiceArticles,
  allNewsArticles,
  allBlogArticles,
} from '@/types/articles/allArticles';
import { siteData } from '@/types/config/siteData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const ARTICLES_BY_TYPE: Record<
  ArticleType,
  Array<{
    slug: string;
    title: string;
    description: string;
    category: string;
    hero: { image?: string };
  }>
> = {
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

const PER_PAGE = 12;

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
    case 'blog':
      return `/${type}/${year}/${month}/${article.slug}`;
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
            description={`Все статьи категории «${TYPE_LABEL[type]}»`}
            className="mb-12"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((article) => (
              <Link
                key={article.slug}
                to={articleHref(type, article)}
                className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
              >
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {article.description}
                </p>
              </Link>
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
