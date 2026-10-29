'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Check } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { cartSubtotal, deliveryFee, cartTotal } from '@/lib/cart';
import { formatNGN } from '@/lib/format';
import { siteConfig } from '@/config/site';
import { validateCheckout, type CheckoutForm, type CheckoutErrors } from '@/lib/validation';
import { saveOrder, generateOrderReference } from '@/lib/orders';
import type { Order } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductImage } from '@/components/products/product-image';

const emptyForm: CheckoutForm = {
  fullName: '',
  email: '',
  phone: '',
  state: '',
  city: '',
  address: '',
  instructions: '',
  deliveryMethod: 'Standard',
};

export function CheckoutClient() {
  const router = useRouter();
  const { items, clearCart, isHydrated } = useCart();
  const [form, setForm] = useState<CheckoutForm>(emptyForm);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartSubtotal(items);
  const delivery = deliveryFee(subtotal);
  const total = cartTotal(items);

  if (isHydrated && items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="font-heading text-2xl text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add items to your cart before checking out.
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

  function update<K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateCheckout(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const order: Order = {
      reference: generateOrderReference(),
      createdAt: new Date().toISOString(),
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        selectedVariants: i.selectedVariants,
      })),
      customer: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        state: form.state,
        city: form.city,
        address: form.address,
        instructions: form.instructions || undefined,
      },
      deliveryMethod: form.deliveryMethod,
      subtotal,
      deliveryFee: delivery,
      total,
      status: 'Demo — Pending',
    };

    saveOrder(order);
    clearCart();
    router.push(`/order-confirmation?ref=${order.reference}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Checkout</h1>
      <div className="mt-4 flex items-center gap-2 rounded-md bg-secondary px-4 py-3 text-xs text-secondary-foreground">
        <Lock className="h-4 w-4 text-primary" />
        This is a demonstration checkout. No payment is processed and no real order is sent.
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-6 lg:col-span-2">
          <fieldset className="rounded-lg border border-border bg-card p-6">
            <legend className="px-2 font-heading text-lg text-foreground">Contact & Delivery</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full name *</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  className="mt-1.5"
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="mt-1.5"
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0803 123 4567"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className="mt-1.5"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Select value={form.state} onValueChange={(v) => update('state', v)}>
                  <SelectTrigger id="state" className="mt-1.5"><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {siteConfig.states.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="mt-1 text-xs text-destructive">{errors.state}</p>}
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  className="mt-1.5"
                  aria-invalid={!!errors.city}
                />
                {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Street address *</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  className="mt-1.5"
                  aria-invalid={!!errors.address}
                />
                {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="instructions">Delivery instructions (optional)</Label>
                <Textarea
                  id="instructions"
                  value={form.instructions}
                  onChange={(e) => update('instructions', e.target.value)}
                  className="mt-1.5"
                  rows={3}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="delivery">Delivery method</Label>
                <Select
                  value={form.deliveryMethod}
                  onValueChange={(v) => update('deliveryMethod', v)}
                >
                  <SelectTrigger id="delivery" className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard (2–5 days)</SelectItem>
                    <SelectItem value="Express">Express (1–2 days)</SelectItem>
                    <SelectItem value="Pickup">Store pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="font-heading text-lg text-foreground">Order Summary</h2>
            <div className="mt-4 max-h-72 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <div key={item.lineKey} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                    <ProductImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="line-clamp-2 leading-snug text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-xs font-medium">{formatNGN(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatNGN(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>{delivery === 0 ? 'Free' : formatNGN(delivery)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-semibold">Total</span>
                <span className="font-heading text-lg">{formatNGN(total)}</span>
              </div>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full gap-2"
              size="lg"
            >
              {submitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Place demo order
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              No payment will be taken. For your privacy, no card details are collected.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
