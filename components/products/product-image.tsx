'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

export function ProductImage({ src, alt, className, fill = false, sizes }: ProductImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-secondary text-secondary-foreground',
          fill ? 'absolute inset-0' : '',
          className
        )}
        role="img"
        aria-label={alt}
      >
        <span className="font-heading text-sm tracking-wide opacity-60">VELORA</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading="lazy"
      onError={() => setErrored(true)}
      className={cn(fill ? 'absolute inset-0 h-full w-full' : '', className)}
    />
  );
}
