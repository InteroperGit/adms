import { cn } from '@/lib/utils';
import { headerContent } from '@/types/sections/header/header';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <a href={headerContent.logo.href} className={cn('inline-flex', className)}>
      <img src={headerContent.logo.src} alt="" className="h-6 w-auto" />
    </a>
  );
}
