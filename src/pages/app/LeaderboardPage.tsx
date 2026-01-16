import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { AppShell } from '@/components/layout';
import { PageHeader, LeaderboardTable, ErrorState } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useFriendsLeaderboard, useUserRank } from '@/hooks/useLeaderboard';
import { useAuth } from '@/context';

export function LeaderboardPage() {
  const { user } = useAuth();
  const { data: leaderboard, isLoading, error, refetch } = useFriendsLeaderboard();
  const { data: userRank, isLoading: rankLoading } = useUserRank();

  return (
    <AppShell>
      <PageHeader
        title="Leaderboard"
        description="See how you rank among your friends"
      />

      {/* User Rank Card */}
      <Card className="mb-8 bg-gradient-to-br from-indigo-500 via-indigo-500 to-purple-600 border-0 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80 mb-2">Your Rank</p>
              {rankLoading ? (
                <Skeleton className="h-14 w-28 bg-white/20 rounded-lg" />
              ) : (
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-bold tracking-tight">
                    {userRank?.rank ? `#${userRank.rank}` : '-'}
                  </span>
                  <div className="text-sm opacity-80 space-y-0.5">
                    <p className="font-medium">{(userRank?.points ?? user?.points ?? 0).toLocaleString()} points</p>
                    <p>{userRank?.completedGoals ?? 0} goals completed</p>
                  </div>
                </div>
              )}
            </div>
            <Trophy className="h-20 w-20 opacity-15" strokeWidth={1} />
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Friends Ranking</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {error ? (
            <ErrorState onRetry={() => refetch()} />
          ) : (
            <LeaderboardTable
              entries={leaderboard}
              isLoading={isLoading}
              currentUserId={user?.id}
            />
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
