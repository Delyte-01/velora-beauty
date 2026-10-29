'use client';

import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist-context';
import { useCart } from '@/lib/cart-context';
import { products } from '@/data/products';
import { ProductImage } from '@/components/products/product-image';
import { PriceDisplay } from '@/components/products/price-display';
import { StarRating } from '@/components/products/star-rating';

export function WishlistClient() {
  const { ids, remove, clear, isHydrated } = useWishlist();
  const { addToCart } = useCart();

  const saved = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (!isHydrated) {
    return <div className="mx-auto max-w-7xl px-4 py-20" />;
  }

  if (saved.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mt-6 font-heading text-2xl text-foreground">Your wishlist is empty</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Save the products you love by tapping the heart icon. They will appear here for
          easy access later.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">My Wishlist</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {saved.length} saved {saved.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <button
          onClick={clear}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
        >
          Clear all
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {saved.map((product) => {
          const defaultVariants = Object.fromEntries(
            product.variants.map((v) => [v.id, v.options[0]])
          );
          return (
            <div
              key={product.id}
              className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"
            >
              <Link
                href={`/products/${product.slug}`}
                className="relative aspect-[4/5] overflow-hidden bg-muted"
              >
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {product.brand}
                </p>
                <Link
                  href={`/products/${product.slug}`}
                  className="mt-1 line-clamp-2 font-heading text-sm leading-snug text-foreground hover:text-primary"
                >
                  {product.name}
                </Link>
                <div className="mt-2">
                  <StarRating rating={product.rating} reviewCount={product.reviewCount} showCount />
                </div>
                <div className="mt-2">
                  <PriceDisplay price={product.price} previousPrice={product.previousPrice} size="md" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => addToCart(product, 1, defaultVariants)}
                    disabled={product.stock === 0}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
                  </button>
                  <button
                    onClick={() => remove(product.id)}
                    aria-label="Remove from wishlist"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
