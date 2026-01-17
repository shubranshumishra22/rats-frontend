// User types
export interface User {
  id: string;
  email: string;
  username: string;
  points: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

// Goal types
export type GoalFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  frequency: GoalFrequency;
  currentStreak: number;
  longestStreak: number;
  completedThisPeriod: boolean;
  lastCompletedAt: string | null;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  frequency: GoalFrequency;
}

export interface GoalStats {
  totalGoals: number;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  totalPointsEarned: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  goalStreaks: Array<{
    id: string;
    title: string;
    currentStreak: number;
    longestStreak: number;
  }>;
}

// Friend types
export type FriendStatus = 'pending' | 'accepted' | 'blocked';

export interface Friend {
  id: string;
  username: string;
  email: string;
  points: number;
  currentStreak: number;
}

export interface FriendRequest {
  id: string;
  status?: FriendStatus;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    email: string;
  };
}

export interface SendFriendRequest {
  userId: string;
}

export interface RespondFriendRequest {
  action: 'accept' | 'reject';
}

// Leaderboard types
export interface LeaderboardEntry {
  id: string;
  username: string;
  email: string;
  points: number;
  completedGoals: number;
  currentStreak: number;
  rank?: number;
}

export interface UserRank {
  rank: number;
  points: number;
  completedGoals: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
