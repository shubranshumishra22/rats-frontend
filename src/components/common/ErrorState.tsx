import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading the data. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div className="rounded-2xl bg-destructive/8 p-5 mb-5 ring-1 ring-destructive/20">
        <AlertCircle className="h-7 w-7 text-destructive/80" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-[-0.01em] mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-5">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="gap-2 shadow-sm">
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
