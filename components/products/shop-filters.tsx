'use client';

import { Search, X } from 'lucide-react';
import type { SortOption } from '@/lib/filter';
import { categories } from '@/data/categories';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface ShopFilterState {
  search: string;
  categorySlug: string | 'all';
  maxPrice: number | null;
  sort: SortOption;
}

interface ShopFiltersProps {
  value: ShopFilterState;
  onChange: (next: ShopFilterState) => void;
  resultCount: number;
}

export function ShopFilters({ value, onChange, resultCount }: ShopFiltersProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <label htmlFor="shop-search" className="sr-only">Search products</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="shop-search"
              type="search"
              placeholder="Search products, brands..."
              value={value.search}
              onChange={(e) => onChange({ ...value, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="w-full sm:w-48">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Category</label>
            <Select
              value={value.categorySlug}
              onValueChange={(v) => onChange({ ...value, categorySlug: v })}
            >
              <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-44">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Max price</label>
            <Select
              value={value.maxPrice?.toString() ?? 'any'}
              onValueChange={(v) => onChange({ ...value, maxPrice: v === 'any' ? null : Number(v) })}
            >
              <SelectTrigger><SelectValue placeholder="Any price" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any price</SelectItem>
                <SelectItem value="5000">Up to ₦5,000</SelectItem>
                <SelectItem value="10000">Up to ₦10,000</SelectItem>
                <SelectItem value="20000">Up to ₦20,000</SelectItem>
                <SelectItem value="50000">Up to ₦50,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Sort by</label>
            <Select
              value={value.sort}
              onValueChange={(v) => onChange({ ...value, sort: v as SortOption })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? 'product' : 'products'}
        </p>
        <button
          onClick={() => onChange({ search: '', categorySlug: 'all', maxPrice: null, sort: 'newest' })}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <X className="h-3 w-3" /> Clear filters
        </button>
      </div>
    </div>
  );
}
