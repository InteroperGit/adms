import { useEffect } from 'react';

/**
 * @description Updates the browser document title (page tab text) reactively.
 * Changes automatically when the title parameter changes.
 *
 * @param {string} title - The new document title to display in the browser tab
 *
 * @example
 * function AboutPage() {
 *   useDocumentTitle('About Us — Company Name');
 *   return <div>About us content...</div>;
 * }
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
