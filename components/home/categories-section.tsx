import { categories } from "@/data/categories";
import { SectionHeader } from "@/components/home/section-header";
import { CategoryTile } from "@/components/home/category-tile";
import { container } from "@/components/home/styles";

export function CategoriesSection() {
  const featured = categories.slice(0, 3);
  const rest = categories.slice(3);

  return (
    <section className={`${container} py-24 lg:py-36`}>
      <SectionHeader
        title="Shop by category"
        subtitle="Explore our curated beauty collections."
        href="/shop"
        linkLabel="Shop all"
      />

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {featured.map((cat) => (
          <CategoryTile key={cat.slug} cat={cat} aspect="aspect-[4/5]" />
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-8">
          {rest.map((cat) => (
            <CategoryTile key={cat.slug} cat={cat} aspect="aspect-[4/3]" />
          ))}
        </div>
      )}
    </section>
  );
}
