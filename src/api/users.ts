import api from './axios';
import type { ApiResponse, User, PublicProfile } from '@/types';

export const usersApi = {
  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/users/me');
    return response.data.data.user;
  },

  updateProfile: async (data: { displayName?: string; bio?: string; avatarUrl?: string | null }): Promise<User> => {
    const response = await api.patch<ApiResponse<{ user: User }>>('/users/me', data);
    return response.data.data.user;
  },

  getPublicProfile: async (username: string): Promise<PublicProfile> => {
    const response = await api.get<ApiResponse<{ profile: PublicProfile }>>(`/users/profile/${username}`);
    return response.data.data.profile;
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const response = await api.get<ApiResponse<{ users: User[] }>>('/users/search', {
      params: { q: query },
    });
    return response.data.data.users;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>(`/users/${id}`);
    return response.data.data.user;
  },
};
