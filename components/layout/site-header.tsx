'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Search, Heart, ShoppingBag, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { categories } from '@/data/categories';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count: cartCount, isHydrated: cartHydrated } = useCart();
  const { count: wishCount, isHydrated: wishHydrated } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="rounded-md p-2 text-foreground transition-colors hover:bg-muted"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 max-w-[85vw]">
              <SheetTitle className="font-heading text-xl tracking-wide">
                VELORA BEAUTY
              </SheetTitle>
              <nav className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted',
                        isActive(link.href) && 'text-primary'
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-6">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Categories
                </p>
                <nav className="mt-2 flex flex-col gap-1">
                  {categories.map((cat) => (
                    <SheetClose asChild key={cat.slug}>
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {cat.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-[0.15em] text-foreground sm:text-xl"
        >
          VELORA BEAUTY
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isActive(link.href) ? 'text-primary' : 'text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary">
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Browse by category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.slug} asChild>
                  <Link href={`/categories/${cat.slug}`}>{cat.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/shop"
            aria-label="Search products"
            className="rounded-md p-2 text-foreground transition-colors hover:bg-muted"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/wishlist"
            aria-label={`Wishlist with ${wishHydrated ? wishCount : 0} items`}
            className="relative rounded-md p-2 text-foreground transition-colors hover:bg-muted"
          >
            <Heart className="h-5 w-5" />
            {wishHydrated && wishCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {wishCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label={`Shopping bag with ${cartHydrated ? cartCount : 0} items`}
            className="relative rounded-md p-2 text-foreground transition-colors hover:bg-muted"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartHydrated && cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
