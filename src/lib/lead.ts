import { z } from "zod";
import { PRODUCTS } from "@/data/products";

export const PROFILE_TYPES = [
  "formulator",
  "distributor",
  "contractor",
  "manufacturer",
  "purchasing",
  "other",
] as const;

export const PURCHASE_VOLUMES = [
  "sample",
  "under_1mt",
  "1_10mt",
  "10_50mt",
  "over_50mt",
] as const;

export const PRIMARY_APPLICATIONS = [
  "tile-adhesive",
  "wall-putty",
  "gypsum-plaster",
  "eifs-etics",
  "coatings-paints",
  "self-leveling",
  "concrete-repair",
  "waterproofing",
  "other",
] as const;

export const PROFILE_TYPE_LABELS: Record<(typeof PROFILE_TYPES)[number], string> = {
  formulator: "Formulator / R&D",
  distributor: "Distributor",
  contractor: "Contractor / Applicator",
  manufacturer: "Dry-mix manufacturer",
  purchasing: "Purchasing / Procurement",
  other: "Other",
};

export const PURCHASE_VOLUME_LABELS: Record<
  (typeof PURCHASE_VOLUMES)[number],
  string
> = {
  sample: "Sample / lab evaluation",
  under_1mt: "Under 1 MT",
  "1_10mt": "1 – 10 MT",
  "10_50mt": "10 – 50 MT",
  over_50mt: "50+ MT",
};

export const PRIMARY_APPLICATION_LABELS: Record<
  (typeof PRIMARY_APPLICATIONS)[number],
  string
> = {
  "tile-adhesive": "Tile adhesives",
  "wall-putty": "Skim coat / wall putty",
  "gypsum-plaster": "Gypsum plaster",
  "eifs-etics": "EIFS / ETICS",
  "coatings-paints": "Coatings & paints",
  "self-leveling": "Self-leveling / flooring",
  "concrete-repair": "Concrete & repair",
  waterproofing: "Waterproofing",
  other: "Other",
};

const productIds = PRODUCTS.map((product) => product.id) as [
  string,
  ...string[],
];

export const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  companyName: z.string().trim().min(2, "Enter your company name").max(160),
  email: z.email("Enter a valid work email"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a phone or WhatsApp number")
    .max(40)
    .regex(/^[+\d][\d\s().-]{6,}$/u, "Enter a valid phone number"),
  profileType: z.enum(PROFILE_TYPES, {
    error: "Select your profile",
  }),
  productsOfInterest: z
    .array(z.enum(productIds))
    .min(1, "Select at least one product"),
  purchaseVolume: z.enum(PURCHASE_VOLUMES, {
    error: "Select an estimated volume",
  }),
  primaryApplication: z.enum(PRIMARY_APPLICATIONS, {
    error: "Select a primary application",
  }),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type SubmitLeadResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

export type LeadRecord = {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  profileType: string;
  productsOfInterest: string[];
  purchaseVolume: string;
  primaryApplication: string;
  rating: number | null;
  notes: string;
  source: string | null;
  createdAt: string | null;
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string" && value.length > 0) {
    try {
      const parsed: unknown = JSON.parse(value);
      return asStringArray(parsed);
    } catch {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

function asRating(value: unknown): number | null {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;
  if (!Number.isFinite(numeric)) {
    return null;
  }
  const rounded = Math.round(numeric);
  if (rounded < 1 || rounded > 5) {
    return null;
  }
  return rounded;
}

export function normalizeLead(row: Record<string, unknown>): LeadRecord | null {
  const id = asString(row.id);
  if (!id) return null;

  return {
    id,
    fullName: asString(row.full_name ?? row.fullName),
    companyName: asString(row.company_name ?? row.companyName),
    email: asString(row.email),
    phone: asString(row.phone),
    profileType: asString(row.profile_type ?? row.profileType),
    productsOfInterest: asStringArray(
      row.products_of_interest ?? row.productsOfInterest,
    ),
    purchaseVolume: asString(row.purchase_volume ?? row.purchaseVolume),
    primaryApplication: asString(
      row.primary_application ?? row.primaryApplication,
    ),
    rating: asRating(row.rating),
    notes: asString(row.notes),
    source: asString(row.source) || null,
    createdAt: asString(row.created_at ?? row.createdAt) || null,
  };
}
