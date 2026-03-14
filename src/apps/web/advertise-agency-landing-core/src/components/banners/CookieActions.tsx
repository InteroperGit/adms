import { Button } from '@/components/ui/button';
import { cookiesContent } from '@/types/config/cookies';

interface CookieActionsProps {
  onAcceptAll: () => void;
  onNecessaryOnly: () => void;
}

/**
 * @component
 * @description Cookie consent action buttons (accept all and necessary only options)
 * @param {CookieActionsProps} props
 * @param {() => void} props.onAcceptAll - Accept all cookies handler
 * @param {() => void} props.onNecessaryOnly - Accept necessary only handler
 * @returns {JSX.Element} Flex container with two action buttons
 * @example
 * <CookieActions onAcceptAll={handleAcceptAll} onNecessaryOnly={handleNecessaryOnly} />
 */
export function CookieActions({ onAcceptAll, onNecessaryOnly }: CookieActionsProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button size="sm" className="w-full rounded-full" onClick={onAcceptAll}>
        {cookiesContent.acceptAll}
      </Button>
      <Button size="sm" variant="outline" className="w-full rounded-full" onClick={onNecessaryOnly}>
        {cookiesContent.necessaryOnly}
      </Button>
    </div>
  );
}
