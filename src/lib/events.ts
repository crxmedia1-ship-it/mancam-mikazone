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
  productViews: ReadonlyArray<{ productId: string; count: number }>;
};

export function emptyStandStats(): StandStats {
  return {
    visits: 0,
    uniqueSessions: 0,
    brochureDownloads: 0,
    registerOpens: 0,
    productViews: [],
  };
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

  return {
    visits,
    uniqueSessions: sessions.size,
    brochureDownloads,
    registerOpens,
    productViews: [...productCounts.entries()]
      .map(([productId, count]) => ({ productId, count }))
      .sort((a, b) => b.count - a.count),
  };
}
