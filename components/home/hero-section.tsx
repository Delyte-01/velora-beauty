import Link from "next/link";
import { ProductImage } from "@/components/products/product-image";
import {
  container,
  btnGold,
  btnGhostLight,
} from "@/components/home/styles";

/* Height of the announcement bar + site header. Adjust if yours differ. */
const HERO_HEIGHT = "min-h-[calc(100svh-6.75rem)]";

const HERO_IMAGE =
  "https://images.pexels.com/photos/7881256/pexels-photo-7881256.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400";

const TRUST_ITEMS = [
  "Authentic products",
  "Nationwide delivery",
  "Secure checkout",
  "WhatsApp support",
];

export function HeroSection() {
  return (
    <section
      className={`relative isolate flex ${HERO_HEIGHT} flex-col overflow-hidden bg-primary text-primary-foreground`}
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-20">
        <ProductImage
          src={HERO_IMAGE}
          alt="Elegant beauty portrait"
          className="h-full w-full object-cover object-center"
        />
      </div>
      {/* Noir overlay for legibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary via-primary/70 to-primary/25 md:bg-gradient-to-r md:from-primary md:via-primary/75 md:to-primary/10" />

      {/* Content */}
      <div className={`${container} flex flex-1 items-center py-20 lg:py-28`}>
        <div className="flex max-w-2xl flex-col items-start gap-8">
          <p className="text-base tracking-[0.15em] text-accent">
            Your beauty, your signature.
          </p>
          <h1 className="font-heading text-5xl font-medium leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
            Discover your everyday luxury.
          </h1>
          <p className="max-w-md text-base leading-[1.8] text-primary-foreground/80 sm:text-lg">
            Hair, fragrance, skincare and beauty essentials, carefully selected
            and delivered with care across Nigeria.
          </p>
          <div className="flex w-full flex-col gap-4 pt-4 sm:w-auto sm:flex-row">
            <Link href="/shop" className={btnGold}>
              Shop collection
            </Link>
            <Link href="/services" className={btnGhostLight}>
              Beauty services
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-primary-foreground/15">
        <div
          className={`${container} grid grid-cols-2 gap-x-6 gap-y-3 py-6 text-xs tracking-[0.12em] text-primary-foreground/75 md:grid-cols-4 md:text-center`}
        >
          {TRUST_ITEMS.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
