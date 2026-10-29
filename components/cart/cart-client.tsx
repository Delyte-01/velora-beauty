'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { cartSubtotal, deliveryFee, cartTotal } from '@/lib/cart';
import { formatNGN } from '@/lib/format';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/components/products/product-image';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';
import { cartOrderMessage } from '@/lib/whatsapp';

export function CartClient() {
  const { items, updateQuantity, removeItem, clearCart, isHydrated } = useCart();
  const { toggle } = useWishlist();

  if (!isHydrated) {
    return <div className="mx-auto max-w-7xl px-4 py-20" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mt-6 font-heading text-2xl text-foreground">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Looks like you have not added anything yet. Explore our collection and find
          your beauty essentials.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Continue shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);
  const delivery = deliveryFee(subtotal);
  const total = cartTotal(items);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Shopping Cart</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-border rounded-lg border border-border">
            {items.map((item) => (
              <div key={item.lineKey} className="flex gap-4 p-4 sm:p-5">
                <Link
                  href={`/products/${item.slug}`}
                  className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted sm:w-24"
                >
                  <ProductImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-heading text-sm leading-snug text-foreground hover:text-primary sm:text-base"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">{item.category}</p>
                      {Object.entries(item.selectedVariants).length > 0 && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {Object.entries(item.selectedVariants)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' · ')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.lineKey)}
                      aria-label="Remove item"
                      className="text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-md border border-border">
                      <button
                        onClick={() => updateQuantity(item.lineKey, item.quantity - 1)}
                        aria-label="Decrease"
                        className="flex h-8 w-8 items-center justify-center text-foreground transition-colors hover:bg-muted"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.lineKey, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        aria-label="Increase"
                        className="flex h-8 w-8 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatNGN(item.price * item.quantity)}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatNGN(item.price)} each</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      toggle(item.productId);
                      removeItem(item.lineKey);
                    }}
                    className="mt-2 self-start text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    Move to wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <Link
              href="/shop"
              className="text-sm font-medium text-primary hover:underline"
            >
              Continue shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
            >
              Clear cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-heading text-lg text-foreground">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatNGN(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated delivery</span>
                <span className="font-medium">
                  {delivery === 0 ? 'Free' : formatNGN(delivery)}
                </span>
              </div>
              {delivery === 0 && subtotal > 0 && (
                <p className="text-xs text-primary">
                  You qualified for free delivery!
                </p>
              )}
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-heading text-xl text-foreground">{formatNGN(total)}</span>
                </div>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Proceed to checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-3">
              <WhatsAppButton
                message={cartOrderMessage(items, subtotal, delivery, total)}
                label="Order via WhatsApp"
                className="w-full"
              />
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Delivery fee is an estimate for {siteConfig.deliveryFee}. Final fee may vary by location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
