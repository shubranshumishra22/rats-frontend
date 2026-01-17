import { Check, X, UserMinus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserLink } from './UserLink';
import type { Friend, FriendRequest } from '@/types';
import { useRespondToRequest, useRemoveFriend } from '@/hooks/useFriends';

interface FriendCardProps {
  friend: Friend;
}

export function FriendCard({ friend }: FriendCardProps) {
  const removeFriend = useRemoveFriend();

  const handleRemove = () => {
    if (confirm(`Are you sure you want to remove ${friend.username} as a friend?`)) {
      removeFriend.mutate(friend.id);
    }
  };

  return (
    <Card className="group transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-10 w-10 ring-1 ring-border/50">
              <AvatarFallback className="text-sm font-medium bg-muted">
                {friend.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <UserLink 
                username={friend.username} 
                className="font-medium text-[0.9375rem]"
              />
              <p className="text-[13px] text-muted-foreground truncate">{friend.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold tabular-nums">{friend.points.toLocaleString()}</p>
              <p className="text-[11px] text-muted-foreground">points</p>
            </div>
            {friend.currentStreak > 0 && (
              <Badge variant="secondary" className="text-[11px] font-medium hidden sm:inline-flex">
                🔥 {friend.currentStreak}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={removeFriend.isPending}
              className="h-8 w-8 text-muted-foreground/60 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <UserMinus className="h-4 w-4" />
              <span className="sr-only">Remove friend</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface FriendRequestCardProps {
  request: FriendRequest;
}

export function FriendRequestCard({ request }: FriendRequestCardProps) {
  const respondToRequest = useRespondToRequest();

  const handleAccept = () => {
    respondToRequest.mutate({ requestId: request.id, action: 'accept' });
  };

  const handleReject = () => {
    respondToRequest.mutate({ requestId: request.id, action: 'reject' });
  };

  return (
    <Card className="border-primary/20 bg-primary/[0.02]">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                {request.sender.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <UserLink 
                username={request.sender.username} 
                className="font-medium text-[0.9375rem]"
              />
              <p className="text-[13px] text-muted-foreground truncate">wants to be friends</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={handleAccept}
              disabled={respondToRequest.isPending}
              className="h-8 gap-1.5 shadow-sm"
            >
              <Check className="h-3.5 w-3.5" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleReject}
              disabled={respondToRequest.isPending}
              className="h-8 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
