// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/ordering-process';

export const value = {
  demoMode: false,
  demoNotice: 'TEST_DEMONOTICE',
  heading: 'TEST_HEADING',
  introduction: 'TEST_INTRODUCTION',
  copyApproved: false,
  approvalSource: null,
  pendingInputs: ['TEST_PENDINGINPUTS'],
  steps: [
    {
      id: 'step-0',
      icon: '/images/guarantees/production.svg',
      title: 'TEST_TITLE',
      description: 'TEST_DESCRIPTION',
      customerProvides: ['TEST_CUSTOMERPROVIDES'],
      agencyHandles: ['TEST_AGENCYHANDLES'],
    },
    {
      id: 'step-1',
      icon: '/images/guarantees/production.svg',
      title: 'TEST_TITLE',
      description: 'TEST_DESCRIPTION',
      customerProvides: ['TEST_CUSTOMERPROVIDES'],
      agencyHandles: ['TEST_AGENCYHANDLES'],
    },
    {
      id: 'step-2',
      icon: '/images/guarantees/production.svg',
      title: 'TEST_TITLE',
      description: 'TEST_DESCRIPTION',
      customerProvides: ['TEST_CUSTOMERPROVIDES'],
      agencyHandles: ['TEST_AGENCYHANDLES'],
    },
    {
      id: 'step-3',
      icon: '/images/guarantees/production.svg',
      title: 'TEST_TITLE',
      description: 'TEST_DESCRIPTION',
      customerProvides: ['TEST_CUSTOMERPROVIDES'],
      agencyHandles: ['TEST_AGENCYHANDLES'],
    },
    {
      id: 'step-4',
      icon: '/images/guarantees/production.svg',
      title: 'TEST_TITLE',
      description: 'TEST_DESCRIPTION',
      customerProvides: ['TEST_CUSTOMERPROVIDES'],
      agencyHandles: ['TEST_AGENCYHANDLES'],
    },
  ],
} satisfies Domain.OrderingProcessContent;

export const OrderingProcessStep = value
  .steps[0] satisfies Domain.OrderingProcessStep;

export const invalid = {
  ...value,
  // @ts-expect-error copyApproved must retain its domain type.
  copyApproved: 'yes',
} satisfies Domain.OrderingProcessContent;
