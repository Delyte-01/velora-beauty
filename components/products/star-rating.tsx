import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating,
  size = 'sm',
  showCount = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              starSize,
              i <= Math.round(rating)
                ? 'fill-accent text-accent'
                : 'fill-muted text-muted'
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {rating.toFixed(1)}
        {showCount && reviewCount !== undefined ? ` (${reviewCount})` : ''}
      </span>
    </div>
  );
}
