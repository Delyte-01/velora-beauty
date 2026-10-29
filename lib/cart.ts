import type { CartItem } from '@/types';
import { siteConfig } from '@/config/site';

export function makeLineKey(
  productId: string,
  selectedVariants: Record<string, string>
): string {
  const variantPart = Object.keys(selectedVariants)
    .sort()
    .map((k) => `${k}:${selectedVariants[k]}`)
    .join('|');
  return `${productId}__${variantPart}`;
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function deliveryFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= siteConfig.freeDeliveryThreshold) return 0;
  return siteConfig.deliveryFee;
}

export function cartTotal(items: CartItem[]): number {
  return cartSubtotal(items) + deliveryFee(cartSubtotal(items));
}
