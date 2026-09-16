export const STAND_EVENT_TYPES = [
  "visit",
  "product_view",
  "brochure_download",
  "register_open",
] as const;

export type StandEventType = (typeof STAND_EVENT_TYPES)[number];

export type StandEventRecord = {
  id: string;
  eventType: StandEventType;
  productId: string | null;
  sessionId: string;
  createdAt: string;
};

export type StandStats = {
  visits: number;
  uniqueSessions: number;
  brochureDownloads: number;
  registerOpens: number;
  productViewCount: number;
  productViews: ReadonlyArray<{ productId: string; count: number }>;
};

export type StandFunnelStep = {
  key: "visits" | "product_details" | "form_opens" | "registrations";
  label: string;
  value: number;
  shareOfVisits: number | null;
};

export function emptyStandStats(): StandStats {
  return {
    visits: 0,
    uniqueSessions: 0,
    brochureDownloads: 0,
    registerOpens: 0,
    productViewCount: 0,
    productViews: [],
  };
}

export function sharePercent(part: number, whole: number): number | null {
  if (whole <= 0) return null;
  return Math.round((part / whole) * 100);
}

export function standFunnel(
  stats: StandStats,
  registrations: number,
): StandFunnelStep[] {
  return [
    {
      key: "visits",
      label: "QR visits",
      value: stats.visits,
      shareOfVisits: stats.visits > 0 ? 100 : null,
    },
    {
      key: "product_details",
      label: "Product details",
      value: stats.productViewCount,
      shareOfVisits: sharePercent(stats.productViewCount, stats.visits),
    },
    {
      key: "form_opens",
      label: "Form opens",
      value: stats.registerOpens,
      shareOfVisits: sharePercent(stats.registerOpens, stats.visits),
    },
    {
      key: "registrations",
      label: "Registrations",
      value: registrations,
      shareOfVisits: sharePercent(registrations, stats.visits),
    },
  ];
}

export function completeProductRanking(
  productViews: StandStats["productViews"],
  catalogIds: readonly string[],
): Array<{ productId: string; count: number }> {
  const counts = new Map(
    productViews.map((item) => [item.productId, item.count]),
  );
  const catalog = new Set(catalogIds);
  const ranked = catalogIds.map((productId) => ({
    productId,
    count: counts.get(productId) ?? 0,
  }));
  const unknown = productViews.filter((item) => !catalog.has(item.productId));
  return [...ranked, ...unknown].sort(
    (a, b) => b.count - a.count || a.productId.localeCompare(b.productId),
  );
}

function asEventType(value: unknown): StandEventType | null {
  if (typeof value !== "string") return null;
  return STAND_EVENT_TYPES.includes(value as StandEventType)
    ? (value as StandEventType)
    : null;
}

export function normalizeStandEvent(
  row: Record<string, unknown>,
): StandEventRecord | null {
  const id = typeof row.id === "string" ? row.id : "";
  const eventType = asEventType(row.event_type ?? row.eventType);
  const sessionId =
    typeof row.session_id === "string"
      ? row.session_id
      : typeof row.sessionId === "string"
        ? row.sessionId
        : "";
  if (!id || !eventType || !sessionId) return null;

  const productRaw = row.product_id ?? row.productId;
  const createdAt = row.created_at ?? row.createdAt;

  return {
    id,
    eventType,
    productId: typeof productRaw === "string" && productRaw ? productRaw : null,
    sessionId,
    createdAt: typeof createdAt === "string" ? createdAt : "",
  };
}

export function summarizeStandEvents(
  events: readonly StandEventRecord[],
): StandStats {
  const sessions = new Set<string>();
  const productCounts = new Map<string, number>();
  let visits = 0;
  let brochureDownloads = 0;
  let registerOpens = 0;

  for (const event of events) {
    sessions.add(event.sessionId);
    if (event.eventType === "visit") visits += 1;
    if (event.eventType === "brochure_download") brochureDownloads += 1;
    if (event.eventType === "register_open") registerOpens += 1;
    if (event.eventType === "product_view" && event.productId) {
      productCounts.set(
        event.productId,
        (productCounts.get(event.productId) ?? 0) + 1,
      );
    }
  }

  const productViews = [...productCounts.entries()]
    .map(([productId, count]) => ({ productId, count }))
    .sort((a, b) => b.count - a.count);

  return {
    visits,
    uniqueSessions: sessions.size,
    brochureDownloads,
    registerOpens,
    productViewCount: productViews.reduce((sum, item) => sum + item.count, 0),
    productViews,
  };
}
