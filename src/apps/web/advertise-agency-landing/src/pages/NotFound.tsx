import { Link } from 'react-router';
import { Container } from '@/components/layout/Container';
import { cn } from '@/libs/utils';
import { notFoundContent } from '@/types/config/notFound';

interface NotFoundProps {
  /** Back button label. Defaults to `notFoundContent.backLabel`. */
  backLabel?: string;
  /** Back button destination. Defaults to `notFoundContent.backHref`. */
  backHref?: string;
}

/**
 * 404 / not-found page.
 *
 * Rendered both as the dedicated `404` pre-rendered route and inline by
 * `PortfolioCategoryPage` / `PortfolioCasePage` when a slug resolves to
 * nothing. The `backLabel` and `backHref` props let callers override the
 * default back-to-home link with a context-specific destination
 * (e.g. back to the category listing).
 *
 * @component
 * @param {NotFoundProps} props
 * @returns {JSX.Element} Full-screen centred layout with animated "404" heading and back link.
 * @example
 * // Default — back to home
 * <NotFound />
 *
 * @example
 * // Context-specific back link
 * <NotFound backLabel="Back to portfolio" backHref="/portfolio" />
 */
export function NotFound({ backLabel, backHref }: NotFoundProps) {
  const label = backLabel ?? notFoundContent.backLabel;
  const href = backHref ?? notFoundContent.backHref;

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden bg-background">
      {/* Decorative blobs */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(1px 1px at 24px 24px, currentColor, currentColor)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Content */}
      <Container className="relative z-10">
        <div className="text-center">
          <h1
            className={cn(
              'text-[10rem] md:text-[14rem] font-heading font-bold mb-4',
              'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent',
              'animate-[float_3s_ease-in-out_infinite] select-none leading-none'
            )}
            aria-label={`Error ${notFoundContent.code}`}
          >
            {notFoundContent.code}
          </h1>
          <h2 className="text-3xl font-semibold text-foreground mb-4">{notFoundContent.title}</h2>
          <p className="text-lg text-muted-foreground mb-8">{notFoundContent.description}</p>
          <Link
            to={href}
            className={cn(
              'inline-flex items-center justify-center px-8 py-3',
              'text-primary font-medium border border-primary rounded-full',
              'hover:bg-primary/10 transition-colors'
            )}
          >
            {label}
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default NotFound;
