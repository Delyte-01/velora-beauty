import { getBestSellers } from "@/data/products";
import { ProductGrid } from "@/components/products/product-grid";
import { SectionHeader } from "@/components/home/section-header";
import { container } from "@/components/home/styles";

export function BestSellersSection() {
  const bestSellers = getBestSellers().slice(0, 8);

  return (
    <section className="border-y border-border bg-card">
      <div className={`${container} py-24 lg:py-36`}>
        <SectionHeader
          title="Best sellers"
          subtitle="The pieces our customers return for."
          href="/shop"
        />
        <div className="mt-16">
          <ProductGrid products={bestSellers} columns={4} />
        </div>
      </div>
    </section>
  );
}
