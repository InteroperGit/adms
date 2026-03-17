// src/pages/Consent.tsx

import { legalData } from '@/types/config/legalData';
import { consentContent } from '@/types/legal';
import { LegalPageLayout } from '@/components/ui/legal/LegalPageLayout';
import { LegalBlockRenderer } from '@/components/ui/legal/LegalBlockRenderer';

/**
 * @component
 * @description Cookie consent policy page with rendered legal document sections and company token substitution
 * @returns {JSX.Element} Legal page with structured content and metadata
 * @example
 * <Consent />
 */
export default function Consent() {
  const { company, documents } = legalData;
  const { version, effectiveDate } = documents.consent;

  return (
    <LegalPageLayout title={consentContent.title} version={version} effectiveDate={effectiveDate}>
      <LegalBlockRenderer content={consentContent} company={company} />
    </LegalPageLayout>
  );
}
