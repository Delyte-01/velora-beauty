/* Shared class strings for the home page sections. */

export const container = "mx-auto w-full max-w-[90rem] px-6 sm:px-10 lg:px-16";

export const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const btnBase = `inline-flex items-center justify-center rounded-sm px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-500 ease-out motion-reduce:transition-none ${focus}`;

export const btnGold = `${btnBase} bg-accent text-accent-foreground hover:bg-accent/85 focus-visible:ring-offset-primary`;

export const btnNoir = `${btnBase} bg-primary text-primary-foreground hover:bg-primary/85 focus-visible:ring-offset-background`;

export const btnGhostLight = `${btnBase} border border-primary-foreground/40 text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground hover:text-primary focus-visible:ring-offset-primary`;

export const textLink =
  "group/link inline-flex w-fit items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-colors duration-500 hover:text-gold-text";
