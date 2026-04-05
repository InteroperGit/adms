import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/libs/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { articleTypesConfig } from '@/types/config/articleTypes';
import type { BaseArticle, ArticleType } from '@/types/articles/article';
import type { ContentBlock } from '@/types/blocks';

const TYPE_LABEL = Object.fromEntries(
  articleTypesConfig.types.map(({ key, label }) => [key, label])
) as Record<ArticleType, string>;

interface ArticleListItemProps {
  article: BaseArticle;
  href: string;
  type: ArticleType;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function extractPreviewBlocks(content: ContentBlock[]): ContentBlock[] {
  const preview: ContentBlock[] = [];
  const maxBlocks = 2;

  for (const block of content) {
    if (!preview.length && ['heading', 'paragraph', 'blockquote'].includes(block.__component)) {
      preview.push(block);
    } else if (preview.length > 0) {
      const acceptable = ['heading', 'paragraph', 'blockquote', 'list'];
      if (acceptable.includes(block.__component)) {
        preview.push(block);
        if (preview.length >= maxBlocks) {
          break;
        }
      }
    }
  }

  if (!preview.length && content.length) {
    preview.push(content[0]);
  }

  return preview;
}

// ——— Sub-components ———

interface ThumbnailProps {
  image?: string;
  title: string;
  gradient: string;
}

function ArticleListThumbnail({ image, title, gradient }: ThumbnailProps) {
  return (
    <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-[180px] lg:w-[220px]">
      {image ? (
        <OptimizedImage
          src={image}
          alt={title}
          sizes="(max-width: 640px) 100vw, 200px"
          className="h-full w-full"
          imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          aspectRatio="16/10"
        />
      ) : (
        <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)} aria-hidden="true" />
      )}
    </div>
  );
}

interface MetaRowProps {
  dateStr: string;
  readTime?: number;
  type: ArticleType;
}

function ArticleListMeta({ dateStr, readTime, type }: MetaRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      {dateStr && (
        <span className="inline-flex items-center gap-1">
          <Calendar size={12} className="shrink-0 opacity-60" />
          {dateStr}
        </span>
      )}
      {readTime != null && (
        <span className="inline-flex items-center gap-1">
          <Clock size={12} className="shrink-0 opacity-60" />
          {readTime} мин
        </span>
      )}
      <Badge variant="outline" className="border-border/50 text-[11px] text-muted-foreground">
        {TYPE_LABEL[type]}
      </Badge>
    </div>
  );
}

interface PreviewProps {
  blocks: ContentBlock[];
}

function ArticleListPreview({ blocks }: PreviewProps) {
  return (
    <div className="-ml-5 mt-2 pl-5 border-l-2 border-primary/20">
      {blocks.map((block, i) => {
        switch (block.__component) {
          case 'paragraph':
            return (
              <p key={i} className="text-sm leading-relaxed text-foreground/70 line-clamp-3">
                {block.text}
              </p>
            );
          case 'heading':
            return (
              <h4
                key={i}
                className={cn(
                  'font-semibold text-foreground/90',
                  block.level === 2 && 'text-sm',
                  block.level === 3 && 'text-sm font-medium',
                  block.level === 4 && 'text-sm font-medium italic'
                )}
              >
                {block.text}
              </h4>
            );
          case 'blockquote':
            if ('text' in block) {
              return (
                <blockquote
                  key={i}
                  className="text-sm italic text-muted-foreground border-l-2 border-accent/40 pl-3"
                >
                  "{block.text}"
                  {block.author && (
                    <span className="not-italic block mt-1 text-xs text-muted-foreground/70">
                      — {block.author}
                      {block.role && `, ${block.role}`}
                      {block.company && ` (${block.company})`}
                    </span>
                  )}
                </blockquote>
              );
            }
            return null;
          case 'list': {
            const items = block.items.slice(0, 3);
            if (block.style === 'unordered') {
              return (
                <ul key={i} className="ml-4 list-disc text-sm text-muted-foreground">
                  {items.map((item, j) => (
                    <li key={j} className="line-clamp-1">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.style === 'ordered') {
              return (
                <ol key={i} className="ml-4 list-decimal text-sm text-muted-foreground">
                  {items.map((item, j) => (
                    <li key={j} className="line-clamp-1">
                      {item}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <div key={i} className="space-y-0.5">
                {items.map((item, j) => (
                  <div key={j} className="flex items-start gap-1.5 text-sm text-muted-foreground">
                    <svg
                      className="w-3.5 h-3.5 mt-[3px] shrink-0 text-primary/80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                      <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="line-clamp-1">{item}</span>
                  </div>
                ))}
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}

// ——— Main component ———

export function ArticleListItem({ article, href, type }: ArticleListItemProps) {
  const dateStr = formatDate(article.publishedAt);
  const previewBlocks = extractPreviewBlocks(article.content);

  return (
    <a
      href={href}
      className="group flex flex-col gap-3 p-4 transition-colors duration-200 hover:bg-muted/20 sm:flex-row sm:items-start sm:gap-6 sm:p-6 lg:gap-8"
    >
      <ArticleListThumbnail
        image={article.images?.preview}
        title={article.title}
        gradient={article.hero.gradient}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="text-base font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary sm:text-lg">
          {article.title}
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {article.description}
        </p>

        <ArticleListMeta dateStr={dateStr} readTime={article.readTime} type={type} />

        {previewBlocks.length > 0 && <ArticleListPreview blocks={previewBlocks} />}
      </div>
    </a>
  );
}
