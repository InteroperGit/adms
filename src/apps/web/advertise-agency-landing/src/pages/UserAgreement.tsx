import { legalData } from '@/types/config/legalData';
import { userAgreementContent } from '@/types/legal';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { LegalBlockRenderer } from '@/components/legal/LegalBlockRenderer';
import { siteData } from '@/types/config/siteData';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * User agreement (terms of service) page.
 *
 * Renders the user agreement legal document using `<LegalPageLayout>` for the
 * page chrome (title, version, effective date) and `<LegalBlockRenderer>` to
 * convert the structured JSON content into HTML — substituting `{company.X}`
 * tokens with values from `legalData.company`.
 *
 * @component
 * @returns {JSX.Element} User agreement page with structured content and metadata.
 * @example
 * <UserAgreement />
 */
export default function UserAgreement() {
  const { company, documents } = legalData;
  const { version, effectiveDate } = documents.userAgreement;

  useDocumentTitle(`${userAgreementContent.title} — ${siteData.name}`);

  return (
    <LegalPageLayout
      title={userAgreementContent.title}
      version={version}
      effectiveDate={effectiveDate}
    >
      <LegalBlockRenderer content={userAgreementContent} company={company} />
    </LegalPageLayout>
  );
}
