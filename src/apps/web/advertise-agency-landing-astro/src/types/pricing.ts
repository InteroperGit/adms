import type { ServiceImage } from './services';

/** Numeric ruble amounts keep formatting separate from editable copy. */
export type PricingAmount =
  | { type: 'exact'; amount: number }
  | { type: 'range'; min: number; max: number };

export type PricingPrice = PricingAmount & {
  currency: 'RUB';
  context: 'demo' | 'current' | 'historical';
  asOf: string | null;
  conditions: string;
};

/** Approval records evidence, independently of demonstration visibility. */
export interface PricingApproval {
  specifications: boolean;
  copy: boolean;
  price: boolean;
  reference: string | null;
  verifiedAt: string | null;
}

export interface PricingExample {
  id: string;
  title: string;
  description: string;
  dimensions: string;
  materials: string[];
  includedWork: string[];
  exclusions: string[];
  source: string;
  price: PricingPrice;
  approval: PricingApproval;
  image: ServiceImage | null;
  href?: string;
}

export interface PricingContent {
  demoMode: boolean;
  demoNotice: string;
  demoPriceLabel: string;
  heading: string;
  introduction: string;
  copyApproved: boolean;
  approvalSource: string | null;
  costFactors: { heading: string; items: string[] };
  estimateGuidance: { heading: string; text: string };
  inquiryLabel: string;
  items: PricingExample[];
}
