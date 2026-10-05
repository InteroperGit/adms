export interface Offer {
  id: number;
  enabled: boolean;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  linkLabel: string;
  href: string;
}

/** Validated settings: intervalMs is always present after the default is applied. */
export interface Offers {
  enabled: boolean;
  autoplay: boolean;
  intervalMs: number;
  title: string;
  items: Offer[];
}
