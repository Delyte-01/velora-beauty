import type { Product } from '@/types';
import { ProductCard } from './product-card';

interface ProductGridProps {
  products: Product[];
  columns?: 3 | 4;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const colsClass =
    columns === 4
      ? 'grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-2 lg:grid-cols-3';
  return (
    <div className={`grid ${colsClass} gap-4 sm:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
