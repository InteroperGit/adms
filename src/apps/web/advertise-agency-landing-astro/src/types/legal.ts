export interface LegalSection {
  heading: string;
  content: string;
  list?: string[];
}

export interface LegalDocument {
  title: string;
  effectiveDate: string;
  sections: LegalSection[];
}