import api from './axios';
import type { ApiResponse, Friend, FriendRequest } from '@/types';

export const friendsApi = {
  getFriends: async (): Promise<Friend[]> => {
    const response = await api.get<ApiResponse<{ friends: Friend[] }>>('/friends');
    return response.data.data.friends || [];
  },

  getPendingRequests: async (): Promise<FriendRequest[]> => {
    const response = await api.get<ApiResponse<{ requests: Array<{
      id: string;
      from: { id: string; username: string; email: string };
      createdAt: string;
    }> }>>('/friends/requests');
    // Map 'from' to 'sender' for frontend compatibility
    return (response.data.data.requests || []).map(req => ({
      id: req.id,
      createdAt: req.createdAt,
      sender: req.from,
    }));
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
