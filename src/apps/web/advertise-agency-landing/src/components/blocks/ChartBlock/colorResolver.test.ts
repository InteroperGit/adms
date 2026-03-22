import { describe, it, expect } from 'vitest';
import { resolveChartColor } from './colorResolver';

describe('resolveChartColor', () => {
  it('returns primary CSS variable for type primary', () => {
    expect(resolveChartColor({ type: 'primary' })).toBe('hsl(var(--primary))');
  });

  it('returns accent CSS variable for type accent', () => {
    expect(resolveChartColor({ type: 'accent' })).toBe('hsl(var(--accent))');
  });

  it('returns hex value for type solid', () => {
    expect(resolveChartColor({ type: 'solid', value: '#FF5733' })).toBe('#FF5733');
  });

  it('falls back to primary when solid has no value', () => {
    expect(resolveChartColor({ type: 'solid' })).toBe('hsl(var(--primary))');
  });

  it('falls back to primary for gradient (SVG does not support gradients)', () => {
    expect(resolveChartColor({ type: 'gradient', value: 'from-blue-500 to-purple-500' })).toBe(
      'hsl(var(--primary))'
    );
  });

  it('returns primary when color is undefined', () => {
    expect(resolveChartColor(undefined)).toBe('hsl(var(--primary))');
  });
});
