/** Traceable agency evidence; a demo switch is never an approval. */
export interface ProjectEvidence {
  source: string;
  approvedBy: string;
  approvedAt: string;
}

export interface ProjectPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: 'demo' | 'installation';
  source: string;
  rights: string | null;
  approval: ProjectEvidence | null;
  caption: string;
  cropGuidance: string;
  focalPoint: { x: number; y: number };
}

/** Optional process copy and media; an empty object renders no section. */
export interface ProjectProcess {
  paragraphs?: string[];
  photos?: ProjectPhoto[];
}

/** Null means unknown; production is distinct from total delivery. */
export interface ProjectDetails {
  customerTask?: string | null;
  installationContext?: string | null;
  constraints?: string[] | null;
  materials?: string[] | null;
  dimensions?: {
    label: string;
    value: number;
    unit: 'mm' | 'cm' | 'm';
  }[] | null;
  includedWork?: string[] | null;
  timing?: {
    production?: { value: number; unit: 'hours' | 'days'; basis: string };
    design?: string | null;
    installation?: string | null;
    totalDelivery?: string | null;
  } | null;
}

/** English case types determine the relevant service request form. */
export const projectTypes = [
  'led-letters', 'signs', 'neon', 'dimensional-structures', 'installation',
] as const;

export type ProjectType = typeof projectTypes[number];

export interface Project {
  id: number;
  projectType?: ProjectType | null;
  status: 'draft' | 'demo' | 'published';
  notice: string | null;
  title: string;
  client: string;
  /** Calendar year supplied by the agency; omit when it is unknown. */
  year?: number;
  attribution: 'named' | 'generic';
  shortDescription: string;
  fullDescription?: string | null;
  /** Proposed narrative and benefits never count as verified outcomes. */
  story?: string[] | null;
  expectedBenefits?: string[] | null;
  manufacturing?: ProjectProcess | null;
  installation?: ProjectProcess | null;
  result?: string | null;
  resultPhotos?: ProjectPhoto[] | null;
  details?: ProjectDetails | null;
  photos: ProjectPhoto[];
  evidence: {
    copy: ProjectEvidence | null;
    specifications: ProjectEvidence | null;
    timing: ProjectEvidence | null;
    outcome: ProjectEvidence | null;
    attribution: ProjectEvidence | null;
  };
}
