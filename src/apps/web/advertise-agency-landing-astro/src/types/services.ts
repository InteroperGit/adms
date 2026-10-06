export interface ServiceFocalPoint {
  x: number;
  y: number;
}

export interface ServiceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  source: string;
  projectContext: string;
  publicationPermission: string;
  approved: boolean;
  desktopFocalPoint: ServiceFocalPoint;
  mobileFocalPoint: ServiceFocalPoint;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  claimSource: string;
  confirmed: boolean;
  copyApproved: boolean;
  image: ServiceImage | null;
  href?: string;
  article: {
    title: string;
    description: string;
    lead: string;
    sections: { heading: string; paragraphs: string[] }[];
    inquiry: string[];
    approved: boolean;
  };
}

export interface ServicesContent {
  demoMode: boolean;
  demoNotice: string;
  heading: string;
  introduction: string;
  copyApproved: boolean;
  items: Service[];
}
