'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Package, Home, ArrowRight } from 'lucide-react';
import type { Order } from '@/types';
import { getOrderByReference } from '@/lib/orders';
import { formatNGN } from '@/lib/format';
import { ProductImage } from '@/components/products/product-image';

export function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  const [order, setOrder] = useState<Order | undefined | null>(null);

  useEffect(() => {
    if (ref) {
      setOrder(getOrderByReference(ref) ?? null);
    } else {
      setOrder(null);
    }
  }, [ref]);

  if (order === null) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="font-heading text-2xl text-foreground">Order not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We could not find an order with that reference. It may have been cleared.
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

  if (!order) return <div className="mx-auto max-w-2xl px-4 py-20" />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mt-5 font-heading text-3xl text-foreground">Order Confirmed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you, {order.customer.fullName.split(' ')[0]}. Your demo order has been created.
        </p>
        <div className="mt-4 rounded-md bg-secondary px-4 py-2 text-sm">
          Order reference: <span className="font-semibold text-foreground">{order.reference}</span>
        </div>
        <p className="mt-4 max-w-md text-xs text-muted-foreground">
          Demo order created successfully. No payment has been processed.
        </p>
      </div>

      {/* Items */}
      <div className="mt-10 rounded-lg border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 font-heading text-lg text-foreground">
          <Package className="h-5 w-5 text-primary" /> Ordered Items
        </h2>
        <div className="mt-4 space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                <ProductImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium text-foreground">{item.name}</p>
                {Object.entries(item.selectedVariants).length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">{formatNGN(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatNGN(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{order.deliveryFee === 0 ? 'Free' : formatNGN(order.deliveryFee)}</span></div>
          <div className="flex justify-between border-t border-border pt-2"><span className="font-semibold">Total</span><span className="font-heading text-lg">{formatNGN(order.total)}</span></div>
        </div>
      </div>

      {/* Delivery */}
      <div className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg text-foreground">Delivery Information</h2>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <p><span className="text-muted-foreground">Name:</span> {order.customer.fullName}</p>
          <p><span className="text-muted-foreground">Email:</span> {order.customer.email}</p>
          <p><span className="text-muted-foreground">Phone:</span> {order.customer.phone}</p>
          <p><span className="text-muted-foreground">Method:</span> {order.deliveryMethod}</p>
          <p className="sm:col-span-2"><span className="text-muted-foreground">Address:</span> {order.customer.address}, {order.customer.city}, {order.customer.state}</p>
          {order.customer.instructions && (
            <p className="sm:col-span-2"><span className="text-muted-foreground">Instructions:</span> {order.customer.instructions}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Continue shopping <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <Home className="h-4 w-4" /> Return home
        </Link>
      </div>
    </div>
  );
}
