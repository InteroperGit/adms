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
} from 'lucide-react';
import type { ComponentType } from 'react';

export type IconComponent = ComponentType<{ size?: number; className?: string }>;

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
};

export function resolveIcon(key: string): IconComponent | undefined {
  return ICON_MAP[key];
}
