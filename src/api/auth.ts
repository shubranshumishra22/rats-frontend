import api, { setAccessToken } from './axios';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, RefreshResponse } from '@/types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    const authData = response.data.data;
    setAccessToken(authData.accessToken);
    return authData;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const authData = response.data.data;
    setAccessToken(authData.accessToken);
    return authData;
  },

  refresh: async (): Promise<RefreshResponse> => {
    const response = await api.post<ApiResponse<RefreshResponse>>('/auth/refresh');
    const refreshData = response.data.data;
    setAccessToken(refreshData.accessToken);
    return refreshData;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },
};
