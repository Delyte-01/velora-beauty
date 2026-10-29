import Link from 'next/link';
import { Sparkles, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';
import { ProductImage } from '@/components/products/product-image';
import { siteConfig } from '@/config/site';



export const metadata = { title: 'About Us' };

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-64 overflow-hidden bg-secondary sm:h-80">
        <ProductImage
          src="https://images.pexels.com/photos/6779609/pexels-photo-6779609.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600"
          alt="Beauty portrait"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl text-white sm:text-5xl">About {siteConfig.name}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Our Story</p>
        <h2 className="mt-3 font-heading text-2xl text-foreground sm:text-3xl text-balance">
          Premium beauty, curated for the modern Nigerian woman.
        </h2>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            {siteConfig.name} began with a simple belief: every woman deserves access to
            premium beauty products without compromise. From carefully sourced hair
            attachments and wigs to luxurious fragrances and effective skincare, we bring
            together the essentials that help you feel confident and look your best.
          </p>
          <p>
            We understand the Nigerian beauty landscape — the climate, the styles, the
            preferences, and the importance of quality you can trust. That is why every
            product in our collection is hand-selected for its performance, authenticity,
            and value.
          </p>
          <p>
            Beyond products, we offer personalised beauty services — from wig installation
            and makeup sessions to skincare consultations — so you can enjoy a complete
            beauty experience in one place.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Sparkles, title: 'Curated Quality', text: 'Every product is chosen for results and reliability — no fillers, no compromises.' },
              { icon: HeartHandshake, title: 'Customer First', text: 'We help you find the right products for your hair, skin, and beauty needs.' },
              { icon: ShieldCheck, title: 'Authentic & Trusted', text: 'Sourced from trusted suppliers so you can shop with confidence.' },
            ].map((v) => (
              <div key={v.title} className="rounded-lg border border-border bg-background p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-base text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-heading text-2xl text-foreground sm:text-3xl">
          Ready to explore our collection?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Browse our products or book a beauty service today.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Shop now <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-muted"
          >
            Book a service
          </Link>
        </div>
      </section>
    </>
  );
}
