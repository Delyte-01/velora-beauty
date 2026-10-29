import type { Product } from "@/types";

/**
 * Nigerian beauty product catalogue — 130 products.
 *
 * ORIGINAL 70 (REAL data scouted on 24 Oct 2026): hair (1), haircare (11), skincare (11),
 * fragrance (27), wigs (20). Real fields: name, brand, price, previousPrice (only where the
 * store showed one), image / gallery, description + highlights. Sources are listed per
 * product in `productSources` at the bottom of this file.
 *
 * NEW 60: hair attachments & extensions (+14), skincare (+14), wigs (+14) and beauty accessories (+18).
 * Prices are estimates. Skincare and wig items use built-in demo artwork (see skincareArt / wigArt
 * below) so every product shows an image with no network request; swap in real photos before launch.
 *
 * MOCK fields (all products): stock, rating, reviewCount, popularity, featured / bestSeller /
 * newArrival, createdAt (the stores didn't expose these, so they're generated for the mockup;
 * NIVEA Soft Cream's rating/reviewCount ARE real from Jumia).
 *
 * Prices change often, so re-check before launch.
 */

const CATS = {
  hair: { category: "Hair Attachments & Extensions", categorySlug: "hair" },
  haircare: { category: "Hair Care", categorySlug: "haircare" },
  skincare: { category: "Skincare", categorySlug: "skincare" },
  fragrance: { category: "Fragrances & Perfumes", categorySlug: "fragrance" },
  wigs: { category: "Wigs & Hairpieces", categorySlug: "wigs" },
  accessories: { category: "Beauty Accessories", categorySlug: "accessories" },
} as const;

type CatKey = keyof typeof CATS;

interface Seed {
  cat: CatKey;
  name: string;
  brand: string;
  price: number;
  previousPrice?: number;
  image: string;
  gallery?: string[];
  description: string;
  highlights: string[];
  rating?: number;
  reviewCount?: number;
  src: string;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const counters: Record<string, number> = {};
const productSources: Record<string, string> = {};

function build(seeds: Seed[]): Product[] {
  return seeds.map((s, i) => {
    counters[s.cat] = (counters[s.cat] ?? 0) + 1;
    const id = `p-${s.cat}-${counters[s.cat]}`;
    productSources[id] = s.src;
    const { category, categorySlug } = CATS[s.cat];
    return {
      id,
      slug: slugify(s.name),
      name: s.name,
      description: s.description,
      price: s.price,
      ...(s.previousPrice ? { previousPrice: s.previousPrice } : {}),
      category,
      categorySlug,
      image: s.image,
      gallery: (s.gallery ?? [s.image]).slice(0, 4),
      brand: s.brand,
      // ---- MOCK values (deterministic) ----
      stock: 8 + ((i * 7) % 55),
      featured: i % 6 === 0,
      bestSeller: i % 3 === 0,
      newArrival: i % 4 === 0,
      rating: s.rating ?? Math.round((4.3 + (i % 7) / 10) * 10) / 10,
      reviewCount: s.reviewCount ?? 12 + ((i * 13) % 90),
      highlights: s.highlights,
      variants: [],
      createdAt: `2026-10-${String(1 + (i % 24)).padStart(2, "0")}`,
      popularity: 130 - i,
    } as Product;
  });
}

const NECTAR = "https://nectarbeautyhub.com/cdn/shop";
const SCENTS = "https://www.thescentsstore.com/cdn/shop";
const FRAGNG =
  "https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b";
const NAIJA = "https://www.naijabeautyhair.com/cdn/shop";
const NAIJA_COLL =
  "https://www.naijabeautyhair.com/collections/wigs-on-sale/products";

const PLACEHOLDER_SRC =
  "PLACEHOLDER — replace price/image with a real Nigerian store listing";

/** Neutral placeholder image (used for the hair-extension and accessory demo products). */
function ph(label: string): string {
  return `https://placehold.co/600x600/f5e6e8/7a3b4a/png?text=${encodeURIComponent(label)}`;
}

// ---------------------------------------------------------------------------
// Demo artwork for the new skincare + wig products: inline SVG data-URIs
// (always load, no network). Replace with real product photos before launch.
// ---------------------------------------------------------------------------
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function svgUri(
  inner: string,
  line1: string,
  line2: string,
  accent: string,
): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">` +
    `<rect width="600" height="600" fill="#fbf3f4"/>` +
    `<circle cx="300" cy="300" r="225" fill="${accent}" opacity=".13"/>` +
    inner +
    `<text x="300" y="515" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" text-anchor="middle" fill="#5a2a37">${esc(line1)}</text>` +
    `<text x="300" y="552" font-family="Arial, Helvetica, sans-serif" font-size="23" text-anchor="middle" fill="#8a6a72">${esc(line2)}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ----- skincare -----
type SkinKind = "jar" | "pump" | "dropper" | "tube" | "bottle";
const SKIN_LABEL: Record<SkinKind, string> = {
  jar: "Cream / Gel",
  pump: "Lotion",
  dropper: "Serum",
  tube: "Sunscreen",
  bottle: "Cleanser",
};
const SKIN_COLOR: Record<string, string> = {
  "The Ordinary": "#495057",
  "La Roche-Posay": "#1c7ed6",
  COSRX: "#2f9e44",
  "Beauty of Joseon": "#e6a23c",
  Neutrogena: "#1971c2",
  Vaseline: "#f08c00",
  Cetaphil: "#228be6",
  SheaMoisture: "#8d5524",
  "Palmer's": "#a0522d",
  Simple: "#37b24d",
  Garnier: "#2b8a3e",
  Bioderma: "#e64980",
};

function skinKind(name: string): SkinKind {
  const n = name.toLowerCase();
  if (/serum|hyaluronic|niacinamide|essence/.test(n)) return "dropper";
  if (/spf|sun|anthelios/.test(n)) return "tube";
  if (/lotion|body/.test(n)) return "pump";
  if (/cleanser|wash|micellar/.test(n)) return "bottle";
  return "jar";
}

function skincareArt(name: string, brand: string): string {
  const kind = skinKind(name);
  const c = SKIN_COLOR[brand] ?? "#3b82a0";
  const dark = "#2b2b2b";
  const shapes: Record<SkinKind, string> = {
    jar: `<rect x="215" y="300" width="170" height="130" rx="22" fill="#fff" stroke="${c}" stroke-width="5"/><rect x="205" y="262" width="190" height="46" rx="14" fill="${c}"/><rect x="235" y="340" width="130" height="50" rx="8" fill="${c}" opacity=".15"/>`,
    pump: `<rect x="245" y="270" width="110" height="170" rx="22" fill="#fff" stroke="${c}" stroke-width="5"/><rect x="262" y="330" width="76" height="62" rx="8" fill="${c}" opacity=".85"/><rect x="282" y="235" width="36" height="38" fill="${dark}"/><rect x="292" y="190" width="16" height="48" fill="${dark}"/><rect x="292" y="184" width="54" height="13" rx="6" fill="${dark}"/>`,
    dropper: `<rect x="250" y="285" width="100" height="150" rx="20" fill="${c}" opacity=".9"/><rect x="262" y="330" width="76" height="52" rx="6" fill="#fff" opacity=".9"/><rect x="272" y="245" width="56" height="44" rx="6" fill="${dark}"/><rect x="284" y="180" width="32" height="68" rx="16" fill="#e9ecef" stroke="${dark}" stroke-width="4"/>`,
    tube: `<path d="M255 440 L260 235 Q300 215 340 235 L345 440 Z" fill="${c}"/><rect x="260" y="200" width="80" height="38" rx="8" fill="${dark}"/><rect x="262" y="320" width="76" height="60" rx="6" fill="#fff" opacity=".92"/><text x="300" y="360" font-family="Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle" fill="${c}">SPF</text>`,
    bottle: `<rect x="245" y="260" width="110" height="180" rx="26" fill="#fff" stroke="${c}" stroke-width="5"/><rect x="262" y="320" width="76" height="70" rx="8" fill="${c}" opacity=".85"/><rect x="270" y="215" width="60" height="48" rx="8" fill="${dark}"/>`,
  };
  return svgUri(shapes[kind], brand, SKIN_LABEL[kind], c);
}

// ----- wigs -----
function wigArt(name: string): string {
  const n = name.toLowerCase();
  const hair = /burgundy|99j/.test(n)
    ? "#6b1f2a"
    : /613|blonde/.test(n)
      ? "#d9b36a"
      : /honey/.test(n)
        ? "#b9803f"
        : /ombre|highlight/.test(n)
          ? "#6e4a35"
          : "#1c1412";
  const skin = "#e6cdb5";
  const style = /pixie/.test(n)
    ? "pixie"
    : /bob/.test(n)
      ? "bob"
      : /afro|jerry|curly|kinky curly/.test(n)
        ? "curly"
        : "long";
  let back = "";
  if (style === "long")
    back = `<path d="M185 300 Q185 140 300 130 Q415 140 415 300 L440 470 L160 470 Z" fill="${hair}"/>`;
  if (style === "bob")
    back = `<path d="M185 300 Q185 140 300 130 Q415 140 415 300 L425 385 L175 385 Z" fill="${hair}"/>`;
  if (style === "pixie")
    back = `<path d="M205 290 Q200 150 300 135 Q400 150 395 290 L380 250 L220 250 Z" fill="${hair}"/>`;
  if (style === "curly") {
    const pts: [number, number][] = [
      [210, 200],
      [260, 160],
      [320, 155],
      [380, 185],
      [400, 250],
      [190, 260],
      [200, 330],
      [400, 330],
      [175, 400],
      [425, 400],
      [230, 130],
      [350, 130],
    ];
    back =
      pts
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="52" fill="${hair}"/>`)
        .join("") + `<circle cx="300" cy="230" r="120" fill="${hair}"/>`;
  }
  const braids = /braid/.test(n)
    ? [200, 235, 270, 330, 365, 400]
        .map(
          (x) =>
            `<line x1="${x}" y1="300" x2="${x + (x < 300 ? -10 : 10)}" y2="470" stroke="#000" stroke-width="5" opacity=".35"/>`,
        )
        .join("")
    : "";
  const face = `<ellipse cx="300" cy="305" rx="78" ry="98" fill="${skin}"/>`;
  const fringe =
    style === "pixie" || style === "curly"
      ? `<path d="M222 270 Q300 175 378 270 Q300 225 222 270Z" fill="${hair}"/>`
      : `<path d="M222 285 Q235 195 300 190 Q365 195 378 285 Q300 215 222 285Z" fill="${hair}"/>`;
  const lace = /lace|frontal|closure|glueless|hd/.test(n)
    ? "Lace wig"
    : /headband/.test(n)
      ? "Headband wig"
      : /synthetic/.test(n)
        ? "Synthetic wig"
        : "Wig";
  return svgUri(back + braids + face + fringe, "Human Hair Wig", lace, hair);
}

