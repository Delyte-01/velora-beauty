import { getNewArrivals } from "@/data/products";
import { ProductGrid } from "@/components/products/product-grid";
import { SectionHeader } from "@/components/home/section-header";
import { container } from "@/components/home/styles";

export function NewArrivalsSection() {
  const newArrivals = getNewArrivals().slice(0, 4);

  return (
    <section className={`${container} py-24 lg:py-36`}>
      <SectionHeader
        title="New arrivals"
        subtitle="Fresh in store this season."
        href="/shop"
      />
      <div className="mt-16">
        <ProductGrid products={newArrivals} columns={4} />
      </div>
    </section>
  );
}
