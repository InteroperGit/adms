import { ImageGallery } from '@/components/ui/imageGallery';
import { Container } from '@/components/layout/Container';
import { portfolioCaseContent } from '@/types/portfolio/portfolioCaseContent';
import { imageGalleryContent } from '@/types/portfolio/imageGallery';
import type { GalleryImage } from '@/types/portfolio';

interface CaseGalleryProps {
  gallery: GalleryImage[];
  caseTitle: string;
}

export function CaseGallery({ gallery, caseTitle }: CaseGalleryProps) {
  const { galleryTitle, photoAlt } = portfolioCaseContent;
  const { prevLabel, nextLabel, counter } = imageGalleryContent;

  return (
    <section className="bg-muted/40 py-16">
      <Container>
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl">{galleryTitle}</h2>
          <ImageGallery
            images={gallery}
            altPrefix={photoAlt.replace('{title}', caseTitle)}
            prevLabel={prevLabel}
            nextLabel={nextLabel}
            counterTemplate={counter}
          />
        </div>
      </Container>
    </section>
  );
}
