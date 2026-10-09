import type { FaqApproval, FaqContent } from '../types/faq';

function isApproved(approval: FaqApproval) {
  return approval.state === 'approved'
    && Boolean(approval.source?.trim())
    && Boolean(approval.approvedBy?.trim());
}

/** Gate section copy as well as answers; an empty result omits the section. */
export function getPublishedFaqItems(content: FaqContent) {
  if (!isApproved(content.approval)) return [];
  return content.items.filter(item => isApproved(item.approval));
}

/** Explicit preview visibility preserves the separate agency approvals. */
export function getVisibleFaqItems(content: FaqContent) {
  return content.demoMode ? content.items : getPublishedFaqItems(content);
}
