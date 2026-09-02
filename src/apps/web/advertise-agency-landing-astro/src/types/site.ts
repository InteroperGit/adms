export interface MenuItem {
  label: string;
  href: string;
}

export interface LegalItem {
  label: string;
  href: string;
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
  menu: MenuItem[];
  legal: LegalItem[];
  footer: {
    copyright: string;
  };
}