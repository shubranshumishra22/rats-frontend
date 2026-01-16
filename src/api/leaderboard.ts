import api from './axios';
import type { ApiResponse, LeaderboardEntry, UserRank } from '@/types';

export const leaderboardApi = {
  getLeaderboard: async (period?: 'all' | 'month' | 'week'): Promise<LeaderboardEntry[]> => {
    const response = await api.get<ApiResponse<{ leaderboard: LeaderboardEntry[] }>>('/leaderboard', {
      params: period ? { period } : undefined,
    });
    return response.data.data.leaderboard || [];
  },

  getFriendsLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await api.get<ApiResponse<{ leaderboard: LeaderboardEntry[] }>>('/leaderboard/friends');
    return response.data.data.leaderboard || [];
  },

  getUserRank: async (): Promise<UserRank> => {
    const response = await api.get<ApiResponse<{ rank: UserRank }>>('/leaderboard/rank');
    return response.data.data.rank;
  },
};
