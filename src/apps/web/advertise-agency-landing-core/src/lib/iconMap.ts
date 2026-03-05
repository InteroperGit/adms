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
  type LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
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
};

export function resolveIcon(key: string): LucideIcon | undefined {
  return ICON_MAP[key];
}
