import { CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { aboutValues } from '@/lib/aboutValues';
import { content } from '@/lib/content';
import { siteData } from '@/lib/siteData';

export function About() {
  const { about } = content;

  return (
    <section id="about" className="bg-white py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left — text content */}
          <div>
            {/* Section label */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              {about.label}
            </div>

            <h2 className="mb-6">
              {about.title}
              <span className="text-primary">{about.titleHighlight}</span>
            </h2>

            {about.text.map((paragraph, i) => (
              <p
                key={i}
                className={`${i === about.text.length - 1 ? 'mb-10' : 'mb-6'} text-base leading-relaxed text-muted-foreground`}
              >
                {paragraph.replace('{name}', siteData.name)}
              </p>
            ))}

            {/* Values */}
            <ul className="space-y-5">
              {aboutValues.map((value) => (
                <li key={value.title} className="flex gap-4">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary" />
                  <div>
                    <p className="mb-0.5 font-semibold text-foreground">{value.title}</p>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — visual */}
          <div className="relative flex items-center justify-center">
            {/* Decorative background blob */}
            <div className="absolute h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

            {/* Main card */}
            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
              {/* Card header */}
              <div className="bg-primary px-6 py-8">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl font-bold text-white">
                  {content.logo.letter}
                </div>
                <p className="text-lg font-semibold text-white">{siteData.name}</p>
                <p className="mt-1 text-sm text-white/70">{about.card.tagline}</p>
              </div>

              {/* Card body — mini stats */}
              <div className="divide-y divide-border">
                {about.card.stats.map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-6 py-4">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span
                      style={{ fontFamily: 'var(--font-heading)' }}
                      className="font-bold text-foreground"
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating accent badge */}
            <div className="absolute bottom-0 right-0 rounded-xl border border-border bg-white px-4 py-3 shadow-lg sm:-bottom-4 sm:-right-4">
              <p className="text-xs text-muted-foreground">{about.card.nps.label}</p>
              <p
                style={{ fontFamily: 'var(--font-heading)' }}
                className="text-2xl font-bold text-primary"
              >
                {about.card.nps.value}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
