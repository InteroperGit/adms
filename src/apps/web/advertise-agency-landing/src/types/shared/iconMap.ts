import {
  Lightbulb,
  MonitorSmartphone,
  Megaphone,
  LayoutTemplate,
  BarChart3,
  Share2,
  CircleDollarSign,
  Clock,
  UserRound,
  LineChart,
  Building2,
  Handshake,
  Phone,
  Mail,
  MapPin,
  Info,
  CheckCircle,
  AlertTriangle,
  StickyNote,
  RectangleHorizontal,
  Box,
  Loader2,
  ShieldCheck,
  Star,
} from 'lucide-react';
import type { ComponentType } from 'react';

/**
 * @description Lucide React icon component type signature with optional size and CSS class support.
 */
export type IconComponent = ComponentType<{ size?: number; className?: string }>;

/**
 * @description Mapping of icon identifier strings (from JSON data) to Lucide React icon components.
 * Imported in schemas (e.g., services, advantages, order forms) as icon: z.string(),
 * then resolved to components via resolveIcon(key). Add new icon imports and map entries
 * to expand available icons across the site.
 */
export const ICON_MAP: Record<string, IconComponent> = {
  Lightbulb,
  MonitorSmartphone,
  Megaphone,
  LayoutTemplate,
  BarChart3,
  Share2,
  CircleDollarSign,
  Clock,
  UserRound,
  LineChart,
  Building2,
  Handshake,
  Phone,
  Mail,
  MapPin,
  Info,
  CheckCircle,
  AlertTriangle,
  StickyNote,
  RectangleHorizontal,
  Box,
  Loader2,
  ShieldCheck,
  Star,
};

/**
 * @description Resolves an icon identifier string to its Lucide React component,
 * returning undefined if the icon is not found in ICON_MAP. Safe for use in render
 * paths with optional chaining or ternary fallbacks.
 *
 * @param {string} key - Icon name/identifier to look up (e.g., "Lightbulb", "Phone")
 * @returns {IconComponent | undefined} The icon component, or undefined if not in ICON_MAP
 *
 * @example
 * const IconComp = resolveIcon('Lightbulb');
 * if (IconComp) {
 *   return <IconComp size={24} className="text-primary" />;
 * }
 */
export function resolveIcon(key: string): IconComponent | undefined {
  return ICON_MAP[key];
}
