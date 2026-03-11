// src/pages/PrivacyPolicy.tsx

import { legalData } from '@/types/config/legalData';
import { privacyPolicyContent } from '@/types/legal';
import { LegalPageLayout } from '@/components/ui/LegalPageLayout.tsx';
import { LegalBlockRenderer } from '@/components/ui/LegalBlockRenderer.tsx';

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
