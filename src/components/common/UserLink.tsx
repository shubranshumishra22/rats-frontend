import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface UserLinkProps {
  username: string;
  displayName?: string | null;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Reusable component for clickable usernames
 * Navigates to user's public profile like Instagram
 * 
 * Usage:
 * <UserLink username="johndoe" />
 * <UserLink username="johndoe" displayName="John Doe" />
 * <UserLink username="johndoe">Custom content</UserLink>
 */
export function UserLink({ username, displayName, className, children }: UserLinkProps) {
  return (
    <Link
      to={`/u/${username}`}
      className={cn(
        'font-medium hover:underline transition-colors',
        'text-foreground hover:text-primary',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm',
        className
      )}
      aria-label={`View ${displayName || username}'s profile`}
    >
      {children || displayName || username}
    </Link>
  );
}

/**
 * Username with @ prefix, useful for mentions
 */
export function UserMention({ username, className }: { username: string; className?: string }) {
  return (
    <UserLink 
      username={username} 
      className={cn('text-primary', className)}
    >
      @{username}
    </UserLink>
  );
}
