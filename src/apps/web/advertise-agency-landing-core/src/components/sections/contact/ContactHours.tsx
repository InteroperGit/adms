// src/components/sections/contact/ContactHours.tsx
import { content } from '@/types/content';
import { siteData } from '@/types/siteData';

export function ContactHours() {
  const { hoursTitle, dayLabels } = content.contact;
  const { weekdays, saturday, sunday } = siteData.contact.workingHours;

  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
      <p className="mb-3 text-sm font-semibold text-foreground">{hoursTitle}</p>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{dayLabels.weekdays}</span>
          <span className="font-medium text-foreground">{weekdays}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{dayLabels.saturday}</span>
          <span className="font-medium text-foreground">{saturday}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{dayLabels.sunday}</span>
          <span className="font-medium text-foreground">{sunday}</span>
        </div>
      </div>
    </div>
  );
}
