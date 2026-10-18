// Check every public barrel type against its direct module export.
import type * as Public from '@/types';
import type { AssertContract, SameContract } from '@/validation/shared';
import type * as review from '@/types/review';
export type Review = AssertContract<SameContract<Public.Review, review.Review>>;
import type * as faq from '@/types/faq';
export type FaqApproval = AssertContract<
  SameContract<Public.FaqApproval, faq.FaqApproval>
>;
export type FaqItem = AssertContract<SameContract<Public.FaqItem, faq.FaqItem>>;
export type FaqContent = AssertContract<
  SameContract<Public.FaqContent, faq.FaqContent>
>;
import type * as project from '@/types/project';
export type Project = AssertContract<
  SameContract<Public.Project, project.Project>
>;
export type ProjectCategory = AssertContract<
  SameContract<Public.ProjectCategory, project.ProjectCategory>
>;
import type * as offer from '@/types/offer';
export type Offer = AssertContract<SameContract<Public.Offer, offer.Offer>>;
export type Offers = AssertContract<SameContract<Public.Offers, offer.Offers>>;
export type OfferPresentation = AssertContract<
  SameContract<Public.OfferPresentation, offer.OfferPresentation>
>;
export type OfferFocalPoint = AssertContract<
  SameContract<Public.OfferFocalPoint, offer.OfferFocalPoint>
>;
import type * as site from '@/types/site';
export type MenuItem = AssertContract<
  SameContract<Public.MenuItem, site.MenuItem>
>;
export type LegalItem = AssertContract<
  SameContract<Public.LegalItem, site.LegalItem>
>;
export type SectionContent = AssertContract<
  SameContract<Public.SectionContent, site.SectionContent>
>;
export type SiteConfig = AssertContract<
  SameContract<Public.SiteConfig, site.SiteConfig>
>;
import type * as legal from '@/types/legal';
export type LegalSection = AssertContract<
  SameContract<Public.LegalSection, legal.LegalSection>
>;
export type LegalDocument = AssertContract<
  SameContract<Public.LegalDocument, legal.LegalDocument>
>;
import type * as about from '@/types/about';
export type Stat = AssertContract<SameContract<Public.Stat, about.Stat>>;
export type AboutContent = AssertContract<
  SameContract<Public.AboutContent, about.AboutContent>
>;
import type * as icons from '@/types/icons';
export type Icons = AssertContract<SameContract<Public.Icons, icons.Icons>>;
import type * as orderInquiry from '@/types/order-inquiry';
export type OrderInquiryContent = AssertContract<
  SameContract<Public.OrderInquiryContent, orderInquiry.OrderInquiryContent>
>;
export type InquiryField = AssertContract<
  SameContract<Public.InquiryField, orderInquiry.InquiryField>
>;
import type * as orderingProcess from '@/types/ordering-process';
export type OrderingProcessContent = AssertContract<
  SameContract<
    Public.OrderingProcessContent,
    orderingProcess.OrderingProcessContent
  >
>;
export type OrderingProcessStep = AssertContract<
  SameContract<Public.OrderingProcessStep, orderingProcess.OrderingProcessStep>
>;
import type * as introduction from '@/types/introduction';
export type IntroductionContent = AssertContract<
  SameContract<Public.IntroductionContent, introduction.IntroductionContent>
>;
export type IntroductionPhoto = AssertContract<
  SameContract<Public.IntroductionPhoto, introduction.IntroductionPhoto>
>;
export type IntroductionFocalPoint = AssertContract<
  SameContract<
    Public.IntroductionFocalPoint,
    introduction.IntroductionFocalPoint
  >
>;
import type * as services from '@/types/services';
export type Service = AssertContract<
  SameContract<Public.Service, services.Service>
>;
export type ServiceImage = AssertContract<
  SameContract<Public.ServiceImage, services.ServiceImage>
>;
export type ServiceFocalPoint = AssertContract<
  SameContract<Public.ServiceFocalPoint, services.ServiceFocalPoint>
>;
export type ServicesContent = AssertContract<
  SameContract<Public.ServicesContent, services.ServicesContent>
>;
import type * as pricing from '@/types/pricing';
export type PricingAmount = AssertContract<
  SameContract<Public.PricingAmount, pricing.PricingAmount>
>;
export type PricingPrice = AssertContract<
  SameContract<Public.PricingPrice, pricing.PricingPrice>
>;
export type PricingApproval = AssertContract<
  SameContract<Public.PricingApproval, pricing.PricingApproval>
>;
export type PricingExample = AssertContract<
  SameContract<Public.PricingExample, pricing.PricingExample>
>;
export type PricingContent = AssertContract<
  SameContract<Public.PricingContent, pricing.PricingContent>
