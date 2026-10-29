import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { services } from '@/data/services';
import { formatNGN } from '@/lib/format';
import { ProductImage } from '@/components/products/product-image';



export const metadata = { title: 'Beauty Services' };

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Beauty Services</p>
        <h1 className="mt-3 font-heading text-3xl text-foreground sm:text-4xl">
          Appointments With Our Specialists
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
          From wig installation to bridal beauty, our specialists are here to help you
          look and feel your best. These are sample services — a real store can customise
          them easily.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md"
          >
            <div className="relative aspect-[3/2] overflow-hidden bg-muted">
              <ProductImage
                src={svc.image}
                alt={svc.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute left-3 top-3">
                <span className="rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {svc.category}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h2 className="font-heading text-lg text-foreground">{svc.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{svc.description}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4" /> {svc.duration}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="font-heading text-lg text-foreground">{formatNGN(svc.price)}</span>
                <Link
                  href={`/booking?service=${svc.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Book now <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-secondary p-6 text-center sm:p-8">
        <h2 className="font-heading text-xl text-foreground sm:text-2xl">Not sure which service you need?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Reach out on WhatsApp and our team will help you choose the right appointment.
        </p>
        <Link
          href="/booking"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Book an appointment <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
