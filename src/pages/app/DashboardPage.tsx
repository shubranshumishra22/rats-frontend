import { useState } from 'react';
import { Flame, Target, CheckCircle2, Trophy, TrendingUp } from 'lucide-react';
import { AppShell } from '@/components/layout';
import { PageHeader, GoalList, GoalCreateModal, ErrorState } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useGoals, useGoalStats, useStreakInfo } from '@/hooks/useGoals';
import { useAuth } from '@/context';
import type { GoalFrequency } from '@/types';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<GoalFrequency>('daily');
  const { user } = useAuth();
  
  const { data: goals, isLoading: goalsLoading, error: goalsError, refetch: refetchGoals } = useGoals(activeTab);
  const { data: stats, isLoading: statsLoading } = useGoalStats();
  const { data: streakInfo, isLoading: streakLoading } = useStreakInfo();

  const statsCards = [
    {
      title: 'Total Goals',
      value: stats?.totalGoals ?? 0,
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Completed',
      value: stats?.totalCompletions ?? 0,
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Current Streak',
      value: streakInfo?.currentStreak ?? stats?.currentStreak ?? 0,
      icon: Flame,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      suffix: 'days',
    },
    {
      title: 'Total Points',
      value: stats?.totalPointsEarned ?? user?.points ?? 0,
      icon: Trophy,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title={`Welcome back, ${user?.username}!`}
        description="Track your goals and build lasting habits"
        actions={<GoalCreateModal defaultFrequency={activeTab} />}
      />

      {/* Streak Banner */}
      {streakInfo && streakInfo.currentStreak > 0 && (
        <Card className="mb-8 bg-gradient-to-br from-orange-500 via-orange-500 to-red-500 border-0 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-sm">
                <Flame className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight">{streakInfo.currentStreak}</span>
                  <span className="text-lg font-medium opacity-90">day streak</span>
                </div>
                <p className="text-sm opacity-80 mt-1.5">
                  Best: {streakInfo.longestStreak} days • {streakInfo.completedToday ? '✓ Done today!' : 'Complete a goal to keep it going!'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-shadow">
            <CardContent className="p-5">
              {statsLoading || streakLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className={`p-2.5 rounded-xl ${stat.bgColor} w-fit`}>
                    <stat.icon className={`h-[18px] w-[18px] ${stat.color}`} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      {stat.suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{stat.suffix}</span>}
                    </p>
                    <p className="text-[13px] text-muted-foreground mt-0.5">{stat.title}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Goals Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-base">Your Goals</CardTitle>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as GoalFrequency)}>
              <TabsList className="h-9">
                <TabsTrigger value="daily" className="text-[13px] px-3">Daily</TabsTrigger>
                <TabsTrigger value="weekly" className="text-[13px] px-3">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="text-[13px] px-3">Monthly</TabsTrigger>
                <TabsTrigger value="yearly" className="text-[13px] px-3">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {goalsError ? (
            <ErrorState onRetry={() => refetchGoals()} />
          ) : (
            <GoalList goals={goals} isLoading={goalsLoading} />
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
