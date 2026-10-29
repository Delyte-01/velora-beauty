import { HeroSlider } from "@/components/home/hero-slider";
import { container } from "@/components/home/styles";

/* Height of the announcement bar + site header. Adjust if yours differ. */
const HERO_HEIGHT = "min-h-[calc(100svh-6.75rem)]";

const TRUST_ITEMS = [
  "Authentic products",
  "Nationwide delivery",
  "Secure checkout",
  "WhatsApp support",
];

export function HeroSection() {
  return (
    <section
      className={`relative flex ${HERO_HEIGHT} flex-col bg-primary text-primary-foreground`}
    >
      <h1 className="sr-only">Velora: your beauty, your signature</h1>

      <HeroSlider />

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
