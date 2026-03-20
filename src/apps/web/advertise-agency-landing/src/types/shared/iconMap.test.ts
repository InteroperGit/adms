import { describe, it, expect } from 'vitest';
import { ICON_MAP, resolveIcon } from './iconMap';

describe('ICON_MAP', () => {
  it('should be a non-empty object', () => {
    expect(ICON_MAP).toBeDefined();
    expect(typeof ICON_MAP).toBe('object');
    expect(Object.keys(ICON_MAP).length).toBeGreaterThan(0);
  });

  it('should have all values as React components', () => {
    Object.values(ICON_MAP).forEach((value) => {
      // Lucide icons are forward refs (objects), not functions
      expect(value).toBeDefined();
      expect(typeof value).toBe('object');
      // React components (forward refs) have a render or _render property
      expect(value).toHaveProperty('$$typeof');
    });
  });

  it('should contain expected icon keys', () => {
    const expectedKeys = [
      'Lightbulb',
      'MonitorSmartphone',
      'Megaphone',
      'LayoutTemplate',
      'BarChart3',
      'Share2',
      'CircleDollarSign',
      'Clock',
      'UserRound',
      'LineChart',
      'Building2',
      'Handshake',
      'Phone',
      'Mail',
      'MapPin',
      'Info',
      'CheckCircle',
      'AlertTriangle',
      'StickyNote',
      'RectangleHorizontal',
      'Box',
      'Loader2',
      'ShieldCheck',
      'Star',
    ];

    expectedKeys.forEach((key) => {
      expect(ICON_MAP).toHaveProperty(key);
    });
  });
});

describe('resolveIcon', () => {
  it('should return the component for a valid key', () => {
    const icon = resolveIcon('Lightbulb');
    expect(icon).toBeDefined();
    expect(icon).toBe(ICON_MAP.Lightbulb);
    // Lucide icons are forward refs (objects)
    expect(typeof icon).toBe('object');
    expect(icon).toHaveProperty('$$typeof');
  });

  it('should return undefined for an invalid key', () => {
    const icon = resolveIcon('NonExistentIcon');
    expect(icon).toBeUndefined();
  });

  it('should return undefined for an empty string', () => {
    const icon = resolveIcon('');
    expect(icon).toBeUndefined();
  });

  it('should be case-sensitive', () => {
    const validIcon = resolveIcon('Lightbulb');
    const invalidIcon = resolveIcon('lightbulb');

    expect(validIcon).toBeDefined();
    expect(invalidIcon).toBeUndefined();
  });

  it('should resolve all ICON_MAP keys correctly', () => {
    Object.keys(ICON_MAP).forEach((key) => {
      const icon = resolveIcon(key);
      expect(icon).toBeDefined();
      expect(icon).toBe(ICON_MAP[key]);
    });
  });
});
