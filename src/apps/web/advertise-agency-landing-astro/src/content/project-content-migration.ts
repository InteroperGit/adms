import type { ContentBlock, ContentImage } from '../types/content-blocks';

/**
 * Convert the pre-ContentBlock project shape into the universal article
 * stream.  The converter deliberately accepts unknown input so it can be run
 * at the data boundary, before the strict public Project schema is applied.
 */
export function migrateProjectContent(
  input: Record<string, unknown>,
): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const addParagraph = (
    id: string,
    paragraphs: unknown,
    heading?: string,
  ) => {
    if (!Array.isArray(paragraphs)) return;
    const values = paragraphs.filter(
      (value): value is string => typeof value === 'string'
        && value.trim().length > 0,
    );
    if (values.length) {
      blocks.push({
        type: 'paragraph',
        id,
        ...(heading ? { heading } : {}),
        paragraphs: values,
      });
    }
  };

  const fullDescription = input.fullDescription;
  if (typeof fullDescription === 'string' && fullDescription.trim()) {
    addParagraph('overview', [fullDescription], 'Overview');
  }
  addParagraph('story', input.story, 'Project story');
  addParagraph(
    'expected-benefits', input.expectedBenefits, 'Expected benefits',
  );

  const process = (key: 'manufacturing' | 'installation', heading: string) => {
    const value = input[key];
    if (!value || typeof value !== 'object') return;
    const section = value as Record<string, unknown>;
    addParagraph(key, section.paragraphs, heading);
    const images = toContentImages(section.photos);
    if (images.length) {
      blocks.push({ type: 'image-stack', id: `${key}-images`, images });
    }
  };
  process('manufacturing', 'Manufacturing');
  process('installation', 'Installation');

  const details = input.details;
  if (details && typeof details === 'object') {
    const rows: { cells: string[] }[] = [];
    const value = details as Record<string, unknown>;
    for (const [label, raw] of Object.entries(value)) {
      if (raw == null || typeof raw === 'object') continue;
      rows.push({ cells: [label, String(raw)] });
    }
    if (rows.length) {
      blocks.push({
        type: 'table',
        id: 'details',
        title: 'Project parameters',
        columns: [
          { key: 'name', label: 'Parameter' },
          { key: 'value', label: 'Value' },
        ],
        rows,
      });
    }
  }

  const photos = toContentImages(input.photos);
  if (photos.length) {
    blocks.push({ type: 'image-stack', id: 'photos', images: photos });
  }
  const resultPhotos = toContentImages(input.resultPhotos);
  if (resultPhotos.length) {
    blocks.push({
      type: 'image-stack',
      id: 'result-images',
      caption: 'Result',
      images: resultPhotos,
    });
  }

  if (typeof input.result === 'string' && input.result.trim()) {
    blocks.push({
      type: 'paragraph',
      id: 'result',
      heading: 'Result',
      paragraphs: [input.result],
    });
  }
  return blocks;
}

/** Build a public record without legacy fields in its returned shape. */
export function toUniversalProjectRecord(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const {
    year,
    shortDescription,
    manufacturing: _manufacturing,
    installation: _installation,
    result: _result,
    resultPhotos: _resultPhotos,
    photos: _photos,
    details: _details,
    fullDescription: _fullDescription,
    story: _story,
    expectedBenefits: _expectedBenefits,
    evidence: _evidence,
    ...metadata
  } = input;
  if (typeof year === 'number' && Number.isInteger(year)) {
    metadata.date = `${year}-01-01`;
  }
  if (typeof shortDescription === 'string') {
    metadata.description = shortDescription;
  }
  const existing = Array.isArray(input.content) ? input.content : [];
  const migrated = migrateProjectContent(input);
  return { ...metadata, content: existing.length ? existing : migrated };
}

function toContentImages(value: unknown): ContentImage[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item): ContentImage[] => {
    if (!item || typeof item !== 'object') return [];
    const photo = item as Record<string, unknown>;
    if (
      typeof photo.src !== 'string'
      || typeof photo.alt !== 'string'
      || typeof photo.width !== 'number'
      || typeof photo.height !== 'number'
    ) return [];
    const approval = photo.approval && typeof photo.approval === 'object'
      ? photo.approval as Record<string, unknown> : null;
    return [{
      src: photo.src,
      alt: photo.alt,
      width: photo.width,
      height: photo.height,
      ...(typeof photo.caption === 'string' ? { caption: photo.caption } : {}),
      ...(typeof photo.source === 'string' ? {
        provenance: {
          source: photo.source,
          ...(typeof photo.rights === 'string'
            ? { rights: photo.rights } : {}),
          ...(approval && typeof approval.approvedBy === 'string'
            ? { approvedBy: approval.approvedBy } : {}),
          ...(approval && typeof approval.approvedAt === 'string'
            ? { approvedAt: approval.approvedAt } : {}),
        },
      } : {}),
    }];
  });
}

