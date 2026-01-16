import { Check, MoreHorizontal, Trash2, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Goal } from '@/types';
import { useCompleteGoal, useDeleteGoal } from '@/hooks/useGoals';

interface GoalCardProps {
  goal: Goal;
}

const frequencyLabels: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export function GoalCard({ goal }: GoalCardProps) {
  const completeGoal = useCompleteGoal();
  const deleteGoal = useDeleteGoal();

  const handleComplete = () => {
    completeGoal.mutate(goal.id);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal.mutate(goal.id);
    }
  };

  return (
    <Card className={cn(
      'group transition-all duration-200',
      'hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]',
      goal.completedThisPeriod && 'bg-success/[0.03] border-success/25'
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <button
              onClick={handleComplete}
              disabled={goal.completedThisPeriod || completeGoal.isPending}
              className={cn(
                'flex-shrink-0 h-[22px] w-[22px] rounded-full border-[1.5px] flex items-center justify-center transition-all duration-200 mt-0.5',
                goal.completedThisPeriod
                  ? 'bg-success border-success text-success-foreground scale-100'
                  : 'border-muted-foreground/30 hover:border-primary/60 hover:bg-primary/5'
              )}
              aria-label={goal.completedThisPeriod ? 'Goal completed' : 'Mark as complete'}
            >
              {goal.completedThisPeriod && <Check className="h-3 w-3" strokeWidth={2.5} />}
            </button>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3
                  className={cn(
                    'font-medium text-[0.9375rem] text-foreground truncate tracking-[-0.01em]',
                    goal.completedThisPeriod && 'line-through text-muted-foreground'
                  )}
                >
                  {goal.title}
                </h3>
                <Badge variant="secondary" className="text-[11px] font-medium px-2 py-0">
                  {frequencyLabels[goal.frequency]}
                </Badge>
              </div>
              {goal.description && (
                <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2">{goal.description}</p>
              )}
              {goal.currentStreak > 0 && (
                <div className="flex items-center gap-1.5 pt-1 text-[13px] text-orange-600 dark:text-orange-400">
                  <Flame className="h-3.5 w-3.5" />
                  <span className="font-medium">{goal.currentStreak} day streak</span>
                </div>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Goal options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
