import Link from "next/link";
import { services } from "@/data/services";
import { ProductImage } from "@/components/products/product-image";
import { formatNGN } from "@/lib/format";
import { focus } from "@/components/home/styles";

type Service = (typeof services)[number];

export function ServiceRow({ svc }: { svc: Service }) {
  return (
    <li className="border-b border-border">
      <Link
        href="/booking"
        className={`group flex items-center gap-5 py-6 transition-colors duration-500 hover:bg-card/60 sm:gap-8 sm:px-4 ${focus} focus-visible:ring-offset-secondary`}
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-muted sm:h-32 sm:w-32">
          <ProductImage
            src={svc.image}
            alt={svc.name}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] motion-reduce:transition-none"
          />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-sm tracking-[0.1em] text-gold-text">
            {svc.category}
          </span>
          <h3 className="mt-1 font-heading text-2xl font-medium text-foreground sm:text-3xl">
            {svc.name}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
            {svc.description}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-base font-medium text-foreground">
            {formatNGN(svc.price)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{svc.duration}</p>
        </div>
      </Link>
    </li>
  );
}
