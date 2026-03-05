// src/components/portfolio/CaseGallery.tsx
import { Container } from '@/components/layout/Container';
import { content } from '@/types/content';
import { cn } from '@/lib/utils';
import type { GalleryImage } from '@/types/portfolio';

interface CaseGalleryProps {
  gallery: GalleryImage[];
  caseTitle: string;
}

export function CaseGallery({ gallery, caseTitle }: CaseGalleryProps) {
  const { galleryTitle, photoAlt } = content.portfolioCase;

  return (
    <section className="bg-muted/40 py-16">
      <Container>
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl">{galleryTitle}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {gallery.map(({ src }, i) => (
              <div
                key={src}
                className={cn(
                  'overflow-hidden rounded-2xl bg-muted',
                  gallery.length >= 3 && i === 0 ? 'sm:col-span-2' : ''
                )}
              >
                <img
                  src={src}
                  alt={photoAlt.replace('{title}', caseTitle).replace('{index}', String(i + 1))}
                  className={cn(
                    'w-full object-cover',
                    gallery.length >= 3 && i === 0 ? 'h-64 sm:h-[480px]' : 'h-52 sm:h-72'
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
