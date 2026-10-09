/** Reusable answers remain drafts until the agency confirms their terms. */
export interface FaqApproval {
  state: 'draft' | 'approved';
  source: string | null;
  approvedBy: string | null;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  approval: FaqApproval;
}

export interface FaqContent {
  demoMode: boolean;
  demoNotice: string;
  heading: string;
  inquiryLabel: string;
  inquiryHref: '/#order-inquiry';
  approval: FaqApproval;
  items: FaqItem[];
}
