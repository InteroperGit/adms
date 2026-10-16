// Linkification must preserve every input character and reject unsafe URLs.
import { expect, it } from 'vitest';
import { paragraphLinks } from './paragraph-links';

it.each([
  '', 'Plain text', 'javascript:alert(1)', 'mailto:user@example.test',
  'https://', 'https://[invalid', 'https://user:pass@example.test/',
  'https://user@example.test/', 'https://example.test/a\u0000b',
  'https://example.test/a\u007fb', '<script>alert(1)</script>',
])('keeps non-links and unsafe input as text: %j', text => {
  expect(paragraphLinks(text)).toEqual(text ? [{ text }] : []);
});

it.each([
  ['https://example.test/a.', 'https://example.test/a', '.'],
  ['https://example.test/a,;:!?', 'https://example.test/a', ',;:!?'],
  ['https://example.test/a))', 'https://example.test/a', '))'],
  ['https://example.test/a]]', 'https://example.test/a', ']]'],
  ['https://example.test/a}}', 'https://example.test/a', '}}'],
  ['https://example.test/a(b)', 'https://example.test/a(b)', ''],
  ['https://example.test/a[b]', 'https://example.test/a[b]', ''],
  ['http://example.test/a{b}', 'http://example.test/a{b}', ''],
  ['HTTPS://example.test/', 'HTTPS://example.test/', ''],
])('separates URL punctuation: %s', (text, href, suffix) => {
  expect(paragraphLinks(text)).toEqual([
    { text: href, href }, ...(suffix ? [{ text: suffix }] : []),
  ]);
});

it('preserves offsets across rejected URLs, HTML delimiters and valid links',
  () => {
    const first = 'https://example.test/a?q=1&x=2#part';
    const second = 'http://example.test/b';
    const prefix = 'https://user:pass@example.test/ <';
    const text = `${prefix}${first}> "${second}" end`;
    const segments = paragraphLinks(text);
    expect(segments).toEqual([
      { text: prefix }, { text: first, href: first }, { text: '> "' },
      { text: second, href: second }, { text: '" end' },
    ]);
    expect(segments.map(segment => segment.text).join('')).toBe(text);
  },
);
