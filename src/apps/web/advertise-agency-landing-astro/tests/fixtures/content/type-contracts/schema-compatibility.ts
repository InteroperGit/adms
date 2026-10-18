// Compile schema outputs together with their plain browser domain contracts.
// These checks also load each schema's existing nested contract assertions.
import type { z } from 'astro/zod';
import type * as Domain from '@/types';
import type { AssertContract, SameContract } from '@/validation/shared';
import type { businessSolutionsSchema } from '@/validation/business-solutions';
import type { contentBlockSchema } from '@/validation/content-blocks';
import type { faqSchema } from '@/validation/faq';
import type { carouselContentSchema } from '@/validation/image-carousel';
import type { introductionSchema } from '@/validation/introduction';
import type { offersSchema } from '@/validation/offers';
import type { orderInquirySchema } from '@/validation/order-inquiry';
import type { orderingProcessSchema } from '@/validation/ordering-process';
import type { pricingSchema } from '@/validation/pricing';
// prettier-ignore
import type { productionAndGuaranteesSchema }
  from '@/validation/production-and-guarantees';
import type { projectSchema } from '@/validation/projects';
import type { reviewSchema } from '@/validation/reviews';
import type { servicesSchema } from '@/validation/services';

export type Business = AssertContract<
  SameContract<
    z.output<typeof businessSolutionsSchema>,
    Domain.BusinessSolutionsContent
  >
>;
export type Blocks = AssertContract<
  SameContract<z.output<typeof contentBlockSchema>, Domain.ContentBlock>
>;
export type Faq = AssertContract<
  SameContract<z.output<typeof faqSchema>, Domain.FaqContent>
>;
export type Carousel = AssertContract<
  SameContract<z.output<typeof carouselContentSchema>, Domain.CarouselContent>
>;
export type Introduction = AssertContract<
  SameContract<z.output<typeof introductionSchema>, Domain.IntroductionContent>
>;
export type Offers = AssertContract<
  SameContract<z.output<typeof offersSchema>, Domain.Offers>
>;
export type Inquiry = AssertContract<
  SameContract<z.output<typeof orderInquirySchema>, Domain.OrderInquiryContent>
>;
export type Ordering = AssertContract<
  SameContract<
    z.output<typeof orderingProcessSchema>,
    Domain.OrderingProcessContent
  >
>;
export type Pricing = AssertContract<
  SameContract<z.output<typeof pricingSchema>, Domain.PricingContent>
>;
export type Production = AssertContract<
  SameContract<
    z.output<typeof productionAndGuaranteesSchema>,
    Domain.ProductionAndGuaranteesContent
  >
>;
export type Project = AssertContract<
  SameContract<z.output<typeof projectSchema>, Domain.Project>
>;
export type Review = AssertContract<
  SameContract<z.output<typeof reviewSchema>, Domain.Review>
>;
export type Services = AssertContract<
  SameContract<z.output<typeof servicesSchema>, Domain.ServicesContent>
>;

// Missing and surplus keys must fail the shared comparison helper itself.
type MissingComparison = SameContract<Pick<Domain.Review, 'id'>, Domain.Review>;
// @ts-expect-error Removing domain keys breaks compatibility.
export type Missing = AssertContract<MissingComparison>;
type ExtraShape = Domain.Review & { accidental: string };
type ExtraComparison = SameContract<ExtraShape, Domain.Review>;
// @ts-expect-error Surplus schema keys also break compatibility.
export type Extra = AssertContract<ExtraComparison>;
