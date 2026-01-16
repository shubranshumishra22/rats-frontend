import { Target } from 'lucide-react';
import { GoalCard } from './GoalCard';
import { EmptyState } from './EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import type { Goal } from '@/types';

interface GoalListProps {
  goals: Goal[] | undefined;
  isLoading: boolean;
  onCreateClick?: () => void;
}

export function GoalList({ goals, isLoading, onCreateClick }: GoalListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[88px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title="No goals yet"
        description="Create your first goal and start building habits that stick"
        action={onCreateClick ? { label: 'Create Goal', onClick: onCreateClick } : undefined}
      />
    );
  }

  return (
    <div className="space-y-3">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}
