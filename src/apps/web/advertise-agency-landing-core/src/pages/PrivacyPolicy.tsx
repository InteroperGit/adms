// src/pages/PrivacyPolicy.tsx

import { legalData } from '@/types/config/legalData';
import { privacyPolicyContent } from '@/types/legal';
import { LegalPageLayout } from '@/components/ui/legal/LegalPageLayout';
import { LegalBlockRenderer } from '@/components/ui/legal/LegalBlockRenderer';

/**
 * @component
 * @description Privacy policy page with rendered legal document sections and company token substitution
 * @returns {JSX.Element} Legal page with structured content and metadata
 * @example
 * <PrivacyPolicy />
 */
export default function PrivacyPolicy() {
  const { company, documents } = legalData;
  const { version, effectiveDate } = documents.privacyPolicy;

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
