import { Link } from 'react-router';
import { Container } from '@/components/layout/Container';
import { cn } from '@/libs/utils';
import { notFoundContent } from '@/types/config/notFound';

interface NotFoundProps {
  backLabel?: string;
  backHref?: string;
}

export function NotFound({ backLabel, backHref }: NotFoundProps) {
  const label = backLabel ?? notFoundContent.backLabel;
  const href = backHref ?? notFoundContent.backHref;

  return (
    <div
      className={cn(
        'relative min-h-screen flex items-center justify-center py-20 overflow-hidden',
        'bg-background'
      )}
    >
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
          <div className="mb-8">
            <h1
              className={cn(
                'text-[10rem] md:text-[14rem] font-heading font-bold',
                'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent',
                'animate-[float_3s_ease-in-out_infinite] select-none leading-none mb-4'
              )}
              aria-label={`Error ${notFoundContent.code}`}
            >
              {notFoundContent.code}
            </h1>
            <h2 className="text-3xl font-semibold text-foreground mb-4">{notFoundContent.title}</h2>
            <p className="text-lg text-muted-foreground mb-8">{notFoundContent.description}</p>
          </div>
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
