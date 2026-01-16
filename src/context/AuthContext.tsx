import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import { authApi } from '@/api/auth';
import { setAccessToken } from '@/api/axios';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isUserLoading,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => usersApi.getMe(),
    enabled: false,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Try to restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        await authApi.refresh();
        await refetch();
      } catch {
        // No valid session
        setAccessToken(null);
      } finally {
        setIsInitializing(false);
      }
    };
    initAuth();
  }, [refetch]);

  const login = async (email: string, password: string) => {
    await authApi.login({ email, password });
    await refetch();
  };

  const register = async (email: string, username: string, password: string) => {
    await authApi.register({ email, username, password });
    await refetch();
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      queryClient.clear();
    }
  };

  const isLoading = isInitializing || isUserLoading;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user: user ?? null, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
