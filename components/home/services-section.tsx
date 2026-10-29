import Link from "next/link";
import { services } from "@/data/services";
import { ServiceRow } from "@/components/home/service-row";
import { container, btnNoir } from "@/components/home/styles";

export function ServicesSection() {
  return (
    <section className="border-y border-border bg-secondary">
      <div
        className={`${container} grid gap-16 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:py-36`}
      >
        {/* Intro */}
        <div className="flex flex-col items-start gap-6 lg:sticky lg:top-32 lg:self-start">
          <h2 className="font-heading text-4xl font-medium leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Beauty services
          </h2>
          <p className="max-w-sm text-base leading-[1.8] text-muted-foreground">
            Book an appointment with our beauty specialists, at a time that
            suits you.
          </p>
          <Link href="/booking" className={`${btnNoir} mt-4`}>
            Book an appointment
          </Link>
        </div>

        {/* Service rows */}
        <ul className="border-t border-border">
          {services.slice(0, 3).map((svc) => (
            <ServiceRow key={svc.id} svc={svc} />
          ))}
        </ul>
      </div>
    </section>
  );
}
