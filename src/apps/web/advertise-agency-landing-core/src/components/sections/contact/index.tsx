// src/components/sections/contact/index.tsx
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';
import { ContactHours } from './ContactHours';
import { content } from '@/lib/content';

export function Contact() {
  return (
    <section id="contact" className="bg-muted/40 py-24 md:py-32">
      <Container>
        <SectionHeader
          label={content.contact.label}
          title={content.contact.title}
          description={content.contact.description}
          className="mb-14"
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-end lg:gap-16">
          <ContactForm />

          <div className="flex flex-col justify-center gap-8">
            <ContactInfo />
            <ContactHours />
          </div>
        </div>
      </Container>
    </section>
  );
}
