import type { ReactNode } from 'react';
import { useLocation, useNavigation } from 'react-router';
import { cn } from '@/libs/utils';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * @component
 * @description Wraps page content with smooth fade transitions between routes. Triggers exit fade when navigating, entrance fade when page loads.
 * @param {PageTransitionProps} props
 * @param {ReactNode} props.children - Page content (typically <Outlet />)
 * @returns {JSX.Element} Animated page wrapper
 * @example
 * <PageTransition><Outlet /></PageTransition>
 */
export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const navigation = useNavigation();
  const isNavigating = navigation.state === 'loading';

  return (
    <div
      key={location.pathname}
      className={cn(
        'animate-fade-in',
        isNavigating && 'opacity-50 transition-opacity duration-200'
      )}
    >
      {children}
    </div>
  );
}
