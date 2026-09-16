export const PRODUCT_CATEGORY_IDS = [
  "mortars",
  "coatings",
  "concrete",
  "specialty",
] as const;

export type ProductCategoryId = (typeof PRODUCT_CATEGORY_IDS)[number];

export type ProductCategory = {
  id: ProductCategoryId;
  label: "Mortars" | "Coatings" | "Concrete" | "Specialties";
};

export const PRODUCT_CATEGORIES: Record<ProductCategoryId, ProductCategory> = {
  mortars: {
    id: "mortars",
    label: "Mortars",
  },
  coatings: {
    id: "coatings",
    label: "Coatings",
  },
  concrete: {
    id: "concrete",
    label: "Concrete",
  },
  specialty: {
    id: "specialty",
    label: "Specialties",
  },
};

export const CATALOG_FILTERS = [
  { id: "all", label: "All" },
  ...PRODUCT_CATEGORY_IDS.map((id) => ({
    id,
    label: PRODUCT_CATEGORIES[id].label,
  })),
] as const;

export type CatalogFilterId = (typeof CATALOG_FILTERS)[number]["id"];

export type ProductBrand = "MikaZone" | "MikaVAE" | "MikaUltra";

export type TechnicalSpecifications = {
  appearance: string;
  pH?: string;
  moisture?: string;
  viscosity?: string;
  particleSize?: string;
  bulkDensity?: string;
  solidContent?: string;
  purity?: string;
  ashContent?: string;
  gelationTemperature?: string;
  hydroxypropylContent?: string;
  waterInsoluble?: string;
  fiberLength?: string;
  casNumber?: string;
  hsCode?: string;
  additional?: ReadonlyArray<{ readonly label: string; readonly value: string }>;
};

export type ProductPackaging = {
  primary: string;
  pallet: string;
  notes: string;
};

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortName: string;
  brand: ProductBrand;
  chemicalName: string;
  summary: string;
  category: ProductCategoryId;
  applications: readonly string[];
  benefits: readonly string[];
  specifications: TechnicalSpecifications;
  packaging: ProductPackaging;
  recommendedDosage: string;
  accent: string;
  packFront?: string;
  packSide?: string;
  packFit?: "contain" | "cover";
};

