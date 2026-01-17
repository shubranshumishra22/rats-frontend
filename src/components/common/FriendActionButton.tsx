import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Check, Clock, UserCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { friendsApi } from '@/api/friends';
import { friendKeys } from '@/hooks/useFriends';
import { toast } from 'sonner';
import type { FriendshipStatusType } from '@/types';
import { AxiosError } from 'axios';

interface FriendActionButtonProps {
  userId: string;
  initialStatus?: FriendshipStatusType;
  requestId?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

/**
 * Smart friend action button that handles all friend states
 * Like Instagram/LinkedIn - shows appropriate action based on relationship
 */
export function FriendActionButton({ 
  userId, 
  initialStatus,
  requestId: initialRequestId,
  size = 'default',
  className,
}: FriendActionButtonProps) {
  const queryClient = useQueryClient();
  const [localStatus, setLocalStatus] = useState<FriendshipStatusType | null>(initialStatus || null);
  // Use initialRequestId directly since we don't need to update it locally
  const localRequestId = initialRequestId;

  // Fetch friendship status if not provided
  const { data: statusData, isLoading: isStatusLoading } = useQuery({
    queryKey: ['friendshipStatus', userId],
    queryFn: () => friendsApi.getFriendshipStatus(userId),
    enabled: !initialStatus,
    staleTime: 30000,
  });

  const status = localStatus || statusData?.status || 'none';
  const requestId = localRequestId || statusData?.requestId;

  // Send friend request mutation
  const sendRequest = useMutation({
    mutationFn: () => friendsApi.sendRequest(userId),
    onSuccess: () => {
      setLocalStatus('request_sent');
      queryClient.invalidateQueries({ queryKey: friendKeys.requests() });
      queryClient.invalidateQueries({ queryKey: ['friendshipStatus', userId] });
      toast.success('Friend request sent!');
    },
    onError: (error: AxiosError<{ code: string; message: string }>) => {
      const errorCode = error.response?.data?.code;
      const errorMessage = error.response?.data?.message;

      // Handle specific 409 cases gracefully
      switch (errorCode) {
        case 'ALREADY_FRIENDS':
          setLocalStatus('friends');
          toast.success('You are already friends!');
          break;
        case 'FRIEND_REQUEST_ALREADY_SENT':
          setLocalStatus('request_sent');
          // Don't show error - just update UI
          break;
        case 'INCOMING_REQUEST_EXISTS':
          setLocalStatus('request_received');
          toast.info('This user has sent you a request. Check your pending requests!');
          break;
        case 'SELF_REQUEST':
          toast.error("You can't send a friend request to yourself");
          break;
        default:
          // Only show error toast for true server errors
          if (error.response?.status && error.response.status >= 500) {
            toast.error('Something went wrong. Please try again.');
          } else {
            toast.error(errorMessage || 'Failed to send request');
          }
      }
    },
  });

  // Accept friend request mutation
  const acceptRequest = useMutation({
    mutationFn: () => friendsApi.respondToRequest(requestId!, 'accept'),
    onSuccess: () => {
      setLocalStatus('friends');
      queryClient.invalidateQueries({ queryKey: friendKeys.list() });
      queryClient.invalidateQueries({ queryKey: friendKeys.requests() });
      queryClient.invalidateQueries({ queryKey: ['friendshipStatus', userId] });
      toast.success('Friend request accepted!');
    },
    onError: () => {
      toast.error('Failed to accept request');
    },
  });

  const isPending = sendRequest.isPending || acceptRequest.isPending || isStatusLoading;

  // Don't show button for self
  if (status === 'self') {
    return null;
  }

  // Render based on status
  switch (status) {
    case 'friends':
      return (
        <Button 
          variant="secondary" 
          size={size} 
          disabled 
          className={className}
        >
          <UserCheck className="h-4 w-4 mr-1.5" />
          Friends
        </Button>
      );

    case 'request_sent':
      return (
        <Button 
          variant="secondary" 
          size={size} 
          disabled 
          className={className}
        >
          <Clock className="h-4 w-4 mr-1.5" />
          Request Sent
        </Button>
      );

    case 'request_received':
      return (
        <Button
          size={size}
          onClick={() => acceptRequest.mutate()}
          disabled={isPending}
          className={className}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-1.5" />
          )}
          Accept Request
        </Button>
      );

    case 'blocked':
      return null;

    case 'none':
    default:
      return (
        <Button
          size={size}
          onClick={() => sendRequest.mutate()}
          disabled={isPending}
          className={className}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4 mr-1.5" />
          )}
          Add Friend
        </Button>
      );
  }
}
