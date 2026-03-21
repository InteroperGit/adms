import { legalData } from '@/types/config/legalData';
import { privacyPolicyContent } from '@/types/legal';
import { LegalPageLayout } from '@/components/ui/legal/LegalPageLayout';
import { LegalBlockRenderer } from '@/components/ui/legal/LegalBlockRenderer';
import { siteData } from '@/types/config/siteData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * Privacy policy page.
 *
 * Renders the privacy policy legal document using `<LegalPageLayout>` for the
 * page chrome (title, version, effective date) and `<LegalBlockRenderer>` to
 * convert the structured JSON content into HTML — substituting `{company.X}`
 * tokens with values from `legalData.company`.
 *
 * @component
 * @returns {JSX.Element} Privacy policy page with structured content and metadata.
 * @example
 * <PrivacyPolicy />
 */
export default function PrivacyPolicy() {
  const { company, documents } = legalData;
  const { version, effectiveDate } = documents.privacyPolicy;

  useDocumentTitle(`${privacyPolicyContent.title} — ${siteData.name}`);

  return (
    <LegalPageLayout
      title={privacyPolicyContent.title}
      version={version}
      effectiveDate={effectiveDate}
    >
      <LegalBlockRenderer content={privacyPolicyContent} company={company} />
    </LegalPageLayout>
  );
}
