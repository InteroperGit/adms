import type { LegalBlock, LegalContent } from '@/types/legal';
import type { LegalData } from '@/types/config/legalData';

function applyTokens(text: string, company: LegalData['company']): string {
  return text.replace(/\{company\.(\w+)\}/g, (_, key) => {
    const value = company[key as keyof typeof company];
    return value ?? '';
  });
}

interface LegalBlockRendererProps {
  content: LegalContent;
  company: LegalData['company'];
}

function renderBlock(block: LegalBlock, company: LegalData['company'], index: number) {
  switch (block.type) {
    case 'p':
      return (
        <p key={index} dangerouslySetInnerHTML={{ __html: applyTokens(block.text, company) }} />
      );
    case 'ul':
      return (
        <ul key={index} className="list-disc pl-6 space-y-1 mt-2">
          {block.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: applyTokens(item, company) }} />
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={index} className="list-decimal pl-6 space-y-1 mt-2">
          {block.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: applyTokens(item, company) }} />
          ))}
        </ol>
      );
    case 'dl':
      return (
        <dl key={index} className="space-y-2">
          {block.items.map(({ term, def }) => (
            <div key={term}>
              <dt className="font-semibold inline">{term}</dt>
              <dd className="inline"> — {def}</dd>
            </div>
          ))}
        </dl>
      );
    case 'contact':
      return (
        <dl key={index} className="space-y-1">
          {block.items.map(({ label, field }) => (
            <div key={field} className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">{label}:</dt>
              <dd>{company[field as keyof typeof company]}</dd>
            </div>
          ))}
        </dl>
      );
    default:
      return null;
  }
}

export function LegalBlockRenderer({ content, company }: LegalBlockRendererProps) {
  return (
    <>
      {content.sections.map((section) => (
        <section key={section.id ?? section.title} id={section.id} className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-foreground">{section.title}</h2>
          <div className="space-y-2 leading-relaxed text-muted-foreground">
            {section.blocks.map((block, i) => renderBlock(block, company, i))}
          </div>
        </section>
      ))}
    </>
  );
}
