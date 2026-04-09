import { describe, it, expect } from 'vitest';
import { SiteDataSchema } from './siteData';
import { ThemeSchema } from './theme';
import { CookiesContentSchema } from './cookies';
import { LegalDataSchema } from './legalData';
import { PortfolioConfigSchema } from './portfolioConfig';
import { CategoriesSchema } from './categories';
import { OrderFormsDataSchema } from './orderForms';
import { NotFoundContentSchema } from './notFound';
import { SeoConfigSchema } from './seo';
import { ErrorFallbackContentSchema } from './errorFallback';

// Mock data for validation (simplified for brevity, actual data would be more comprehensive)

const mockSiteData = {
  name: 'Test Agency',
  description: 'A test agency for advertising',
  homeLabel: 'Home',
  domain: 'test.com',
  companyPhone: '123-456-7890',
  companyEmail: 'test@test.com',
  companyAddress: '123 Test St',
  social: {
    facebook: 'test',
    instagram: 'test',
    linkedin: 'test',
    x: 'test',
  },
  contact: {
    phone: '123-456-7890',
    email: 'test@test.com',
    address: '123 Test St',
    telegram: '@test',
    vk: 'vk.com/test',
    workingHours: {
      weekdays: '9:00-18:00',
      saturday: '10:00-16:00',
      sunday: 'Closed',
    },
  },
};

const mockThemeData = {
  colors: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(240 10% 3.9%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(240 10% 3.9%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(240 10% 3.9%)',
    primary: 'hsl(240 5.9% 10%)',
    primaryForeground: 'hsl(0 0% 98%)',
    secondary: 'hsl(240 4.8% 95.9%)',
    secondaryForeground: 'hsl(240 5.9% 10%)',
    muted: 'hsl(240 4.8% 95.9%)',
    mutedForeground: 'hsl(240 3.8% 46.1%)',
    accent: 'hsl(240 4.8% 95.9%)',
    accentForeground: 'hsl(240 5.9% 10%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    destructiveForeground: 'hsl(0 0% 98%)',
    border: 'hsl(240 5.9% 90%)',
    input: 'hsl(240 5.9% 90%)',
    ring: 'hsl(240 5.9% 10%)',
  },
  radius: '0.5rem',
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  fontUrls: [],
};

const mockCookiesData = {
  ariaLabel: 'Cookie Consent Banner',
  closeLabel: 'Close',
  title: 'Cookie Consent',
  text: 'We use cookies to ensure you get the best experience on our website. Please review our privacy policy.',
  privacyLink: { label: 'Privacy Policy', href: '/legal/privacy-policy' },
  acceptAll: 'Accept All',
  necessaryOnly: 'Necessary Only',
};

const mockLegalData = {
  company: {
    name: 'Test Agency LLC',
    inn: '1234567890',
    ogrn: '0987654321',
    legalAddress: '456 Legal Ave',
    siteUrl: 'https://test.com',
    email: 'legal@test.com',
    phone: '098-765-4321',
    responsible: 'John Doe',
  },
  documents: {
    privacyPolicy: { version: '1.0', effectiveDate: '2023-01-01' },
    consent: { version: '1.0', effectiveDate: '2023-01-01' },
    userAgreement: { version: '1.0', effectiveDate: '2023-01-01' },
  },
};

const mockPortfolioConfig = {
  gridDescription: 'Selected portfolio projects.',
  perPage: 9,
  allLabel: 'All',
  detailsLabel: 'View Details',
  prevLabel: 'Previous',
  nextLabel: 'Next',
  pageLabel: '{current} of {total}',
  emptyLabel: 'No portfolio cases found.',
  notFoundCategory: 'Unknown Category',
  allProjectsLink: 'View All Projects',
  cta: { label: 'Contact Us', href: '/contact' },
  overviewLabels: {
    client: 'Client',
    category: 'Category',
    year: 'Year',
    services: 'Services',
  },
};

const mockCategoriesData = [
  { name: 'All', slug: 'all' },
  { name: 'Branding', slug: 'branding' },
];

const mockOrderFormsData = {
  forms: {
    'test-form': {
      title: 'Test Order Form',
      description: 'This is a test order form.',
      icon: 'TestIcon',
      trustBadges: [{ icon: 'ShieldCheck', label: 'Secure' }],
      tabsLabel: 'Select Product',
      productTypes: [
        {
          key: 'product-1',
          label: 'Product One',
          icon: 'Package',
          fields: [
            { key: 'name', type: 'text', label: 'Your Name', required: true },
            { key: 'email', type: 'text', label: 'Your Email', required: true },
          ],
        },
      ],
      customerFields: [{ key: 'phone', type: 'text', label: 'Phone Number' }],
      consent: {
        text: 'I agree to the terms',
        links: [{ label: 'Terms', href: '/legal/terms' }],
        joiner: ' and ',
      },
      submit: 'Submit Order',
      disclaimer: 'By submitting, you agree...',
      success: {
        title: 'Order Received!',
        text: 'Thank you for your order.',
        reset: 'Order Again',
      },
    },
  },
  page: {
    label: 'Order',
    title: 'Place Your Order',
    description: 'Select a service and fill out the form.',
    defaultFormId: 'test-form',
  },
};

const mockNotFoundData = {
  title: '404 - Page Not Found',
  code: '404',
  description: 'The page you are looking for does not exist.',
  backLabel: 'Go to Homepage',
  backHref: '/',
};

const mockSeoData = {
  siteUrl: 'https://test.com',
  siteName: 'Test Agency',
  locale: 'en',
  twitterCard: 'summary_large_image',
  defaultOgImage: '/images/default-og.webp',
};

const mockErrorFallbackData = {
  title: 'Something went wrong!',
  description: 'An unexpected error has occurred. Please try again later.',
  resetLabel: 'Try Again',
};

describe('Config Schemas Validation', () => {
  it('SiteDataSchema parses without errors', () => {
    expect(() => SiteDataSchema.parse(mockSiteData)).not.toThrow();
  });

  it('ThemeSchema parses without errors', () => {
    expect(() => ThemeSchema.parse(mockThemeData)).not.toThrow();
  });

  it('CookiesContentSchema parses without errors', () => {
    expect(() => CookiesContentSchema.parse(mockCookiesData)).not.toThrow();
  });

  it('LegalDataSchema parses without errors', () => {
    expect(() => LegalDataSchema.parse(mockLegalData)).not.toThrow();
  });

  it('PortfolioConfigSchema parses without errors', () => {
    expect(() => PortfolioConfigSchema.parse(mockPortfolioConfig)).not.toThrow();
  });

  it('CategoriesSchema parses without errors', () => {
    expect(() => CategoriesSchema.parse(mockCategoriesData)).not.toThrow();
  });

  it('OrderFormsDataSchema parses without errors', () => {
    expect(() => OrderFormsDataSchema.parse(mockOrderFormsData)).not.toThrow();
  });

  it('NotFoundContentSchema parses without errors', () => {
    expect(() => NotFoundContentSchema.parse(mockNotFoundData)).not.toThrow();
  });

  it('SeoConfigSchema parses without errors', () => {
    expect(() => SeoConfigSchema.parse(mockSeoData)).not.toThrow();
  });

  it('ErrorFallbackContentSchema parses without errors', () => {
    expect(() => ErrorFallbackContentSchema.parse(mockErrorFallbackData)).not.toThrow();
  });
});
