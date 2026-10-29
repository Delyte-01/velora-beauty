import Link from "next/link";
import { categories } from "@/data/categories";
import { ProductImage } from "@/components/products/product-image";
import { focus } from "@/components/home/styles";

type Category = (typeof categories)[number];

interface CategoryTileProps {
  cat: Category;
  aspect: string;
}

export function CategoryTile({ cat, aspect }: CategoryTileProps) {
  return (
    <Link
      href={`/categories/${cat.slug}`}
      className={`group relative block overflow-hidden rounded-sm bg-muted ${aspect} ${focus} focus-visible:ring-offset-background`}
    >
      <ProductImage
        src={cat.image}
        alt={cat.name}
        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
        <h3 className="font-heading text-3xl font-medium text-primary-foreground sm:text-4xl">
          {cat.name}
        </h3>
        <span
          aria-hidden="true"
          className="mb-3 block h-px w-8 bg-accent transition-all duration-500 ease-out group-hover:w-14 motion-reduce:transition-none"
        />
      </div>
    </Link>
  );
}
