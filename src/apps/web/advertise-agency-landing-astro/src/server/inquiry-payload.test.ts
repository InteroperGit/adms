// @vitest-environment node
// Exercise the untrusted delivery boundary without sending customer data.
import { afterEach, expect, it, vi } from 'vitest';
import fixtures from '../../tests/fixtures/content/inquiry-payload.json';
import { validateInquiryPayload as validate } from './inquiry-payload';

const { homepage, lettering, options } = fixtures;
const commonLimits = {
  name: 120,
  email: 254,
  phone: 40,
  message: 5000,
};
const serviceLimits = {
  ...commonLimits,
  company: 120,
  signText: 300,
  address: 300,
  facade: 300,
  fileLink: 2000,
  widthCm: 100,
  letterHeightCm: 100,
  budget: 100,
  deadline: 10,
  lighting: 20,
  installation: 20,
  power: 20,
  contactMethod: 20,
  serviceId: 40,
  projectId: 100,
  consent: 2,
  requestId: 36,
};

afterEach(() => vi.unstubAllGlobals());

function rejects(payload: unknown, field: string) {
  expect(validate(payload, options)).toEqual({
    valid: false,
    errors: [field],
  });
}

it.each([
  ['homepage', homepage],
  ['lettering', lettering],
] as const)(
  'returns the exact normalized %s without mutation',
  (kind, source) => {
    const input = { ...source, name: '  Fixture customer \t\n' };
    const before = structuredClone(input);
    expect(validate(input, options)).toEqual({
      valid: true,
      kind,
      fields: source,
    });
    expect(input).toEqual(before);
  },
);

it(
  'accepts optional empty fields and a' +
    ' lettering inquiry without a projec' +
    't',
  () => {
    const { projectId: _projectId, ...input } = lettering;
    const fields = { ...input, email: '', message: '', company: '' };
    expect(validate(fields, options)).toEqual({
      valid: true,
      kind: 'lettering',
      fields,
    });
    expect(validate({ ...homepage, phone: '' }, options)).toEqual({
      valid: true,
      kind: 'homepage',
      fields: { ...homepage, phone: '' },
    });
    expect(validate({ ...lettering, projectId: '' }, options)).toEqual({
      valid: true,
      kind: 'lettering',
      fields: { ...lettering, projectId: '' },
    });
  },
);

it.each([undefined, null, [], false, true, '', 'payload', 0, 1, () => {}])(
  'rejects a non-record payload: %s',
  (input) => rejects(input, 'payload'),
);

it.each([
  ['homepage', homepage, ['name', 'email', 'message']],
  [
    'lettering',
    lettering,
    [
      'name',
      'phone',
      'serviceId',
      'lighting',
      'installation',
      'power',
      'contactMethod',
      'consent',
      'requestId',
    ],
  ],
] as const)('requires all mandatory %s fields', (_kind, source, required) => {
  for (const field of required) {
    const input: Record<string, unknown> = { ...source };
    // Keep projectId when serviceId is removed to retain service detection.
    delete input[field];
    rejects(input, field);
    rejects({ ...source, [field]: ' \t\n ' }, field);
  }
});

it.each(['consent', 'requestId'])('requires homepage %s', (field) => {
  const input: Record<string, unknown> = { ...homepage };
  delete input[field];
  rejects(input, field);
});

it.each(Object.keys(serviceLimits))('rejects non-string %s', (field) => {
  for (const value of [null, undefined, 1, true, [], {}]) {
    rejects({ ...lettering, [field]: value }, field);
  }
});

it.each(['unknown', '__proto__', 'constructor', 'toString'])(
  'rejects unexpected own field %s',
  (field) => {
    rejects({ ...homepage, [field]: 'value' }, field);
  },
);

it('selects the stricter schema for malformed own context', () => {
  for (const field of ['projectId', 'serviceId']) {
    const result = validate({ ...homepage, [field]: null }, options);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors).toContain(field);
      expect(result.errors).toContain('phone');
      expect(result.errors).toContain('lighting');
    }
  }
  const inherited = Object.assign(
    Object.create({ serviceId: 'untrusted' }),
    homepage,
  );
  expect(validate(inherited, options)).toEqual({
    valid: true,
    kind: 'homepage',
    fields: homepage,
  });
});

