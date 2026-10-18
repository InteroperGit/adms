// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/production-and-guarantees';

export const value = {
  demoMode: false,
  demoNotice: 'TEST_DEMONOTICE',
  heading: 'TEST_HEADING',
  introduction: 'TEST_INTRODUCTION',
  guidance: [
    {
      title: 'TEST_TITLE',
      description: 'TEST_DESCRIPTION',
      icon: '/images/guarantees/production.svg',
    },
  ],
  copyApproved: false,
  approvalSource: null,
  pendingInputs: ['TEST_PENDINGINPUTS'],
  productionOperations: [
    {
      id: 'sample',
      title: 'TEST_TITLE',
      description: 'TEST_DESCRIPTION',
      evidence: 'TEST_EVIDENCE',
      approval: 'draft',
    },
  ],
  materials: [
    {
      id: 'sample',
      title: 'TEST_TITLE',
      description: 'TEST_DESCRIPTION',
      evidence: 'TEST_EVIDENCE',
      approval: 'draft',
    },
  ],
  qualityChecks: [
    {
      id: 'sample',
      title: 'TEST_TITLE',
      description: 'TEST_DESCRIPTION',
      evidence: 'TEST_EVIDENCE',
      approval: 'draft',
    },
  ],
  photos: [],
  warrantyTerms: [
    {
      id: 'sample',
      title: 'TEST_TITLE',
      coverage: 'TEST_COVERAGE',
      duration: 'TEST_DURATION',
      starts: 'TEST_STARTS',
      conditions: ['TEST_CONDITIONS'],
      exclusions: ['TEST_EXCLUSIONS'],
      claimRoute: 'TEST_CLAIMROUTE',
      sourceType: 'pending',
      source: 'TEST_SOURCE',
      approval: 'draft',
    },
  ],
  maintenance: {
    scope: ['TEST_SCOPE'],
    customerResponsibilities: ['TEST_CUSTOMERRESPONSIBILITIES'],
    pricing: 'TEST_PRICING',
    requestRoute: 'TEST_REQUESTROUTE',
    approval: 'draft',
  },
  inquiryHref: '/#order-inquiry',
} satisfies Domain.ProductionAndGuaranteesContent;

export const ProductionApproval = value.maintenance
  .approval satisfies Domain.ProductionApproval;
export const ProductionGuidanceIcon = value.guidance[0]
  .icon satisfies Domain.ProductionGuidanceIcon;
export const ProductionPhoto = {
  src: '/fixture.svg',
  alt: 'Fixture workshop',
  caption: 'Synthetic photo',
  width: 1,
  height: 1,
  source: 'Fixture owner',
  rights: 'Fixture permission',
  approval: 'draft',
} satisfies Domain.ProductionPhoto;
export const ProductionItem = value
  .productionOperations[0] satisfies Domain.ProductionItem;
export const WarrantyTerm = value
  .warrantyTerms[0] satisfies Domain.WarrantyTerm;
export const MaintenanceContent =
  value.maintenance satisfies Domain.MaintenanceContent;

export const invalid = {
  ...value,
  // @ts-expect-error inquiryHref must retain its domain type.
  inquiryHref: '/wrong',
} satisfies Domain.ProductionAndGuaranteesContent;
