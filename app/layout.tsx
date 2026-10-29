import type { Metadata } from "next";
import { Jost, Marcellus } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { siteConfig } from "@/config/site";
import "@fontsource-variable/jost";
import "@fontsource/marcellus";
import "./globals.css";
import { SmoothScroll } from "@/components/lenis";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const heading = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Your Beauty, Your Signature`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jost.variable} ${heading.variable}`}>
      <body className="font-body bg-background text-foreground antialiased">
        <SmoothScroll>
          <CartProvider>
            <WishlistProvider>
              <div className="flex min-h-screen flex-col">
                <AnnouncementBar />
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
              <WhatsAppFloat />
            </WishlistProvider>
          </CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