/** Compact seed builder for the placeholder products. */
function extra(
  cat: CatKey,
  name: string,
  brand: string,
  price: number,
  description: string,
  highlights: string[],
  previousPrice?: number,
): Seed {
  return {
    cat,
    name,
    brand,
    price,
    ...(previousPrice ? { previousPrice } : {}),
    image:
      cat === "skincare"
        ? skincareArt(name, brand)
        : cat === "wigs"
          ? wigArt(name)
          : ph(name),
    description,
    highlights,
    src: PLACEHOLDER_SRC,
  };
}

const seeds: Seed[] = [
  // ---------- HAIR ATTACHMENT (1) ----------
  {
    cat: "hair",
    name: "X-Pression Ruwa Rich Braid Attachment",
    brand: "X-Pression",
    price: 3450,
    image:
      "https://wigmorewholesale.com/image/cache/wkseller/11778/Screenshot%202024-10-25%20165650-637x430.png",
    description:
      "X-Pression Ruwa Rich Braid braiding attachment from Solpia Nigeria. Listed per unit (price shown is the wholesale unit price; sold by the carton of 25).",
    highlights: [
      "X-Pression original",
      "Per-unit wholesale price",
      "Ships from Nigeria",
      "Carton of 25",
    ],
    src: "https://wigmorewholesale.com/product/nigeria/x-pression-attachment-ruwa-rich-braid-per-carton",
  },

  // ---------- HAIR CARE (11) ----------
  {
    cat: "haircare",
    name: "Aunt Jackie's In Control Moisturizing & Softening Conditioner 426g",
    brand: "Aunt Jackie's",
    price: 11400,
    image: `${NECTAR}/files/aunt-jackies-in-control-moisturizing-softening-conditioner-426g-1271506.png?v=1755807366`,
    description:
      "Deep conditioner that softens, detangles and repairs textured hair, made with shea butter, olive oil, marshmallow root and coconut oil.",
    highlights: [
      "Shea butter & olive oil",
      "Detangles",
      "Sulfate & paraben free",
      "All curl patterns",
    ],
    src: "https://nectarbeautyhub.com/products/aunt-jackie-1",
  },
  {
    cat: "haircare",
    name: "Aunt Jackie's Tame My Edges Smoothing Gel 71g",
    brand: "Aunt Jackie's",
    price: 8200,
    image: `${NECTAR}/files/aunt-jackies-tame-my-edges-smoothing-gel-71g-7711640.jpg?v=1752689255`,
    description:
      "Water-based edge gel with flaxseed, grapeseed and argan oils that smooths unruly edges with a soft but effective hold.",
    highlights: [
      "Flaxseed, grapeseed & argan oils",
      "Water-based",
      "Holds under protective styles",
      "71g",
    ],
    src: "https://nectarbeautyhub.com/products/aunt-jackies-tame-my-edges-smoothing-gel-71g",
  },
  {
    cat: "haircare",
    name: "Cantu Leave In Conditioning Cream 340g",
    brand: "Cantu",
    price: 10900,
    image: `${NECTAR}/files/cantu-leave-in-conditioning-cream-340g-4551976.png?v=1759884379`,
    description:
      "Shea butter leave-in cream with natural oils to help repair breakage and split ends and add shine and manageability.",
    highlights: [
      "Shea butter",
      "Leave-in or overnight treatment",
      "Repairs split ends",
      "340g",
    ],
    src: "https://nectarbeautyhub.com/products/leave-in-conditioning-cream-340g",
  },
  {
    cat: "haircare",
    name: "Cantu Shea Butter Grow Strong Strengthening Treatment 173g",
    brand: "Cantu",
    price: 7000,
    image: `${NECTAR}/files/cantu-shea-butter-grow-strong-strengthening-treatment-173g-9988600.jpg?v=1752690338`,
    description:
      "Nourishing cream that fortifies and hydrates dry, brittle hair, with heat protection to help reduce breakage.",
    highlights: [
      "Heat protection",
      "Shea butter",
      "Helps reduce breakage",
      "173g",
    ],
    src: "https://nectarbeautyhub.com/products/shea-butter-grow-strong-strengthening-treatment-173g",
  },
  {
    cat: "haircare",
    name: "Cantu Shea Butter Wave Whip Curl Mousse 248ml",
    brand: "Cantu",
    price: 10900,
    image: `${NECTAR}/files/cantu-shea-butter-wave-whip-curl-mousse-248ml-5033029.png?v=1759882922`,
    description:
      "Light, airy styling foam with shea butter that shapes and adds volume to waves, curls and coils without stiffness or flaking.",
    highlights: ["Frizz control", "No flaking", "Type 2–4 hair", "248ml"],
    src: "https://nectarbeautyhub.com/products/cantu-shea-butter-wave-whip-curl-mousse-248ml",
  },
  {
    cat: "haircare",
    name: "Cantu Shea Butter Deep Treatment Masque 340g",
    brand: "Cantu",
    price: 11700,
    image: `${NECTAR}/files/cantu-shea-butter-deep-treatment-masque-340g-1550550.png?v=1759882922`,
    description:
      "Deep masque for dry, brittle or damaged hair, formulated with shea butter and nine essential oils. Sulfate-free, without silicones, parabens or mineral oil.",
    highlights: [
      "Shea butter + 9 oils",
      "Sulfate-free",
      "No silicones or parabens",
      "340g",
    ],
    src: "https://nectarbeautyhub.com/products/cantu-shea-butter-deep-treatment-masque-340g",
  },
  {
    cat: "haircare",
    name: "Ebin Braid Formula Sweet Almond Oil Setting Mousse 354ml",
    brand: "EBIN New York",
    price: 11900,
    image: `${NECTAR}/files/ebin-braid-formula-sweet-almond-oil-setting-mouse-354ml-810014.png?v=1747879684`,
    description:
      "Lightweight air-dry setting mousse that smooths hair, controls frizz and flyways, and helps lock braids in place. Infused with sweet almond oil.",
    highlights: [
      "Sets braids",
      "Controls frizz & flyaways",
      "Sweet almond oil",
      "Cruelty-free",
    ],
    src: "https://nectarbeautyhub.com/products/ebin-braid-formula-sweet-almond-oil-setting-mouse",
  },
  {
    cat: "haircare",
    name: "EBIN Wonder Lace Bond Lace Melt Spray — Extreme Firm Hold Supreme 100ml",
    brand: "EBIN New York",
    price: 7600,
    image: `${NECTAR}/files/ebin-new-york-wonder-lace-bond-lace-melt-spray-extreme-firm-hold-supreme-100ml-572438.jpg?v=1721367404`,
    description:
      "Melting spray for laying wigs and styling edges with strong, long-lasting hold and an acai berry scent. Contains vitamin E and silk protein.",
    highlights: [
      "Wig lace melting",
      "Extreme firm hold",
      "Vitamin E & silk protein",
      "100ml",
    ],
    src: "https://nectarbeautyhub.com/products/ebin-new-york-wonder-lace-bond-lace-melt-spray-extreme-firm-hold-supreme-100ml",
  },
  {
    cat: "haircare",
    name: "Hawaiian Silky 14 in 1 Miracle Worker 473ml",
    brand: "Hawaiian Silky",
    price: 9500,
    image: `${NECTAR}/files/hawaiian-silky-14-in-1-miracle-worker-473ml-1385355.png?v=1754940147`,
    description:
      "Multi-benefit leave-in that hydrates, detangles, softens and protects dry, frizzy or chemically treated hair. Use as a leave-in, detangler or scalp spray.",
    highlights: [
      "14-in-1 leave-in",
      "Non-greasy",
      "Detangles & softens",
      "473ml",
    ],
    src: "https://nectarbeautyhub.com/products/hawaiian-silky-14-in-1-miracle-worker-473ml",
  },
  {
    cat: "haircare",
    name: "Avyo Purifying Charcoal Shampoo 296ml",
    brand: "Avyo",
    price: 8500,
    image: `${NECTAR}/files/avyo-purifying-charcoal-shampoo-296ml-455462.jpg?v=1748939598`,
    description:
      "Activated-charcoal shampoo that lifts impurities, excess oil and product buildup. Sulfate-free and silicone-free, suitable for colour-treated hair.",
    highlights: [
      "Activated charcoal",
      "Sulfate & silicone free",
      "Good for oily scalps",
      "296ml",
    ],
    src: "https://nectarbeautyhub.com/products/avyo-purifying-charcoal-shampoo-296ml",
  },
  {
    cat: "haircare",
    name: "Above Oil Sheen Hairspray 450ml",
    brand: "Above",
    price: 6500,
    image: `${NECTAR}/files/Untitleddesign_6.png?v=1755165511`,
    description:
      "Lightweight oil sheen spray with pro-vitamin B5, argan and jojoba oils. Adds shine without greasiness and suits natural hair, wigs and weaves.",
    highlights: [
      "Argan & jojoba oils",
      "Works on wigs & weaves",
      "Frizz control",
      "450ml",
    ],
    src: "https://nectarbeautyhub.com/products/oil-sheen-hairspray-450ml",
  },

  // ---------- SKINCARE (11) ----------
  {
    cat: "skincare",
    name: "CeraVe Moisturizing Lotion 236ml",
    brand: "CeraVe",
    price: 13800,
    image: `${NECTAR}/products/cerave-moisturizing-lotion-236ml-786805.jpg?v=1709851413`,
    description:
      "Lightweight, non-greasy, oil-free lotion with three ceramides and hyaluronic acid for 24-hour hydration. For face, body and hands.",
    highlights: [
      "3 essential ceramides",
      "Hyaluronic acid",
      "24-hour hydration",
      "236ml",
    ],
    src: "https://nectarbeautyhub.com/products/moisturizing-lotion-236ml",
  },
  {
    cat: "skincare",
    name: "CeraVe Hydrating Cleanser 473ml",
    brand: "CeraVe",
    price: 17850,
    image: `${NECTAR}/products/cerave-hydrating-cleanser-473ml-731337.jpg?v=1709851410`,
    description:
      "Gentle, non-foaming cleanser for face and body with ceramides and hyaluronic acid. Suitable for sensitive and eczema-prone skin.",
    highlights: [
      "Non-foaming",
      "Ceramides + hyaluronic acid",
      "Sensitive-skin friendly",
      "473ml",
    ],
    src: "https://nectarbeautyhub.com/products/hydrating-cleanser-473ml",
  },
  {
    cat: "skincare",
    name: "CeraVe SA Smoothing Cleanser 236ml",
    brand: "CeraVe",
    price: 16300,
    image: `${NECTAR}/products/cerave-sa-smoothing-cleanser-236ml-731559.jpg?v=1709851416`,
    description:
      "Daily foaming face and body cleanser with salicylic acid to ease rough, bumpy texture while keeping the skin barrier intact.",
    highlights: [
      "Salicylic acid",
      "Ceramides + hyaluronic acid",
      "Dermatologist developed",
      "236ml",
    ],
    src: "https://nectarbeautyhub.com/products/sa-smoothing-cleanser-236ml",
  },
  {
    cat: "skincare",
    name: "CeraVe Blemish Control Cleanser 236ml",
    brand: "CeraVe",
    price: 16800,
    image: `${NECTAR}/files/cerave-blemish-control-cleanser-236ml-166814.jpg?v=1718188886`,
    description:
      "Foamy gel cleanser for blemish-prone skin with 2% salicylic acid, ceramides and niacinamide. Fragrance-free and non-comedogenic.",
    highlights: ["2% salicylic acid", "Niacinamide", "Fragrance-free", "236ml"],
    src: "https://nectarbeautyhub.com/products/cerave-blemish-control-cleanser",
  },
  {
    cat: "skincare",
    name: "CeraVe Skin Renewing Vitamin C Serum 30ml",
    brand: "CeraVe",
    price: 14000,
    previousPrice: 32000,
    image: `${NECTAR}/products/cerave-skin-renewing-vitamin-c-serum-397052.jpg?v=1709851420`,
    description:
      "Gel-like serum with 10% L-ascorbic acid, hyaluronic acid and ceramides for a brighter, more even-looking complexion.",
    highlights: ["10% vitamin C", "Hyaluronic acid", "Fragrance-free", "30ml"],
    src: "https://nectarbeautyhub.com/products/cerave-skin-renewing-vitamin-c-serum",
  },
  {
    cat: "skincare",
    name: "CeraVe Hydrating Cream-to-Foam Cleanser 236ml",
    brand: "CeraVe",
    price: 15500,
    image: `${NECTAR}/products/cerave-hydrating-cream-to-foam-cleanser-236ml-143221.webp?v=1718188714`,
    description:
      "Starts as a cream and lathers into a soft foam, removing dirt and makeup without tightness. Fragrance-free with ceramides and hyaluronic acid.",
    highlights: [
      "Cream-to-foam texture",
      "Removes makeup",
      "Fragrance-free",
      "236ml",
    ],
    src: "https://nectarbeautyhub.com/products/hydrating-cream-to-foam-cleanser-236ml",
  },
  {
    cat: "skincare",
    name: "CeraVe Foaming Facial Cleanser 236ml",
    brand: "CeraVe",
    price: 14500,
    image: `${NECTAR}/products/cerave-foaming-cleanser-236ml-239318.jpg?v=1773936992`,
    description:
      "Gel-based foaming cleanser for normal to oily skin that removes excess oil without over-stripping. Contains ceramides, hyaluronic acid and niacinamide.",
    highlights: [
      "Normal to oily skin",
      "Niacinamide",
      "Non-stripping",
      "236ml",
    ],
    src: "https://nectarbeautyhub.com/products/foaming-cleanser-236ml",
  },
  {
    cat: "skincare",
    name: "CeraVe SA Smoothing Cream 340g",
    brand: "CeraVe",
    price: 21500,
    image: `${NECTAR}/products/cerave-sa-smooting-cream-340g-887455.webp?v=1709851418`,
    description:
      "Non-greasy moisturizing and exfoliating cream with 10% urea for dry, rough, bumpy skin. Vegan formula for face and body (avoid the eye area).",
    highlights: ["10% urea", "3 ceramides", "Vegan", "340g"],
    src: "https://nectarbeautyhub.com/products/sa-smooting-cream-340g",
  },
  {
    cat: "skincare",
    name: "CeraVe Moisturizing Cream 340g",
    brand: "CeraVe",
    price: 18500,
    image: `${NECTAR}/files/cerave-moisturizing-cream-340g-894355.webp?v=1721367334`,
    description:
      "Dermatologist-developed cream for dry to very dry skin on face and body, with three ceramides and MVE delivery technology. Light, non-greasy, no added fragrance.",
    highlights: [
      "3 ceramides",
      "MVE slow-release",
      "Dry to very dry skin",
      "340g",
    ],
    src: "https://nectarbeautyhub.com/products/moisturizing-cream-340g",
  },
  {
    cat: "skincare",
    name: "CeraVe Blemish Control Gel with AHA & BHA Serum 40ml",
    brand: "CeraVe",
    price: 18000,
    image: `${NECTAR}/files/cerave-blemish-control-gel-with-aha-bha-serum-40ml-745301.webp?v=1733216353`,
    description:
      "Evening treatment for acne-prone skin with 2% salicylic acid, glycolic and lactic acids, niacinamide and ceramides. Fragrance-free and alcohol-free.",
    highlights: [
      "2% salicylic acid",
      "AHA + BHA",
      "Niacinamide",
      "Use SPF by day",
    ],
    src: "https://nectarbeautyhub.com/products/cerave-blemish-control-gel-with-aha-bha-serum-40ml",
  },
  {
    cat: "skincare",
    name: "NIVEA Soft Cream 200ml",
    brand: "NIVEA",
    price: 7590,
    previousPrice: 8980,
    image:
      "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/07/1249383/1.jpg?2674",
    gallery: [
      "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/07/1249383/1.jpg?2674",
      "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/07/1249383/2.jpg?2674",
      "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/07/1249383/3.jpg?2674",
      "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/07/1249383/4.jpg?2674",
    ],
    description:
      "Light moisturizing cream for everyday use with Vitamin E and jojoba oil. Quickly absorbed, leaving skin soft and supple. Dermatologically approved.",
    highlights: [
      "Vitamin E & jojoba oil",
      "Fast absorbing",
      "Dermatologically approved",
      "200ml",
    ],
    rating: 4.1,
    reviewCount: 557,
    src: "https://www.jumia.com.ng/nivea-soft-cream-200ml-48-hours-hydration-and-quick-absorbtion-383942170.html",
  },

  // ---------- FRAGRANCE — LATTAFA (12) ----------
  {
    cat: "fragrance",
    name: "Lattafa Asad Eau de Parfum 100ml",
    brand: "Lattafa",
    price: 32500,
    image: `${SCENTS}/products/Lattafa-Asad_500x.png?v=1753700810`,
    description:
      "Lattafa Asad EDP 100ml, a men’s Arabian fragrance sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "100ml", "For men", "Lattafa"],
    src: "https://www.thescentsstore.com/products/lattafa-asad-edp-100ml-men",
  },
  {
    cat: "fragrance",
    name: "Lattafa Khamrah Eau de Parfum 100ml",
    brand: "Lattafa",
    price: 42000,
    image: `${SCENTS}/products/Lattafa-Khamrah_500x.png?v=1753700839`,
    description:
      "Warm, spicy and sweet gourmand with cognac, cinnamon, tonka bean, oak, vanilla, praline and sandalwood notes.",
    highlights: ["Eau de Parfum", "100ml", "Spicy-sweet", "Unisex"],
    src: "https://www.thescentsstore.com/products/lattafa-khamrah-edp-100ml",
  },
  {
    cat: "fragrance",
    name: "Lattafa Khamrah Qahwa Eau de Parfum 100ml",
    brand: "Lattafa",
    price: 44000,
    image: `${SCENTS}/files/Untitleddesign-2023-11-27T191450.660_500x.png?v=1753701260`,
    description:
      "Lattafa Khamrah Qahwa EDP 100ml, the coffee-led flanker of Khamrah, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "100ml", "Khamrah flanker", "Lattafa"],
    src: "https://www.thescentsstore.com/products/lattafa-khamrah-qahwa-edp-100ml",
  },
  {
    cat: "fragrance",
    name: "Lattafa Khamrah Dukhan Eau de Parfum 100ml",
    brand: "Lattafa",
    price: 42000,
    image: `${SCENTS}/files/LattafaDukhanKhamrahEDP100ml_500x.png?v=1753702351`,
    description:
      "Lattafa Khamrah Dukhan EDP 100ml, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "100ml", "Khamrah flanker", "Lattafa"],
    src: "https://www.thescentsstore.com/products/lattafa-khamrah-dukhan-edp-100ml",
  },
  {
    cat: "fragrance",
    name: "Lattafa Yara Eau de Parfum 100ml",
    brand: "Lattafa",
    price: 28000,
    image: `${SCENTS}/products/lattafa_yara_1_500x.png?v=1753699855`,
    description:
      "Lattafa Yara EDP 100ml, a popular unisex-listed Arabian fragrance sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "100ml", "Unisex", "Lattafa"],
    src: "https://www.thescentsstore.com/products/lattafa-yara-edp-100ml-unisex-perfume",
  },
  {
    cat: "fragrance",
    name: "Lattafa Fakhar Pride of Lattafa Eau de Parfum 100ml (Women)",
    brand: "Lattafa",
    price: 29000,
    image: `${SCENTS}/products/pride_of_lattafa_women_500x.jpg?v=1753699785`,
    description:
      "Pride of Lattafa Fakhar EDP 100ml for women, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "100ml", "For women", "Pride of Lattafa"],
    src: "https://www.thescentsstore.com/products/lattafa-fakhar-pride-of-lattafa-edp-100ml-for-women",
  },
  {
    cat: "fragrance",
    name: "Lattafa Hayaati Eau de Parfum 100ml",
    brand: "Lattafa",
    price: 25000,
    image: `${SCENTS}/products/hayaati_1_500x.png?v=1753700012`,
    description:
      "Lattafa Hayaati EDP 100ml, a men’s fragrance sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "100ml", "For men", "Lattafa"],
    src: "https://www.thescentsstore.com/products/lattafa-hayaati-edp-100ml-perfume-for-men",
  },
  {
    cat: "fragrance",
    name: "Lattafa Qaed Al Fursan Eau de Parfum 100ml",
    brand: "Lattafa",
    price: 29000,
    image: `${SCENTS}/products/lattafa_qaa_ed_al_fursan_500x.jpg?v=1753699007`,
    description:
      "Lattafa Qaed Al Fursan EDP 100ml, a unisex Arabian fragrance sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "100ml", "Unisex", "Lattafa"],
    src: "https://www.thescentsstore.com/products/lattafa-qaed-al-fursan-edp-100ml-unisex-perfume",
  },
  {
    cat: "fragrance",
    name: "Lattafa Opulent Oud Eau de Parfum 100ml",
    brand: "Lattafa",
    price: 27000,
    image: `${SCENTS}/products/lattafa_opulent_oud_500x.jpg?v=1753698545`,
    description:
      "Lattafa Opulent Oud EDP 100ml, an oud fragrance for men sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "100ml", "Oud", "For men"],
    src: "https://www.thescentsstore.com/products/lattafa-opulent-oud-edp-100ml-perfume-for-men",
  },
  {
    cat: "fragrance",
    name: "Lattafa Ameer Al Oudh Intense Oud Eau de Parfum 100ml",
    brand: "Lattafa",
    price: 32000,
    image: `${SCENTS}/products/untitled_design_56_500x.png?v=1753699834`,
    description:
      "Lattafa Ameer Al Oudh Intense Oud EDP 100ml, a unisex oud fragrance sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "100ml", "Intense oud", "Unisex"],
    src: "https://www.thescentsstore.com/products/lattafa-ameer-al-oudh-intense-oud-edp-100ml-unisex-perfume",
  },
  {
    cat: "fragrance",
    name: "Lattafa Oud Mood Eau de Parfum 100ml",
    brand: "Lattafa",
    price: 31000,
    image: `${SCENTS}/products/lattafa_oud_mood_edp_perfume_100ml_500x.jpg?v=1753697436`,
    description:
      "Lattafa Oud Mood EDP 100ml, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "100ml", "Oud", "Lattafa"],
    src: "https://www.thescentsstore.com/products/lattafa-oud-mood-edp-perfume-100ml",
  },
  {
    cat: "fragrance",
    name: "Lattafa Nebras Eau de Parfum 100ml",
    brand: "Lattafa",
    price: 46000,
    image: `${SCENTS}/products/LattafaNebras_500x.png?v=1753700815`,
    description:
      "Lattafa Nebras EDP 100ml, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "100ml", "Lattafa", "Premium line"],
    src: "https://www.thescentsstore.com/products/lattafa-nebras-edp-100ml",
  },

  // ---------- FRAGRANCE — LATTAFA via fragrances.com.ng (3) ----------
  {
    cat: "fragrance",
    name: "Lattafa Ser Al Malik Eau de Parfum 100ml",
    brand: "Lattafa",
    price: 29999,
    image: `${FRAGNG}/l/a/lattafa_ser_al_malik_eau_de_parfum_100ml.jpg`,
    description: "Lattafa Ser Al Malik EDP 100ml, listed on fragrances.com.ng.",
    highlights: ["Eau de Parfum", "100ml", "Lattafa", "Arabian fragrance"],
    src: "https://fragrances.com.ng/lattafa-khamrah-edp-100ml.html",
  },
  {
    cat: "fragrance",
    name: "Lattafa Muna Eau de Parfum 100ml",
    brand: "Lattafa",
    price: 27999,
    image: `${FRAGNG}/l/a/lattafa_muna_eau_de_parfum_100ml.jpeg`,
    description: "Lattafa Muna EDP 100ml, listed on fragrances.com.ng.",
    highlights: ["Eau de Parfum", "100ml", "Lattafa", "Arabian fragrance"],
    src: "https://fragrances.com.ng/lattafa-khamrah-edp-100ml.html",
  },
  {
    cat: "fragrance",
    name: "Lattafa Tamima Eau de Parfum 100ml",
    brand: "Lattafa",
    price: 29999,
    image: `${FRAGNG}/l/a/lattafa_tamima_edp_100ml_perfume-2.jpg`,
    description: "Lattafa Tamima EDP 100ml, listed on fragrances.com.ng.",
    highlights: ["Eau de Parfum", "100ml", "Lattafa", "Arabian fragrance"],
    src: "https://fragrances.com.ng/lattafa-khamrah-edp-100ml.html",
  },

  // ---------- FRAGRANCE — ARMAF (12) ----------
  {
    cat: "fragrance",
    name: "Armaf Club de Nuit Intense Man EDT 105ml",
    brand: "Armaf",
    price: 57000,
    image: `${SCENTS}/products/armaf_club_de_nuit_intense_man_500x.jpg?v=1753698446`,
    description:
      "Armaf Club de Nuit Intense Man eau de toilette, 105ml, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Toilette", "105ml", "For men", "Armaf"],
    src: "https://www.thescentsstore.com/products/armaf-club-de-nuit-intense-man-edt-105ml",
  },
  {
    cat: "fragrance",
    name: "Armaf Club de Nuit Intense Woman EDP 105ml",
    brand: "Armaf",
    price: 53000,
    image: `${SCENTS}/products/armaf_club_de_nuit_intense_woman_500x.jpg?v=1753698451`,
    description:
      "Armaf Club de Nuit Intense Woman EDP 105ml, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "105ml", "For women", "Armaf"],
    src: "https://www.thescentsstore.com/products/armaf-club-de-nuit-intense-woman-edp-105ml",
  },
  {
    cat: "fragrance",
    name: "Armaf Club de Nuit Woman EDP 105ml",
    brand: "Armaf",
    price: 53000,
    image: `${SCENTS}/products/armaf_club_de_nuit_woman_500x.jpg?v=1753698874`,
    description:
      "Armaf Club de Nuit Woman EDP 105ml, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "105ml", "For women", "Armaf"],
    src: "https://www.thescentsstore.com/products/armaf-club-de-nuit-woman-edp-105ml",
  },
  {
    cat: "fragrance",
    name: "Armaf Club de Nuit Untold EDP 105ml",
    brand: "Armaf",
    price: 63000,
    image: `${SCENTS}/products/Untitleddesign-2022-12-16T174355.495_500x.png?v=1753700972`,
    description:
      "Armaf Club de Nuit Untold EDP 105ml, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "105ml", "Armaf", "Club de Nuit line"],
    src: "https://www.thescentsstore.com/products/armaf-club-de-nuit-untold-edp-105ml",
  },
  {
    cat: "fragrance",
    name: "Armaf Club de Nuit Sillage EDP 105ml",
    brand: "Armaf",
    price: 63000,
    image: `${SCENTS}/products/armaf_club_de_nuit_sillage_500x.jpg?v=1753699494`,
    description:
      "Armaf Club de Nuit Sillage EDP 105ml for men, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "105ml", "For men", "Armaf"],
    src: "https://www.thescentsstore.com/products/armaf-club-de-nuit-sillage-edp-105ml-perfume-for-men",
  },
  {
    cat: "fragrance",
    name: "Armaf Club de Nuit White Imperiale EDP 105ml",
    brand: "Armaf",
    price: 62000,
    image: `${SCENTS}/products/Untitleddesign-2022-12-16T173725.449_500x.png?v=1753700971`,
    description:
      "Armaf Club de Nuit White Imperiale EDP 105ml, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "105ml", "Armaf", "Club de Nuit line"],
    src: "https://www.thescentsstore.com/products/armaf-club-de-nuit-imperiale-edp-105ml",
  },
  {
    cat: "fragrance",
    name: "Armaf Club de Nuit Blue Iconic EDP 105ml",
    brand: "Armaf",
    price: 62000,
    image: `${SCENTS}/products/Untitleddesign-2022-12-16T173337.914_500x.png?v=1753700970`,
    description:
      "Armaf Club de Nuit Blue Iconic EDP 105ml, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "105ml", "Armaf", "Club de Nuit line"],
    src: "https://www.thescentsstore.com/products/armaf-club-de-nuit-blue-iconic-edp-105ml",
  },
  {
    cat: "fragrance",
    name: "Armaf Club de Nuit Urban Man Elixir EDP 105ml",
    brand: "Armaf",
    price: 59000,
    image: `${SCENTS}/products/Untitleddesign-2022-11-22T194032.256_500x.png?v=1753700956`,
    description:
      "Armaf Club de Nuit Urban Man Elixir EDP 105ml, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "105ml", "For men", "Armaf"],
    src: "https://www.thescentsstore.com/products/armaf-club-de-nuit-urban-man-elixir-edp-105ml",
  },
  {
    cat: "fragrance",
    name: "Armaf Club de Nuit Milestone EDP 105ml",
    brand: "Armaf",
    price: 64000,
    image: `${SCENTS}/products/club_de_nuit_milestone_500x.jpg?v=1753699301`,
    description:
      "Armaf Club de Nuit Milestone EDP 105ml, a unisex fragrance sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "105ml", "Unisex", "Armaf"],
    src: "https://www.thescentsstore.com/products/armaf-club-de-nuit-milestone-edp-105ml-unisex-perfume",
  },
  {
    cat: "fragrance",
    name: "Armaf Odyssey Homme EDP 100ml",
    brand: "Armaf",
    price: 47000,
    image: `${SCENTS}/products/untitled_design_32_500x.png?v=1753699734`,
    description:
      "Armaf Odyssey Homme EDP 100ml for men, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "100ml", "For men", "Armaf"],
    src: "https://www.thescentsstore.com/products/armaf-odyssey-homme-100ml-edp-perfume-for-men",
  },
  {
    cat: "fragrance",
    name: "Armaf Legasi EDP 100ml",
    brand: "Armaf",
    price: 35000,
    image: `${SCENTS}/products/armaf_legasi_man_500x.jpg?v=1753699496`,
    description:
      "Armaf Legasi EDP 100ml for men, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "100ml", "For men", "Armaf"],
    src: "https://www.thescentsstore.com/products/armaf-legasi-100ml-edp-perfume-for-men",
  },
  {
    cat: "fragrance",
    name: "Armaf Ombre d'Or EDP 100ml",
    brand: "Armaf",
    price: 67000,
    image: `${SCENTS}/files/Untitleddesign_54_500x.png?v=1753702492`,
    description:
      "Armaf Ombre d'Or EDP 100ml, sold in Nigeria by The Scents Store.",
    highlights: ["Eau de Parfum", "100ml", "Armaf", "Premium line"],
    src: "https://www.thescentsstore.com/products/armaf-ombre-dor-edp-100ml",
  },

  // ---------- WIGS & HAIRPIECES — Naija Beauty Hair, Lagos (20) ----------
  // Where the store shows "from ₦X", price is that starting price (final price depends on length).
  {
    cat: "wigs",
    name: "Cambodian Curls Frontal Wig",
    brand: "Naija Beauty Hair",
    price: 29900,
    previousPrice: 45000,
    image: `${NAIJA}/files/IMG_7113_250x250@2x.jpg?v=1754896233`,
    description:
      "Cambodian curls 13x1 frontal wig from Naija Beauty Hair. Price shown is the starting price; it varies by length.",
    highlights: [
      "13x1 frontal",
      "Cambodian curls",
      "Starting price",
      "Lagos-based store",
    ],
    src: `${NAIJA_COLL}/cambodian-curls-13x1-frontal-wig`,
  },
  {
    cat: "wigs",
    name: "Prestyled Wear-to-Go Glueless Frontal Wig (100% Human Hair)",
    brand: "Naija Beauty Hair",
    price: 32000,
    previousPrice: 39000,
    image: `${NAIJA}/files/image_20250319182006_d1c61d889cf923061760c269449c44f4_250x250@2x.jpg?v=1742379868`,
    description:
      "Prestyled wear-to-go glueless frontal wig made with 100% human hair. Price shown is the starting price; it varies by length.",
    highlights: ["100% human hair", "Glueless", "Wear-and-go", "Frontal lace"],
    src: `${NAIJA_COLL}/hd-undetectable-invisible-4x13-lace-straight-frontal`,
  },
  {
    cat: "wigs",
    name: "Boss Lady Pixie Cut 13x4 Frontal Lace Wig",
    brand: "Naija Beauty Hair",
    price: 49000,
    previousPrice: 76000,
    image: `${NAIJA}/products/Naija_Beauty_Boss_Lady_Pixie_Cut_13X4_Frontal_Lace_Human_Hair_Wig_250x250@2x.png?v=1704379894`,
    description: "Boss Lady pixie cut human hair wig with a 13x4 frontal lace.",
    highlights: ["Pixie cut", "13x4 frontal lace", "Human hair", "Short style"],
    src: `${NAIJA_COLL}/boss-lady-pixie-cut-frontal-lace-wig-1`,
  },
  {
    cat: "wigs",
    name: "Silky Straight Short Bob Wig With Fringe",
    brand: "Naija Beauty Hair",
    price: 49000,
    previousPrice: 72000,
    image: `${NAIJA}/files/IMG_6536_JPG_250x250@2x.jpg?v=1732876020`,
    description:
      "Silk-base short bob wig with fringe in a silky straight finish. Price shown is the starting price; it varies by length.",
    highlights: [
      "Silk base",
      "Short bob with fringe",
      "Silky straight",
      "Starting price",
    ],
    src: `${NAIJA_COLL}/silk-base-short-bob-with-fringe-wig`,
  },
  {
    cat: "wigs",
    name: "250% Double Drawn Straight 2x6 Kim K Human Hair Wig",
    brand: "Naija Beauty Hair",
    price: 45000,
    previousPrice: 75000,
    image: `${NAIJA}/files/Naija_Beauty_New_Arrivals_Classic_2X6_Lace_Kim_K_Bob_Human_Hair_Wig_250x250@2x.jpg?v=1760492808`,
    description:
      "Classic 2x6 lace Kim K bob wig in 250% density double drawn human hair. Price shown is the starting price; it varies by length.",
    highlights: ["250% density", "Double drawn", "2x6 lace", "Human hair"],
    src: `${NAIJA_COLL}/2x6-classic-kim-k-bob-wig`,
  },
  {
    cat: "wigs",
    name: "Glueless Dark Brown Blunt Cut SDD Bone Straight 4x4 Lace Wig",
    brand: "Naija Beauty Hair",
    price: 68000,
    previousPrice: 98000,
    image: `${NAIJA}/files/IMG_1188_250x250@2x.jpg?v=1745835143`,
    description:
      "Glueless dark brown blunt cut bone straight 4x4 lace wig in 100% human hair. Price shown is the starting price; it varies by length.",
    highlights: [
      "100% human hair",
      "Glueless",
      "Dark brown blunt cut",
      "4x4 lace",
    ],
    src: `${NAIJA_COLL}/highlight-compact-frontal-bob-wig`,
  },
  {
    cat: "wigs",
    name: "Glueless Bone Straight 4x4 Pre-Cut Closure Ready-to-Go Wig",
    brand: "Naija Beauty Hair",
    price: 49900,
    previousPrice: 72000,
    image: `${NAIJA}/files/71F7NLIiUaL_1_250x250@2x.jpg?v=1713492637`,
    description:
      "Glueless bone straight wig with a pre-cut 4x4 lace closure, ready to wear. Price shown is the starting price; it varies by length.",
    highlights: ["Pre-cut lace", "Glueless", "Bone straight", "Ready to go"],
    src: `${NAIJA_COLL}/naija-new-arrival-straight-13x4-frontal-short-bob-human-hair-wigs-12-t1b`,
  },
  {
    cat: "wigs",
    name: "Blunt Cut Double Drawn 250% Bone Straight 13x4 HD Lace Frontal Glueless Wig",
    brand: "Naija Beauty Hair",
    price: 59000,
    previousPrice: 78000,
    image: `${NAIJA}/files/3bb3fa48-ada4-4218-9157-292969e112130a1d_250x250@2x.jpg?v=1717644500`,
    description:
      "Blunt cut, double drawn, 250% density bone straight wig with a 13x4 HD lace frontal. Glueless. Price shown is the starting price.",
    highlights: [
      "250% density",
      "Double drawn",
      "13x4 HD lace frontal",
      "Glueless",
    ],
    src: `${NAIJA_COLL}/new-arrival-super-natural-glueless-bob-wig`,
  },
  {
    cat: "wigs",
    name: "Glueless Chestnut Brown Blunt Cut Bone Straight 2x6 Lace Bob Wig",
    brand: "Naija Beauty Hair",
    price: 66000,
    previousPrice: 99000,
    image: `${NAIJA}/files/5e175244e546a74c6b1c6613418c2845_250x250@2x.jpg?v=1731134199`,
    description:
      "Glueless chestnut brown blunt cut bob wig with a 2x6 lace, made with 100% human hair. Price shown is the starting price.",
    highlights: [
      "100% human hair",
      "Chestnut brown",
      "2x6 lace bob",
      "Glueless",
    ],
    src: `${NAIJA_COLL}/classic-kim-k-bob-wig-14`,
  },
  {
    cat: "wigs",
    name: "Mature Boss Natural Black Egg Curly 5x5 HD Closure Glueless Wig",
    brand: "Naija Beauty Hair",
    price: 66000,
    previousPrice: 125000,
    image: `${NAIJA}/files/IMG_7678_250x250@2x.jpg?v=1770707322`,
    description:
      "Minimalist glueless egg curly wig in natural black with a 5x5 HD closure lace. Price shown is the starting price.",
    highlights: ["Egg curl", "5x5 HD closure", "Natural black", "Glueless"],
    src: `${NAIJA_COLL}/glueless-water-wave-t-frontal-lace-wig-16`,
  },
  {
    cat: "wigs",
    name: "Glueless Blunt Cut Bone Straight 5x5 Pre-Cut Lace Bob Wig",
    brand: "Naija Beauty Hair",
    price: 85000,
    previousPrice: 125000,
    image: `${NAIJA}/files/b833abe82e6d162d1ccaf366755a3c52_250x250@2x.jpg?v=1720773691`,
    description:
      "Glueless blunt cut bone straight bob wig with a pre-cut 5x5 lace, ready to go. Price shown is the starting price.",
    highlights: [
      "Pre-cut 5x5 lace",
      "Blunt cut bob",
      "Bone straight",
      "Ready to go",
    ],
    src: `${NAIJA_COLL}/350g-closure-bob-wig`,
  },
  {
    cat: "wigs",
    name: "Wig ISSA — Original Curly 4x4 Closure Glueless Wig",
    brand: "Naija Beauty Hair",
    price: 99000,
    previousPrice: 125000,
    image: `${NAIJA}/files/IMG_6470_250x250@2x.jpg?v=1752560019`,
    description:
      "Original curly glueless wig with a 4x4 closure. Price shown is the starting price; it varies by length.",
    highlights: ["Curly", "4x4 closure", "Glueless", "Starting price"],
    src: `${NAIJA_COLL}/wig-issa-original-curly-4x4-closure-wig`,
  },
  {
    cat: "wigs",
    name: '300% Pixie Kinky Curly Glueless 5x5 Closure HD Lace Wig 14"',
    brand: "Naija Beauty Hair",
    price: 99000,
    previousPrice: 165000,
    image: `${NAIJA}/files/1739526708681297920indDKg63pqXtjHBk_640x_e846588f-b1b7-4451-90c9-7c95f67c59fd_250x250@2x.jpg?v=1729238630`,
    description:
      "300% density pixie kinky curly glueless wig with a 5x5 HD lace closure, ready to go, in 100% human hair.",
    highlights: ["300% density", "Kinky curly pixie", "5x5 HD lace", "14 inch"],
    src: `${NAIJA_COLL}/wk-falsh-sale-kinky-frontal-wig-14`,
  },
  {
    cat: "wigs",
    name: 'Silky Bone Straight 2x6 Lace Closure Wig 18"',
    brand: "Naija Beauty Hair",
    price: 115000,
    previousPrice: 178000,
    image: `${NAIJA}/files/IMG_6008_250x250@2x.jpg?v=1754553366`,
    description: "Silky bone straight wig with a 2x6 lace closure, 18 inch.",
    highlights: ["Bone straight", "2x6 lace closure", "18 inch", "Human hair"],
    src: `${NAIJA_COLL}/2-6-clousure-silky-straight-wig`,
  },
  {
    cat: "wigs",
    name: "Glueless Chestnut Brown Highlights Blunt Cut Silky Straight 4x4 HD Lace Bob Wig",
    brand: "Naija Beauty Hair",
    price: 95000,
    previousPrice: 112000,
    image: `${NAIJA}/files/1728621124561965056oyEuwrWZL6Tv9CDf_250x250@2x.webp?v=1714459525`,
    description:
      "Glueless chestnut brown bob with highlights, blunt cut, silky straight, 4x4 closure HD lace, 100% human hair. Price shown is the starting price.",
    highlights: [
      "100% human hair",
      "Brown highlights",
      "4x4 HD lace",
      "Glueless bob",
    ],
    src: `${NAIJA_COLL}/double-drawn-daily-brown-bob-wig`,
  },
  {
    cat: "wigs",
    name: 'Glueless Fabulous Ombre Brown Loose Wavy Closure Wig 18"',
    brand: "Naija Beauty Hair",
    price: 145000,
    previousPrice: 205000,
    image: `${NAIJA}/files/Fabulous_Ombre_Brown_Loose_Wavy_Closure_Wig._-_Naija_Beauty_Hair_1024x1024_2x_1_250x250@2x.webp?v=1708692626`,
    description: "Glueless ombre brown loose wavy closure wig, 18 inch.",
    highlights: ["Ombre brown", "Loose wave", "Glueless", "18 inch"],
    src: `${NAIJA_COLL}/fabulous-ombre-brown-loose-wavy-closure-wig-16`,
  },
  {
    cat: "wigs",
    name: "Ronke — 300% Raw Wavy Body Wave 4x4 Lace Closure Wig",
    brand: "Naija Beauty Hair",
    price: 145000,
    previousPrice: 178000,
    image: `${NAIJA}/files/Naija_13X4_Frontal_Super_Double_Drawn_Raw_Wave_Human_Hair_Wigs_250x250@2x.jpg?v=1733905163`,
    description:
      "300% density raw wavy body wave wig with a 4x4 lace closure. Price shown is the starting price; it varies by length.",
    highlights: [
      "300% density",
      "Raw wavy body wave",
      "4x4 lace closure",
      "Human hair",
    ],
    src: `${NAIJA_COLL}/wig-ronke-300-raw-wavy-4x4-closure-wig`,
  },
  {
    cat: "wigs",
    name: "Wig AVA — Glueless 13x4 Frontal Wig",
    brand: "Naija Beauty Hair",
    price: 165000,
    previousPrice: 198000,
    image: `${NAIJA}/files/IMG_6465_250x250@2x.jpg?v=1722505733`,
    description:
      "400g glueless wig with a 13x4 frontal. Price shown is the starting price; it varies by length.",
    highlights: ["400g", "13x4 frontal", "Glueless", "Starting price"],
    src: `${NAIJA_COLL}/wig-ava-400g-glueless-frontal-wig`,
  },
  {
    cat: "wigs",
    name: 'Graceful 99J Burgundy Bone Straight Glueless 5x5 HD Lace Wig 20"',
    brand: "Naija Beauty Hair",
    price: 185000,
    previousPrice: 298000,
    image: `${NAIJA}/files/IMG_7172_PNG_250x250@2x.jpg?v=1738979600`,
    description:
      "Glueless 99J burgundy bone straight wig with a 5x5 closure HD lace, 20 inch, 100% human hair.",
    highlights: ["99J burgundy", "5x5 HD lace", "20 inch", "100% human hair"],
    src: `${NAIJA_COLL}/affordable-luxury-highlight-silky-straight-frontal-wig`,
  },
  {
    cat: "wigs",
    name: "Glueless Bone Straight 13x4 Frontal Lace Ready-to-Go Bob Wig",
    brand: "Naija Beauty Hair",
    price: 59000,
    previousPrice: 75000,
    image: `${NAIJA}/files/IMG_3751_250x250@2x.webp?v=1710925042`,
    description:
      "Glueless bone straight bob wig with a 13x4 frontal lace, ready to go. Price shown is the starting price.",
    highlights: [
      "13x4 frontal lace",
      "Bone straight bob",
      "Glueless",
      "Ready to go",
    ],
    src: `${NAIJA_COLL}/wk-falsh-sale-boss-lady-fringe-wig`,
  },

  // =====================================================================
  // NEW PRODUCTS (+60) — PLACEHOLDER prices/images, replace with real listings
  // =====================================================================

  // ---------- HAIR ATTACHMENTS & EXTENSIONS (+14) ----------
  extra(
    "hair",
    "X-Pression Pre-Stretched Braiding Hair 3X",
    "X-Pression",
    3200,
    "Pre-stretched Kanekalon braiding hair for box braids, knotless braids and twists. Soft, lightweight and itch-free.",
    ["Pre-stretched", "Itch-free", "Lightweight", "Box & knotless braids"],
  ),
  extra(
    "hair",
    "Sensationnel Ruwa Pre-Stretched Braid 3X",
    "Sensationnel",
    3500,
    "Pre-stretched, easy-to-separate braiding hair with a smooth finish and tangle-free feel.",
    ["Pre-stretched", "Tangle-free", "Easy to separate", "Hot-water sealable"],
  ),
  extra(
    "hair",
    "Darling Soft Attachment Braiding Hair",
    "Darling",
    2800,
    "Soft synthetic attachment popular in Nigeria for neat, long-lasting braids.",
    ["Soft texture", "Long-lasting", "Affordable", "Synthetic"],
  ),
  extra(
    "hair",
    "Spetra EZ Braid Pre-Stretched Hair",
    "Spetra",
    3000,
    "Pre-stretched EZ braiding hair that saves time during installation and gives a uniform finish.",
    ["Pre-stretched", "Saves install time", "Uniform finish", "Synthetic"],
  ),
  extra(
    "hair",
    "X-Pression Passion Twist Hair",
    "X-Pression",
    4800,
    "Bohemian-style passion twist hair for a full, textured twisted look.",
    ["Passion twist", "Lightweight", "Crochet install", "Full look"],
  ),
  extra(
    "hair",
    "Pretty Twist Spring Twist Hair",
    "Pretty Twist",
    4500,
    "Ready-to-use spring twist hair for quick, low-maintenance protective styling.",
    ["Spring twist", "Quick install", "Protective style", "Lightweight"],
  ),
  extra(
    "hair",
    "Brazilian Loose Wave Bundle 18 inch",
    "Naija Beauty Hair",
    48000,
    "Soft Brazilian loose wave human hair bundle that can be coloured, curled and straightened.",
    ["100% human hair", "Loose wave", "Can be dyed", "18 inch"],
    62000,
  ),
  extra(
    "hair",
    "Peruvian Straight Bundle 20 inch",
    "Naija Beauty Hair",
    55000,
    "Silky Peruvian straight human hair bundle with minimal shedding.",
    ["100% human hair", "Silky straight", "Low shedding", "20 inch"],
    70000,
  ),
  extra(
    "hair",
    "Brazilian Body Wave 3 Bundles + 4x4 Closure",
    "Naija Beauty Hair",
    165000,
    "Three bundles of body wave human hair with a matching 4x4 lace closure for a full install.",
    ["3 bundles + closure", "Body wave", "Human hair", "Full install"],
    210000,
  ),
  extra(
    "hair",
    "Kinky Curly Crochet Hair 18 inch",
    "Freetress",
    4200,
    "Kinky curly crochet hair for easy, natural-looking protective styles.",
    ["Kinky curly", "Crochet install", "18 inch", "Natural look"],
  ),
  extra(
    "hair",
    "Tape-In Human Hair Extensions 20pcs",
    "Naija Beauty Hair",
    72000,
    "Seamless tape-in extensions for instant length and volume.",
    ["20 pieces", "Human hair", "Seamless", "Reusable"],
    90000,
  ),
  extra(
    "hair",
    "Clip-In Hair Extensions 7-Piece Set",
    "Naija Beauty Hair",
    38000,
    "Seven-piece clip-in set for quick length and volume with no commitment.",
    ["7-piece set", "No glue or heat", "Human hair blend", "Quick install"],
  ),
  extra(
    "hair",
    "Drawstring Ponytail Extension 22 inch",
    "Naija Beauty Hair",
    18000,
    "Wrap-around drawstring ponytail for a quick, voluminous look.",
    ["Drawstring", "22 inch", "Heat friendly", "Easy to wear"],
  ),
  extra(
    "hair",
    "HD Lace Closure 5x5 Straight 14 inch",
    "Naija Beauty Hair",
    42000,
    "Human hair 5x5 HD lace closure that melts into the skin.",
    ["5x5 HD lace", "Human hair", "Pre-plucked", "14 inch"],
  ),

  // ---------- SKINCARE (+14) — replaces the old makeup block ----------
  extra(
    "skincare",
    "The Ordinary Niacinamide 10% + Zinc 1% Serum 30ml",
    "The Ordinary",
    14500,
    "Lightweight serum that targets the look of blemishes, congestion and uneven texture.",
    ["10% niacinamide", "1% zinc", "Fragrance-free", "30ml"],
  ),
  extra(
    "skincare",
    "The Ordinary Hyaluronic Acid 2% + B5 Serum 30ml",
    "The Ordinary",
    15500,
    "Hydrating serum with multi-weight hyaluronic acid and vitamin B5 for plumper-looking skin.",
    ["Multi-weight hyaluronic acid", "Vitamin B5", "Fragrance-free", "30ml"],
  ),
  extra(
    "skincare",
    "La Roche-Posay Anthelios UVMune 400 Invisible Fluid SPF50+ 50ml",
    "La Roche-Posay",
    22000,
    "Very high protection, ultra-light daily facial sunscreen with a non-greasy, invisible finish.",
    ["SPF 50+", "UVA/UVB protection", "Non-greasy", "50ml"],
  ),
  extra(
    "skincare",
    "La Roche-Posay Effaclar Duo+ Acne Treatment 40ml",
    "La Roche-Posay",
    24500,
    "Corrective care for blemish-prone skin that helps clear spots and reduce marks.",
    [
      "Targets blemishes",
      "Helps reduce marks",
      "Dermatologist developed",
      "40ml",
    ],
  ),
  extra(
    "skincare",
    "COSRX Advanced Snail 96 Mucin Power Essence 100ml",
    "COSRX",
    21000,
    "Lightweight Korean essence with 96% snail secretion filtrate for hydrated, smoother-looking skin.",
    ["96% snail mucin", "Hydrating", "Lightweight", "100ml"],
  ),
  extra(
    "skincare",
    "Beauty of Joseon Relief Sun: Rice + Probiotics SPF50+ 50ml",
    "Beauty of Joseon",
    19500,
    "Comfortable Korean sunscreen with rice extract and probiotics and a light, moisturising finish.",
    ["SPF 50+ PA++++", "Rice extract", "Light finish", "50ml"],
  ),
  extra(
    "skincare",
    "Neutrogena Hydro Boost Water Gel 50g",
    "Neutrogena",
    17500,
    "Oil-free gel moisturizer with hyaluronic acid that absorbs quickly for lasting hydration.",
    ["Hyaluronic acid", "Oil-free", "Fast absorbing", "50g"],
  ),
  extra(
    "skincare",
    "Cetaphil Gentle Skin Cleanser 236ml",
    "Cetaphil",
    16500,
    "Soap-free, non-irritating cleanser for face and body, suitable for sensitive skin.",
    ["Soap-free", "Sensitive-skin friendly", "Face & body", "236ml"],
  ),
  extra(
    "skincare",
    "Bioderma Sensibio H2O Micellar Water 500ml",
    "Bioderma",
    24000,
    "Gentle micellar water that removes makeup and impurities without rinsing.",
    ["No rinse needed", "Removes makeup", "Sensitive skin", "500ml"],
  ),
  extra(
    "skincare",
    "Simple Kind to Skin Refreshing Facial Wash 150ml",
    "Simple",
    6000,
    "Everyday face wash that cleanses without harsh perfumes or dyes.",
    ["No harsh perfume", "Daily use", "Gentle", "150ml"],
  ),
  extra(
    "skincare",
    "Garnier Vitamin C Brightening Serum 30ml",
    "Garnier",
    9500,
    "Brightening serum with vitamin C to help even tone and boost radiance.",
    ["Vitamin C", "Brightening", "Lightweight", "30ml"],
  ),
  extra(
    "skincare",
    "SheaMoisture Raw Shea Butter Nourishing Moisturizer 340g",
    "SheaMoisture",
    14500,
    "Rich head-to-toe moisturizer with raw shea butter for dry, rough skin.",
    ["Raw shea butter", "Rich moisture", "Body & hands", "340g"],
  ),
  extra(
    "skincare",
    "Palmer's Cocoa Butter Formula Body Lotion 400ml",
    "Palmer's",
    8500,
    "Daily body lotion with cocoa butter and vitamin E for soft, smooth skin.",
    ["Cocoa butter", "Vitamin E", "Daily lotion", "400ml"],
  ),
  extra(
    "skincare",
    "Vaseline Intensive Care Cocoa Radiant Body Lotion 400ml",
    "Vaseline",
    6500,
    "Body lotion with pure cocoa butter that moisturises deeply and gives a healthy glow.",
    ["Cocoa butter", "Deep moisture", "Healthy glow", "400ml"],
  ),

  // ---------- WIGS & HAIRPIECES (+14) — replaces the old makeup block ----------
  extra(
    "wigs",
    "Short Pixie Cut Human Hair Wig 8 inch",
    "Generic",
    38000,
    "Short, easy-to-style pixie cut human hair wig. Lightweight and ideal for a bold, low-maintenance look.",
    ["Pixie cut", "Human hair", "8 inch", "Lightweight"],
    48000,
  ),
  extra(
    "wigs",
    "Straight 13x4 Lace Frontal Wig 22 inch",
    "Generic",
    120000,
    "Silky straight human hair wig with a 13x4 lace frontal for a natural hairline.",
    ["13x4 lace frontal", "Straight", "Human hair", "22 inch"],
    150000,
  ),
  extra(
    "wigs",
    "Body Wave 13x4 HD Lace Frontal Wig 24 inch",
    "Generic",
    165000,
    "Soft body wave human hair wig with a melt-into-skin HD lace frontal.",
    ["HD lace", "Body wave", "Human hair", "24 inch"],
    205000,
  ),
  extra(
    "wigs",
    "Deep Wave 5x5 Closure Wig 20 inch",
    "Generic",
    98000,
    "Defined deep wave curls with a 5x5 closure for a natural-looking part.",
    ["5x5 closure", "Deep wave", "Human hair", "20 inch"],
  ),
  extra(
    "wigs",
    "Water Wave Glueless Closure Wig 18 inch",
    "Generic",
    85000,
    "Glueless water wave wig that is ready to wear, with an adjustable cap and pre-cut lace.",
    ["Glueless", "Water wave", "Pre-cut lace", "18 inch"],
    110000,
  ),
  extra(
    "wigs",
    "Curly Bob Wig 12 inch",
    "Generic",
    52000,
    "Bouncy curly bob wig for a fun, easy everyday style.",
    ["Curly bob", "Human hair blend", "12 inch", "Easy to style"],
  ),
  extra(
    "wigs",
    "Jerry Curl Wig 14 inch",
    "Generic",
    45000,
    "Classic jerry curl look in a pull-on wig with soft, defined curls.",
    ["Jerry curl", "Soft curls", "14 inch", "Lightweight"],
  ),
  extra(
    "wigs",
    "Kinky Straight Yaki 4x4 Closure Wig 20 inch",
    "Generic",
    90000,
    "Yaki straight texture that blends with relaxed or blow-dried natural hair.",
    ["Kinky straight", "4x4 closure", "Human hair", "20 inch"],
  ),
  extra(
    "wigs",
    "Burgundy Bone Straight Bob Wig 12 inch",
    "Generic",
    68000,
    "Sleek burgundy bone straight bob with a rich wine colour.",
    ["Burgundy", "Bone straight", "Bob", "12 inch"],
    85000,
  ),
  extra(
    "wigs",
    "Honey Blonde 613 Straight Lace Frontal Wig 22 inch",
    "Generic",
    150000,
    "Honey blonde 613 straight lace frontal wig that can be styled or toned.",
    ["613 blonde", "Lace frontal", "Straight", "22 inch"],
    185000,
  ),
  extra(
    "wigs",
    "Afro Kinky Curly Wig 16 inch",
    "Generic",
    42000,
    "Full afro kinky curly wig that mimics natural 4C texture.",
    ["Afro kinky curly", "Natural texture", "16 inch", "Full volume"],
  ),
  extra(
    "wigs",
    "Synthetic Box Braid Wig 30 inch",
    "Generic",
    35000,
    "Lightweight synthetic braided wig that gives a protective-style look without hours in the salon.",
    ["Box braids", "Synthetic", "30 inch", "Lightweight"],
  ),
  extra(
    "wigs",
    "Headband Wig Straight 18 inch",
    "Generic",
    32000,
    "Glueless headband wig, throw-on and go, with no lace or glue needed.",
    ["Headband wig", "Glueless", "Straight", "18 inch"],
  ),
  extra(
    "wigs",
    "Ombre Highlight Loose Wave Wig 20 inch",
    "Generic",
    135000,
    "Brown ombre highlighted loose wave wig for a sun-kissed finish.",
    ["Ombre highlights", "Loose wave", "Human hair", "20 inch"],
    170000,
  ),

  // ---------- BEAUTY ACCESSORIES (+18) ----------
  extra(
    "accessories",
    "Beauty Sponge Blender Set (5 pcs)",
    "Generic",
    4500,
    "Soft, latex-free makeup sponges for foundation, concealer and powder.",
    ["5 pieces", "Latex-free", "Works wet or dry", "Soft & bouncy"],
  ),
  extra(
    "accessories",
    "Professional Makeup Brush Set (12 pcs)",
    "Generic",
    12500,
    "Twelve-piece brush set for face and eyes with a travel pouch.",
    ["12 brushes", "Soft bristles", "Face & eyes", "Includes pouch"],
  ),
  extra(
    "accessories",
    "Satin Hair Bonnet (Double Layer)",
    "Generic",
    2500,
    "Double-layer satin bonnet that protects hair and edges overnight.",
    ["Double layer", "Reduces frizz", "Adjustable", "Satin"],
  ),
  extra(
    "accessories",
    "Satin Pillowcase",
    "Generic",
    6500,
    "Smooth satin pillowcase that is gentle on skin and hair.",
    ["Gentle on hair", "Skin friendly", "Machine washable", "Standard size"],
  ),
  extra(
    "accessories",
    "Satin Edge Scarf",
    "Generic",
    2000,
    "Wide, stretchy satin scarf for laying edges and nightly protection.",
    ["Wide band", "Stretchy", "Satin", "Many colours"],
  ),
  extra(
    "accessories",
    "Wig Cap Stocking (10 pcs)",
    "Generic",
    3000,
    "Stretchy mesh wig caps for a smooth, secure base under wigs.",
    ["10 pieces", "Stretchy", "Breathable", "Under-wig base"],
  ),
  extra(
    "accessories",
    "Tripod Mannequin Wig Stand",
    "Generic",
    7500,
    "Adjustable tripod stand for styling, drying and storing wigs.",
    [
      "Adjustable height",
      "Stable tripod",
      "For styling & storage",
      "Lightweight",
    ],
  ),
  extra(
    "accessories",
    "Elastic Wig Grip Band",
    "Generic",
    3500,
    "Velvet-lined grip band that keeps wigs secure without glue.",
    ["Velvet grip", "Adjustable", "Glueless hold", "Comfortable"],
  ),
  extra(
    "accessories",
    "Wide-Tooth Detangling Comb",
    "Generic",
    1800,
    "Wide-tooth comb that glides through thick or curly hair.",
    ["Wide teeth", "Low breakage", "Durable", "For curly hair"],
  ),
  extra(
    "accessories",
    "Wet Detangling Hair Brush",
    "Generic",
    4800,
    "Flexible-bristle brush that detangles wet or dry hair gently.",
    ["Flexible bristles", "Wet or dry", "Less breakage", "Ergonomic handle"],
  ),
  extra(
    "accessories",
    "Edge Control Brush Set (3 pcs)",
    "Generic",
    3200,
    "Dual-ended edge brushes for sleek, smooth baby hairs.",
    ["3 pieces", "Dual-ended", "Soft bristles", "Edge styling"],
  ),
  extra(
    "accessories",
    "Silk Scrunchies (6 pcs)",
    "Generic",
    3800,
    "Gentle silk-feel scrunchies that hold without creasing.",
    ["6 pieces", "No crease", "Gentle hold", "Mixed colours"],
  ),
  extra(
    "accessories",
    "Jade Roller & Gua Sha Set",
    "Generic",
    9500,
    "Facial roller and gua sha stone set for massage and de-puffing.",
    ["2-piece set", "Facial massage", "Cooling feel", "Gift box"],
  ),
  extra(
    "accessories",
    "LED Vanity Makeup Mirror",
    "Generic",
    14500,
    "Tabletop mirror with dimmable LED lights, ideal for makeup application.",
    ["Dimmable LED", "Tabletop", "USB powered", "Touch control"],
  ),
  extra(
    "accessories",
    "Waterproof Cosmetic Organizer Bag",
    "Generic",
    6800,
    "Roomy, waterproof makeup bag with dividers for brushes and palettes.",
    ["Waterproof", "Multi-compartment", "Portable", "Zip closure"],
  ),
  extra(
    "accessories",
    "3D Mink False Eyelashes (5 Pairs)",
    "Generic",
    5500,
    "Fluffy, reusable 3D lashes in a five-pair pack.",
    ["5 pairs", "Reusable", "Lightweight", "3D effect"],
  ),
  extra(
    "accessories",
    "Waterproof Lash Glue (Clear/Black)",
    "Generic",
    3500,
    "Quick-dry, waterproof glue for strip lashes.",
    ["Waterproof", "Quick-dry", "Clear/black", "Latex-free"],
  ),
  extra(
    "accessories",
    "Eyebrow Razor Shaper (6 pcs)",
    "Generic",
    2200,
    "Folding brow razors for quick, safe shaping and facial hair removal.",
    ["6 pieces", "Folding design", "Safe tip", "Portable"],
  ),
];

export const products: Product[] = build(seeds);

/** Where each product's real name / price / image came from (keyed by product id). */
export { productSources };

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.bestSeller);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.newArrival);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
    )
    .slice(0, limit);
}
