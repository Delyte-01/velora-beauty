'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Calendar, Package, TrendingUp, Plus, Pencil, Trash2, X, Check, AlertCircle,
} from 'lucide-react';
import { products as initialProducts } from '@/data/products';
import type { Product, Order, Booking } from '@/types';
import { getOrders } from '@/lib/orders';
import { getBookings } from '@/lib/bookings';
import { getStorageItem, setStorageItem } from '@/lib/storage';
import { formatNGN } from '@/lib/format';
import { ProductImage } from '@/components/products/product-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { categories } from '@/data/categories';
import { cn } from '@/lib/utils';

const PRODUCTS_KEY = 'velora_admin_products';

export function AdminClient() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const saved = getStorageItem<Product[]>(PRODUCTS_KEY, []);
    if (saved.length > 0) setProductList(saved);
    setOrders(getOrders());
    setBookings(getBookings());
    setHydrated(true);
  }, []);

  function persistProducts(next: Product[]) {
    setProductList(next);
    setStorageItem(PRODUCTS_KEY, next);
  }

  const revenue = useMemo(
    () => orders.reduce((s, o) => s + o.total, 0),
    [orders]
  );

  function handleSave(product: Product) {
    const exists = productList.find((p) => p.id === product.id);
    const next = exists
      ? productList.map((p) => (p.id === product.id ? product : p))
      : [product, ...productList];
    persistProducts(next);
    setShowForm(false);
    setEditing(null);
  }

  function handleDelete(id: string) {
    persistProducts(productList.filter((p) => p.id !== id));
  }

  function startEdit(product: Product) {
    setEditing(product);
    setShowForm(true);
  }

  function startNew() {
    setEditing(null);
    setShowForm(true);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Demo Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">A preview of the future store management experience.</p>
        </div>
        <Badge className="bg-destructive text-destructive-foreground">
          <AlertCircle className="mr-1 h-3 w-3" /> DEMO MODE — LOCAL DATA ONLY
        </Badge>
      </div>

      {/* Notice */}
      <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
        This is a demonstration dashboard. No authentication, no security claims, and no real
        production data. Changes are stored only in this browser.
      </div>

      {/* Summary cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard icon={ShoppingBag} label="Demo Orders" value={orders.length.toString()} />
        <SummaryCard icon={TrendingUp} label="Demo Revenue" value={formatNGN(revenue)} />
        <SummaryCard icon={Package} label="Products" value={productList.length.toString()} />
        <SummaryCard icon={Calendar} label="Bookings" value={bookings.length.toString()} />
      </div>

      {/* Recent orders */}
      <section className="mt-10">
        <h2 className="font-heading text-xl text-foreground">Recent Demo Orders</h2>
        {orders.length === 0 ? (
          <p className="mt-3 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            No demo orders yet. Place an order through the checkout to see it here.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.slice(0, 8).map((o) => (
                  <tr key={o.reference} className="bg-card">
                    <td className="px-4 py-3 font-medium text-foreground">{o.reference}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.customer.fullName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.items.length}</td>
                    <td className="px-4 py-3 font-medium">{formatNGN(o.total)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString('en-NG')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent bookings */}
      <section className="mt-10">
        <h2 className="font-heading text-xl text-foreground">Recent Demo Bookings</h2>
        {bookings.length === 0 ? (
          <p className="mt-3 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            No demo bookings yet. Book an appointment to see it here.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.slice(0, 8).map((b) => (
                  <tr key={b.reference} className="bg-card">
                    <td className="px-4 py-3 font-medium text-foreground">{b.reference}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.serviceName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.customer.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.date}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.timeSlot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Product management */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl text-foreground">Products</h2>
          <Button onClick={startNew} className="gap-2" size="sm">
            <Plus className="h-4 w-4" /> Add product
          </Button>
        </div>

        {showForm && (
          <ProductForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        )}

        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {productList.map((p) => (
                <tr key={p.id} className="bg-card">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-8 shrink-0 overflow-hidden rounded border border-border bg-muted">
                        <ProductImage src={p.image} alt={p.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="line-clamp-1 font-medium text-foreground">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 font-medium">{formatNGN(p.price)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        aria-label="Edit product"
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        aria-label="Delete product"
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-10 text-center">
        <Link href="/" className="text-sm text-primary hover:underline">Back to store</Link>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-3 font-heading text-2xl text-foreground">{value}</p>
    </div>
  );
}

function ProductForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Product | null;
  onSave: (p: Product) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [stock, setStock] = useState(initial?.stock ?? 0);
  const [categorySlug, setCategorySlug] = useState(initial?.categorySlug ?? 'hair');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [image, setImage] = useState(initial?.image ?? '');
  const [brand, setBrand] = useState(initial?.brand ?? 'Velora');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const category = categories.find((c) => c.slug === categorySlug) ?? categories[0];
    const slug = (name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) || `product-${Date.now()}`;
    const product: Product = {
      id: initial?.id ?? `p-admin-${Date.now()}`,
      slug: initial?.slug ?? slug,
      name: name || 'Untitled product',
      description: description || 'No description provided.',
      price: Number(price) || 0,
      category: category.name,
      categorySlug: category.slug,
      image: image || 'https://images.pexels.com/photos/2537930/pexels-photo-2537930.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      gallery: [image || 'https://images.pexels.com/photos/2537930/pexels-photo-2537930.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
      brand: brand || 'Velora',
      stock: Number(stock) || 0,
      featured: initial?.featured ?? false,
      bestSeller: initial?.bestSeller ?? false,
      newArrival: initial?.newArrival ?? true,
      rating: initial?.rating ?? 4.5,
      reviewCount: initial?.reviewCount ?? 0,
      highlights: initial?.highlights ?? ['Demo product'],
      variants: initial?.variants ?? [],
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      popularity: initial?.popularity ?? 50,
    };
    onSave(product);
  }

  return (
    <form onSubmit={submit} className="mt-4 rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg text-foreground">
          {initial ? 'Edit product' : 'Add new product'}
        </h3>
        <button type="button" onClick={onCancel} aria-label="Close form" className="rounded-md p-2 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="pf-name">Name</Label>
          <Input id="pf-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" required />
        </div>
        <div>
          <Label htmlFor="pf-price">Price (NGN)</Label>
          <Input id="pf-price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1.5" required />
        </div>
        <div>
          <Label htmlFor="pf-stock">Stock</Label>
          <Input id="pf-stock" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="mt-1.5" required />
        </div>
        <div>
          <Label htmlFor="pf-brand">Brand</Label>
          <Input id="pf-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="pf-cat">Category</Label>
          <Select value={categorySlug} onValueChange={setCategorySlug}>
            <SelectTrigger id="pf-cat" className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="pf-image">Image URL</Label>
          <Input id="pf-image" value={image} onChange={(e) => setImage(e.target.value)} className="mt-1.5" placeholder="https://..." />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="pf-desc">Description</Label>
          <Textarea id="pf-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5" rows={3} />
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <Button type="submit" className="gap-2">
          <Check className="h-4 w-4" /> {initial ? 'Save changes' : 'Add product'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
