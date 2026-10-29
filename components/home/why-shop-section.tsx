import { Sparkles, Truck, HeartHandshake, CalendarCheck } from "lucide-react";
import { container } from "@/components/home/styles";

const REASONS = [
  {
    icon: Sparkles,
    title: "Carefully selected",
    text: "Every product is chosen for its quality and results.",
  },
  {
    icon: Truck,
    title: "Convenient ordering",
    text: "Browse and order from the comfort of your home.",
  },
  {
    icon: HeartHandshake,
    title: "Personal assistance",
    text: "We help you find the right products for your needs.",
  },
  {
    icon: CalendarCheck,
    title: "Easy booking",
    text: "Book beauty services at a time that suits you.",
  },
];

export function WhyShopSection() {
  return (
    <section className={`${container} py-24 lg:py-36`}>
      <h2 className="mx-auto max-w-2xl text-center font-heading text-4xl font-medium leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        Why shop with us
      </h2>
      <div className="mt-16 grid gap-y-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
        {REASONS.map((item, i) => (
          <div
            key={item.title}
            className={`flex flex-col items-center px-8 text-center ${
              i > 0 ? "lg:border-l lg:border-border" : ""
            }`}
          >
            <item.icon
              className="h-7 w-7 text-gold-text"
              strokeWidth={1.1}
              aria-hidden="true"
            />
            <h3 className="mt-6 font-heading text-2xl font-medium text-foreground">
              {item.title}
            </h3>
            <p className="mt-3 max-w-[17rem] text-sm leading-[1.8] text-muted-foreground">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
