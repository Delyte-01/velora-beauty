import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
  showCount?: boolean;
  reviewCount?: number;
  /** "stars" shows five stars. "compact" shows one star plus the number. */
  variant?: "stars" | "compact";
  className?: string;
}

export function StarRating({
  rating,
  size = "sm",
  showCount = false,
  reviewCount,
  variant = "stars",
  className,
}: StarRatingProps) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const label =
    `Rated ${rating.toFixed(1)} out of 5` +
    (reviewCount !== undefined ? ` from ${reviewCount} reviews` : "");
  const text = `${rating.toFixed(1)}${
    showCount && reviewCount !== undefined ? ` (${reviewCount})` : ""
  }`;

  if (variant === "compact") {
    return (
      <div
        role="img"
        aria-label={label}
        className={cn("flex items-center gap-1.5", className)}
      >
        <Star
          className={cn(starSize, "fill-accent text-accent")}
          aria-hidden="true"
        />
        <span className="text-xs text-muted-foreground" aria-hidden="true">
          {text}
        </span>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={cn("flex items-center gap-1.5", className)}
    >
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              starSize,
              i <= Math.round(rating)
                ? "fill-accent text-accent"
                : "fill-transparent text-muted-foreground/30",
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground" aria-hidden="true">
        {text}
      </span>
    </div>
  );
}
