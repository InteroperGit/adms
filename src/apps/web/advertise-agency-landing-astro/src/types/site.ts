export interface MenuItem {
  label: string;
  href: string;
}

export interface LegalItem {
  label: string;
  href: string;
}

export interface SectionContent {
  title: string;
  subtitle?: string;
}

export interface YandexReviewsConfig {
  enabled: boolean;
  organizationId: string;
  reviewsUrl: string;
  placeholder: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export interface SiteConfig {
  title: string;
  description: string;
  logoText: string;
  phone: string;
  email: string;
  address: string;
  workHours: string;
  workHoursWeekend: string;
  mapSrc: string;
  mapEnabled: boolean;
  mapFallback: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  yandexReviews: YandexReviewsConfig;
  menu: MenuItem[];
  legal: LegalItem[];
  sections: {
    about: SectionContent;
    projects: SectionContent;
    reviews: SectionContent;
    contacts: SectionContent & { panelTitle: string };
  };
  footer: {
    description: string;
    copyright: string;
  };
}
