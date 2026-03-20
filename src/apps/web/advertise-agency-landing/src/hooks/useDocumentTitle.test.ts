import { renderHook } from '@testing-library/react';
import { useDocumentTitle } from './useDocumentTitle';

describe('useDocumentTitle', () => {
  it('sets document.title on mount', () => {
    renderHook(() => useDocumentTitle('Test Page'));
    expect(document.title).toBe('Test Page');
  });

  it('updates document.title when prop changes', () => {
    const { rerender } = renderHook(({ title }: { title: string }) => useDocumentTitle(title), {
      initialProps: { title: 'First' },
    });
    expect(document.title).toBe('First');
    rerender({ title: 'Second' });
    expect(document.title).toBe('Second');
  });
});
