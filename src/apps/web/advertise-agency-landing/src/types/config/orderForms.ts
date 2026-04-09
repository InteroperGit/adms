import raw from '@data/config/orderForms.json';
import { z } from 'zod';

/**
 * @module config/orderForms
 * @description Order form configurations with product types, customer fields, consent, and success messages.
 */

/**
 * @description Option choice within a select, radio, or checkbox field
 */
const FormFieldOptionSchema = z.object({
  /** Submitted value */
  value: z.string(),
  /** Display label */
  label: z.string(),
});

/**
 * @description Form field option with label and value
 */
export type FormFieldOption = z.infer<typeof FormFieldOptionSchema>;

/**
 * @description Single form field definition
 */
const FormFieldDefinitionSchema = z.object({
  /** Unique field identifier */
  key: z.string(),
  /** Input type (text input, number, dropdown, checkbox, textarea, radio button) */
  type: z.enum(['text', 'number', 'select', 'checkbox', 'textarea', 'radio']),
  /** Display label for the field */
  label: z.string(),
  /** Placeholder text shown when field is empty */
  placeholder: z.string().optional(),
  /** Whether field submission is required */
  required: z.boolean().optional(),
  /** Options for select/radio/checkbox fields */
  options: z.array(FormFieldOptionSchema).optional(),
  /** Minimum value for number fields */
  min: z.number().optional(),
  /** Maximum value for number fields */
  max: z.number().optional(),
});

/**
 * @description Form field configuration
 */
export type FormFieldDefinition = z.infer<typeof FormFieldDefinitionSchema>;

/**
 * @description Image reference for product type gallery
 */
const ProductTypeImageSchema = z.object({
  /** Image URL or path */
  src: z.string(),
  /** Optional alt text or description */
  description: z.string().optional(),
});

/**
 * @description Image with source and optional description
 */
export type ProductTypeImage = z.infer<typeof ProductTypeImageSchema>;

/**
 * @description Product/service type that can be ordered
 */
const ProductTypeSchema = z.object({
  /** Unique product type identifier */
  key: z.string(),
  /** Display name of the product type */
  label: z.string(),
  /** Icon name (resolved from ICON_MAP) */
  icon: z.string(),
  /** Short description of the product type */
  description: z.string().optional(),
  /** Gallery images showcasing the product */
  images: z.array(ProductTypeImageSchema).optional(),
  /** Form fields specific to this product type */
  fields: z.array(FormFieldDefinitionSchema),
});

/**
 * @description Product type with fields and gallery
 */
export type ProductType = z.infer<typeof ProductTypeSchema>;

/**
 * @description Consent/agreement checkbox text and links
 */
const OrderFormConsentSchema = z.object({
  /** Consent text (can include inline links) */
  text: z.string(),
  /** Array of links to legal documents */
  links: z.array(z.object({ label: z.string(), href: z.string() })),
  /** Text joining multiple links (e.g., " and ") */
  joiner: z.string(),
});

/**
 * @description Consent configuration with text and legal links
 */
export type OrderFormConsent = z.infer<typeof OrderFormConsentSchema>;

/**
 * @description Success message shown after form submission
 */
const OrderFormSuccessSchema = z.object({
  /** Success page title */
  title: z.string(),
  /** Success message body */
  text: z.string(),
  /** Label for button to reset form */
  reset: z.string(),
});

/**
 * @description Success confirmation content
 */
export type OrderFormSuccess = z.infer<typeof OrderFormSuccessSchema>;

/**
 * @description Trust badge shown above the order form CTA
 */
const TrustBadgeSchema = z.object({
  /** Icon name (resolved from ICON_MAP) */
  icon: z.string(),
  /** Short trust signal label */
  label: z.string(),
});

/**
 * @description Trust badge item
 */
export type TrustBadge = z.infer<typeof TrustBadgeSchema>;

/**
 * @description Complete order form configuration
 */
const OrderFormDefinitionSchema = z.object({
  /** Form title displayed to user */
  title: z.string(),
  /** Form description/introduction */
  description: z.string(),
  /** Icon name for the form (resolved from ICON_MAP) */
  icon: z.string(),
  /** Trust badges shown above the form in OrderFormBlock CTA container */
  trustBadges: z.array(TrustBadgeSchema).optional(),
  /** Label for product type tabs (shown when multiple product types exist) */
  tabsLabel: z.string().optional(),
  /** Available product types within this form */
  productTypes: z.array(ProductTypeSchema),
  /** Common customer info fields (contact details, etc.) */
  customerFields: z.array(FormFieldDefinitionSchema),
  /** Consent/agreement configuration */
  consent: OrderFormConsentSchema,
  /** Label for submit button */
  submit: z.string(),
  /** Disclaimer text shown above submit button */
  disclaimer: z.string(),
  /** Success message configuration */
  success: OrderFormSuccessSchema,
  /** Error text when captcha site key is missing */
  captchaNotConfigured: z.string(),
  /** Error text when form submission fails */
  submitFailed: z.string(),
  /** Button text while submitting */
  sending: z.string(),
});

/**
 * @description Order form with product types and customer fields
 */
export type OrderFormDefinition = z.infer<typeof OrderFormDefinitionSchema>;

/**
 * @description Order forms page header and settings
 */
const OrderFormsPageContentSchema = z.object({
  /** Navigation label for order page */
  label: z.string(),
  /** Page title */
  title: z.string(),
  /** Page description/introduction */
  description: z.string(),
  /** Default form ID to display on page load */
  defaultFormId: z.string(),
});

/**
 * @description Order page content configuration
 */
export type OrderFormsPageContent = z.infer<typeof OrderFormsPageContentSchema>;

/**
 * @description Root order forms configuration with multiple forms and page content
 */
export const OrderFormsDataSchema = z.object({
  /** Map of form ID to form definition */
  forms: z.record(z.string(), OrderFormDefinitionSchema),
  /** Page header and settings */
  page: OrderFormsPageContentSchema,
});

/**
 * @description Parsed and validated order forms data
 */
export type OrderFormsData = z.infer<typeof OrderFormsDataSchema>;

/**
 * @description Exported order forms data constant parsed from data/config/orderForms.json
 */
export const orderFormsData = OrderFormsDataSchema.parse(raw);
