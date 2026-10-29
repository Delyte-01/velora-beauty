import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  columns?: 3 | 4;
  className?: string;
}

/* Full class names so Tailwind can detect them.
   Mobile: 2 columns. Tablet: 3. Desktop: 3 or 4. */
const COLUMN_CLASSES = {
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
} as const;

export function ProductGrid({
  products,
  columns = 4,
  className,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="border-y border-border py-20 text-center">
        <p className="font-heading text-2xl text-foreground">
          No products found
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your filters or check back soon.
        </p>
      </div>
    );
  }

  return (
    <ul
      role="list"
      className={cn(
        "grid gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-14 lg:gap-x-7",
        COLUMN_CLASSES[columns],
        className,
      )}
    >
      {products.map((product, index) => (
        <li key={product.id} className="min-w-0">
          {/* The first row loads eagerly so it appears without delay */}
          <ProductCard product={product} priority={index < columns} />
        </li>
      ))}
    </ul>
  );
}
