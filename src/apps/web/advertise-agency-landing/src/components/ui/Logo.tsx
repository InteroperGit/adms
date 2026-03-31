import { cn } from '@/libs/utils';
import { headerContent } from '@/types/sections/header/header';

interface LogoProps {
  className?: string;
}

/**
 * @component
 * @description Renders the site logo as a linked image from the header configuration
 * @param {LogoProps} props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @returns {JSX.Element} Logo link with optimized image
 * @example
 * <Logo className="h-8" />
 */
export function Logo({ className }: LogoProps) {
  return (
    <a href={headerContent.logo.href} className={cn('inline-flex', className)}>
      <img
        src={headerContent.logo.src}
        alt=""
        className="h-6 w-auto transition-all duration-300 hover:brightness-125"
      />
    </a>
  );
}
