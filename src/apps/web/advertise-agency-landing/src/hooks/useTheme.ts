import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

/**
 * @description Accesses the global theme context containing dark mode state and toggle function.
 * Returns the theme context value from ThemeProvider, including isDark flag and toggle() method.
 *
 * @returns {object} Theme context value
 *   - isDark: Boolean indicating if dark mode is currently active
 *   - toggle: Function to toggle between light and dark modes
 *
 * @example
 * function ThemeToggleButton() {
 *   const { isDark, toggle } = useTheme();
 *
 *   return (
 *     <button onClick={toggle} className="p-2">
 *       {isDark ? '☀️ Light' : '🌙 Dark'}
 *     </button>
 *   );
 * }
 */
export const useTheme = () => useContext(ThemeContext);
