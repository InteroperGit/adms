import type { ContentBlock } from "./content-blocks";

export interface ProjectApproval {
  source: string;
  approvedBy: string;
  approvedAt: string;
}

export interface ProjectEvidence {
  copy: ProjectApproval | null;
  specifications: ProjectApproval | null;
  timing: ProjectApproval | null;
  outcome: ProjectApproval | null;
  attribution: ProjectApproval | null;
}

export type ProjectCategory = string;

export interface ProjectCategoryConfig {
  slug: ProjectCategory;
  label: string;
  color: string;
  textColor: string;
}

/**
 * Catalog and SEO metadata for a project article.
 * Article material belongs in content blocks.
 */
export interface Project {
  id: number;
  category?: ProjectCategory | null;
  status: "draft" | "demo" | "published";
  title: string;
  client: string;
  /** ISO calendar date for the project milestone, when known. */
  date?: string;
  attribution: "named" | "generic";
  description: string;
  /** Keep editorial approval references separate from visitor-facing copy. */
  evidence?: ProjectEvidence;
  content: ContentBlock[];
}
