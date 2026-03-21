import { legalData } from '@/types/config/legalData';
import { consentContent } from '@/types/legal';
import { LegalPageLayout } from '@/components/ui/legal/LegalPageLayout';
import { LegalBlockRenderer } from '@/components/ui/legal/LegalBlockRenderer';
import { siteData } from '@/types/config/siteData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * Cookie consent policy page.
 *
 * Renders the consent document using `<LegalPageLayout>` for the page chrome
 * (title, version, effective date) and `<LegalBlockRenderer>` to convert the
 * structured JSON content into HTML — substituting `{company.X}` tokens with
 * values from `legalData.company`.
 *
 * @component
 * @returns {JSX.Element} Consent page with structured content and metadata.
 * @example
 * <Consent />
 */
export default function Consent() {
  const { company, documents } = legalData;
  const { version, effectiveDate } = documents.consent;

  useDocumentTitle(`${consentContent.title} — ${siteData.name}`);

  return (
    <LegalPageLayout title={consentContent.title} version={version} effectiveDate={effectiveDate}>
      <LegalBlockRenderer content={consentContent} company={company} />
    </LegalPageLayout>
  );
}
