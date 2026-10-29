"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { ProductImage } from "@/components/products/product-image";
import { gsap, useGSAP } from "@/lib/gsap";
import { heroSlides } from "@/components/home/hero-slide";
import {
  container,
  focus,
  btnGold,
  btnGhostLight,
} from "@/components/home/styles";

const AUTOPLAY_MS = 2500;
const COUNT = heroSlides.length;

const controlBtn = `inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground transition-all duration-500 ease-out hover:border-accent hover:bg-accent hover:text-accent-foreground motion-reduce:transition-none ${focus} focus-visible:ring-offset-primary`;

export function HeroSlider() {
  const rootRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const currentRef = useRef(0);
  const busyRef = useRef(false);
  const playingRef = useRef(true);
  const hoverRef = useRef(false);
  const reducedRef = useRef(false);
  const progressRef = useRef<gsap.core.Tween | null>(null);
  const goToRef = useRef<(next: number, dir: 1 | -1) => void>(() => {});
  const swipeStartX = useRef<number | null>(null);

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  /* Pause/resume the autoplay timer depending on hover, tab visibility
     and the pause button. */
  const applyPlayState = () => {
    const tween = progressRef.current;
    if (!tween) return;
    const shouldPlay =
      playingRef.current && !hoverRef.current && !document.hidden;
    if (shouldPlay) tween.resume();
    else tween.pause();
  };

  const { contextSafe } = useGSAP(
    () => {
      reducedRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      /* Reduced motion: no intro, no autoplay. Manual controls still work. */
      if (reducedRef.current) {
        playingRef.current = false;
        setPlaying(false);
        return;
      }

      const first = slideRefs.current[0];
      const root = rootRef.current;
      if (!first || !root) return;

      const media = first.querySelector("[data-media]");
      const lines = first.querySelectorAll("[data-line]");
      const fades = first.querySelectorAll("[data-fade]");
      const controls = root.querySelectorAll("[data-controls]");

      gsap.set(first, { zIndex: 2 });

      gsap
        .timeline({ delay: 0.1, onComplete: () => startProgress(0) })
        .fromTo(
          media,
          { scale: 1.35 },
          { scale: 1.12, duration: 2.2, ease: "luxeOut" },
          0,
        )
        .from(
          lines,
          { yPercent: 115, duration: 1.3, ease: "luxeOut", stagger: 0.1 },
          0.2,
        )
        .from(
          fades,
          {
            autoAlpha: 0,
            y: 28,
            duration: 1,
            ease: "luxeOut",
            stagger: 0.09,
          },
          0.45,
        )
        .from(
          controls,
          { autoAlpha: 0, y: 16, duration: 0.9, ease: "luxeOut" },
          0.9,
        );
    },
    { scope: rootRef },
  );

  /* Fills the active indicator bar; when it completes, go to the next slide. */
  const startProgress = contextSafe((index: number) => {
    progressRef.current?.kill();
    progressRef.current = null;
    barRefs.current.forEach((bar) => bar && gsap.set(bar, { scaleX: 0 }));

    const bar = barRefs.current[index];
    if (!bar || !playingRef.current) return;

    progressRef.current = gsap.to(bar, {
      scaleX: 1,
      duration: AUTOPLAY_MS / 1000,
      ease: "none",
      paused: hoverRef.current || document.hidden,
      onComplete: () => goToRef.current((index + 1) % COUNT, 1),
    });
  });

  /* The slide transition: a clip-path wipe, parallax on both images and
     masked line reveals on the text. */
  const goTo = contextSafe((next: number, dir: 1 | -1) => {
    const fromIndex = currentRef.current;
    if (busyRef.current || next === fromIndex) return;

    const from = slideRefs.current[fromIndex];
    const to = slideRefs.current[next];
    if (!from || !to) return;

    busyRef.current = true;
    progressRef.current?.kill();
    progressRef.current = null;
    barRefs.current.forEach((bar) => bar && gsap.set(bar, { scaleX: 0 }));
    setActive(next);

    const fromMedia = from.querySelector("[data-media]");
    const toMedia = to.querySelector("[data-media]");
    const fromLines = from.querySelectorAll("[data-line]");
    const toLines = to.querySelectorAll("[data-line]");
    const fromFades = from.querySelectorAll("[data-fade]");
    const toFades = to.querySelectorAll("[data-fade]");

    gsap.set(from, { zIndex: 1 });
    gsap.set(to, {
      zIndex: 2,
      visibility: "visible",
      clipPath: dir === 1 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
    });
    gsap.set(toMedia, { xPercent: dir * 8, scale: 1.32 });
    gsap.set(toLines, { yPercent: 115 });
    gsap.set(toFades, { autoAlpha: 0, y: 28 });

    const tl = gsap.timeline({
      defaults: { ease: "luxe" },
      onComplete: () => {
        gsap.set(from, { visibility: "hidden" });
        currentRef.current = next;
        busyRef.current = false;
        startProgress(next);
      },
    });

    tl
      /* New slide wipes in; both images drift for depth */
      .to(to, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 }, 0)
      .to(
        toMedia,
        { xPercent: 0, scale: 1.12, duration: 1.9, ease: "luxeOut" },
        0,
      )
      .to(fromMedia, { xPercent: -dir * 8, duration: 1.4 }, 0)
      /* Old text leaves upward, new text rises in behind the wipe */
      .to(
        fromLines,
        { yPercent: -115, duration: 0.7, ease: "luxeIn", stagger: 0.05 },
        0,
      )
      .to(
        fromFades,
        {
          autoAlpha: 0,
          y: -20,
          duration: 0.5,
          ease: "power2.in",
          stagger: 0.04,
        },
        0,
      )
      .to(
        toLines,
        { yPercent: 0, duration: 1.2, ease: "luxeOut", stagger: 0.09 },
        0.55,
      )
      .to(
        toFades,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "luxeOut",
          stagger: 0.09,
        },
        0.7,
      );

    if (reducedRef.current) tl.progress(1);
  });

  goToRef.current = goTo;

  const goNext = () => goTo((currentRef.current + 1) % COUNT, 1);
  const goPrev = () => goTo((currentRef.current - 1 + COUNT) % COUNT, -1);
  const goToIndex = (i: number) => goTo(i, i > currentRef.current ? 1 : -1);

  const togglePlay = () => {
    const next = !playingRef.current;
    playingRef.current = next;
    setPlaying(next);
    if (!next) {
      progressRef.current?.pause();
    } else if (progressRef.current) {
      applyPlayState();
    } else {
      startProgress(currentRef.current);
    }
  };

  /* Pause while the browser tab is hidden */
  useEffect(() => {
    const onVisibility = () => applyPlayState();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative isolate min-h-[34rem] flex-1 overflow-hidden bg-primary text-primary-foreground"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goNext();
        if (e.key === "ArrowLeft") goPrev();
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") {
          hoverRef.current = true;
          applyPlayState();
        }
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") {
          hoverRef.current = false;
          applyPlayState();
        }
      }}
    >
      {/* Slides (swipeable) */}
      <div
        className="absolute inset-0 touch-pan-y"
        onPointerDown={(e) => {
          swipeStartX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (swipeStartX.current === null) return;
          const dx = e.clientX - swipeStartX.current;
          swipeStartX.current = null;
          if (dx < -60) goNext();
          if (dx > 60) goPrev();
        }}
        onPointerCancel={() => {
          swipeStartX.current = null;
        }}
      >
        {heroSlides.map((slide, i) => {
          const isActive = i === active;
          return (
            <div
              key={slide.id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${COUNT}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 ${i === 0 ? "" : "invisible"}`}
            >
              {/* Image */}
              <div
                data-media
                className="absolute inset-0 will-change-transform"
              >
                {slide.image ? (
                  <ProductImage
                    src={slide.image}
                    alt={slide.alt}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-primary via-accent/20 to-primary" />
                )}
              </div>

              {/* Noir overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/65 to-primary/20 md:bg-gradient-to-r md:from-primary md:via-primary/70 md:to-primary/5" />

              {/* Content */}
              <div
                className={`${container} relative flex h-full items-center pb-36 pt-16 lg:pb-40`}
              >
                <div className="flex max-w-2xl flex-col items-start gap-7">
                  <p
                    data-fade
                    className="text-base tracking-[0.15em] text-accent"
                  >
                    {slide.eyebrow}
                  </p>

                  <h2 className="font-heading text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
                    {slide.title.map((line) => (
                      <span
                        key={line}
                        className="-mb-[0.12em] block overflow-hidden pb-[0.12em]"
                      >
                        <span data-line className="block will-change-transform">
                          {line}
                        </span>
                      </span>
                    ))}
                  </h2>

                  <p
                    data-fade
                    className="max-w-md text-base leading-[1.8] text-primary-foreground/80 sm:text-lg"
                  >
                    {slide.text}
                  </p>

                  <div
                    data-fade
                    className="flex w-full flex-col gap-4 pt-3 sm:w-auto sm:flex-row"
                  >
                    <Link
                      href={slide.cta.href}
                      tabIndex={isActive ? 0 : -1}
                      className={btnGold}
                    >
                      {slide.cta.label}
                    </Link>
                    <Link
                      href="/shop"
                      tabIndex={isActive ? 0 : -1}
                      className={btnGhostLight}
                    >
                      Shop everything
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div data-controls className="absolute inset-x-0 bottom-0 z-20">
        <div
          className={`${container} flex items-end justify-between gap-6 pb-8 lg:pb-10`}
        >
          {/* Indicators with autoplay progress */}
          <div className="flex gap-4 sm:gap-8">
            {heroSlides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToIndex(i)}
                aria-label={`Go to slide ${i + 1}: ${slide.label}`}
                aria-current={i === active}
                className={`group flex w-20 flex-col gap-3 text-left sm:w-32 ${focus} focus-visible:ring-offset-primary`}
              >
                <span
                  className={`text-xs tracking-[0.16em] transition-colors duration-500 motion-reduce:transition-none ${
                    i === active
                      ? "text-primary-foreground"
                      : "text-primary-foreground/50 group-hover:text-primary-foreground/80"
                  }`}
                >
                  {`0${i + 1}`}
                  <span className="hidden sm:inline">{` ${slide.label}`}</span>
                </span>
                <span className="relative block h-0.5 w-full bg-primary-foreground/25">
                  <span
                    ref={(el) => {
                      barRefs.current[i] = el;
                    }}
                    className="absolute inset-0 origin-left bg-accent"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
              </button>
            ))}
          </div>

          {/* Pause / previous / next */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className={`${controlBtn} hidden sm:inline-flex`}
            >
              {playing ? (
                <Pause className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Play className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous slide"
              className={controlBtn}
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next slide"
              className={controlBtn}
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live={playing ? "off" : "polite"}>
        {`Slide ${active + 1} of ${COUNT}: ${heroSlides[active].label}`}
      </div>
    </div>
  );
}
