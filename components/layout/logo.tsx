import "@fontsource/playfair-display/500-italic.css";
import { cn } from "@/lib/utils";

/* Cloudinary resizes and compresses on the fly: 120px square (sharp even on
   3x phone screens), cropped to fill, with automatic format and quality. */
const LOGO_SRC =
  "https://res.cloudinary.com/dk5mfu099/image/upload/w_120,h_120,c_fill,f_auto,q_auto/v1793270724/Ava_xgejm3.jpg";

/** The Velora logo image, shown as a circle. */
export function LogoMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt=""
      width={40}
      height={40}
      decoding="async"
      className={cn("rounded-full object-cover ring-1 ring-border", className)}
    />
  );
}

interface LogoProps {
  className?: string;
  /** Show the small "BEAUTY" line under the name */
  showTagline?: boolean;
}

/** Image + italic wordmark. Text inherits color, so it works on dark backgrounds too. */
export function Logo({ className, showTagline = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
      <span className="flex flex-col leading-none">
        <span
          className="text-[1.65rem] italic tracking-tight sm:text-[1.9rem]"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 500,
          }}
        >
          Velora
        </span>
        {showTagline && (
          <span className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.5em] opacity-60">
            Beauty
          </span>
        )}
      </span>
    </span>
  );
}
