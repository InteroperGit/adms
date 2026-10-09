import type { IntroductionContent } from '../types/introduction';

/** Explicit demo mode displays configured media without claiming approval. */
export function getVisibleIntroductionPhoto(content: IntroductionContent) {
  return content.demoMode || (content.copyApproved && content.photo?.approved)
    ? content.photo
    : null;
}
