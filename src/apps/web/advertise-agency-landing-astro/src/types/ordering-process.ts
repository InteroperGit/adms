/** A single stage in the customer's path from inquiry to installation. */
export interface OrderingProcessStep {
  id: string;
  icon: string;
  title: string;
  description: string;
  customerProvides: string[];
  agencyHandles: string[];
}

export interface OrderingProcessContent {
  demoMode: boolean;
  demoNotice: string;
  heading: string;
  introduction: string;
  copyApproved: boolean;
  approvalSource: string | null;
  pendingInputs: string[];
  steps: OrderingProcessStep[];
}
