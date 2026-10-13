import type {
  ContentBlock, ContentImage,
} from '../../src/types/content-blocks';

/**
 * Convert the pre-ContentBlock project shape into the universal article
 * stream.  The converter deliberately accepts unknown input so it can be run
 * offline for the historical regression fixture. Application loaders never
 * import this converter; authored records are validated directly.
 */
export function migrateProjectContent(
  input: Record<string, unknown>,
): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  // Lead media remains the catalogue thumbnail and precedes the explanation.
  const photos = toContentImages(input.photos);
  if (photos.length) {
    blocks.push({ type: 'image-gallery', id: 'photos', images: photos });
  }
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
  const addList = (id: string, values: unknown, heading: string) => {
    if (!Array.isArray(values)) return;
    const items = values.filter(
      (value): value is string => typeof value === 'string'
        && value.trim().length > 0,
    );
    if (items.length) {
      blocks.push({ type: 'unordered-list', id, heading, items });
    }
  };

  const fullDescription = input.fullDescription;
  if (typeof fullDescription === 'string' && fullDescription.trim()) {
    addParagraph('overview', [fullDescription], 'О проекте');
  }
  addParagraph('story', input.story, 'История проекта');
  addList(
    'expected-benefits', input.expectedBenefits, 'Ожидаемые преимущества',
  );

  const details = input.details;
  if (details && typeof details === 'object') {
    const value = details as Record<string, unknown>;
    const task = value.customerTask;
    if (typeof task === 'string' && task.trim()) {
      addParagraph('customer-task', [task], 'Задача заказчика');
    }
    const context = value.installationContext;
    if (typeof context === 'string' && context.trim()) {
      addParagraph('installation-context', [context], 'Условия размещения');
    }
    addList('constraints', value.constraints, 'Условия монтажа');
    addList('materials', value.materials, 'Материалы');
    addList('included-work', value.includedWork, 'Состав работ');
    if (Array.isArray(value.dimensions) && value.dimensions.length) {
      const rows = value.dimensions.map((dimension) => {
        if (!dimension || typeof dimension !== 'object') {
          throw new Error('Project dimension must be a measurement');
        }
        const item = dimension as Record<string, unknown>;
        if (typeof item.label !== 'string' || !item.label.trim()) {
          throw new Error('Project dimension needs a label');
        }
        return { cells: [item.label, formatMeasure(item)] };
      });
      blocks.push({
        type: 'table', id: 'dimensions', title: 'Размеры',
        columns: [
          { key: 'name', label: 'Параметр' },
          { key: 'value', label: 'Значение' },
        ],
        rows,
      });
    }
    const timing = value.timing;
    if (timing && typeof timing === 'object') {
      const timingValue = timing as Record<string, unknown>;
      const rows = Object.entries(timingValue).flatMap(([label, raw]) => {
        if (raw && typeof raw === 'object') {
          const item = raw as Record<string, unknown>;
          if (typeof item.value === 'number' && typeof item.unit === 'string') {
            const basis = typeof item.basis === 'string'
              ? ` (${item.basis})` : '';
            return [{ cells: [timingLabel(label),
              `${formatMeasure(item)}${basis}`] }];
          }
        }
        return typeof raw === 'string' && raw.trim()
          ? [{ cells: [timingLabel(label), raw] }] : [];
      });
      if (rows.length) {
        blocks.push({
          type: 'table',
          id: 'timing',
          title: 'Сроки',
          columns: [
            { key: 'stage', label: 'Этап' },
            { key: 'duration', label: 'Срок' },
          ],
          rows,
        });
      }
    }
  }

  const process = (key: 'manufacturing' | 'installation', heading: string) => {
    const value = input[key];
    if (!value || typeof value !== 'object') return;
    const section = value as Record<string, unknown>;
    addParagraph(key, section.paragraphs, heading);
    const images = toContentImages(section.photos);
    if (images.length) {
      blocks.push({ type: 'image-gallery', id: `${key}-images`, images });
    }
  };
  process('manufacturing', 'Изготовление');
  process('installation', 'Монтаж');

  if (details && typeof details === 'object') {
    const rows: { cells: string[] }[] = [];
    const value = details as Record<string, unknown>;
    for (const [label, raw] of Object.entries(value)) {
      // These values already have dedicated sections in the ordered stream.
      if (label === 'customerTask' || label === 'installationContext') continue;
      if (raw == null || typeof raw === 'object') continue;
      rows.push({ cells: [label, String(raw)] });
    }
    if (rows.length) {
      blocks.push({
        type: 'table',
        id: 'details',
        title: 'Параметры проекта',
        columns: [
          { key: 'name', label: 'Параметр' },
          { key: 'value', label: 'Значение' },
        ],
        rows,
      });
    }
  }

  const resultPhotos = toContentImages(input.resultPhotos);
  if (resultPhotos.length) {
    blocks.push({
      type: 'image-gallery',
      id: 'result-images',
      caption: 'Результат',
      images: resultPhotos,
    });
  }

  if (typeof input.result === 'string' && input.result.trim()) {
    blocks.push({
      type: 'paragraph',
      id: 'result',
      heading: 'Результат',
      paragraphs: [input.result],
    });
  }
  if (input.category === 'led-letters') {
    blocks.push({
      type: 'order-form',
      id: 'order-form',
      formId: 'led-letters',
      context: 'project',
      category: 'led-letters',
    });
  }
  return blocks;
}

/** Localize known legacy units without altering the underlying quantities. */
function formatMeasure(item: Record<string, unknown>): string {
  if (typeof item.value !== 'number' || !Number.isFinite(item.value)
    || typeof item.unit !== 'string' || !item.unit.trim()) {
    throw new Error('Project measurement needs a finite value and unit');
  }
  const units: Record<string, string> = {
    m: 'м', cm: 'см', mm: 'мм', days: 'дн.', hours: 'ч.',
  };
  const value = item.value.toLocaleString('ru-RU', {
    maximumFractionDigits: 20,
  });
  const unit = item.unit;
  return `${value} ${units[unit] ?? unit}`;
}

function timingLabel(label: string): string {
  const labels: Record<string, string> = {
    production: 'Изготовление', design: 'Разработка макета',
    installation: 'Монтаж', totalDelivery: 'Общий срок',
  };
  return labels[label] ?? label;
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
