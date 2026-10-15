// @vitest-environment node
// The delivery boundary treats every browser-supplied field as untrusted.
import { expect, it } from 'vitest';
import { validateInquiryPayload as validate } from
  '../../src/server/inquiry-payload';

const options = { projectIds: ['1'] };
const home = {
  name: ' Fixture ', email: 'fixture@example.test', message: 'Synthetic',
  consent: 'on', requestId: '12345678-1234-4123-8123-123456789abc',
};
const lettering = {
  ...home, phone: '+7 (999) 123-45-67', serviceId: 'svetovye-bukvy',
  projectId: '1', lighting: 'advice', installation: 'advice',
  power: 'unknown', contactMethod: 'phone',
};

it('accepts both forms and trims strings without mutating input', () => {
  const cases = [[home, 'homepage'], [lettering, 'lettering']] as const;
  for (const [payload, kind] of cases) {
    expect(validate(payload, options)).toMatchObject({
      valid: true, kind, fields: { name: 'Fixture' },
    });
    expect(payload.name).toBe(' Fixture ');
  }
  expect(validate({ ...lettering, email: '', projectId: '' }, options).valid)
    .toBe(true);
});

it.each([null, [], false, 'payload', 0])('rejects non-objects: %s', input => {
  expect(validate(input, options)).toEqual({
    valid: false, errors: ['payload'],
  });
});

it.each([
  ['name', ''], ['name', 1], ['name', 'a'.repeat(121)],
  ['message', '\u0000'], ['message', 'a'.repeat(5001)],
  ['email', 'a@-bad.test'], ['email', 'a'.repeat(255)],
  ['phone', '123'], ['phone', 'letters'], ['phone', '1'.repeat(16)],
  ['consent', 'no'], ['requestId', 'invalid'], ['unknown', 'value'],
])('rejects invalid homepage %s', (field, value) => {
  expect(validate({ ...home, [field]: value }, options))
    .toMatchObject({ valid: false, errors: expect.arrayContaining([field]) });
});

it.each([
  ['serviceId', null], ['serviceId', 'other'], ['projectId', '999'],
  ['lighting', 'bad'], ['installation', 'bad'], ['power', 'bad'],
  ['contactMethod', 'bad'], ['widthCm', '0'], ['widthCm', 'Infinity'],
  ['widthCm', '0x10'], ['widthCm', '1e999'], ['budget', '-1'],
  ['deadline', '2026-02-30'], ['deadline', '0000-01-01'],
  ['deadline', 'yesterday'], ['fileLink', 'javascript:alert(1)'],
  ['fileLink', 'https://user:pass@example.test/'], ['fileLink', 'invalid'],
])('rejects invalid service %s', (field, value) => {
  expect(validate({ ...lettering, [field]: value }, options))
    .toMatchObject({ valid: false, errors: expect.arrayContaining([field]) });
});

it('accepts numeric notation, leap dates and safe file links', () => {
  for (const widthCm of ['1', '1.5', '1e2']) {
    expect(validate({ ...lettering, widthCm, deadline: '2024-02-29',
      fileLink: 'https://example.test/file' }, options).valid).toBe(true);
  }
  expect(validate({ ...lettering, contactMethod: 'email', email: '' }, options))
    .toMatchObject({ valid: false, errors: ['email'] });
});

it('enforces lengths and rejects invalid server configuration', () => {
  expect(validate(home, { ...options, homepageLimits: { name: 1 } }))
    .toMatchObject({ valid: false, errors: ['name'] });
  for (const name of [0, -1, 1.5, 121, NaN]) {
    expect(() => validate(home, { ...options, homepageLimits: { name } }))
      .toThrow('Invalid homepage validation limits');
  }
  expect(validate({ ...home, name: 'a'.repeat(120) }, options).valid)
    .toBe(true);
});
