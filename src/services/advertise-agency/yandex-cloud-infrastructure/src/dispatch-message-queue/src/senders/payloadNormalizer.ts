export interface NormalizedPayload {
  productType: string;
  fields: Record<string, string>;
}

export function normalizeOrderPayload(raw: Record<string, unknown>): NormalizedPayload {
  const { productType, ...rest } = raw;

  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (typeof value === 'boolean') {
      fields[key] = value ? 'Yes' : 'No';
    } else {
      fields[key] = String(value ?? '');
    }
  }

  return {
    productType: typeof productType === 'string' ? productType : '',
    fields,
  };
}
