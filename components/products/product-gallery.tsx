'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ProductImage } from './product-image';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const safeImages = images.length > 0 ? images : [''];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-muted">
        <ProductImage
          src={safeImages[active]}
          alt={`${alt} — image ${active + 1}`}
          className="h-full w-full object-cover"
        />
      </div>
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                'relative aspect-square overflow-hidden rounded-md border-2 bg-muted transition-colors',
                active === i ? 'border-primary' : 'border-border hover:border-muted-foreground'
              )}
            >
              <ProductImage
                src={img}
                alt={`${alt} thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
