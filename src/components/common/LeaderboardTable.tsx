import { Trophy, Medal, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from './EmptyState';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[] | undefined;
  isLoading: boolean;
  currentUserId?: string;
}

export function LeaderboardTable({ entries, isLoading, currentUserId }: LeaderboardTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="No rankings yet"
        description="Complete goals to start climbing the leaderboard"
      />
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-amber-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-slate-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-[13px] font-semibold text-muted-foreground tabular-nums">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => {
        const rank = entry.rank ?? index + 1;
        const isCurrentUser = entry.id === currentUserId;

        return (
          <Card
            key={entry.id}
            className={cn(
              'transition-all duration-200',
              isCurrentUser && 'ring-2 ring-primary/30 ring-offset-2 ring-offset-background',
              rank === 1 && 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/50',
              rank === 2 && 'bg-slate-50/50 dark:bg-slate-950/20',
              rank === 3 && 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-200/50 dark:border-orange-800/50'
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 flex items-center justify-center">{getRankIcon(rank)}</div>
                  <Avatar className={cn(
                    'h-10 w-10',
                    rank <= 3 && 'ring-2 ring-offset-2 ring-offset-background',
                    rank === 1 && 'ring-amber-400/60',
                    rank === 2 && 'ring-slate-400/60',
                    rank === 3 && 'ring-orange-400/60'
                  )}>
                    <AvatarFallback
                      className={cn(
                        'text-sm font-medium',
                        rank === 1 && 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
                        rank === 2 && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
                        rank === 3 && 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
                        rank > 3 && 'bg-muted'
                      )}
                    >
                      {entry.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[0.9375rem] text-foreground">{entry.username}</p>
                      {isCurrentUser && (
                        <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-muted-foreground">{entry.completedGoals} goals completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold tabular-nums text-foreground">{entry.points.toLocaleString()}</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
