import { describe, it, expect } from 'vitest';
import { cn, phoneHref, interpolate } from './utils';

describe('cn()', () => {
  it('should merge classes correctly', () => {
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
    expect(cn('text-sm', { 'text-lg': true })).toBe('text-lg');
    expect(cn('text-sm', { 'text-lg': false })).toBe('text-sm');
    const shouldAddRing = true;
    expect(cn('bg-blue-500', shouldAddRing && 'bg-blue-600', ['ring-2', 'ring-offset-2'])).toBe(
      'bg-blue-600 ring-2 ring-offset-2'
    );
    const shouldAddBaz = false;
    expect(cn('foo', null, undefined, 'bar', shouldAddBaz && 'baz')).toBe('foo bar');
  });

  it('should resolve Tailwind conflicts', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('flex-row', 'flex-col')).toBe('flex-col');
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('', null, undefined)).toBe('');
  });
});

describe('phoneHref()', () => {
  it('should strip non-digit characters', () => {
    expect(phoneHref('+7 (999) 123-45-67')).toBe('tel:79991234567');
    expect(phoneHref('1-800-CALL-NOW')).toBe('tel:1800');
    expect(phoneHref('555.123.4567 ext. 123')).toBe('tel:5551234567123');
    expect(phoneHref('  +1 (555) 123 4567  ')).toBe('tel:15551234567');
  });

  it('should return "tel:" for an empty string', () => {
    expect(phoneHref('')).toBe('tel:');
  });

  it('should handle a plain digit string', () => {
    expect(phoneHref('1234567890')).toBe('tel:1234567890');
  });
});

describe('interpolate()', () => {
  it('should replace a single placeholder', () => {
    expect(interpolate('Hello, {name}!', { name: 'World' })).toBe('Hello, World!');
  });

  it('should replace multiple different placeholders', () => {
    expect(interpolate('Page {current} of {total}', { current: 2, total: 5 })).toBe('Page 2 of 5');
  });

  it('should replace a repeated placeholder', () => {
    expect(
      interpolate('{greeting}, {name}! {greeting} again.', { greeting: 'Hi', name: 'Alice' })
    ).toBe('Hi, Alice! Hi again.');
  });

  it('should handle numeric values', () => {
    expect(interpolate('The answer is {number}.', { number: 42 })).toBe('The answer is 42.');
  });

  it('should preserve unmatched placeholders', () => {
    expect(interpolate('Hello, {name}! Your age is {age}.', { name: 'World' })).toBe(
      'Hello, World! Your age is {age}.'
    );
  });

  it('should handle an empty template', () => {
    expect(interpolate('', { name: 'World' })).toBe('');
  });

  it('should handle an empty values object', () => {
    expect(interpolate('Hello, {name}!', {})).toBe('Hello, {name}!');
  });

  it('should handle placeholders at the start and end', () => {
    expect(interpolate('{start} middle {end}', { start: 'Beginning', end: 'End' })).toBe(
      'Beginning middle End'
    );
  });
});
