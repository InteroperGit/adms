import { CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';
import { AboutCard } from '@/components/sections/about/AboutCard';
import { aboutValues } from '@/types/sections/aboutValues';
import { aboutContent } from '@/types/sections/aboutContent';
import { siteData } from '@/types/config/siteData';

export function About() {
  const about = aboutContent;

  return (
    <section id="about" className="bg-white py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left — text content */}
          <div>
            {/* Section label */}
            <div
              className={cn(
                'mb-4 inline-flex items-center gap-2 rounded-full border',
                'border-primary/20 bg-primary/5 px-4 py-1.5',
                'text-sm font-medium text-primary'
              )}
            >
              {about.label}
            </div>

            <h2 className="mb-6">
              {about.title}
              <span className="text-primary">{about.titleHighlight}</span>
            </h2>

            {about.text.map((paragraph, i) => (
              <p
                key={i}
                className={cn(
                  i === about.text.length - 1 ? 'mb-10' : 'mb-6',
                  'text-base leading-relaxed text-muted-foreground'
                )}
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
          <AboutCard card={about.card} />
        </div>
      </Container>
    </section>
  );
}