export const PRODUCTS: readonly Product[] = [
  {
    id: "hpmc-mhec",
    slug: "cellulose-ethers-hpmc-mhec",
    sku: "MK 200P",
    name: "Cellulose Ether HPMC (Grade MK 200P)",
    shortName: "HPMC Cellulose Ether",
    brand: "MikaZone",
    chemicalName: "Grade MK 200P | For Mortars & Tile Adhesives",
    summary:
      "A multifunctional cellulose ether for cement-based construction materials. It provides water retention, thickening and rheology control, helping formulations deliver consistent application and reliable performance.",
    category: "mortars",
    applications: [
      "Tile adhesives",
      "Wall putty",
      "EIFS",
      "Spray mortars",
      "Cement renders",
      "Dry-mix mortars",
    ],
    benefits: [
      "Improves water retention and reduces premature water loss",
      "Enhances workability and application consistency",
      "Increases sag resistance and extends open time",
      "Supports adhesion and tensile performance",
    ],
    specifications: {
      appearance: "White to off-white free-flowing powder",
      pH: "6.0 – 8.0 (2% solution)",
      moisture: "≤ 5%",
      viscosity: "400 – 200,000 mPa·s (Brookfield, 2%, 20 °C)",
      particleSize: "≥ 99% pass 80–100 mesh",
      gelationTemperature: "60 – 90 °C (grade dependent)",
      ashContent: "≤ 5%",
      casNumber: "9004-65-3 (HPMC) / 9032-42-2 (MHEC)",
      hsCode: "39123900",
      additional: [
        { label: "Methoxy content (HPMC)", value: "19 – 30%" },
        { label: "Hydroxypropyl content (HPMC)", value: "4 – 12%" },
        { label: "Surface treatment", value: "Delayed-solubility grades available" },
      ],
    },
    packaging: {
      primary: "25 kg multi-layer paper bag with PE liner",
      pallet: "500 kg or 1,000 kg per pallet",
      notes: "Keep sealed, dry, and cool. Shelf life 24 months in original packaging.",
    },
    recommendedDosage: "0.20 – 0.50% of dry mix (up to 0.60% in gypsum plasters)",
    accent: "#4DB8C9",
    packFront: "/products/hpmc-front.png",
    packSide: "/products/hpmc-side.png",
  },
  {
    id: "vae-rpp",
    slug: "vae-redispersible-polymer-powder",
    sku: "MK 3510",
    name: "MIKA VAE Redispersible Polymer Powder (Grade 3510)",
    shortName: "RDP – Redispersible Polymer Powder",
    brand: "MikaVAE",
    chemicalName: "Grade 3510 | For Adhesion & Flexibility",
    summary:
      "A VAE redispersible polymer powder designed to improve the performance of cementitious dry-mix systems. When mixed with water, it forms a flexible polymer film that strengthens the bond between mortar components and substrates.",
    category: "mortars",
    applications: [
      "Tile adhesives",
      "Repair mortars",
      "Skim coats",
      "Wall putty",
      "EIFS",
      "Waterproofing mortars",
    ],
    benefits: [
      "Improves adhesion and cohesion",
      "Enhances flexibility and crack resistance",
      "Supports mechanical strength and durability",
      "Improves water resistance and overall mortar performance",
    ],
    specifications: {
      appearance: "White free-flowing powder",
      pH: "5.0 – 8.0 (10% dispersion)",
      moisture: "≤ 2%",
      particleSize: "≥ 98% pass 80 mesh",
      bulkDensity: "400 – 600 g/L",
      solidContent: "≥ 98%",
      ashContent: "10 – 14% (protective colloid / mineral)",
      casNumber: "24937-78-8",
      hsCode: "39019090",
      additional: [
        { label: "Grade", value: "3510" },
        { label: "Glass transition (Tg)", value: "0 – 16 °C (grade dependent)" },
        { label: "Minimum film forming temp.", value: "0 – 5 °C typical" },
        { label: "Protective colloid", value: "Polyvinyl alcohol" },
      ],
    },
    packaging: {
      primary: "25 kg PE-lined paper bag",
      pallet: "500 kg or 1,000 kg per pallet",
      notes: "Protect from humidity and stacking compression. Shelf life 12 months.",
    },
    recommendedDosage: "1 – 5% of dry mix (3 – 8% in flexible C2TES1 / S2 adhesives)",
    accent: "#2BA090",
    packFront: "/products/rdp-front.png",
  },
  {
    id: "hec",
    slug: "hydroxyethyl-cellulose-hec",
    sku: "MK-HEC",
    name: "Cellulose Ether (HEC)",
    shortName: "HEC – Hydroxyethyl Cellulose",
    brand: "MikaZone",
    chemicalName: "Thickener for Paints & Coatings",
    summary:
      "A high-performance, non-ionic cellulose ether that provides thickening, water retention, suspension, stabilization and rheological control in water-based formulations.",
    category: "coatings",
    applications: [
      "Architectural paints",
      "Textured coatings",
      "Adhesives",
      "Polymer emulsions",
      "Construction pastes",
    ],
    benefits: [
      "Provides effective thickening and viscosity stability",
      "Improves water retention and open time",
      "Supports dispersion, suspension and color acceptance",
      "Enhances leveling, workability and spatter resistance",
    ],
    specifications: {
      appearance: "White to off-white powder",
      pH: "6.0 – 8.5 (1% solution)",
      moisture: "≤ 6%",
      viscosity: "300 – 100,000 mPa·s (Brookfield, 2%, 25 °C)",
      particleSize: "≥ 98% pass 80 mesh",
      solidContent: "≥ 94%",
      casNumber: "9004-62-0",
      hsCode: "39123900",
      additional: [
        { label: "Degree of substitution", value: "1.8 – 2.5 typical" },
        { label: "Biostability", value: "Standard and enzyme-resistant grades" },
      ],
    },
    packaging: {
      primary: "25 kg multi-layer paper bag with PE liner",
      pallet: "500 kg or 1,000 kg per pallet",
      notes: "Hygroscopic. Store below 30 °C, RH < 60%. Shelf life 24 months.",
    },
    recommendedDosage: "0.20 – 0.60% of total paint formulation (0.3 – 1.0% in high-build coatings)",
    accent: "#E07A45",
    packFront: "/products/hec-front.png",
    packSide: "/products/hec-side.png",
  },
  {
    id: "starch-ether-hps",
    slug: "starch-ether-hps",
    sku: "MikaUltra MK301",
    name: "Hydroxypropyl Starch Ether (HPS)",
    shortName: "HPS – Hydroxypropyl Starch Ether",
    brand: "MikaUltra",
    chemicalName: "Rheology & Workability Modifier",
    summary:
      "A water-soluble starch ether used as a rheology and thickening modifier in cement- and gypsum-based dry mixes. Low addition levels can provide rapid thickening and smoother application.",
    category: "mortars",
    applications: [
      "Tile adhesives",
      "Cement mortars",
      "Gypsum plasters",
      "Wall putty",
      "Finishing and plastering mortars",
    ],
    benefits: [
      "Improves workability and lubrication",
      "Enhances sag resistance and shape retention",
      "Helps prevent sticking during application",
      "Extends open time and works well with HPMC",
    ],
    specifications: {
      appearance: "White free-flowing powder",
      pH: "8.0 – 11.5 (2%, 25 °C)",
      moisture: "Loss on drying ≤ 10%",
      viscosity: "2,000 – 6,000 mPa·s (5% aqueous, 20 °C)",
      bulkDensity: "0.45 – 0.61 g/cm³",
      solidContent: "≥ 98%",
      hydroxypropylContent: "18.0 – 25.0%",
      casNumber: "9049-76-7",
      hsCode: "39123900",
      additional: [{ label: "Solubility", value: "Cold-water soluble, clear alkaline solution" }],
    },
    packaging: {
      primary: "25 kg multi-layer valve bag",
      pallet: "500 kg or 1,000 kg per pallet",
      notes: "Custom and OEM bags available. Store dry. Shelf life 24 months.",
    },
    recommendedDosage: "0.05 – 0.20% of dry mix; typically paired with a reduced HPMC dose",
    accent: "#C47A1A",
  },
  {
    id: "pce-superplasticizer",
    slug: "pce-superplasticizer",
    sku: "MikaUltra PC201 – PC204",
    name: "PCE Superplasticizer (PC 201 – PC 204)",
    shortName: "PCE – Polycarboxylate Superplasticizer",
    brand: "MikaUltra",
    chemicalName: "Grades PC 201-204 | For Concrete & Mortars",
    summary:
      "A high-efficiency powder superplasticizer that delivers strong water reduction and improved flowability without compromising strength. It is designed for demanding cementitious formulations requiring precision and durability.",
    category: "concrete",
    applications: [
      "High-performance concrete",
      "Self-leveling compounds",
      "Grouts",
      "Repair mortars",
      "Precast components",
      "Industrial floors",
    ],
    benefits: [
      "Provides rapid dispersion and high water reduction",
      "Improves flowability, cohesion and pumpability",
      "Helps maintain workability and slump retention",
      "Minimizes bleeding and segregation",
    ],
    specifications: {
      appearance: "White free-flowing powder",
      pH: "6.0 – 8.0",
      moisture: "≤ 5%",
      viscosity: "400 – 75,000 mPa·s (solution grade dependent)",
      particleSize: "≥ 99% pass 80 mesh",
      casNumber: "70789-60-6",
      hsCode: "38244010",
      additional: [
        { label: "Grade range", value: "PC 201 – PC 204 (water-reduction and slump-retention ladder)" },
        { label: "Water reduction", value: "Up to 40%" },
        { label: "Chloride", value: "Chloride-free formulation" },
      ],
    },
    packaging: {
      primary: "25 kg bag",
      pallet: "500 kg or 1 MT per pallet",
      notes: "Liquid grades available on request. Lead time 7–20 business days.",
    },
    recommendedDosage: "0.10 – 0.50% of binder (optimize for slump retention and set profile)",
    accent: "#C0392B",
  },
  {
    id: "silicone-shp",
    slug: "silicone-hydrophobic-powder",
    sku: "MikaUltra SHP MK980",
    name: "Silicone Hydrophobic Powder (SHP)",
    shortName: "SHP – Hydrophobic Powder",
    brand: "MikaUltra",
    chemicalName: "Silicone-Based Water Repellent Additive",
    summary:
      "A silicone-based powder water repellent for cementitious dry-mix systems. It reduces liquid-water penetration while helping the finished material maintain vapor permeability.",
    category: "specialty",
    applications: [
      "Waterproof mortars",
      "Plasters and renders",
      "Joint fillers",
      "EIFS",
      "Decorative mortars",
      "Exterior wall systems",
    ],
    benefits: [
      "Provides strong and long-lasting water repellency",
      "Creates a visible water-beading effect",
      "Disperses easily in dry-mix formulations",
      "Maintains compatibility and mechanical performance",
    ],
    specifications: {
      appearance: "White free-flowing powder",
      pH: "10 – 12",
      moisture: "≤ 3%",
      particleSize: "200 mesh",
      bulkDensity: "250 – 400 g/L",
      casNumber: "63148-62-9",
      hsCode: "38244090",
      additional: [
        { label: "Grade", value: "MK980" },
        { label: "Water contact angle", value: "> 120°" },
        { label: "Service range", value: "−30 °C to 150 °C" },
      ],
    },
    packaging: {
      primary: "25 kg bag",
      pallet: "500 kg or 1 MT per pallet; custom packs available",
      notes: "Store 10–30 °C, RH < 60%, away from UV. Shelf life 24 months. Max 3 pallet layers.",
    },
    recommendedDosage: "0.20 – 2.0% by weight of dry mix (0.05 – 0.30% in selected gypsum systems)",
    accent: "#1F6F8B",
    packFront: "/products/shp.jpg",
    packFit: "cover",
  },
  {
    id: "gypsum-retarder",
    slug: "gypsum-plaster-retarder",
    sku: "MikaUltra GR-7011",
    name: "Gypsum Retarder (GR-7011)",
    shortName: "Gypsum Retarder",
    brand: "MikaUltra",
    chemicalName: "Grade GR-7011 | Set-Control Additive",
    summary:
      "A set-control additive developed to delay and regulate the setting time of gypsum-based materials. It provides additional working time so products can be applied and finished more consistently.",
    category: "specialty",
    applications: [
      "Gypsum plaster",
      "Gypsum putty",
      "Gypsum self-leveling compounds",
      "Joint compounds",
      "Prefabricated gypsum components",
    ],
    benefits: [
      "Extends setting and working time",
      "Improves workability and ease of application",
      "Helps produce smoother, more consistent finishes",
      "Reduces premature setting and material waste",
    ],
    specifications: {
      appearance: "Light yellow free-flowing powder",
      pH: "6.0 – 8.0",
      moisture: "≤ 5%",
      particleSize: "≥ 99% pass 80 mesh",
      casNumber: "9000-70-8",
      hsCode: "38244090",
      additional: [
        { label: "Grade", value: "GR-7011" },
        { label: "Set extension", value: "Typically +30 to +90 minutes, dose dependent" },
        { label: "Solubility", value: "Readily water soluble" },
      ],
    },
    packaging: {
      primary: "25 kg bag",
      pallet: "500 kg or 1 MT per pallet",
      notes: "Keep dry. Recalibrate dose when gypsum source or temperature changes.",
    },
    recommendedDosage: "0.05 – 0.30% of gypsum binder (confirm with Vicat set on local plaster)",
    accent: "#B8860B",
  },
  {
    id: "powder-defoamer",
    slug: "powder-defoamer-de401-de402",
    sku: "MikaUltra DE401 / DE402",
    name: "Powder Defoamer (DE401 / DE402)",
    shortName: "Powder Defoamer",
    brand: "MikaUltra",
    chemicalName: "Grades DE401 / DE402 | Air & Foam Control",
    summary:
      "A modified polyether-based powder additive that breaks down foam, promotes air release and suppresses the formation of unwanted bubbles in dry-mix formulations.",
    category: "specialty",
    applications: [
      "Self-leveling compounds",
      "Grouts",
      "Repair mortars",
      "Waterproofing systems",
      "Cementitious dry mixes",
    ],
    benefits: [
      "Provides fast defoaming and lasting foam suppression",
      "Reduces entrapped air and internal voids",
      "Improves surface appearance and finish",
      "Offers good dispersibility without affecting core mortar properties",
    ],
    specifications: {
      appearance: "Light yellow free-flowing powder",
      pH: "6.0 – 8.0",
      moisture: "≤ 5%",
      particleSize: "≥ 99% pass 80 mesh",
      casNumber: "68554-65-4",
      hsCode: "3208901909",
      additional: [
        {
          label: "Grades",
          value: "DE401 (standard) / DE402 (high-activity rapid knock-down)",
        },
        {
          label: "Foam control",
          value: "Rapid collapse in seconds to minutes under high shear",
        },
        {
          label: "Active system",
          value: "Silicone / polyether on an inert powder carrier",
        },
      ],
    },
    packaging: {
      primary: "25 kg bag",
      pallet: "500 kg or 1 MT per pallet",
      notes: "Keep dry. Lead time 7–20 business days. Custom packs available.",
    },
    recommendedDosage:
      "0.01 – 0.05% of dry mix (0.10 – 0.50% in high-foam grouts and spray mortars)",
    accent: "#2C3E6B",
  },
  {
    id: "calcium-formate",
    slug: "calcium-formate",
    sku: "MikaUltra CaFo 98%",
    name: "Calcium Formate (98% Industrial Grade)",
    shortName: "Calcium Formate",
    brand: "MikaUltra",
    chemicalName: "98% | Early Strength Accelerator",
    summary:
      "A high-purity early-strength accelerator for cementitious construction materials. It promotes cement hydration and supports faster strength development, especially when early performance is important.",
    category: "concrete",
    applications: [
      "Tile adhesives",
      "Dry-mix mortars",
      "Repair mortars",
      "Concrete",
      "Cold-weather applications",
    ],
    benefits: [
      "Accelerates early strength development",
      "Supports faster setting and construction cycles",
      "Performs well in low-temperature conditions",
      "Provides stable and consistent formulation performance",
    ],
    specifications: {
      appearance: "White crystalline powder, high flow",
      pH: "6.0 – 8.0",
      moisture: "≤ 0.5%",
      purity: "Total calcium ≥ 98% (industrial grade)",
      waterInsoluble: "≤ 0.3%",
      casNumber: "544-17-2",
      hsCode: "29151290",
      additional: [
        { label: "Drying loss (105 °C)", value: "≤ 1.0%" },
        { label: "Chloride", value: "< 0.5% (EN-oriented construction grade)" },
      ],
    },
    packaging: {
      primary: "25 kg bag",
      pallet: "500 kg or 1 MT per pallet",
      notes: "Sealed, dry storage 10–30 °C. Shelf life 24 months; use within 6 months of opening.",
    },
    recommendedDosage:
      "0.30 – 0.80% of cement in tile adhesive / plaster; 0.50 – 1.50% in repair mortars",
    accent: "#4A7C59",
  },
  {
    id: "synthetic-fibers",
    slug: "synthetic-fibers",
    sku: "MikaUltra PP / Macro Fiber",
    name: "Polypropylene Monofilament & Synthetic Macro Fibers",
    shortName: "Concrete Reinforcement Fibers",
    brand: "MikaUltra",
    chemicalName: "PP Monofilament Microfiber & Synthetic Macrofiber",
    summary:
      "Two polypropylene fiber solutions designed for different reinforcement needs in concrete and mortar.",
    category: "concrete",
    applications: [
      "Concrete and mortars",
      "Industrial floors",
      "Pavements",
      "Slabs",
      "Precast concrete",
      "Shotcrete",
    ],
    benefits: [
      "PP Monofilament Microfiber: creates a three-dimensional reinforcing network that helps control plastic shrinkage and early-age microcracking while improving cohesion and surface integrity.",
      "Synthetic Macrofiber: provides structural reinforcement after cracking, improving load transfer, residual strength, toughness, impact resistance and fatigue performance.",
      "Both options are lightweight, corrosion-resistant and chemically stable.",
      "Easy to handle and disperse in cementitious mixtures.",
    ],
    specifications: {
      appearance: "White virgin polypropylene monofilament and synthetic macro fibers",
      fiberLength: "Monofilament 3 / 6 / 12 / 19 mm; macro fiber 25 – 54 mm cuts",
      purity: "Virgin PP, alkali resistant",
      casNumber: "9003-07-0",
      hsCode: "55034000",
      additional: [
        { label: "Density", value: "0.91 g/cm³" },
        { label: "Diameter", value: "18 – 35 μm (monofilament); 0.5 – 1.0 mm (macro)" },
        { label: "Melting point", value: "160 – 170 °C" },
        { label: "Tensile strength", value: "≥ 300 MPa (monofilament); ≥ 500 MPa (macro)" },
      ],
    },
    packaging: {
      primary: "0.6 kg water-soluble bags or 10–20 kg cartons",
      pallet: "Bulk cartons on pallet; custom pre-weigh packs for dry-mix plants",
      notes: "Keep away from heat and UV. Disperse with aggregates before water addition.",
    },
    recommendedDosage: "0.10 – 0.50% of dry mix, or 0.6 – 1.2 kg/m³ in concrete and screeds",
    accent: "#5C4B51",
  },
];

export type ProductId = (typeof PRODUCTS)[number]["id"];

export const FEATURED_PRODUCT_IDS = ["hpmc-mhec", "vae-rpp"] as const;

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function getProductsByIds(ids: readonly string[]): Product[] {
  const uniqueIds = [...new Set(ids)];
  return uniqueIds
    .map((id) => getProductById(id))
    .filter((product): product is Product => product !== undefined);
}

export function filterProductsByCategory(
  selectedCategory: CatalogFilterId,
): readonly Product[] {
  if (selectedCategory === "all") {
    return PRODUCTS;
  }

  return PRODUCTS.filter((product) => product.category === selectedCategory);
}
