// Validate the existing browser payload before any queue or delivery action.
// This pure module does not authorize consent, accept delivery or log data.
export type InquiryKind = 'homepage' | 'lettering';

export type InquiryValidation =
  | { valid: true; kind: InquiryKind; fields: Record<string, string> }
  | { valid: false; errors: string[] };

export interface InquiryValidationOptions {
  // The adapter supplies its published catalog; client context is untrusted.
  projectIds: readonly string[];
  // Homepage content may configure smaller limits than the hard ceilings.
  homepageLimits?: Partial<Record<'name' | 'email' | 'phone' | 'message',
    number>>;
}

const commonLimits = { name: 120, email: 254, phone: 40, message: 5000 };
const letteringLimits = {
  ...commonLimits, company: 120, signText: 300, address: 300,
  facade: 300, fileLink: 2000, widthCm: 100, letterHeightCm: 100,
  budget: 100, deadline: 10, lighting: 20, installation: 20,
  power: 20, contactMethod: 20, serviceId: 40, projectId: 100,
};
const uuid = new RegExp(
  '^[\\da-f]{8}-[\\da-f]{4}-4[\\da-f]{3}-'
    + '[89ab][\\da-f]{3}-[\\da-f]{12}$', 'i',
);
const email = new RegExp([
  "^[a-z\\d.!#$%&'*+/=?^_`{|}~-]+@",
  '[a-z\\d](?:[a-z\\d-]{0,61}[a-z\\d])?',
  '(?:\\.[a-z\\d](?:[a-z\\d-]{0,61}[a-z\\d])?)*$',
].join(''), 'i');

// Reject invalid dates instead of Date's normalization of e.g. 30 February.
function calendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.valueOf())
    && date.toISOString().slice(0, 10) === value;
}

export function validateInquiryPayload(
  input: unknown,
  options: InquiryValidationOptions,
): InquiryValidation {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, errors: ['payload'] };
  }
  const raw = input as Record<string, unknown>;
  // Presence of context selects the stricter service schema, including when
  // context is malformed; stripping it cannot produce a valid service order.
  const kind = Object.hasOwn(raw, 'serviceId')
    || Object.hasOwn(raw, 'projectId') ? 'lettering' : 'homepage';
  const limits: Record<string, number> = kind === 'lettering'
    ? letteringLimits : { ...commonLimits };
  if (kind === 'homepage') {
    for (const [field, ceiling] of Object.entries(commonLimits)) {
      const configured = options.homepageLimits?.[
        field as keyof typeof commonLimits
      ];
      if (configured !== undefined) {
        if (!Number.isInteger(configured) || configured < 1
          || configured > ceiling) {
          throw new Error('Invalid homepage validation limits');
        }
        limits[field] = configured;
      }
    }
  }
  const allowed: Record<string, number> = {
    ...limits, consent: 2, requestId: 36,
  };
  const errors = new Set<string>();
  const fields: Record<string, string> = {};
  for (const [field, value] of Object.entries(raw)) {
    if (!Object.hasOwn(allowed, field) || typeof value !== 'string') {
      errors.add(field);
      continue;
    }
    if (value.length > allowed[field as keyof typeof allowed]
      || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) {
      errors.add(field);
    }
    fields[field] = value.trim();
  }
  const required = kind === 'homepage'
    ? ['name', 'email', 'message'] : ['name', 'phone'];
  for (const field of required) {
    if (!fields[field]) errors.add(field);
  }
  if (fields.consent !== 'on') errors.add('consent');
  if (!uuid.test(fields.requestId ?? '')) errors.add('requestId');
  if (fields.email && !email.test(fields.email)) errors.add('email');
  if (fields.phone && (!/^\+?[\d\s().-]+$/.test(fields.phone)
    || !/^\d{7,15}$/.test(fields.phone.replace(/\D/g, '')))) {
    errors.add('phone');
  }
  if (kind === 'lettering') {
    if (fields.serviceId !== 'svetovye-bukvy') errors.add('serviceId');
    if (!fields.projectId || !options.projectIds.includes(fields.projectId)) {
      errors.add('projectId');
    }
    const choices = {
      lighting: ['advice', 'front', 'halo', 'combined'],
      installation: ['advice', 'yes', 'no'],
      power: ['unknown', 'available', 'needed'],
      contactMethod: ['phone', 'email'],
    };
    for (const [field, values] of Object.entries(choices)) {
      if (!values.includes(fields[field] ?? '')) errors.add(field);
    }
    if (fields.contactMethod === 'email' && !fields.email) errors.add('email');
    for (const field of ['widthCm', 'letterHeightCm', 'budget']) {
      const value = fields[field];
      // HTML number controls allow exponent notation and fractional values.
      if (value && (!/^-?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value)
        || !Number.isFinite(Number(value)) || Number(value) < 1)) {
        errors.add(field);
      }
    }
    if (fields.deadline && !calendarDate(fields.deadline)) {
      errors.add('deadline');
    }
    if (fields.fileLink) {
      try {
        const url = new URL(fields.fileLink);
        if (!['https:', 'http:'].includes(url.protocol)
          || url.username || url.password) errors.add('fileLink');
      } catch {
        errors.add('fileLink');
      }
    }
  }
  return errors.size
    ? { valid: false, errors: [...errors] }
    : { valid: true, kind, fields };
}
