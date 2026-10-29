"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  /** Load immediately instead of lazily (use for above-the-fold images) */
  priority?: boolean;
}

export function ProductImage({
  src,
  alt,
  className,
  fill = false,
  sizes,
  priority = false,
}: ProductImageProps) {
  /* Remember which src failed, so a new src gets a fresh try */
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-secondary text-secondary-foreground",
          fill ? "absolute inset-0" : "",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <span className="font-heading text-sm tracking-[0.2em] opacity-60">
          VELORA
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      onError={() => setFailedSrc(src)}
      className={cn(fill ? "absolute inset-0 h-full w-full" : "", className)}
    />
  );
}
