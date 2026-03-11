import raw from '@data/config/orderForms.json';
import { z } from 'zod';

const FormFieldOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export type FormFieldOption = z.infer<typeof FormFieldOptionSchema>;

const FormFieldDefinitionSchema = z.object({
  key: z.string(),
  type: z.enum(['text', 'number', 'select', 'checkbox', 'textarea', 'radio']),
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(FormFieldOptionSchema).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

export type FormFieldDefinition = z.infer<typeof FormFieldDefinitionSchema>;

const ProductTypeImageSchema = z.object({
  src: z.string(),
  description: z.string().optional(),
});

export type ProductTypeImage = z.infer<typeof ProductTypeImageSchema>;

const ProductTypeSchema = z.object({
  key: z.string(),
  label: z.string(),
  icon: z.string(),
  description: z.string().optional(),
  images: z.array(ProductTypeImageSchema).optional(),
  fields: z.array(FormFieldDefinitionSchema),
});

export type ProductType = z.infer<typeof ProductTypeSchema>;

const OrderFormConsentSchema = z.object({
  text: z.string(),
  links: z.array(z.object({ label: z.string(), href: z.string() })),
  joiner: z.string(),
});

export type OrderFormConsent = z.infer<typeof OrderFormConsentSchema>;

const OrderFormSuccessSchema = z.object({
  title: z.string(),
  text: z.string(),
  reset: z.string(),
});

export type OrderFormSuccess = z.infer<typeof OrderFormSuccessSchema>;

const OrderFormDefinitionSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  tabsLabel: z.string().optional(),
  productTypes: z.array(ProductTypeSchema),
  customerFields: z.array(FormFieldDefinitionSchema),
  consent: OrderFormConsentSchema,
  submit: z.string(),
  disclaimer: z.string(),
  success: OrderFormSuccessSchema,
});

export type OrderFormDefinition = z.infer<typeof OrderFormDefinitionSchema>;

const OrderFormsPageContentSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  defaultFormId: z.string(),
});

export type OrderFormsPageContent = z.infer<typeof OrderFormsPageContentSchema>;

export const OrderFormsDataSchema = z.object({
  forms: z.record(z.string(), OrderFormDefinitionSchema),
  page: OrderFormsPageContentSchema,
});

export type OrderFormsData = z.infer<typeof OrderFormsDataSchema>;

export const orderFormsData = OrderFormsDataSchema.parse(raw);
