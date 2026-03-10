import raw from '@data/config/orderForms.json';

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormFieldDefinition {
  key: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[];
  min?: number;
  max?: number;
}

export interface ProductTypeImage {
  src: string;
  description?: string;
}

export interface ProductType {
  key: string;
  label: string;
  icon: string;
  description?: string;
  images?: ProductTypeImage[];
  fields: FormFieldDefinition[];
}

export interface OrderFormConsent {
  text: string;
  links: { label: string; href: string }[];
  joiner: string;
}

export interface OrderFormSuccess {
  title: string;
  text: string;
  reset: string;
}

export interface OrderFormDefinition {
  title: string;
  description: string;
  icon: string;
  tabsLabel?: string;
  productTypes: ProductType[];
  customerFields: FormFieldDefinition[];
  consent: OrderFormConsent;
  submit: string;
  disclaimer: string;
  success: OrderFormSuccess;
}

export interface OrderFormsPageContent {
  label: string;
  title: string;
  description: string;
  defaultFormId: string;
}

export interface OrderFormsData {
  forms: Record<string, OrderFormDefinition>;
  page: OrderFormsPageContent;
}

export const orderFormsData = raw as unknown as OrderFormsData;
