import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div className="rounded-2xl bg-muted/60 p-5 mb-5 ring-1 ring-border/40">
        <Icon className="h-7 w-7 text-muted-foreground/70" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-[-0.01em] mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-5">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="sm" className="shadow-sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}
