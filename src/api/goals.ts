import api from './axios';
import type { ApiResponse, Goal, GoalStats, CreateGoalRequest, GoalFrequency, StreakInfo } from '@/types';

export const goalsApi = {
  getGoals: async (type?: GoalFrequency): Promise<Goal[]> => {
    const response = await api.get<ApiResponse<{ goals: Goal[] }>>('/goals', {
      params: type ? { type } : undefined,
    });
    return response.data.data.goals || [];
  },

  getMyGoals: async (type?: GoalFrequency): Promise<Goal[]> => {
    const response = await api.get<ApiResponse<{ goals: Goal[] }>>('/goals/my', {
      params: type ? { type } : undefined,
    });
    return response.data.data.goals || [];
  },

  getGoalById: async (id: string): Promise<Goal> => {
    const response = await api.get<ApiResponse<{ goal: Goal }>>(`/goals/${id}`);
    return response.data.data.goal;
  },

  createGoal: async (data: CreateGoalRequest): Promise<Goal> => {
    const response = await api.post<ApiResponse<{ goal: Goal }>>('/goals', data);
    return response.data.data.goal;
  },

  updateGoal: async (id: string, data: Partial<CreateGoalRequest>): Promise<Goal> => {
    const response = await api.patch<ApiResponse<{ goal: Goal }>>(`/goals/${id}`, data);
    return response.data.data.goal;
  },

  deleteGoal: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },

  completeGoal: async (id: string): Promise<Goal> => {
    const response = await api.post<ApiResponse<{ goal: Goal }>>(`/goals/${id}/complete`);
    return response.data.data.goal;
  },

  getStats: async (): Promise<GoalStats> => {
    const response = await api.get<ApiResponse<{ stats: GoalStats }>>('/goals/stats');
    return response.data.data.stats;
  },

  getStreakInfo: async (): Promise<StreakInfo> => {
    const response = await api.get<ApiResponse<{ streak: StreakInfo }>>('/goals/streak');
    return response.data.data.streak;
  },

  shareGoal: async (goalId: string, friendId: string): Promise<void> => {
    await api.post(`/goals/${goalId}/share`, { friendId });
  },

  unshareGoal: async (goalId: string, friendId: string): Promise<void> => {
    await api.delete(`/goals/${goalId}/share/${friendId}`);
  },
};
