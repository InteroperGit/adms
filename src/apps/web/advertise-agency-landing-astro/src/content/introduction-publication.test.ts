// Preview visibility must never promote an unapproved photograph.
import { expect, it } from 'vitest';
import { buildContract } from '../../tests/helpers/fixtures';
import type { IntroductionContent } from '../types/introduction';
import { getVisibleIntroductionPhoto } from './introduction-publication';

it.each([false, true])('checks all photo gates with demoMode=%s', demoMode => {
  for (const copyApproved of [false, true]) {
    for (const approved of [false, true]) {
      const content = buildContract('introduction') as IntroductionContent;
      content.demoMode = demoMode;
      content.copyApproved = copyApproved;
      content.photo!.approved = approved;
      expect(getVisibleIntroductionPhoto(content)).toBe(
        demoMode || (copyApproved && approved) ? content.photo : null,
      );
      content.photo = null;
      expect(getVisibleIntroductionPhoto(content)).toBeNull();
    }
  }
});
