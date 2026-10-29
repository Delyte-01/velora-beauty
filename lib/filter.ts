import type { Product } from '@/types';

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'popularity';

export interface FilterOptions {
  search: string;
  categorySlug: string | 'all';
  maxPrice: number | null;
  sort: SortOption;
}

export function filterAndSortProducts(
  products: Product[],
  opts: FilterOptions
): Product[] {
  let result = [...products];

  if (opts.search.trim()) {
    const q = opts.search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (opts.categorySlug !== 'all') {
    result = result.filter((p) => p.categorySlug === opts.categorySlug);
  }

  if (opts.maxPrice !== null) {
    result = result.filter((p) => p.price <= (opts.maxPrice as number));
  }

  switch (opts.sort) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'popularity':
      result.sort((a, b) => b.popularity - a.popularity);
      break;
    case 'newest':
    default:
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
  }

  return result;
}
