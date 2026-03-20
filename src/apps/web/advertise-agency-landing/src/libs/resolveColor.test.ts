import { describe, it, expect } from 'vitest';
import { resolveColor, resolveListItemStyles } from './resolveColor';

describe('resolveColor()', () => {
  it('should pass through hex colors unchanged', () => {
    expect(resolveColor('#f65314')).toBe('#f65314');
    expect(resolveColor('#fff')).toBe('#fff');
    expect(resolveColor('#ffffff')).toBe('#ffffff');
    expect(resolveColor('#aabbccdd')).toBe('#aabbccdd');
  });

  it('should pass through CSS values unchanged', () => {
    expect(resolveColor('hsl(var(--primary))')).toBe('hsl(var(--primary))');
    expect(resolveColor('rgb(255, 0, 0)')).toBe('rgb(255, 0, 0)');
    expect(resolveColor('var(--custom-color)')).toBe('var(--custom-color)');
  });

  it('should resolve semantic tokens to hsl(var()) format', () => {
    expect(resolveColor('primary')).toBe('hsl(var(--primary))');
    expect(resolveColor('accent')).toBe('hsl(var(--accent))');
    expect(resolveColor('background')).toBe('hsl(var(--background))');
    expect(resolveColor('foreground')).toBe('hsl(var(--foreground))');
    expect(resolveColor('card')).toBe('hsl(var(--card))');
    expect(resolveColor('muted-foreground')).toBe('hsl(var(--muted-foreground))');
  });

  it('should handle semantic tokens with opacity (e.g., primary/50)', () => {
    expect(resolveColor('primary/50')).toBe('hsl(var(--primary) / 0.5)');
    expect(resolveColor('accent/80')).toBe('hsl(var(--accent) / 0.8)');
    expect(resolveColor('background/20')).toBe('hsl(var(--background) / 0.2)');
    expect(resolveColor('primary/100')).toBe('hsl(var(--primary) / 1)');
  });

  it('should handle semantic tokens with fallbacks and opacity', () => {
    expect(resolveColor('surface-dark/50')).toBe(
      'hsl(var(--surface-dark, var(--foreground)) / 0.5)'
    );
  });

  it('should return unknown tokens as-is', () => {
    expect(resolveColor('unknown-token')).toBe('unknown-token');
    expect(resolveColor('invalid-color')).toBe('invalid-color');
  });

  it('should handle empty string', () => {
    expect(resolveColor('')).toBe('');
  });

  it('should handle all semantic color tokens', () => {
    const expectedResults: Record<string, string> = {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      'surface-dark': 'hsl(var(--surface-dark, var(--foreground)))',
      card: 'hsl(var(--card))',
      'card-foreground': 'hsl(var(--card-foreground))',
      popover: 'hsl(var(--popover))',
      'popover-foreground': 'hsl(var(--popover-foreground))',
      primary: 'hsl(var(--primary))',
      'primary-foreground': 'hsl(var(--primary-foreground))',
      secondary: 'hsl(var(--secondary))',
      'secondary-foreground': 'hsl(var(--secondary-foreground))',
      muted: 'hsl(var(--muted))',
      'muted-foreground': 'hsl(var(--muted-foreground))',
      accent: 'hsl(var(--accent))',
      'accent-foreground': 'hsl(var(--accent-foreground))',
      destructive: 'hsl(var(--destructive))',
      'destructive-foreground': 'hsl(var(--destructive-foreground))',
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
    };

    Object.entries(expectedResults).forEach(([token, expected]) => {
      const result = resolveColor(token);
      expect(result).toBe(expected);
    });
  });
});

describe('resolveListItemStyles()', () => {
  it('should return undefined styles for undefined colors', () => {
    const result = resolveListItemStyles(undefined, 0);
    expect(result.bgStyle).toBeUndefined();
    expect(result.textStyle).toBeUndefined();
    expect(result.textClass).toBe('text-muted-foreground leading-relaxed');
  });

  it('should apply even row colors at even indices', () => {
    const colors = {
      even: { background: '#f0f0f0', text: '#333' },
      odd: { background: '#ffffff', text: '#666' },
    };

    const result = resolveListItemStyles(colors, 0);
    expect(result.bgStyle).toEqual({ backgroundColor: '#f0f0f0' });
    expect(result.textStyle).toEqual({ color: '#333' });
    expect(result.textClass).toBe('leading-relaxed');
  });

  it('should apply odd row colors at odd indices', () => {
    const colors = {
      even: { background: '#f0f0f0', text: '#333' },
      odd: { background: '#ffffff', text: '#666' },
    };

    const result = resolveListItemStyles(colors, 1);
    expect(result.bgStyle).toEqual({ backgroundColor: '#ffffff' });
    expect(result.textStyle).toEqual({ color: '#666' });
    expect(result.textClass).toBe('leading-relaxed');
  });

  it('should handle partial color definitions (only background)', () => {
    const colors = {
      even: { background: '#f0f0f0' },
      odd: { background: '#ffffff' },
    };

    const result = resolveListItemStyles(colors, 0);
    expect(result.bgStyle).toEqual({ backgroundColor: '#f0f0f0' });
    expect(result.textStyle).toBeUndefined();
    expect(result.textClass).toBe('text-muted-foreground leading-relaxed');
  });

  it('should handle partial color definitions (only text)', () => {
    const colors = {
      even: { text: '#333' },
      odd: { text: '#666' },
    };

    const result = resolveListItemStyles(colors, 0);
    expect(result.bgStyle).toBeUndefined();
    expect(result.textStyle).toEqual({ color: '#333' });
    expect(result.textClass).toBe('leading-relaxed');
  });

  it('should resolve semantic tokens in color values', () => {
    const colors = {
      even: { background: 'primary/20', text: 'primary' },
      odd: { background: 'accent/10', text: 'accent' },
    };

    const result = resolveListItemStyles(colors, 0);
    expect(result.bgStyle).toEqual({ backgroundColor: 'hsl(var(--primary) / 0.2)' });
    expect(result.textStyle).toEqual({ color: 'hsl(var(--primary))' });
  });

  it('should alternate colors across multiple indices', () => {
    const colors = {
      even: { background: '#f0f0f0', text: '#333' },
      odd: { background: '#ffffff', text: '#666' },
    };

    const evenResult = resolveListItemStyles(colors, 4);
    expect(evenResult.bgStyle).toEqual({ backgroundColor: '#f0f0f0' });

    const oddResult = resolveListItemStyles(colors, 5);
    expect(oddResult.bgStyle).toEqual({ backgroundColor: '#ffffff' });
  });
});