>;
import type * as production from '@/types/production-and-guarantees';
export type ProductionApproval = AssertContract<
  SameContract<Public.ProductionApproval, production.ProductionApproval>
>;
export type ProductionPhoto = AssertContract<
  SameContract<Public.ProductionPhoto, production.ProductionPhoto>
>;
export type ProductionItem = AssertContract<
  SameContract<Public.ProductionItem, production.ProductionItem>
>;
export type WarrantyTerm = AssertContract<
  SameContract<Public.WarrantyTerm, production.WarrantyTerm>
>;
export type MaintenanceContent = AssertContract<
  SameContract<Public.MaintenanceContent, production.MaintenanceContent>
>;
export type ProductionAndGuaranteesContent = AssertContract<
  SameContract<
    Public.ProductionAndGuaranteesContent,
    production.ProductionAndGuaranteesContent
  >
>;
import type * as imageCarousel from '@/types/image-carousel';
export type CarouselItem = AssertContract<
  SameContract<Public.CarouselItem, imageCarousel.CarouselItem>
>;
export type CarouselOptions = AssertContract<
  SameContract<Public.CarouselOptions, imageCarousel.CarouselOptions>
>;
export type CarouselContent = AssertContract<
  SameContract<Public.CarouselContent, imageCarousel.CarouselContent>
>;
export type CarouselPresentation = AssertContract<
  SameContract<Public.CarouselPresentation, imageCarousel.CarouselPresentation>
>;
export type CarouselFocalPoint = AssertContract<
  SameContract<Public.CarouselFocalPoint, imageCarousel.CarouselFocalPoint>
>;
import type * as businessSolutions from '@/types/business-solutions';
export type BusinessSolutionMedia = AssertContract<
  SameContract<
    Public.BusinessSolutionMedia,
    businessSolutions.BusinessSolutionMedia
  >
>;
export type BusinessSolutionAttribution = AssertContract<
  SameContract<
    Public.BusinessSolutionAttribution,
    businessSolutions.BusinessSolutionAttribution
  >
>;
export type BusinessSolutionItem = AssertContract<
  SameContract<
    Public.BusinessSolutionItem,
    businessSolutions.BusinessSolutionItem
  >
>;
export type BusinessSolutionsContent = AssertContract<
  SameContract<
    Public.BusinessSolutionsContent,
    businessSolutions.BusinessSolutionsContent
  >
>;
import type * as contentBlocks from '@/types/content-blocks';
export type ChartBlock = AssertContract<
  SameContract<Public.ChartBlock, contentBlocks.ChartBlock>
>;
export type ContentBlock = AssertContract<
  SameContract<Public.ContentBlock, contentBlocks.ContentBlock>
>;
export type ContentBlockMeta = AssertContract<
  SameContract<Public.ContentBlockMeta, contentBlocks.ContentBlockMeta>
>;
export type ContentBlockProvenance = AssertContract<
  SameContract<
    Public.ContentBlockProvenance,
    contentBlocks.ContentBlockProvenance
  >
>;
export type ContentImage = AssertContract<
  SameContract<Public.ContentImage, contentBlocks.ContentImage>
>;
export type FootnoteBlock = AssertContract<
  SameContract<Public.FootnoteBlock, contentBlocks.FootnoteBlock>
>;
export type ImageBlock = AssertContract<
  SameContract<Public.ImageBlock, contentBlocks.ImageBlock>
>;
export type ImageGalleryBlock = AssertContract<
  SameContract<Public.ImageGalleryBlock, contentBlocks.ImageGalleryBlock>
>;
export type OrderedListBlock = AssertContract<
  SameContract<Public.OrderedListBlock, contentBlocks.OrderedListBlock>
>;
export type OrderFormBlock = AssertContract<
  SameContract<Public.OrderFormBlock, contentBlocks.OrderFormBlock>
>;
export type ParagraphBlock = AssertContract<
  SameContract<Public.ParagraphBlock, contentBlocks.ParagraphBlock>
>;
export type QuoteBlock = AssertContract<
  SameContract<Public.QuoteBlock, contentBlocks.QuoteBlock>
>;
export type TableBlock = AssertContract<
  SameContract<Public.TableBlock, contentBlocks.TableBlock>
>;
export type UnorderedListBlock = AssertContract<
  SameContract<Public.UnorderedListBlock, contentBlocks.UnorderedListBlock>
>;
export type VideoBlock = AssertContract<
  SameContract<Public.VideoBlock, contentBlocks.VideoBlock>
>;

import { projectCategories } from '@/types';
export const categories =
  projectCategories satisfies project.ProjectCategoryConfig[];
// @ts-expect-error Barrel exports preserve the draft/public union.
export const invalid = 'archived' satisfies Public.Project['status'];
