import { NewsletterForm } from "@/components/layout/newsletter-form";
import { container } from "@/components/home/styles";

export function NewsletterSection() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div
        className={`${container} grid items-center gap-12 py-24 lg:grid-cols-2 lg:gap-24 lg:py-32`}
      >
        <div className="max-w-lg">
          <h2 className="font-heading text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Join the Velora Circle
          </h2>
          <span aria-hidden="true" className="mt-6 block h-px w-14 bg-accent" />
          <p className="mt-6 text-base leading-[1.8] text-primary-foreground/75">
            New arrivals, exclusive offers and beauty tips, sent to your inbox.
          </p>
        </div>
        <div className="w-full max-w-xl lg:justify-self-end">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
