"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, Heart, ShoppingBag, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

/* Desktop: left and right of the centered logo. Mobile: all in the menu. */
const leftLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
];
const rightLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
const mobileLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/* Nav link with a gold underline that draws in on hover and stays when active */
const navLink = (active: boolean) =>
  cn(
    "relative inline-flex items-center gap-1.5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-foreground transition-colors duration-300 hover:text-gold-text motion-reduce:transition-none",
    "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-accent after:transition-transform after:duration-500 after:ease-out motion-reduce:after:transition-none",
    active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
    focusRing,
  );

const iconButton = cn(
  "relative inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors duration-300 hover:bg-secondary hover:text-gold-text motion-reduce:transition-none",
  focusRing,
);

const countBadge =
  "absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-accent-foreground";

export function SiteHeader() {
  const pathname = usePathname();
  const { count: cartCount, isHydrated: cartHydrated } = useCart();
  const { count: wishCount, isHydrated: wishHydrated } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const cartItems = cartHydrated ? cartCount : 0;
  const wishItems = wishHydrated ? wishCount : 0;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-500 motion-reduce:transition-none",
        scrolled
          ? "border-border bg-background/95 shadow-[0_10px_30px_-20px_rgba(26,18,22,0.35)]"
          : "border-border/60 bg-background/85",
      )}
    >
      <div className="mx-auto grid h-[4.5rem] w-full max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-10 lg:px-16">
        {/* ------------------------------ Left ------------------------------ */}
        <div className="flex items-center">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className={cn(iconButton, "-ml-2 lg:hidden")}
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              data-lenis-prevent
              aria-describedby={undefined}
              className="flex w-[88vw] max-w-sm flex-col gap-0 overflow-y-auto border-r border-border bg-background p-0"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>

              <div className="border-b border-border px-6 py-6">
                <SheetClose asChild>
                  <Link
                    href="/"
                    aria-label="Velora Beauty, home"
                    className={cn("inline-block text-foreground", focusRing)}
                  >
                    <Logo />
                  </Link>
                </SheetClose>
              </div>

              <nav aria-label="Main" className="px-6 py-3">
                {mobileLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block border-b border-border/70 py-4 font-heading text-3xl text-foreground transition-colors duration-300 hover:text-gold-text",
                        isActive(link.href) && "text-gold-text",
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="px-6 py-6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Categories
                </p>
                <nav
                  aria-label="Categories"
                  className="mt-3 grid grid-cols-2 gap-x-4"
                >
                  {categories.map((cat) => (
                    <SheetClose asChild key={cat.slug}>
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="py-2.5 text-sm text-foreground/80 transition-colors duration-300 hover:text-gold-text"
                      >
                        {cat.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border px-6 py-5">
                <SheetClose asChild>
                  <Link
                    href="/wishlist"
                    className="flex items-center justify-center gap-2 rounded-sm border border-border py-3 text-xs font-medium uppercase tracking-[0.16em] text-foreground transition-colors duration-300 hover:border-primary"
                  >
                    <Heart className="h-4 w-4" strokeWidth={1.5} />
                    Wishlist{wishItems > 0 ? ` (${wishItems})` : ""}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/cart"
                    className="flex items-center justify-center gap-2 rounded-sm bg-primary py-3 text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground transition-colors duration-300 hover:bg-primary/85"
                  >
                    <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                    Bag{cartItems > 0 ? ` (${cartItems})` : ""}
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop nav (left) */}
          <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
            {leftLinks.slice(0, 1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={navLink(isActive(link.href))}
              >
                {link.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    navLink(pathname.startsWith("/categories")),
                    "data-[state=open]:text-gold-text [&[data-state=open]>svg]:rotate-180",
                  )}
                >
                  Categories
                  <ChevronDown
                    className="h-3.5 w-3.5 transition-transform duration-300 motion-reduce:transition-none"
                    strokeWidth={1.5}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={18}
                className="w-64 rounded-sm border-border bg-background p-2 shadow-xl"
              >
                <DropdownMenuLabel className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Browse by category
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat.slug}
                    asChild
                    className="cursor-pointer rounded-sm px-3 py-2.5 text-sm focus:bg-secondary focus:text-gold-text"
                  >
                    <Link href={`/categories/${cat.slug}`}>{cat.name}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-sm px-3 py-2.5 text-sm font-medium focus:bg-secondary focus:text-gold-text"
                >
                  <Link href="/shop">View all products</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {leftLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={navLink(isActive(link.href))}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ----------------------------- Center ----------------------------- */}
        <Link
          href="/"
          aria-label="Velora Beauty, home"
          className={cn("justify-self-center text-foreground", focusRing)}
        >
          <Logo />
        </Link>

        {/* ------------------------------ Right ----------------------------- */}
        <div className="flex items-center justify-end">
          <nav
            aria-label="Secondary"
            className="mr-6 hidden items-center gap-9 lg:flex"
          >
            {rightLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={navLink(isActive(link.href))}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/shop"
            aria-label="Search products"
            className={iconButton}
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </Link>

          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${wishItems} items`}
            className={cn(iconButton, "hidden sm:inline-flex")}
          >
            <Heart className="h-5 w-5" strokeWidth={1.5} />
            {wishItems > 0 && <span className={countBadge}>{wishItems}</span>}
          </Link>

          <Link
            href="/cart"
            aria-label={`Shopping bag, ${cartItems} items`}
            className={cn(iconButton, "-mr-2 sm:mr-0")}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {cartItems > 0 && <span className={countBadge}>{cartItems}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
