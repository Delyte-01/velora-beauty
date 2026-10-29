'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, PackageSearch } from 'lucide-react';
import { products } from '@/data/products';
import { filterAndSortProducts, type FilterOptions } from '@/lib/filter';
import { ProductGrid } from '@/components/products/product-grid';
import { ShopFilters, type ShopFilterState } from '@/components/products/shop-filters';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const defaultFilters: ShopFilterState = {
  search: '',
  categorySlug: 'all',
  maxPrice: null,
  sort: 'newest',
};

export function ShopClient() {
  const [filters, setFilters] = useState<ShopFilterState>(defaultFilters);

  const filtered = useMemo(
    () => filterAndSortProducts(products, filters as FilterOptions),
    [filters]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Shop</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Shop All Products</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Browse our full collection of hair, fragrance, skincare, makeup, and beauty
          accessories.
        </p>
      </div>

      <div className="mb-8 border-b border-border pb-6">
        <ShopFilters value={filters} onChange={setFilters} resultCount={filtered.length} />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <PackageSearch className="h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 font-heading text-xl text-foreground">No products found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
          <button
            onClick={() => setFilters(defaultFilters)}
            className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <ProductGrid products={filtered} columns={4} />
      )}
    </div>
  );
}
