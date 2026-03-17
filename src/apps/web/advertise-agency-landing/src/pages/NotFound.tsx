import { Link } from 'react-router';
import { Container } from '@/components/layout/Container';
import { notFoundContent } from '@/types/config/notFound';

interface NotFoundProps {
  backLabel?: string;
  backHref?: string;
}

export function NotFound({ backLabel, backHref }: NotFoundProps) {
  const label = backLabel ?? notFoundContent.backLabel;
  const href = backHref ?? notFoundContent.backHref;

  return (
    <div className="bg-background min-h-screen flex items-center justify-center py-20">
      <Container>
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-primary mb-4">{notFoundContent.code}</h1>
            <h2 className="text-3xl font-semibold text-foreground mb-4">{notFoundContent.title}</h2>
            <p className="text-lg text-muted-foreground mb-8">{notFoundContent.description}</p>
          </div>
          <Link
            to={href}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {label}
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default NotFound;