it.each(Object.entries(serviceLimits))(
  'enforces the %s raw length ceiling of %s',
  (field, maximum) => {
    const value =
      field in lettering ? lettering[field as keyof typeof lettering] : '';
    const padded = value.padEnd(maximum, ' ');
    expect(validate({ ...lettering, [field]: padded }, options)).toEqual({
      valid: true,
      kind: 'lettering',
      fields: { ...lettering, [field]: value },
    });
    rejects({ ...lettering, [field]: padded + ' ' }, field);
  },
);

it.each(Object.entries(commonLimits))(
  'enforces homepage %s raw length and configured limits',
  (field, maximum) => {
    const value =
      field in homepage ? homepage[field as keyof typeof homepage] : '';
    const configured = value.length || 1;
    const settings = {
      ...options,
      homepageLimits: { [field]: configured },
    };
    expect(validate({ ...homepage, [field]: value }, settings)).toEqual({
      valid: true,
      kind: 'homepage',
      fields: { ...homepage, [field]: value },
    });
    expect(
      validate(
        { ...homepage, [field]: value.padEnd(configured + 1, ' ') },
        settings,
      ),
    ).toEqual({ valid: false, errors: [field] });
    const padded = value.padEnd(maximum, ' ');
    expect(validate({ ...homepage, [field]: padded }, options).valid).toBe(
      true,
    );
    rejects({ ...homepage, [field]: padded + ' ' }, field);
    for (const limit of [0, -1, 1.5, maximum + 1, NaN, Infinity]) {
      expect(() =>
        validate(homepage, {
          ...options,
          homepageLimits: { [field]: limit },
        }),
      ).toThrow('Invalid homepage validation limits');
    }
  },
);

it('does not apply homepage configuration to lettering requests', () => {
  expect(
    validate(lettering, {
      ...options,
      homepageLimits: { name: 0 },
    }),
  ).toEqual({ valid: true, kind: 'lettering', fields: lettering });
});

it.each(
  Array.from({ length: 32 }, (_, code) => code)
    .filter((code) => ![9, 10, 13].includes(code))
    .concat(127),
)('rejects control character U+%s', (code) => {
  rejects(
    { ...homepage, message: `text${String.fromCharCode(code)}` },
    'message',
  );
});

it('preserves permitted internal tabs and line breaks', () => {
  const fields = {
    ...homepage,
    message: 'first\tline\nsecond\r\nthird',
  };
  expect(validate(fields, options)).toEqual({
    valid: true,
    kind: 'homepage',
    fields,
  });
});

it.each(['', 'off', 'ON', 'true', '1'])('rejects consent %j', (consent) =>
  rejects({ ...homepage, consent }, 'consent'),
);

it.each([
  '',
  'invalid',
  '12345678-1234-1123-8123-123456789abc',
  '12345678-1234-4123-7123-123456789abc',
  '12345678123441238123123456789abc',
])('rejects invalid UUID %j', (requestId) => {
  rejects({ ...homepage, requestId }, 'requestId');
});

it.each(['8', '9', 'a', 'b'])(
  'accepts UUID variant %s and uppercase',
  (variant) => {
    const requestId = `ABCDEF12-1234-4123-${variant}123-123456789ABC`;
    expect(validate({ ...homepage, requestId }, options)).toEqual({
      valid: true,
      kind: 'homepage',
      fields: { ...homepage, requestId },
    });
  },
);

it.each([
  'missing-at.test',
  'a b@example.test',
  'a@-bad.test',
  'a@bad-.test',
  'a@example..test',
  'a@',
  '@example.test',
  'a@' + 'b'.repeat(64),
])('rejects email %j', (email) => rejects({ ...homepage, email }, 'email'));

it.each(['A+tag@EXAMPLE.test', 'a@localhost', 'a@' + 'b'.repeat(63) + '.test'])(
  'accepts supported email %j',
  (email) => {
    expect(validate({ ...homepage, email }, options)).toEqual({
      valid: true,
      kind: 'homepage',
      fields: { ...homepage, email },
    });
  },
);

it.each([
  '123456',
  '1'.repeat(16),
  'letters',
  '+123x4567890',
  '++1234567890',
  '123+4567890',
  '().-',
])('rejects phone %j', (phone) => rejects({ ...homepage, phone }, 'phone'));

