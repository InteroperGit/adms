import { Button } from '@/components/ui/button';
import { content } from '@/types/content';

interface CookieActionsProps {
  onAcceptAll: () => void;
  onNecessaryOnly: () => void;
}

export function CookieActions({ onAcceptAll, onNecessaryOnly }: CookieActionsProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button size="sm" className="w-full rounded-full" onClick={onAcceptAll}>
        {content.cookies.acceptAll}
      </Button>
      <Button size="sm" variant="outline" className="w-full rounded-full" onClick={onNecessaryOnly}>
        {content.cookies.necessaryOnly}
      </Button>
    </div>
  );
}
