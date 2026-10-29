import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { BestSellersSection } from "@/components/home/best-sellers-section";
import { GiftSetsSection } from "@/components/home/gift-sets-section";
import { NewArrivalsSection } from "@/components/home/new-arrivals-section";
import { ServicesSection } from "@/components/home/services-section";
import { WhyShopSection } from "@/components/home/why-shop-section";
import { NewsletterSection } from "@/components/home/newsletter-section";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <BestSellersSection />
      <GiftSetsSection />
      <NewArrivalsSection />
      <ServicesSection />
      <WhyShopSection />
      <NewsletterSection />
    </>
  );
}
