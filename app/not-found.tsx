import Link from 'next/link';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-heading text-7xl text-primary sm:text-8xl">404</p>
      <h1 className="mt-4 font-heading text-2xl text-foreground sm:text-3xl">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The page you are looking for does not exist or may have been moved. Let us help you
        get back on track.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Home className="h-4 w-4" /> Return home
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Browse shop <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
