import { formatNGN } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  previousPrice?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceDisplay({
  price,
  previousPrice,
  className,
  size = 'md',
}: PriceDisplayProps) {
  const sizeClass =
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';
  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className={cn('font-semibold text-foreground', sizeClass)}>
        {formatNGN(price)}
      </span>
      {previousPrice && previousPrice > price && (
        <span className="text-sm text-muted-foreground line-through">
          {formatNGN(previousPrice)}
        </span>
      )}
    </div>
  );
}
