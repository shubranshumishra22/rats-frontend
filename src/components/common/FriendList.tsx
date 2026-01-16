import { Users } from 'lucide-react';
import { FriendCard, FriendRequestCard } from './FriendCard';
import { EmptyState } from './EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import type { Friend, FriendRequest } from '@/types';

interface FriendListProps {
  friends: Friend[] | undefined;
  isLoading: boolean;
}

export function FriendList({ friends, isLoading }: FriendListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No friends yet"
        description="Use the search above to find and connect with friends"
      />
    );
  }

  return (
    <div className="space-y-3">
      {friends.map((friend) => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
}

interface FriendRequestListProps {
  requests: FriendRequest[] | undefined;
  isLoading: boolean;
}

export function FriendRequestList({ requests, isLoading }: FriendRequestListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No pending requests"
        description="You're all caught up! No friend requests to review."
      />
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <FriendRequestCard key={request.id} request={request} />
      ))}
    </div>
  );
}
