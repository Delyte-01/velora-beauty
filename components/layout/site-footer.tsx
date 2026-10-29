import Link from 'next/link';
import { Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { categories } from '@/data/categories';
import { whatsappLink } from '@/lib/whatsapp';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-xl tracking-[0.15em]">VELORA BEAUTY</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <a
              href={whatsappLink(`Hello ${siteConfig.name}, I would like to make an enquiry.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/shop" className="transition-colors hover:text-primary">Shop All</Link></li>
              <li><Link href="/services" className="transition-colors hover:text-primary">Beauty Services</Link></li>
              <li><Link href="/booking" className="transition-colors hover:text-primary">Book Appointment</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-primary">Contact</Link></li>
              <li><Link href="/cart" className="transition-colors hover:text-primary">Shopping Cart</Link></li>
              <li><Link href="/wishlist" className="transition-colors hover:text-primary">Wishlist</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Categories
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="transition-colors hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>{siteConfig.address}</li>
              <li>{siteConfig.email}</li>
              <li>{siteConfig.phone}</li>
            </ul>
            <div className="mt-4 flex items-center gap-3">
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground transition-colors hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground transition-colors hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground transition-colors hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition-colors hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