it.each(['1234567', '1'.repeat(15), '+7 (999) 123-45-67'])(
  'accepts phone %j',
  (phone) => {
    expect(validate({ ...homepage, phone }, options)).toEqual({
      valid: true,
      kind: 'homepage',
      fields: { ...homepage, phone },
    });
  },
);

it('enforces the service and project allow-lists', () => {
  rejects({ ...lettering, serviceId: 'other' }, 'serviceId');
  rejects({ ...lettering, projectId: 'unpublished' }, 'projectId');
  expect(validate(lettering, { projectIds: [] })).toEqual({
    valid: false,
    errors: ['projectId'],
  });
});

it.each([
  ['lighting', ['advice', 'front', 'halo', 'combined']],
  ['installation', ['advice', 'yes', 'no']],
  ['power', ['unknown', 'available', 'needed']],
  ['contactMethod', ['phone', 'email']],
] as const)(
  'accepts all %s choices and rejects unknown ones',
  (field, choices) => {
    for (const value of choices) {
      const fields = {
        ...lettering,
        email: homepage.email,
        [field]: value,
      };
      expect(validate(fields, options)).toEqual({
        valid: true,
        kind: 'lettering',
        fields,
      });
    }
    rejects({ ...lettering, [field]: 'invalid' }, field);
  },
);

it('requires email when it is the selected contact method', () => {
  rejects({ ...lettering, contactMethod: 'email' }, 'email');
  rejects({ ...lettering, contactMethod: 'email', email: ' ' }, 'email');
});

it.each(['widthCm', 'letterHeightCm', 'budget'])(
  'checks numeric syntax, finite value and minimum for %s',
  (field) => {
    for (const value of ['', '1', '1.5', '1e2', '1E+2', '10e-1']) {
      const fields = { ...lettering, [field]: value };
      expect(validate(fields, options)).toEqual({
        valid: true,
        kind: 'lettering',
        fields,
      });
    }
    for (const value of [
      '0',
      '-1',
      '.5',
      '1e-2',
      '1e999',
      'Infinity',
      'NaN',
      '0x10',
      '+1',
      '1.',
      '1,5',
      '1 000',
      '1e',
      '--1',
    ]) {
      rejects({ ...lettering, [field]: value }, field);
    }
  },
);

it.each([
  '2026-02-30',
  '2025-02-29',
  '0000-01-01',
  '2026-13-01',
  '2026-00-01',
  '2026-01-00',
  '2026-1-01',
  'yesterday',
])('rejects invalid calendar date %j', (deadline) => {
  rejects({ ...lettering, deadline }, 'deadline');
});

it.each(['', '2024-02-29', '2026-12-31', '0001-01-01'])(
  'accepts calendar date %j',
  (deadline) => {
    const fields = { ...lettering, deadline };
    expect(validate(fields, options)).toEqual({
      valid: true,
      kind: 'lettering',
      fields,
    });
  },
);

it.each([
  'javascript:alert(1)',
  'ftp://example.test/file',
  'data:text/plain,fixture',
  '/relative',
  '//example.test',
  'invalid',
  'https://user@example.test',
  'https://:pass@example.test',
  'https://user:pass@example.test',
])('rejects unsafe file URL %j', (fileLink) => {
  rejects({ ...lettering, fileLink }, 'fileLink');
});

it.each([
  '',
  'https://example.test/file?q=fixture#section',
  'http://example.test/file',
])('accepts supported file URL %j', (fileLink) => {
  const fields = { ...lettering, fileLink };
  expect(validate(fields, options)).toEqual({
    valid: true,
    kind: 'lettering',
    fields,
  });
});

it('collects distinct field errors without a network request', () => {
  const fetch = vi.fn(() => {
    throw new Error('Unexpected network call');
  });
  vi.stubGlobal('fetch', fetch);
  expect(
    validate(
      {
        ...homepage,
        name: '\u0000'.repeat(121),
        email: '',
        consent: 'no',
        requestId: 'invalid',
      },
      options,
    ),
  ).toEqual({
    valid: false,
    errors: ['name', 'email', 'consent', 'requestId'],
  });
  expect(validate(homepage, options)).toEqual({
    valid: true,
    kind: 'homepage',
    fields: homepage,
  });
  expect(fetch).not.toHaveBeenCalled();
});
