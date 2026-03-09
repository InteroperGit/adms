import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { CaseHero } from '@/components/portfolio/CaseHero';
import { CaseOverview } from '@/components/portfolio/CaseOverview';
import { CaseSolution } from '@/components/portfolio/CaseSolution';
import { CaseResults } from '@/components/portfolio/CaseResults';
import { CaseGallery } from '@/components/portfolio/CaseGallery';
import { CaseCTA } from '@/components/portfolio/CaseCTA';
import { portfolioCaseContent } from '@/types/portfolio/portfolioCaseContent';
import { testimonials } from '@/types/sections/testimonials';
import { portfolioCaseMap } from '@/types/portfolio/portfolioCases';

export function PortfolioCasePage() {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? portfolioCaseMap[slug] : undefined;

  useEffect(() => {
    if (data) {
      document.title = data.meta.title;
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl) descEl.setAttribute('content', data.meta.description);
    }
  }, [data]);

  const pc = portfolioCaseContent;

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">{pc.notFound.title}</h1>
          <a href="/#portfolio" className="text-primary hover:underline">
            {pc.notFound.back}
          </a>
        </div>
      </div>
    );
  }

  const testimonial = data.testimonialId
    ? testimonials.find((t) => t.id === data.testimonialId)
    : undefined;

  return (
    <div className="min-h-screen bg-white font-sans text-foreground">
      <div className="border-b border-border bg-muted/40">
        <Container>
          <a
            href="/#portfolio"
            className="inline-flex items-center gap-2 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} />
            {pc.backLabel}
          </a>
        </Container>
      </div>

      <CaseHero
        gradient={data.gradient}
        category={data.category}
        title={data.title}
        description={data.description}
      />

      <CaseOverview
        client={data.overview.client}
        category={data.category}
        year={data.overview.year}
        services={data.overview.services}
      />

      {/* Challenge — too small to extract */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold md:text-3xl">{pc.challengeTitle}</h2>
            <p className="leading-relaxed text-muted-foreground">{data.challenge}</p>
          </div>
        </Container>
      </section>

      <CaseSolution solution={data.solution} gradient={data.gradient} />

      <CaseResults results={data.results} gradient={data.gradient} />

      {data.images?.gallery && data.images.gallery.length > 0 && (
        <CaseGallery gallery={data.images.gallery} caseTitle={data.title} />
      )}

      {testimonial && (
        <section className="bg-muted/40 py-16">
          <Container>
            <div className="mx-auto max-w-2xl">
              <TestimonialCard
                testimonial={testimonial}
                starClassName="fill-amber-400 text-amber-400"
                className="p-6 sm:p-8"
              />
            </div>
          </Container>
        </section>
      )}

      <CaseCTA />
    </div>
  );
}
