import { CheckCircle2 } from 'lucide-react';
import { aboutValues } from '@/types/sections/about/aboutValues';

/**
 * @component
 * @description Unordered list of company values with checkmark icons and descriptions
 * @returns {JSX.Element} Vertical list of values with icon, title, and description per item
 * @example <caption>Company values in about section</caption>
 * <AboutValues />
 */
export function AboutValues() {
  return (
    <ul className="space-y-5">
      {aboutValues.map((value) => (
        <li key={value.title} className="flex gap-4">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary" />
          <div>
            <p className="mb-0.5 font-semibold text-foreground">{value.title}</p>
            <p className="text-sm text-muted-foreground">{value.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
