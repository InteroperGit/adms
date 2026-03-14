import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OrderFormSuccess as SuccessData } from '@/types/config/orderForms';

interface OrderFormSuccessProps {
  success: SuccessData;
  onReset: () => void;
}

/**
 * @component
 * @description Success message displayed after form submission with icon, message and reset button
 * @param {OrderFormSuccessProps} props
 * @param {SuccessData} props.success - Success message, title and reset button label
 * @param {() => void} props.onReset - Reset form handler to restart submission
 * @returns {JSX.Element} Centered success message with icon and button
 * @example
 * <OrderFormSuccess success={successConfig} onReset={handleReset} />
 */
export function OrderFormSuccess({ success, onReset }: OrderFormSuccessProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Send size={28} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">{success.title}</h3>
      <p className="max-w-xs text-sm text-muted-foreground">{success.text}</p>
      <Button variant="outline" className="mt-2 rounded-full" onClick={onReset}>
        {success.reset}
      </Button>
    </div>
  );
}
