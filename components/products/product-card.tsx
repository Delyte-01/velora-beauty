"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { cn } from "@/lib/utils";
import { StarRating } from "./star-rating";
import { PriceDisplay } from "./price-display";
import { ProductImage } from "./product-image";

interface ProductCardProps {
  product: Product;
  /** Load the image immediately (use for above-the-fold cards) */
  priority?: boolean;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const badgeBase =
  "inline-flex items-center rounded-sm px-2 py-1 text-[10px] font-medium uppercase leading-none tracking-[0.14em]";

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggle, has, isHydrated } = useWishlist();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const inWishlist = isHydrated && has(product.id);
  const href = `/products/${product.slug}`;
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const discount =
    product.previousPrice && product.previousPrice > product.price
      ? Math.round(
          ((product.previousPrice - product.price) / product.previousPrice) *
            100,
        )
      : 0;

  const hasVariants = product.variants.length > 0;
  const defaultVariants: Record<string, string> = hasVariants
    ? Object.fromEntries(product.variants.map((v) => [v.id, v.options[0]]))
    : {};

  /* At most two badges, in order of importance */
  const badges: { label: string; className: string }[] = [];
  if (outOfStock) {
    badges.push({
      label: "Sold out",
      className: "bg-background text-foreground",
    });
  } else {
    if (discount > 0) {
      badges.push({
        label: `-${discount}%`,
        className: "bg-destructive text-destructive-foreground",
      });
    }
    if (product.bestSeller) {
      badges.push({
        label: "Best seller",
        className: "bg-primary text-primary-foreground",
      });
    } else if (product.newArrival) {
      badges.push({
        label: "New",
        className: "bg-accent text-accent-foreground",
      });
    }
  }

  function handleAdd() {
    addToCart(product, 1, defaultVariants);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  }

  const addLabel = added ? "Added" : hasVariants ? "Quick add" : "Add to cart";

  return (
    <article className="group relative flex h-full flex-col">
      {/* Image area */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="block h-full w-full"
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            priority={priority}
            className={cn(
              "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none",
              outOfStock && "opacity-60",
            )}
          />
        </Link>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {badges.map((badge) => (
              <span
                key={badge.label}
                className={cn(badgeBase, badge.className)}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-label={
            inWishlist
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={inWishlist}
          className={cn(
            "absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur-sm transition-colors duration-300 hover:bg-background hover:text-destructive motion-reduce:transition-none",
            focusRing,
          )}
        >
          <Heart
            className={cn(
              "h-[18px] w-[18px]",
              inWishlist && "fill-destructive text-destructive",
            )}
            strokeWidth={1.5}
          />
        </button>

        {!outOfStock && (
          <>
            {/* Mobile and tablet: round add button, always visible */}
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`${addLabel}: ${product.name}`}
              className={cn(
                "absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/95 text-foreground backdrop-blur-sm transition-colors duration-300 hover:bg-primary hover:text-primary-foreground lg:hidden motion-reduce:transition-none",
                focusRing,
              )}
            >
              {added ? (
                <Check className="h-[18px] w-[18px]" strokeWidth={1.75} />
              ) : (
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
              )}
            </button>

            {/* Desktop: bar that slides up on hover or keyboard focus */}
            <button
              type="button"
              onClick={handleAdd}
              className={cn(
                "absolute inset-x-3 bottom-3 z-10 hidden h-11 translate-y-[130%] items-center justify-center gap-2 rounded-sm bg-background/95 text-xs font-medium uppercase tracking-[0.18em] text-foreground opacity-0 backdrop-blur-sm transition-all duration-500 ease-out hover:bg-primary hover:text-primary-foreground group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 lg:flex motion-reduce:transition-none",
                focusRing,
              )}
            >
              {added ? (
                <Check className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              )}
              {addLabel}
            </button>
          </>
        )}
      </div>

      {/* Details */}
      <div className="mt-4 flex flex-1 flex-col gap-1.5 sm:mt-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {product.brand}
        </p>

        <h3 className="min-h-[2.75em] font-heading text-base leading-snug text-foreground sm:text-lg">
          <Link
            href={href}
            className={cn(
              "line-clamp-2 transition-colors duration-300 hover:text-gold-text motion-reduce:transition-none",
              focusRing,
            )}
          >
            {product.name}
          </Link>
        </h3>

        {product.reviewCount > 0 && (
          <StarRating
            variant="compact"
            rating={product.rating}
            reviewCount={product.reviewCount}
            showCount
          />
        )}

        <div className="mt-auto pt-2">
          <PriceDisplay
            price={product.price}
            previousPrice={product.previousPrice}
            size="md"
          />
          {lowStock && (
            <p className="mt-1.5 text-xs text-gold-text">
              Only {product.stock} left
            </p>
          )}
        </div>
      </div>

      {/* Screen reader confirmation */}
      <span className="sr-only" role="status" aria-live="polite">
        {added ? `${product.name} added to cart` : ""}
      </span>
    </article>
  );
}
