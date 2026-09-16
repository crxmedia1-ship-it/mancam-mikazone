import { PRODUCTS, getProductById } from "@/data/products";
import {
  PRIMARY_APPLICATION_LABELS,
  PROFILE_TYPE_LABELS,
  PURCHASE_VOLUME_LABELS,
  type LeadRecord,
} from "@/lib/lead";
import type { StandStats } from "@/lib/events";

const EXPO_TIME_ZONE = "America/New_York";

export type ProspectExportRow = Record<string, string | number>;

export function profileLabel(value: string): string {
  return (
    PROFILE_TYPE_LABELS[value as keyof typeof PROFILE_TYPE_LABELS] ??
    (value.trim() ? value : "")
  );
}

export function volumeLabel(value: string): string {
  return (
    PURCHASE_VOLUME_LABELS[value as keyof typeof PURCHASE_VOLUME_LABELS] ??
    (value.trim() ? value : "")
  );
}

export function applicationLabel(value: string): string {
  return (
    PRIMARY_APPLICATION_LABELS[
      value as keyof typeof PRIMARY_APPLICATION_LABELS
    ] ?? (value.trim() ? value : "")
  );
}

export function productDisplayName(id: string): string {
  const product = getProductById(id);
  if (!product) return id;
  return product.name;
}

export function productList(ids: readonly string[]): string {
  return ids.map(productDisplayName).join("; ");
}

export function whatsappHref(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) return null;
  const intl = digits.length === 10 ? `1${digits}` : digits;
  return `https://wa.me/${intl}`;
}

export function standExportStamp(now = new Date()): string {
  const parts = expoParts(now);
  return `${parts.date.replaceAll("-", "")}-${parts.time.replace(":", "")}`;
}

export function standExportBasename(now = new Date()): string {
  return `Mancam-BuildExpo-prospects-${standExportStamp(now)}`;
}

export function formatCapturedAt(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: EXPO_TIME_ZONE,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function leadSearchHaystack(lead: LeadRecord): string {
  return [
    lead.fullName,
    lead.companyName,
    lead.email,
    lead.phone,
    profileLabel(lead.profileType),
    volumeLabel(lead.purchaseVolume),
    applicationLabel(lead.primaryApplication),
    productList(lead.productsOfInterest),
    lead.notes,
    lead.source,
  ]
    .join(" ")
    .toLowerCase();
}

export function sortLeads(
  leads: readonly LeadRecord[],
  sort: "newest" | "company" | "rating",
): LeadRecord[] {
  const copy = [...leads];
  copy.sort((a, b) => {
    if (sort === "company") {
      return a.companyName.localeCompare(b.companyName, "en", {
        sensitivity: "base",
      });
    }
    if (sort === "rating") {
      return (b.rating ?? -1) - (a.rating ?? -1);
    }
    const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
    return bTime - aTime;
  });
  return copy;
}

export function prospectExportRows(
  leads: readonly LeadRecord[],
): ProspectExportRow[] {
  return leads.map((lead, index) => {
    const captured = expoParts(lead.createdAt ? new Date(lead.createdAt) : null);
    const row: ProspectExportRow = {
      "#": index + 1,
      "Captured date": captured.date,
      "Captured time": captured.time,
      "Full name": lead.fullName,
      Company: lead.companyName,
      Role: profileLabel(lead.profileType),
      Email: lead.email,
      Phone: lead.phone,
      WhatsApp: whatsappHref(lead.phone) ?? "",
      "Typical volume": volumeLabel(lead.purchaseVolume),
      "Main application": applicationLabel(lead.primaryApplication),
      Products: productList(lead.productsOfInterest),
    };

    for (const product of PRODUCTS) {
      row[product.shortName] = lead.productsOfInterest.includes(product.id)
        ? "Yes"
        : "";
    }

    row["Stand rating"] = lead.rating ?? "";
    row["Team notes"] = lead.notes;
    row.Source = lead.source ?? "";
    row["Record ID"] = lead.id;
    return row;
  });
}

export function trafficExportRows(
  stats: StandStats,
  registrations: number,
): ProspectExportRow[] {
  return [
    { Metric: "QR visits", Value: stats.visits },
    { Metric: "Unique visitors", Value: stats.uniqueSessions },
    { Metric: "Product details opened", Value: stats.productViewCount },
    { Metric: "Form opens", Value: stats.registerOpens },
    { Metric: "Registrations", Value: registrations },
    { Metric: "Catalog downloads", Value: stats.brochureDownloads },
  ];
}

export function productSummaryExportRows(
  leads: readonly LeadRecord[],
  stats: StandStats,
): ProspectExportRow[] {
  const selected = new Map<string, number>();
  for (const lead of leads) {
    for (const id of lead.productsOfInterest) {
      selected.set(id, (selected.get(id) ?? 0) + 1);
    }
  }
  const opened = new Map(
    stats.productViews.map((item) => [item.productId, item.count]),
  );

  return PRODUCTS.map((product, index) => {
    const timesSelected = selected.get(product.id) ?? 0;
    return {
      Rank: index + 1,
      Product: product.name,
      Subtitle: product.chemicalName,
      "Details opened": opened.get(product.id) ?? 0,
      "Selected in form": timesSelected,
      "% of registrations":
        leads.length > 0
          ? Math.round((timesSelected / leads.length) * 100)
          : 0,
    };
  }).sort(
    (a, b) =>
      Number(b["Selected in form"]) - Number(a["Selected in form"]) ||
      Number(b["Details opened"]) - Number(a["Details opened"]),
  ).map((row, index) => ({ ...row, Rank: index + 1 }));
}

export function prospectsToCsv(leads: readonly LeadRecord[]): string {
  const rows = prospectExportRows(leads);
  const header = Object.keys(
    rows[0] ?? {
      "#": "",
      "Full name": "",
      Company: "",
      Email: "",
      Phone: "",
    },
  );
  const lines = [
    header.map(csvCell).join(","),
    ...rows.map((row) => header.map((key) => csvCell(row[key] ?? "")).join(",")),
  ];
  return `\uFEFF${lines.join("\n")}`;
}

export function downloadNamedFile(
  contents: BlobPart,
  filename: string,
  mime: string,
) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function sheetColumnWidths(rows: ProspectExportRow[]): Array<{ wch: number }> {
  const keys = Object.keys(rows[0] ?? {});
  return keys.map((key) => {
    const longest = rows.reduce((max, row) => {
      const value = String(row[key] ?? "");
      return Math.max(max, value.length);
    }, key.length);
    return { wch: Math.min(Math.max(longest + 2, 12), 42) };
  });
}

function expoParts(date: Date | null): { date: string; time: string } {
  if (!date || Number.isNaN(date.getTime())) {
    return { date: "", time: "" };
  }
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: EXPO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

function csvCell(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}
