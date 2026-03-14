import { MessageSquareOff } from 'lucide-react';

/**
 * @component
 * @description Empty state placeholder for testimonials section when Yandex organization ID is not configured. Shows icon and instructions.
 * @returns {JSX.Element} Centered card with empty state message and configuration hint
 * @example <caption>Testimonials empty state</caption>
 * <TestimonialsEmpty />
 */
export function TestimonialsEmpty() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-background px-8 py-12 text-center">
      <MessageSquareOff size={36} className="text-muted-foreground/50" />
      <p className="font-medium text-muted-foreground">Отзывы не найдены</p>
      <p className="text-sm text-muted-foreground/70">
        Укажите <code className="rounded bg-muted px-1 py-0.5 text-xs">yandexMapsOrgId</code> в
        конфигурации сайта
      </p>
    </div>
  );
}
