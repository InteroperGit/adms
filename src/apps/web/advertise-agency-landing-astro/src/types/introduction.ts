export interface IntroductionFocalPoint {
  x: number;
  y: number;
}

export interface IntroductionPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  source: string;
  projectContext: string;
  publicationPermission: string;
  desktopFocalPoint: IntroductionFocalPoint;
  mobileFocalPoint: IntroductionFocalPoint;
}

export interface IntroductionContent {
  heading: string;
  summary: string;
  location: string;
  copyApproved: boolean;
  action: {
    label: string;
    href: '/#order-inquiry';
  };
  photo: IntroductionPhoto | null;
}
