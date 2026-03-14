// src/components/sections/contact/index.tsx
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/ui/section/SectionHeader';
import { FadeInSection } from '@/components/ui/section/FadeInSection';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';
import { ContactHours } from './ContactHours';
import { contactContent } from '@/types/sections/contact/contact';
import { useTheme } from '@/hooks/useTheme';

export function Contact() {
  const { isDark } = useTheme();

  return (
    <FadeInSection id="contact" className="bg-muted py-24 md:py-32">
      <Container>
        <SectionHeader
          label={contactContent.label}
          title={contactContent.title}
          description={contactContent.description}
          className="mb-14"
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <ContactForm />

          <div className="flex flex-col justify-center gap-8">
            <ContactInfo isDark={isDark} />
            <ContactHours />
          </div>
        </div>
      </Container>
    </FadeInSection>
  );
}
