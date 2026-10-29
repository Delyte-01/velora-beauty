'use client';

import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { StarRating } from './star-rating';
import { PriceDisplay } from './price-display';
import { ProductImage } from './product-image';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggle, has, isHydrated } = useWishlist();
  const inWishlist = isHydrated && has(product.id);

  const discount =
    product.previousPrice && product.previousPrice > product.price
      ? Math.round(
          ((product.previousPrice - product.price) / product.previousPrice) * 100
        )
      : 0;

  const hasVariants = product.variants.length > 0;
  const defaultVariants: Record<string, string> = hasVariants
    ? Object.fromEntries(product.variants.map((v) => [v.id, v.options[0]]))
    : {};

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, defaultVariants);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.id);
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.bestSeller && (
            <Badge className="bg-primary text-primary-foreground">Best Seller</Badge>
          )}
          {product.newArrival && (
            <Badge className="bg-accent text-accent-foreground">New</Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground">
              -{discount}%
            </Badge>
          )}
        </div>
        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background"
        >
          <Heart
            className={cn('h-4 w-4', inWishlist && 'fill-destructive text-destructive')}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.brand}
        </p>
        <h3 className="mt-1 line-clamp-2 font-heading text-base leading-snug text-foreground">
          {product.name}
        </h3>
        <div className="mt-2">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} showCount />
        </div>
        <div className="mt-3">
          <PriceDisplay
            price={product.price}
            previousPrice={product.previousPrice}
            size="md"
          />
        </div>
        <div className="mt-4 flex items-center gap-2 pt-0">
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <ShoppingBag className="h-4 w-4" />
            {product.stock === 0 ? 'Out of stock' : hasVariants ? 'Quick add' : 'Add to cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
