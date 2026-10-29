"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

/**
 * Access the Lenis instance anywhere inside <SmoothScroll>.
 * Returns null on the server, on first render, and when the visitor
 * prefers reduced motion (smooth scrolling is disabled in that case).
 *
 * Example:
 *   const lenis = useLenis();
 *   lenis?.scrollTo("#section", { offset: -80 });
 */
export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  /* Create Lenis once and drive it from GSAP's ticker so that
     ScrollTrigger animations and smooth scrolling stay in sync. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const instance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  /* Jump to the top on route change (Next.js App Router). */
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    ScrollTrigger.refresh();
  }, [pathname, lenis]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
