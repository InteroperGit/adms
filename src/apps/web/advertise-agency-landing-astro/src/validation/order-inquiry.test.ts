// Build-time inquiry configuration; browser submission is tested separately.
import { expect, it } from 'vitest';
import fixtures from '../../tests/fixtures/content/unit-contracts.json';
import { orderInquirySchema } from './order-inquiry';

const source = fixtures['order-inquiry'];

it('accepts disabled delivery and approved local or HTTPS endpoints', () => {
  expect(orderInquirySchema.parse(source)).toEqual(source);
  for (const endpoint of ['/api/inquiry', 'https://example.test/inquiry']) {
    expect(orderInquirySchema.safeParse({
      ...source, consent: { approved: true, label: 'Consent' },
      submission: { enabled: true, endpoint, timeoutMs: 30000 },
    }).success).toBe(true);
  }
});

it.each(['/', '//host', '/bad#hash', '/bad path', '/bad\\path',
  'http://example.test', 'https://user@example.test',
  'https://:pass@example.test', 'not-a-url'])(
  'rejects unsafe endpoints even while disabled: %s', endpoint => {
    const result = orderInquirySchema.safeParse({
      ...source, submission: { ...source.submission, endpoint },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['submission', 'endpoint']);
    }
  },
);

it('requires endpoint and consent independently when enabling delivery', () => {
  for (const change of [
    { consent: { approved: true, label: 'Consent' },
      submission: { enabled: true, endpoint: '', timeoutMs: 1000 } },
    { submission: { enabled: true, endpoint: '/api', timeoutMs: 1000 } },
  ]) {
    expect(orderInquirySchema.safeParse({ ...source, ...change }).success)
      .toBe(false);
  }
});

it.each([
  ['name', 120, true], ['email', 254, true],
  ['phone', 40, false], ['message', 5000, true],
] as const)('checks %s field limits and required policy',
  (name, maximum, required) => {
    const withField = (change: object) => ({
      ...source, fields: {
        ...source.fields, [name]: { ...source.fields[name], ...change },
      },
    });
    expect(orderInquirySchema.safeParse(withField({
      maxLength: maximum, required,
    })).success).toBe(true);
    for (const change of [
      { maxLength: 0 }, { maxLength: maximum + 1 },
      { required: !required }, { label: '' }, { extra: true },
    ]) {
      expect(orderInquirySchema.safeParse(withField(change)).success)
        .toBe(false);
    }
  },
);

it.each([999, 30001, 1000.5])('rejects timeout %s', timeoutMs => {
  expect(orderInquirySchema.safeParse({
    ...source, submission: { ...source.submission, timeoutMs },
  }).success).toBe(false);
});
