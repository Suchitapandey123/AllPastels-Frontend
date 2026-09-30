/**
 * Centralised image registry.
 *
 * Every image used anywhere in the storefront is declared here, so swapping
 * AllPatels' real photography for this placeholder set later means editing
 * a single file. Components never contain a raw URL.
 *
 * Sources are royalty-free Unsplash photographs used as temporary
 * stand-ins — they are not assets belonging to any reference brand.
 */

const UNSPLASH = "https://images.unsplash.com";

/** Named slots, grouped by the surface that consumes them. */
const SOURCES = {
  // Hero + campaign
  hero: "photo-1490481651871-ab68de25d43d",
  campaign: "photo-1469334031218-e382a71b716b",

  // Category cards
  categoryWomen: "photo-1483985988355-763728e1935b",
  categoryMen: "photo-1507003211169-0a1dd7228f2d",
  categoryKids: "photo-1503454537195-1dcabb73ffb9",
  categoryAccessories: "photo-1523170335258-f5ed11844a49",

  // Editorial
  editorial: "photo-1515886657613-9f3515b0c78f",
  editorialSecondary: "photo-1503342217505-b0a15ec3261c",
  brandStory: "photo-1483118714900-540cf339fd46",
  brandStorySecondary: "photo-1441984904996-e0b6ba687e04",

  // Moods / occasions
  moodEveryday: "photo-1492707892479-7bc8d5a4ee93",
  moodWeekend: "photo-1496449903678-68ddcb189a24",
  moodParty: "photo-1529139574466-a303027c1d8b",
  moodVacation: "photo-1529626455594-4ff0802cfb7e",
  moodFestive: "photo-1512316609839-ce289d3eba0a",

  // Discovery
  discoveryGifting: "photo-1515562141207-7a88fb7ce338",
  discoveryEveryday: "photo-1524250502761-1ac6f2e30d43",
  discoveryWork: "photo-1487412720507-e7ab37603c6f",
  discoveryTravel: "photo-1508214751196-bcfd4ca60f91",
  discoveryCelebration: "photo-1502823403499-6ccfcf4fb453",

  // Collections
  collectionSoftStructure: "photo-1594633312681-425c7b97ccd1",
  collectionSunlit: "photo-1529626455594-4ff0802cfb7e",
  collectionTailored: "photo-1507003211169-0a1dd7228f2d",
  collectionGifting: "photo-1515562141207-7a88fb7ce338",
} as const;

export type ImageSlot = keyof typeof SOURCES;

/** Aspect ratios used consistently so the grid never shifts while loading. */
export const ASPECT = {
  /** 3:4 — the standard editorial & product portrait. */
  portrait: { width: 3, height: 4 },
  /** 4:5 — used by mood and discovery cards. */
  editorial: { width: 4, height: 5 },
  /** 1:1 — square thumbnails. */
  square: { width: 1, height: 1 },
  /** 16:9 — wide editorial bands. */
  wide: { width: 16, height: 9 },
  /** 4:3 — banners. */
  landscape: { width: 4, height: 3 },
} as const;

export type AspectKey = keyof typeof ASPECT;

/**
 * Builds an optimised Unsplash URL.
 *
 * `next/image` resizes these again on the fly; the parameters here simply
 * keep the source file reasonable and correctly cropped.
 */
export function imageUrl(source: string, options: { width?: number; aspect?: AspectKey } = {}): string {
  const { width = 1600, aspect = "portrait" } = options;
  const ratio = ASPECT[aspect];

  return (
    `${UNSPLASH}/${source}` +
    `?auto=format&fit=crop&crop=entropy&q=80` +
    `&w=${width}&h=${Math.round((width / ratio.width) * ratio.height)}`
  );
}

/** Resolves a named editorial/category slot. */
export function slotUrl(slot: ImageSlot, options?: { width?: number; aspect?: AspectKey }): string {
  return imageUrl(SOURCES[slot], options);
}

/** Product photography: a front shot plus a detail shot for each set. */
const PRODUCT_SOURCES = {
  dressLinen: ["photo-1566174053879-31528523f8ae", "photo-1595777457583-95e059d581b8"],
  dressBlush: ["photo-1594633312681-425c7b97ccd1", "photo-1583743814966-8936f5b7be1a"],
  shirtLinen: ["photo-1596755094514-f87e34085b2c", "photo-1620799140408-edc6dcb6d633"],
  shirtWhite: ["photo-1610652492500-ded49ceeb378", "photo-1584917865442-de89df76afd3"],
  knitSweater: ["photo-1610030469983-98e550d6193c", "photo-1608234807905-4466023792f5"],
  knitCardigan: ["photo-1434389677669-e08b4cac3105", "photo-1618453292459-53424b66bb6a"],
  topBlouse: ["photo-1560243563-062bfc001d68", "photo-1591369822096-ffd140ec948f"],
  outerwear: ["photo-1552374196-c4e7ffc6e126", "photo-1512436991641-6745cdb1723f"],
  trousers: ["photo-1593030103066-0093718efeb9", "photo-1610701596007-11502861dcfa"],
  denim: ["photo-1542272604-787c3835535d", "photo-1604176354204-9268737828e4"],
  kidsDress: ["photo-1519238263530-99bdd11df2ea", "photo-1607453998774-d533f65dac99"],
  kidsSet: ["photo-1596870230751-ebdfce98ec42", "photo-1503341504253-dff4815485f1"],
  bagTote: ["photo-1548036328-c9fa89d128fa", "photo-1594223274512-ad4803739b7c"],
  bagShoulder: ["photo-1584917865442-de89df76afd3", "photo-1601924994987-69e26d50dc26"],
  accessoryScarf: ["photo-1603561591411-07134e71a2a9", "photo-1610030469983-98e550d6193c"],
  accessoryJewellery: ["photo-1515562141207-7a88fb7ce338", "photo-1599643478518-a784e5dc4c8f"],
  accessorySunglasses: ["photo-1511499767150-a48a237f0083", "photo-1572635196237-14b3f281503f"],
  accessoryWatch: ["photo-1523275335684-37898b6baf30", "photo-1524805444758-089113d48a6d"],
  accessoryFootwear: ["photo-1542291026-7eec264c27ff", "photo-1560769629-975ec94e6a86"],
  accessoryHeels: ["photo-1543163521-1bf539c55dd2", "photo-1595950653106-6c9ebd614d3a"],
  homeLifestyle: ["photo-1484101403633-562f891dc89a", "photo-1522708323590-d24dbb6b0267"],
  travelLifestyle: ["photo-1503220317375-aaad61436b1b", "photo-1476514525535-07fb3b4ae5f1"],
} as const;

export type ProductImageSet = keyof typeof PRODUCT_SOURCES;

const PRODUCT_SLOTS = Object.keys(PRODUCT_SOURCES) as ProductImageSet[];

/** Every photograph in a product's set, primary first. */
export function productImages(
  set: ProductImageSet,
  options?: { width?: number; aspect?: AspectKey },
): string[] {
  return PRODUCT_SOURCES[set].map((source) => imageUrl(source, options));
}

/** A single product image by index, clamped to the available range. */
export function productImage(
  set: ProductImageSet,
  index = 0,
  options?: { width?: number; aspect?: AspectKey },
): string {
  const images = productImages(set, options);
  return images[index % images.length];
}

/** Deterministically picks a product photo set, so mock data stays compact. */
export function photoSet(seed: string): ProductImageSet {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PRODUCT_SLOTS[hash % PRODUCT_SLOTS.length];
}

