/* ------------------------------------------------------------------ */
/*  Hero slider content. Edit copy, links and images here only.        */
/* ------------------------------------------------------------------ */

/** Builds a Pexels image URL from a photo ID (the number in the photo's URL). */
const pexels = (id: number, width = 1920) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export interface HeroSlide {
  id: string;
  /** Short name shown in the slide indicator */
  label: string;
  eyebrow: string;
  /** One string per line; each line is revealed separately */
  title: string[];
  text: string;
  cta: { label: string; href: string };
  /** Pexels (or any) image URL. Leave null to show a plain noir backdrop. */
  image: string | null;
  alt: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "fragrance",
    label: "Fragrance",
    eyebrow: "The fragrance edit",
    title: ["Scents that", "linger."],
    text: "Signature perfumes and gift sets, chosen for depth, longevity and the compliments that follow.",
    cta: { label: "Shop fragrance", href: "/categories/fragrance" },
    image:
      "https://images.pexels.com/photos/18031844/pexels-photo-18031844.jpeg",
    alt: "Luxury perfume bottles arranged on a surface",
  },
  {
    id: "hair",
    label: "Hair",
    eyebrow: "Hair and wigs",
    title: ["Crowned in", "confidence."],
    text: "Premium wigs, bundles and hair care, finished to look effortless and made to last.",
    cta: { label: "Shop hair", href: "/categories/hair" },
    // TODO: replace with a hair/wig photo from Pexels (see the ID in its URL)
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1793271748/wmremove-transformed_3_tn60ao.jpg",
    alt: "Woman with beautifully styled hair",
  },
  {
    id: "skincare",
    label: "Creams",
    eyebrow: "Creams and skincare",
    title: ["Skin that", "glows."],
    text: "Rich creams and daily essentials that nourish, protect and bring out your natural radiance.",
    cta: { label: "Shop skincare", href: "/categories/skincare" },
    // TODO: add a skincare cream photo, e.g. image: pexels(1234567)
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1793271747/wmremove-transformed_4_o3imrs.jpg",
    alt: "Jar of luxury face cream",
  },
];
