import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { resetBrowserState } from './helpers/browser';

afterEach(() => {
  resetBrowserState();
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
