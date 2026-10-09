/** Draft-safe content for production evidence, warranties and maintenance. */
export type ProductionApproval = 'draft' | 'approved';
export type ProductionGuidanceIcon =
  | '/images/guarantees/design-approval.svg'
  | '/images/guarantees/inquiry.svg'
  | '/images/guarantees/installation.svg'
  | '/images/guarantees/measurements.svg'
  | '/images/guarantees/production.svg';

export interface ProductionPhoto {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  source: string;
  rights: string;
  approval: ProductionApproval;
}

export interface ProductionItem {
  id: string;
  title: string;
  description: string;
  evidence: string;
  approval: ProductionApproval;
}

export interface WarrantyTerm {
  id: string;
  title: string;
  coverage: string;
  duration: string;
  starts: string;
  conditions: string[];
  exclusions: string[];
  claimRoute: string;
  sourceType: 'agency-workmanship' | 'manufacturer-component' | 'pending';
  source: string;
  approval: ProductionApproval;
}

export interface MaintenanceContent {
  scope: string[];
  customerResponsibilities: string[];
  pricing: string;
  requestRoute: string;
  approval: ProductionApproval;
}

export interface ProductionAndGuaranteesContent {
  demoMode: boolean;
  demoNotice: string;
  heading: string;
  introduction: string;
  guidance: {
    title: string;
    description: string;
    icon: ProductionGuidanceIcon;
  }[];
  copyApproved: boolean;
  approvalSource: string | null;
  pendingInputs: string[];
  productionOperations: ProductionItem[];
  materials: ProductionItem[];
  qualityChecks: ProductionItem[];
  photos: ProductionPhoto[];
  warrantyTerms: WarrantyTerm[];
  maintenance: MaintenanceContent;
  inquiryHref: '/#order-inquiry';
}
