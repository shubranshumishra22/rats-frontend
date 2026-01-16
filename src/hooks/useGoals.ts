import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '@/api/goals';
import type { CreateGoalRequest, GoalFrequency } from '@/types';
import { toast } from 'sonner';

export const goalKeys = {
  all: ['goals'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  list: (type?: GoalFrequency) => [...goalKeys.lists(), { type }] as const,
  detail: (id: string) => [...goalKeys.all, 'detail', id] as const,
  stats: () => [...goalKeys.all, 'stats'] as const,
  streak: () => [...goalKeys.all, 'streak'] as const,
};

export function useGoals(type?: GoalFrequency) {
  return useQuery({
    queryKey: goalKeys.list(type),
    queryFn: () => goalsApi.getGoals(type),
  });
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: goalKeys.detail(id),
    queryFn: () => goalsApi.getGoalById(id),
    enabled: !!id,
  });
}

export function useGoalStats() {
  return useQuery({
    queryKey: goalKeys.stats(),
    queryFn: () => goalsApi.getStats(),
  });
}

export function useStreakInfo() {
  return useQuery({
    queryKey: goalKeys.streak(),
    queryFn: () => goalsApi.getStreakInfo(),
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoalRequest) => goalsApi.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalKeys.stats() });
      toast.success('Goal created successfully!');
    },
    onError: () => {
      toast.error('Failed to create goal');
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateGoalRequest> }) =>
      goalsApi.updateGoal(id, data),
    onSuccess: (goal) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      queryClient.setQueryData(goalKeys.detail(goal.id), goal);
      toast.success('Goal updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update goal');
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalsApi.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalKeys.stats() });
      toast.success('Goal deleted');
    },
    onError: () => {
      toast.error('Failed to delete goal');
    },
  });
}

export function useCompleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalsApi.completeGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: goalKeys.stats() });
      queryClient.invalidateQueries({ queryKey: goalKeys.streak() });
      toast.success('Goal completed! 🎉');
    },
    onError: () => {
      toast.error('Failed to complete goal');
    },
  });
}
