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
};

export const PRODUCTS: readonly Product[] = [
  {
    id: "hpmc-mhec",
    slug: "cellulose-ethers-hpmc-mhec",
    sku: "MK-HPMC / MK-MHEC",
    name: "Cellulose Ethers (HPMC / MHEC)",
    shortName: "HPMC / MHEC",
    brand: "MikaZone",
    chemicalName:
      "Hydroxypropyl Methylcellulose (HPMC) / Hydroxyethyl Methylcellulose (MHEC / HEMC)",
    summary:
      "Core water-retention and workability package for dry-mix mortars, tile adhesives, gypsum plasters, and EIFS. Available across viscosity and substitution grades, including surface-treated options for delayed hydration.",
    category: "mortars",
    applications: [
      "C2 tile adhesives and large-format thin-set",
      "Cement and gypsum skim coats / wall putty",
      "EIFS / ETICS adhesive and base coats",
      "Masonry, plastering, and repair mortars",
      "Self-leveling underlayments (selected low-viscosity grades)",
    ],
    benefits: [
      "High water retention for full cement and gypsum hydration",
      "Extended open time with controlled slip resistance",
      "Smooth trowelability and anti-sag on vertical applications",
      "Consistent viscosity batch to batch across MK viscosity ladder",
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
    accent: "#1A6FB5",
  },
  {
    id: "hec",
    slug: "hydroxyethyl-cellulose-hec",
    sku: "MK-HEC",
    name: "Cellulose Ether (HEC)",
    shortName: "HEC",
    brand: "MikaZone",
    chemicalName: "Hydroxyethyl Cellulose",
    summary:
      "Non-ionic thickener and stabilizer for waterborne architectural paints, stone coatings, and personal-care or detergent systems. Builds ICI/KU viscosity with excellent color acceptance and spatter resistance.",
    category: "coatings",
    applications: [
      "Interior and exterior latex architectural paints",
      "Stone emulsion and decorative texture coatings",
      "Construction primers and ready-mix joint compounds",
      "Liquid detergents and household cleaners",
      "Oilfield and industrial thickening where salt tolerance is required",
    ],
    benefits: [
      "Pseudoplastic rheology for brush, roll, and spray",
      "Enzyme-resistant grades for long in-can stability",
      "Compatible with most latex binders and pigments",
      "Low impact on gloss and color development",
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
    accent: "#0E8A6A",
  },
  {
    id: "vae-rpp",
    slug: "vae-redispersible-polymer-powder",
    sku: "MIKA VAE MK3510N",
    name: "MIKA VAE Redispersible Polymer Powder (RPP)",
    shortName: "MIKA VAE RPP",
    brand: "MikaVAE",
    chemicalName: "Vinyl acetate–ethylene copolymer redispersible polymer powder",
    summary:
      "Spray-dried VAE latex that redisperses in water to add flexibility, adhesion, and cohesion to cement and gypsum dry mixes. Designed to work with MikaZone cellulose ethers in tile adhesives, ETICS, and waterproofing mortars.",
    category: "mortars",
    applications: [
      "Flexible and deformable tile adhesives (C2TES1 / S2)",
      "EIFS / ETICS adhesive, base coat, and finishing mortar",
      "Waterproofing and repair mortars",
      "Self-leveling compounds and floor overlays",
      "Gypsum joint fillers and skim coats",
    ],
    benefits: [
      "Higher tensile adhesion and cohesive strength",
      "Improved flexibility and crack bridging",
      "Better freeze–thaw and wet abrasion resistance",
      "Synergistic with HPMC / MHEC for open time and slip",
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
    accent: "#7A4FBF",
  },
  {
    id: "starch-ether-hps",
    slug: "starch-ether-hps",
    sku: "MikaUltra MK301",
    name: "Hydroxypropyl Starch Ether (HPS)",
    shortName: "HPS",
    brand: "MikaUltra",
    chemicalName: "Hydroxypropyl Starch Ether",
    summary:
      "Cost-efficient thickener and anti-sag modifier used with HPMC in tile adhesives, putties, and plasters. Partial cellulose-ether replacement improves knife feel and reduces formulation cost without sacrificing water retention.",
    category: "mortars",
    applications: [
      "Cement-based tile adhesives",
      "Interior and exterior wall putty",
      "Plastering and finishing mortars",
      "Gypsum-based joint compounds",
      "Machine-applied renders",
    ],
    benefits: [
      "Rapid thickening at very low dosage",
      "Improved anti-sag and reduced trowel stick",
      "Can replace 20 – 30% of HPMC while cutting cost 10 – 20%",
      "Compatible with cellulose ethers, RDP, and PCE",
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
    shortName: "PC 201 – PC 204",
    brand: "MikaUltra",
    chemicalName: "Polycarboxylate ether superplasticizer powder (PC 201 – PC 204 grade ladder)",
    summary:
      "High-range water reducer across the PC 201 – PC 204 powder grades for self-leveling mortars, grouts, UHPC, and precast. Delivers up to 40% water reduction with low viscosity, strong slump retention, and compatibility with OPC, blends, and SCMs.",
    category: "concrete",
    applications: [
      "Self-leveling underlayments and screeds",
      "Grouting, duct grout, and repair mortars",
      "UHPC and high-strength precast",
      "Pumpable concrete and flowable fills",
      "Prefabricated building components",
    ],
    benefits: [
      "Water reduction up to 40% at low dosage",
      "High fluidity without segregation or bleed",
      "Sharper mold fill and early strength in precast",
      "Compatible with fly ash, slag, and silica fume",
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
    shortName: "SHP",
    brand: "MikaUltra",
    chemicalName: "Encapsulated silicone resin hydrophobic powder",
    summary:
      "Integral water-repellent for cementitious joint fillers, waterproof mortars, concrete, and EIFS. A hydrophilic shell lets the powder mix uniformly, then forms a breathable silicone network with contact angles above 120°.",
    category: "specialty",
    applications: [
      "Waterproof mortars and slurry coats",
      "Cementitious joint fillers and grouts",
      "EIFS finish coats and base coats",
      "Concrete with reduced capillary uptake",
      "Facades exposed to driving rain and freeze–thaw",
    ],
    benefits: [
      "Reduces water absorption while remaining vapor-open",
      "Contact angle > 120°; capillary uptake cut > 50%",
      "Lower efflorescence and better freeze–thaw durability",
      "Does not compromise compressive strength at recommended dose",
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
  },
  {
    id: "gypsum-retarder",
    slug: "gypsum-plaster-retarder",
    sku: "MikaUltra GR-7011",
    name: "Gypsum Retarder (GR-7011)",
    shortName: "GR-7011",
    brand: "MikaUltra",
    chemicalName: "Protein / amino-acid based gypsum set retarder, grade GR-7011",
    summary:
      "Grade GR-7011 free-flowing retarder that extends the working window of gypsum plaster, lime finish plaster, sheetrock compounds, and set-type joint compounds. Dissolves readily and gives a predictable, linear set curve.",
    category: "specialty",
    applications: [
      "Machine and hand gypsum plaster",
      "Lime-finish and multi-coat interior plaster",
      "Set-type joint compounds and sheetrock plaster",
      "Gypsum-based adhesives and grouts",
      "Prefabricated gypsum elements",
    ],
    benefits: [
      "Extends working time without weakening final hardness",
      "Smooth finishing window for large surfaces",
      "Low dosage with consistent batch response",
      "Compatible with cellulose ethers and starch ethers",
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
    shortName: "DE401 / DE402",
    brand: "MikaUltra",
    chemicalName: "Silicone / polyether powder defoamer for dry-mix systems",
    summary:
      "Rapid foam-control powder for dry-mix mortars, self-leveling compounds, grouts, and spray-applied systems. DE401 and DE402 collapse entrapped air so mixes densify, flow without pinholes, and cure with higher compactness.",
    category: "specialty",
    applications: [
      "Self-leveling underlayments requiring a pinhole-free finish",
      "Grouts and duct grouts where voids weaken the fill",
      "Spray-applied mortars and renders (nozzle foam control)",
      "Repair mortars that must pack densely into cracks",
      "High-flow tile adhesives and grouts",
    ],
    benefits: [
      "Rapid foam collapse during mixing, pumping, and placement",
      "Denser, more uniform texture with fewer voids and pinholes",
      "Higher compactness and strength by minimizing air entrapment",
      "Smoother spray and self-leveling surfaces with less rework",
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
    shortName: "CaFo 98%",
    brand: "MikaUltra",
    chemicalName: "Calcium formate (Ca(HCOO)₂), 98% industrial grade",
    summary:
      "Chloride-lean set accelerator and early-strength aid for tile adhesives, plasters, EIFS, repair mortars, and cold-weather work. Speeds cement hydration so crews grout, coat, or demold sooner.",
    category: "concrete",
    applications: [
      "Tile adhesives requiring earlier grouting",
      "Cement-based plasters and EIFS / ETICS",
      "Repair mortars with rapid return to service",
      "Precast and prefabricated concrete elements",
      "Low-temperature and high-humidity job sites",
    ],
    benefits: [
      "20 – 30% faster setting in typical dry-mix systems",
      "Early strength without chloride-driven corrosion risk",
      "More reliable winter / low-temperature hydration",
      "Compatible with PCE, RDP, and cellulose ethers",
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
    shortName: "PP & Macro Fibers",
    brand: "MikaUltra",
    chemicalName:
      "Alkali-resistant polypropylene monofilament microfibers and synthetic macro fibers",
    summary:
      "Three-dimensional micro- and macro-reinforcement for mortars, overlays, and concrete. Monofilament grades control plastic shrinkage; synthetic macro fibers lift flexural toughness, impact resistance, and freeze–thaw performance in tile adhesives and floors.",
    category: "concrete",
    applications: [
      "Flexible tile adhesives and thin-set mortars",
      "Screeds, overlays, and industrial floors",
      "Shotcrete and repair mortars",
      "Precast elements and architectural concrete",
      "EIFS base coats subject to thermal cycling",
    ],
    benefits: [
      "Reduces plastic shrinkage cracking",
      "Typical flexural strength gain of 15 – 25%",
      "Better impact resistance and post-crack cohesion",
      "Alkali stable in cement paste (pH 12 – 13)",
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
