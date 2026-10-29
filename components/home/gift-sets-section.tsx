import Link from "next/link";
import { ProductImage } from "@/components/products/product-image";
import { btnGold } from "@/components/home/styles";

const GIFT_IMAGE =
  "https://images.pexels.com/photos/32817141/pexels-photo-32817141.jpeg?auto=compress&cs=tinysrgb&h=650&w=940";

export function GiftSetsSection() {
  return (
    <section className="grid bg-primary text-primary-foreground lg:grid-cols-2">
      <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[44rem]">
        <div className="absolute inset-0">
          <ProductImage
            src={GIFT_IMAGE}
            alt="Luxury fragrance collection"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="flex items-center px-6 py-20 sm:px-12 lg:px-20 xl:px-28">
        <div className="flex max-w-lg flex-col items-start gap-7">
          <p className="text-base tracking-[0.15em] text-accent">
            Limited edition
          </p>
          <h2 className="font-heading text-4xl font-medium leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Gift sets and fragrance collections
          </h2>
          <span aria-hidden="true" className="block h-px w-14 bg-accent" />
          <p className="text-base leading-[1.8] text-primary-foreground/75">
            Signature scents and beauty essentials, gathered in packaging made
            to be given.
          </p>
          <Link href="/categories/fragrance" className={`${btnGold} mt-2`}>
            Shop gift sets
          </Link>
        </div>
      </div>
    </section>
  );
}
