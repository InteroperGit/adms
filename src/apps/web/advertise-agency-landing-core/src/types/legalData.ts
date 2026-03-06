import raw from '@data/config/legal.json';

export interface DocumentVersion {
  version: string;
  effectiveDate: string;
}

export interface LegalData {
  company: {
    name: string;
    inn: string;
    ogrn: string;
    legalAddress: string;
    siteUrl: string;
    email: string;
    phone: string;
    responsible: string;
  };
  documents: {
    privacyPolicy: DocumentVersion;
    consent: DocumentVersion;
    userAgreement: DocumentVersion;
  };
}

export const legalData = raw satisfies LegalData;
