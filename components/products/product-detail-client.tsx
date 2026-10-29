'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ShoppingBag, Heart, Check, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { formatNGN } from '@/lib/format';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/products/star-rating';
import { PriceDisplay } from '@/components/products/price-display';
import { ProductGallery } from '@/components/products/product-gallery';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';
import { ProductGrid } from '@/components/products/product-grid';
import { productEnquiryMessage } from '@/lib/whatsapp';

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

export function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggle, has, isHydrated } = useWishlist();

  const initialVariants = useMemo(
    () =>
      Object.fromEntries(product.variants.map((v) => [v.id, v.options[0]])),
    [product.variants]
  );

  const [selectedVariants, setSelectedVariants] =
    useState<Record<string, string>>(initialVariants);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const inWishlist = isHydrated && has(product.id);
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  function setVariant(variantId: string, option: string) {
    setSelectedVariants((prev) => ({ ...prev, [variantId]: option }));
  }

  function handleAdd() {
    if (!inStock) return;
    if (quantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }
    if (quantity > product.stock) {
      setError(`Only ${product.stock} in stock.`);
      return;
    }
    setError('');
    addToCart(product, quantity, selectedVariants);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    if (!inStock) return;
    addToCart(product, quantity, selectedVariants);
    router.push('/cart');
  }

  const enquiryMsg = productEnquiryMessage(
    product.name,
    `${siteConfig.name} — ${product.name}`,
    selectedVariants,
    quantity
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <ProductGallery images={product.gallery} alt={product.name} />

        {/* Details */}
        <div className="flex flex-col">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            {product.brand}
          </p>
          <h1 className="mt-2 font-heading text-3xl leading-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-4">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} showCount size="md" />
            <Link
              href={`/categories/${product.categorySlug}`}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {product.category}
            </Link>
          </div>

          <div className="mt-5">
            <PriceDisplay
              price={product.price}
              previousPrice={product.previousPrice}
              size="lg"
            />
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Stock */}
          <div className="mt-5">
            {!inStock ? (
              <Badge variant="destructive">Out of stock</Badge>
            ) : lowStock ? (
              <Badge className="bg-accent text-accent-foreground">
                Only {product.stock} left in stock
              </Badge>
            ) : (
              <Badge className="bg-secondary text-secondary-foreground">
                In stock ({product.stock} available)
              </Badge>
            )}
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mt-6 space-y-4">
              {product.variants.map((variant) => (
                <div key={variant.id}>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground">
                    {variant.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setVariant(variant.id, opt)}
                        className={cn(
                          'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                          selectedVariants[variant.id] === opt
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-card text-foreground hover:bg-muted'
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-md border border-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                  className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">
                Max {product.stock} per order
              </span>
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handleAdd}
              disabled={!inStock}
              className="flex-1 gap-2"
              size="lg"
            >
              {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              {added ? 'Added to cart' : 'Add to cart'}
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={!inStock}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Buy now
            </Button>
            <button
              onClick={() => toggle(product.id)}
              aria-label="Toggle wishlist"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted"
            >
              <Heart className={cn('h-5 w-5', inWishlist && 'fill-destructive text-destructive')} />
            </button>
          </div>

          {/* WhatsApp */}
          <div className="mt-4">
            <WhatsAppButton message={enquiryMsg} label="Ask about this product" />
          </div>

          {/* Highlights */}
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Product Highlights
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" /> {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery info */}
          <div className="mt-6 space-y-3 border-t border-border pt-6">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Delivery</p>
                <p className="text-xs text-muted-foreground">
                  Estimated delivery {formatNGN(siteConfig.deliveryFee)}. Free on orders over{' '}
                  {formatNGN(siteConfig.freeDeliveryThreshold)}. Nationwide delivery in 2–5 days.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Quality assured</p>
                <p className="text-xs text-muted-foreground">Authentic products sourced from trusted suppliers.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Returns</p>
                <p className="text-xs text-muted-foreground">Returns accepted within 7 days for unused items in original packaging.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="mb-8 font-heading text-2xl text-foreground sm:text-3xl">You May Also Like</h2>
          <ProductGrid products={related} columns={4} />
        </section>
      )}
    </div>
  );
}
