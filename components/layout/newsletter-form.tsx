'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-secondary px-4 py-3 text-sm text-secondary-foreground">
        <Check className="h-4 w-4 text-primary" />
        Thank you for subscribing to {siteConfig.name} updates.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        aria-label="Email address"
        className={cn(
          'h-11 flex-1 rounded-md border bg-background px-4 text-sm',
          error ? 'border-destructive' : 'border-input'
        )}
      />
      <button
        type="submit"
        className="h-11 rounded-md bg-primary px-6 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Subscribe
      </button>
    </form>
  );
}
