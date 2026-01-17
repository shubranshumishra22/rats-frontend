import api from './axios';
import type { ApiResponse, Conversation, Message } from '@/types';

export const messagesApi = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<ApiResponse<{ conversations: Conversation[] }>>('/messages/conversations');
    return response.data.data.conversations;
  },

  getOrCreateConversation: async (userId: string): Promise<Conversation> => {
    const response = await api.post<ApiResponse<{ conversation: Conversation }>>('/messages/conversations', { userId });
    return response.data.data.conversation;
  },

  getMessages: async (conversationId: string, cursor?: string): Promise<{
    messages: Message[];
    nextCursor: string | null;
    hasMore: boolean;
  }> => {
    const response = await api.get<ApiResponse<{
      messages: Message[];
      nextCursor: string | null;
      hasMore: boolean;
    }>>(`/messages/conversations/${conversationId}/messages`, {
      params: { cursor },
    });
    return response.data.data;
  },

  sendMessage: async (conversationId: string, content: string): Promise<Message> => {
    const response = await api.post<ApiResponse<{ message: Message }>>(
      `/messages/conversations/${conversationId}/messages`,
      { content }
    );
    return response.data.data.message;
  },

  markAsRead: async (conversationId: string): Promise<void> => {
    await api.post(`/messages/conversations/${conversationId}/read`);
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<{ unreadCount: number }>>('/messages/unread');
    return response.data.data.unreadCount;
  },
};
