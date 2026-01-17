// User types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  points: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Public Profile (no email)
export interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  stats: {
    points: number;
    currentStreak: number;
    longestStreak: number;
    goalsCompleted: number;
    totalGoals: number;
  };
  createdAt: string;
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

// Friendship Status
export type FriendshipStatusType = 'none' | 'friends' | 'request_sent' | 'request_received' | 'self' | 'blocked';

export interface FriendshipStatus {
  status: FriendshipStatusType;
  friendshipId?: string;
  requestId?: string;
}

// Messaging types
export interface Conversation {
  id: string;
  otherUser: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
  } | null;
  lastReadAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
  senderId: string;
  sender: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  username: string;
  isTyping: boolean;
}

// API Error
export interface ApiError {
  code: string;
  message: string;
}
