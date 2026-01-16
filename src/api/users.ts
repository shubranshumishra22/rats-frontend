import api from './axios';
import type { ApiResponse, User } from '@/types';

export const usersApi = {
  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/users/me');
    return response.data.data.user;
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
