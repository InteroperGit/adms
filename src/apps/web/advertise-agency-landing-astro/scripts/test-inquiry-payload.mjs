// Exercise the server trust boundary with synthetic, nonpersonal payloads.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

// Transpile in memory so tests also run on the project's minimum Node 22.
const source = await readFile('src/server/inquiry-payload.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022 },
}).outputText;
const { validateInquiryPayload: validate } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
);
const options = { projectIds: ['1'] };
const homepage = {
  name: 'Synthetic test', email: 'test@example.invalid', phone: '',
  message: 'Synthetic inquiry', consent: 'on',
  requestId: '00000000-0000-4000-8000-000000000001',
};
const lettering = {
  name: 'Synthetic test', phone: '+7 (000) 000-00-00', email: '',
  consent: 'on', requestId: homepage.requestId,
  serviceId: 'svetovye-bukvy', projectId: '1', lighting: 'advice',
  installation: 'advice', power: 'unknown', contactMethod: 'phone',
};

function rejected(payload, field, config = options) {
  const result = validate(payload, config);
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes(field), JSON.stringify(result.errors));
}

test('both form contracts accept their own required fields', () => {
  assert.equal(validate(homepage, options).kind, 'homepage');
  assert.equal(validate(lettering, options).kind, 'lettering');
  rejected({ ...homepage, email: '' }, 'email');
  rejected({ ...homepage, message: '' }, 'message');
  rejected({ ...lettering, phone: '' }, 'phone');
  rejected({ ...lettering, contactMethod: 'email' }, 'email');
  assert.equal(validate({ ...lettering, contactMethod: 'email',
    email: homepage.email }, options).valid, true);
});

test('untrusted shapes, consent, retry ID and unknown fields fail', () => {
  for (const value of [null, [], 'text', 12]) rejected(value, 'payload');
  for (const value of [true, 'true', '', undefined]) {
    rejected({ ...homepage, consent: value }, 'consent');
  }
  for (const value of ['', '1', homepage.requestId.replace('4', '5')]) {
    rejected({ ...homepage, requestId: value }, 'requestId');
  }
  rejected({ ...homepage, password: 'unexpected' }, 'password');
  rejected({ ...homepage, name: { value: 'injected' } }, 'name');
  rejected({ ...homepage, name: '   ' }, 'name');
  rejected({ ...homepage, name: 'bad\u0000name' }, 'name');
});

test('field lengths and contact syntax are enforced', () => {
  for (const [field, length] of Object.entries({
    name: 120, email: 254, phone: 40, message: 5000,
  })) rejected({ ...homepage, [field]: 'a'.repeat(length + 1) }, field);
  rejected({ ...homepage, name: '12345' }, 'name', {
    ...options, homepageLimits: { name: 4 },
  });
  for (const value of ['a@@example.invalid', 'a b@example.invalid']) {
    rejected({ ...homepage, email: value }, 'email');
  }
  for (const domain of [label => label, label => `example.${label}`]) {
    assert.equal(validate({ ...homepage,
      email: `a@${domain('x'.repeat(63))}` }, options).valid, true);
    rejected({ ...homepage,
      email: `a@${domain('x'.repeat(64))}` }, 'email');
  }
  for (const value of ['123', '1234567890123456', '1234567abc']) {
    rejected({ ...homepage, phone: value }, 'phone');
  }
});

test('service context and every select use server allowlists', () => {
  rejected({ ...lettering, serviceId: 'unapproved' }, 'serviceId');
  rejected({ ...lettering, projectId: '2' }, 'projectId');
  rejected(lettering, 'projectId', { projectIds: [] });
  for (const field of ['lighting', 'installation', 'power', 'contactMethod']) {
    rejected({ ...lettering, [field]: 'injected' }, field);
    const missing = { ...lettering };
    delete missing[field];
    rejected(missing, field);
  }
  rejected({ ...homepage, projectId: '1' }, 'serviceId');
});

test('optional specifications enforce number, calendar and URL rules', () => {
  for (const field of ['widthCm', 'letterHeightCm', 'budget']) {
    for (const value of ['0', '-1', 'Infinity', '1e999', '0x10', 'abc',
      '+1', '1.']) {
      rejected({ ...lettering, [field]: value }, field);
    }
    for (const value of ['', '1.5', '1e2']) {
      assert.equal(validate({ ...lettering, [field]: value }, options)
        .valid, true);
    }
  }
  for (const value of ['2026-02-30', '2026-13-01', '0000-01-01']) {
    rejected({ ...lettering, deadline: value }, 'deadline');
  }
  assert.equal(validate({ ...lettering, deadline: '2028-02-29' }, options)
    .valid, true);
  for (const value of ['javascript:alert(1)', '/relative',
    'https://user:password@example.invalid/']) {
    rejected({ ...lettering, fileLink: value }, 'fileLink');
  }
  assert.equal(validate({ ...lettering,
    fileLink: 'https://example.invalid/artwork' }, options).valid, true);
});
