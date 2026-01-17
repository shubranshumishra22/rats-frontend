import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getAccessToken } from '@/api/axios';
import type { Message, TypingIndicator } from '@/types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  markAsRead: (conversationId: string) => void;
  onNewMessage: (callback: (message: Message) => void) => () => void;
  onTypingUpdate: (callback: (data: TypingIndicator) => void) => () => void;
  onMessageNotification: (callback: (data: { conversationId: string; message: Message }) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || '';

export function SocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = getAccessToken();
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('[Socket] Connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  const joinConversation = useCallback((conversationId: string) => {
    socket?.emit('join:conversation', conversationId);
  }, [socket]);

  const leaveConversation = useCallback((conversationId: string) => {
    socket?.emit('leave:conversation', conversationId);
  }, [socket]);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    socket?.emit('message:send', { conversationId, content });
  }, [socket]);

  const startTyping = useCallback((conversationId: string) => {
    socket?.emit('typing:start', conversationId);
  }, [socket]);

  const stopTyping = useCallback((conversationId: string) => {
    socket?.emit('typing:stop', conversationId);
  }, [socket]);

  const markAsRead = useCallback((conversationId: string) => {
    socket?.emit('message:read', conversationId);
  }, [socket]);

  const onNewMessage = useCallback((callback: (message: Message) => void) => {
    socket?.on('message:new', callback);
    return () => {
      socket?.off('message:new', callback);
    };
  }, [socket]);

  const onTypingUpdate = useCallback((callback: (data: TypingIndicator) => void) => {
    socket?.on('typing:update', callback);
    return () => {
      socket?.off('typing:update', callback);
    };
  }, [socket]);

  const onMessageNotification = useCallback((callback: (data: { conversationId: string; message: Message }) => void) => {
    socket?.on('message:notification', callback);
    return () => {
      socket?.off('message:notification', callback);
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinConversation,
        leaveConversation,
        sendMessage,
        startTyping,
        stopTyping,
        markAsRead,
        onNewMessage,
        onTypingUpdate,
        onMessageNotification,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
