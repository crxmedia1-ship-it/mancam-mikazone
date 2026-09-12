export type SackShowcase = {
  productId: string;
  shortName: string;
  chemical: string;
  front: string;
  side?: string;
  accent: string;
  introRotate: number;
};

export const SACK_SHOWCASE: readonly SackShowcase[] = [
  {
    productId: "hpmc-mhec",
    shortName: "HPMC 200P",
    chemical: "Hydroxypropyl Methyl Cellulose",
    front: "/products/hpmc-front.png",
    side: "/products/hpmc-side.png",
    accent: "#4DB8C9",
    introRotate: -4,
  },
  {
    productId: "vae-rpp",
    shortName: "RDP 3510",
    chemical: "Redispersible Polymer Powder",
    front: "/products/rdp-front.png",
    accent: "#2BA090",
    introRotate: 4,
  },
  {
    productId: "hec",
    shortName: "HEC",
    chemical: "Hydroxyethyl Cellulose",
    front: "/products/hec-front.png",
    side: "/products/hec-side.png",
    accent: "#E07A45",
    introRotate: 0,
  },
];

export const SACK_LINEUP = [
  SACK_SHOWCASE[0],
  SACK_SHOWCASE[2],
  SACK_SHOWCASE[1],
] as const;

export const SACK_REST_ROTATE = [-4, 0, 4] as const;

export const SACK_IMAGE_SRC = [
  ...new Set(
    SACK_SHOWCASE.flatMap((sack) =>
      sack.side ? [sack.front, sack.side] : [sack.front],
    ),
  ),
];
