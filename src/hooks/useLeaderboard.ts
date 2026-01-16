import { useQuery } from '@tanstack/react-query';
import { leaderboardApi } from '@/api/leaderboard';

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (period?: string) => [...leaderboardKeys.all, 'list', { period }] as const,
  friends: () => [...leaderboardKeys.all, 'friends'] as const,
  rank: () => [...leaderboardKeys.all, 'rank'] as const,
};

export function useLeaderboard(period?: 'all' | 'month' | 'week') {
  return useQuery({
    queryKey: leaderboardKeys.list(period),
    queryFn: () => leaderboardApi.getLeaderboard(period),
  });
}

export function useFriendsLeaderboard() {
  return useQuery({
    queryKey: leaderboardKeys.friends(),
    queryFn: () => leaderboardApi.getFriendsLeaderboard(),
  });
}

export function useUserRank() {
  return useQuery({
    queryKey: leaderboardKeys.rank(),
    queryFn: () => leaderboardApi.getUserRank(),
  });
}
