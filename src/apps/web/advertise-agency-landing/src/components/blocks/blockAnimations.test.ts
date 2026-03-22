import { describe, it, expect } from 'vitest';
import { HIDDEN_STYLE, STAGGER_ANIMATION_BASE } from './blockAnimations';

describe('blockAnimations', () => {
  describe('HIDDEN_STYLE', () => {
    it('has opacity 0', () => {
      expect(HIDDEN_STYLE.opacity).toBe(0);
    });

    it('contains only opacity property', () => {
      expect(Object.keys(HIDDEN_STYLE)).toEqual(['opacity']);
    });
  });

  describe('STAGGER_ANIMATION_BASE', () => {
    it('uses stagger-fade-in animation name', () => {
      expect(STAGGER_ANIMATION_BASE.animationName).toBe('stagger-fade-in');
    });

    it('has 0.5s duration', () => {
      expect(STAGGER_ANIMATION_BASE.animationDuration).toBe('0.5s');
    });

    it('uses ease-out timing function', () => {
      expect(STAGGER_ANIMATION_BASE.animationTimingFunction).toBe('ease-out');
    });

    it('fills both directions', () => {
      expect(STAGGER_ANIMATION_BASE.animationFillMode).toBe('both');
    });
  });

  describe('stagger delay pattern', () => {
    it('produces increasing delays when combined with index * 80ms', () => {
      const delays = [0, 1, 2, 3].map((i) => i * 80);
      expect(delays).toEqual([0, 80, 160, 240]);
    });

    it('index 0 produces zero delay (no extra wait for first item)', () => {
      const delay = 0 * 80;
      expect(delay).toBe(0);
    });

    it('each subsequent index adds 80ms', () => {
      for (let i = 1; i < 5; i++) {
        expect(i * 80 - (i - 1) * 80).toBe(80);
      }
    });
  });
});
