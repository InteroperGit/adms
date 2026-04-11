import { useParams } from 'react-router';
import { Container } from '@/components/layout/Container';
import { ArticleHero } from '@/components/articles/ArticleHero';
import { PortfolioOverview } from '@/components/articles/PortfolioOverview';
import { ArticleCTA } from '@/components/articles/ArticleCTA';
import { BreadCrumbs } from '@/components/navigation/BreadCrumbs';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { NotFound } from '@/pages/NotFound';
import { articleMap } from '@/types/articles/allArticles';
import type { BaseArticle, ArticleType } from '@/types/articles/article';
import { defaultArticleCta } from '@/types/config/defaultArticleCta';
import { categories } from '@/types/config/categories';
import { siteData } from '@/types/config/siteData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const ROUTE_PATH: Record<ArticleType, string> = {
  portfolio: '/portfolio',
  service: '/services',
  news: '/news',
  blog: '/blog',
};

const ROUTE_LABEL: Record<ArticleType, string> = {
  portfolio: 'Портфолио',
  service: 'Услуги',
  news: 'Новости',
  blog: 'Блог',
};

function buildBreadcrumbs(article: BaseArticle) {
  const items: Array<{ label: string; href?: string }> = [
    { label: siteData.homeLabel, href: '/' },
    { label: ROUTE_LABEL[article.type], href: ROUTE_PATH[article.type] },
  ];

  if (article.type === 'portfolio') {
    const catName = article.category;
    const cat = categories.find((c) => c.name === catName);
    if (cat) {
      items.push({ label: cat.name, href: `/portfolio/${cat.slug}` });
    }
  }

  items.push({ label: article.title });
  return items;
}

/**
 * Generic article detail page — renders portfolio, service, news, and blog articles.
 *
 * Reads `categorySlug`, `year`, `month`, `slug` from the URL params, looks up the
 * article in `articleMap` by slug, and renders a full article view.
 *
 * @component
 * @returns {JSX.Element} Article layout, or a 404 page.
 */
export function ArticlePage() {
  const { slug } = useParams<{
    categorySlug?: string;
    year?: string;
    month?: string;
    slug?: string;
  }>();

  const article = slug ? articleMap[slug] : undefined;

  useDocumentTitle(article ? `${article.title} — ${siteData.name}` : siteData.name);

  if (!article) {
    return <NotFound backLabel="Назад" backHref="/portfolio" />;
  }

  const breadcrumbs = buildBreadcrumbs(article);

  return (
    <div
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-background font-sans text-foreground"
    >
      <BreadCrumbs items={breadcrumbs} />

      <ArticleHero
        hero={article.hero}
        category={article.category}
        title={article.title}
        description={article.description}
      />

      {article.type === 'portfolio' && 'overview' in article && (
        <PortfolioOverview
          client={(article as { overview: { client: string } }).overview.client}
          category={article.category}
          year={(article as { overview: { year: string } }).overview.year}
          services={(article as { overview: { services: string } }).overview.services}
        />
      )}

      {article.author && (
        <div className="border-t border-border/50">
          <Container className="py-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>Автор: {article.author.name}</span>
              {article.author.title && <span>— {article.author.title}</span>}
            </div>
          </Container>
        </div>
      )}

      {article.type === 'news' &&
        'source' in article &&
        (article as { source?: string }).source && (
          <div className="border-t border-border/50">
            <Container className="py-4">
              <div className="text-sm text-muted-foreground">
                Источник: {(article as { source: string }).source}
              </div>
            </Container>
          </div>
        )}

      <Container>
        {article.content.map((block, i) => (
          <BlockRenderer
            key={`${block.__component}-${i}`}
            block={block}
            articleGradient={article.hero.gradient}
            articleTitle={article.title}
          />
        ))}
      </Container>

      <ArticleCTA
        title={article.cta?.title ?? defaultArticleCta.title}
        subtitle={article.cta?.subtitle ?? defaultArticleCta.subtitle}
        label={article.cta?.label ?? defaultArticleCta.label}
        href={article.cta?.href ?? defaultArticleCta.href}
      />
    </div>
  );
}

export default ArticlePage;
