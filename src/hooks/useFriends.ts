import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { friendsApi } from '@/api/friends';
import { usersApi } from '@/api/users';
import { toast } from 'sonner';

export const friendKeys = {
  all: ['friends'] as const,
  list: () => [...friendKeys.all, 'list'] as const,
  requests: () => [...friendKeys.all, 'requests'] as const,
  search: (query: string) => [...friendKeys.all, 'search', query] as const,
};

export function useFriends() {
  return useQuery({
    queryKey: friendKeys.list(),
    queryFn: () => friendsApi.getFriends(),
  });
}

export function useFriendRequests() {
  return useQuery({
    queryKey: friendKeys.requests(),
    queryFn: () => friendsApi.getPendingRequests(),
  });
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: friendKeys.search(query),
    queryFn: () => usersApi.searchUsers(query),
    enabled: query.length >= 2,
    staleTime: 30000,
  });
}

export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => friendsApi.sendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.requests() });
      toast.success('Friend request sent!');
    },
    onError: () => {
      toast.error('Failed to send friend request');
    },
  });
}

export function useRespondToRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: 'accept' | 'reject' }) =>
      friendsApi.respondToRequest(requestId, action),
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: friendKeys.list() });
      queryClient.invalidateQueries({ queryKey: friendKeys.requests() });
      toast.success(action === 'accept' ? 'Friend request accepted!' : 'Friend request declined');
    },
    onError: () => {
      toast.error('Failed to respond to request');
    },
  });
}

export function useRemoveFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendId: string) => friendsApi.removeFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendKeys.list() });
      toast.success('Friend removed');
    },
    onError: () => {
      toast.error('Failed to remove friend');
    },
  });
}
