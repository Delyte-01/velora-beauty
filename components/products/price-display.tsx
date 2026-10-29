import { formatNGN } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  previousPrice?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({
  price,
  previousPrice,
  className,
  size = "md",
}: PriceDisplayProps) {
  const sizeClass =
    size === "sm"
      ? "text-sm"
      : size === "lg"
        ? "text-2xl"
        : "text-base sm:text-lg";
  const onSale = previousPrice !== undefined && previousPrice > price;

  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5",
        className,
      )}
    >
      <span className="sr-only">{onSale ? "Sale price" : "Price"}</span>
      <span
        className={cn(
          "font-medium tabular-nums text-foreground",
          sizeClass,
          onSale && "text-destructive",
        )}
      >
        {formatNGN(price)}
      </span>
      {onSale && previousPrice !== undefined && (
        <>
          <span className="sr-only">Original price</span>
          <span className="text-sm tabular-nums text-muted-foreground line-through">
            {formatNGN(previousPrice)}
          </span>
        </>
      )}
    </div>
  );
}
