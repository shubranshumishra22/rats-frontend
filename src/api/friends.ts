import api from './axios';
import type { ApiResponse, Friend, FriendRequest } from '@/types';

export const friendsApi = {
  getFriends: async (): Promise<Friend[]> => {
    const response = await api.get<ApiResponse<{ friends: Friend[] }>>('/friends');
    return response.data.data.friends || [];
  },

  getPendingRequests: async (): Promise<FriendRequest[]> => {
    const response = await api.get<ApiResponse<{ requests: FriendRequest[] }>>('/friends/requests');
    return response.data.data.requests || [];
  },

  sendRequest: async (userId: string): Promise<void> => {
    await api.post('/friends/request', { userId });
  },

  respondToRequest: async (requestId: string, action: 'accept' | 'reject'): Promise<void> => {
    await api.patch(`/friends/request/${requestId}`, { action });
  },

  removeFriend: async (friendId: string): Promise<void> => {
    await api.delete(`/friends/${friendId}`);
  },
};
