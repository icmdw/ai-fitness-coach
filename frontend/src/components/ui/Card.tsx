import { cn } from '@/lib/utils';

export interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn(
      'bg-white rounded-lg border border-gray-200 shadow-sm',
      'hover:shadow-md transition-shadow',
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return (
    <div className={cn('px-4 py-3 border-b border-gray-200', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: CardProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children }: CardProps) {
  return (
    <div className={cn('px-4 py-3', className)}>
      {children}
    </div>
  );
}
