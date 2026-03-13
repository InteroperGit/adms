// src/pages/UserAgreement.tsx

import { legalData } from '@/types/config/legalData';
import { userAgreementContent } from '@/types/legal';
import { LegalPageLayout } from '@/components/ui/legal/LegalPageLayout';
import { LegalBlockRenderer } from '@/components/ui/legal/LegalBlockRenderer';

export default function UserAgreement() {
  const { company, documents } = legalData;
  const { version, effectiveDate } = documents.userAgreement;

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
