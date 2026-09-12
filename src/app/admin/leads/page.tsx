"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Image from "next/image";
import {
  Download,
  Eye,
  FileSpreadsheet,
  LoaderCircle,
  Lock,
  Mail,
  Phone,
  QrCode,
  RefreshCw,
  Star,
  Users,
} from "lucide-react";
import {
  loadAdminDashboard,
  updateLeadNotes,
  updateLeadRating,
} from "@/app/actions/admin";
import { PRODUCTS, getProductById } from "@/data/products";
import {
  PRIMARY_APPLICATION_LABELS,
  PROFILE_TYPE_LABELS,
  PURCHASE_VOLUME_LABELS,
  type LeadRecord,
} from "@/lib/lead";
import {
  emptyStandStats,
  summarizeStandEvents,
  type StandStats,
} from "@/lib/events";

const ADMIN_UNLOCK_KEY = "mancam-mikazone:admin-unlocked";
const EVENT_PIN = process.env.NEXT_PUBLIC_EVENT_PIN?.trim() || "2026";
const MIKAZONE_LOGO =
  "https://res.cloudinary.com/dgphys1xd/image/upload/v1788991971/PHOTO-2026-09-07-18-40-08_zw0udk.jpg";

const unlockListeners = new Set<() => void>();
let memoryUnlocked = false;

function readUnlocked(): boolean {
  try {
    return window.sessionStorage.getItem(ADMIN_UNLOCK_KEY) === "1" || memoryUnlocked;
  } catch {
    return memoryUnlocked;
  }
}

function emitUnlocked() {
  for (const listener of unlockListeners) {
    listener();
  }
}

function subscribeToUnlock(listener: () => void) {
  unlockListeners.add(listener);
  return () => {
    unlockListeners.delete(listener);
  };
}

function setSessionUnlocked(next: boolean) {
  memoryUnlocked = next;
  try {
    if (next) {
      window.sessionStorage.setItem(ADMIN_UNLOCK_KEY, "1");
    } else {
      window.sessionStorage.removeItem(ADMIN_UNLOCK_KEY);
    }
  } catch {
    // Private mode can block sessionStorage; in-memory state still unlocks this tab.
  }
  emitUnlocked();
}

function profileLabel(value: string): string {
  return (
    PROFILE_TYPE_LABELS[value as keyof typeof PROFILE_TYPE_LABELS] ?? value
  );
}

function volumeLabel(value: string): string {
  return (
    PURCHASE_VOLUME_LABELS[value as keyof typeof PURCHASE_VOLUME_LABELS] ??
    value
  );
}

function applicationLabel(value: string): string {
  return (
    PRIMARY_APPLICATION_LABELS[
      value as keyof typeof PRIMARY_APPLICATION_LABELS
    ] ?? value
  );
}

function productLabels(ids: readonly string[]): string {
  return ids
    .map((id) => getProductById(id)?.shortName ?? id)
    .join(", ");
}

function formatCapturedAt(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function fileStamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
}

function csvCell(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function downloadCsvBackup(leads: LeadRecord[], stats: StandStats) {
  const header = [
    "Name",
    "Company",
    "Email",
    "Phone",
    "Products",
    "Rating",
    "Notes",
    "Captured",
  ];
  const rows = leads.map((lead) => [
    lead.fullName,
    lead.companyName,
    lead.email,
    lead.phone,
    productLabels(lead.productsOfInterest),
    lead.rating ?? "",
    lead.notes,
    lead.createdAt ?? "",
  ]);
  const traffic = [
    [],
    ["Metric", "Value"],
    ["QR / link visits", stats.visits],
    ["Unique phones / sessions", stats.uniqueSessions],
    ["Registrations", leads.length],
    ["Brochure downloads", stats.brochureDownloads],
    ["Register form opens", stats.registerOpens],
  ];
  const csv = [header, ...rows, ...traffic]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Mancam-MikaZone-stand-${fileStamp()}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function AdminLeadsPage() {
  const unlocked = useSyncExternalStore(
    subscribeToUnlock,
    readUnlocked,
    () => false,
  );

  if (!unlocked) {
    return <PinLockScreen onUnlock={() => setSessionUnlocked(true)} />;
  }

  return <LeadsDashboard onLock={() => setSessionUnlocked(false)} />;
}

function PinLockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const expectedLength = EVENT_PIN.length || 4;

  function evaluatePin(nextPin: string) {
    if (nextPin.length < expectedLength) {
      setPin(nextPin);
      return;
    }
    if (nextPin === EVENT_PIN) {
      onUnlock();
      return;
    }
    setError("Incorrect PIN. Try again.");
    setPin("");
  }

  function appendDigit(digit: string) {
    setError(null);
    if (pin.length >= expectedLength) return;
    evaluatePin(`${pin}${digit}`);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Backspace") {
        event.preventDefault();
        setError(null);
        setPin((current) => current.slice(0, -1));
        return;
      }
      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        appendDigit(event.key);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pin]);

  return (
    <div className="flex min-h-dvh flex-col bg-sand px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
        <Image
          src={MIKAZONE_LOGO}
          alt="MikaZone USA"
          width={280}
          height={90}
          priority
          className="mx-auto h-14 w-auto object-contain sm:h-16"
        />
        <p className="mt-6 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-mika">
          Stand team
        </p>
        <h1 className="font-display mt-2 text-center text-[2rem] leading-none tracking-tight text-usa">
          Commercial panel
        </h1>
        <p className="mt-3 text-center text-[15px] leading-6 text-slate-600">
          Enter the stand PIN to see live visitors, registrations, and export
          Excel.
        </p>

        <div className="mt-8 flex justify-center gap-2.5">
          {Array.from({ length: expectedLength }, (_, index) => (
            <span
              key={index}
              className={`h-14 w-11 rounded-2xl border text-center text-2xl font-semibold leading-[3.4rem] ${
                pin.length > index
                  ? "border-mika bg-mika text-white"
                  : "border-usa/15 bg-white text-transparent"
              }`}
            >
              •
            </span>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-2.5">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => appendDigit(digit)}
              className="h-16 touch-manipulation rounded-2xl bg-white text-[1.65rem] font-semibold text-usa shadow-[0_1px_0_rgba(60,59,110,0.06)] ring-1 ring-usa/10 active:bg-mika/10 sm:h-[4.25rem]"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setError(null);
              setPin("");
            }}
            className="h-16 touch-manipulation rounded-2xl bg-white text-sm font-semibold text-usa/60 ring-1 ring-usa/10 sm:h-[4.25rem]"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => appendDigit("0")}
            className="h-16 touch-manipulation rounded-2xl bg-white text-[1.65rem] font-semibold text-usa shadow-[0_1px_0_rgba(60,59,110,0.06)] ring-1 ring-usa/10 active:bg-mika/10 sm:h-[4.25rem]"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setPin((current) => current.slice(0, -1));
            }}
            className="h-16 touch-manipulation rounded-2xl bg-white text-sm font-semibold text-usa/60 ring-1 ring-usa/10 sm:h-[4.25rem]"
          >
            Delete
          </button>
        </div>

        {error ? (
          <p className="mt-5 text-center text-sm font-medium text-usa-red">
            {error}
          </p>
        ) : (
          <p className="mt-5 text-center text-sm text-usa/45">
            On a computer, you can type the PIN with the keyboard.
          </p>
        )}
      </div>
    </div>
  );
}

function LeadsDashboard({ onLock }: { onLock: () => void }) {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [stats, setStats] = useState<StandStats>(emptyStandStats);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"ok" | "error">("ok");
  const notesDrafts = useRef<Record<string, string>>({});

  const loadLeads = useCallback(async (mode: "initial" | "manual" | "poll" = "initial") => {
    if (mode === "manual") setRefreshing(true);

    try {
      const result = await loadAdminDashboard();
      if (result.ok) {
        setLeads(result.data.leads);
        setStats(summarizeStandEvents(result.data.events));
        if (mode === "manual") {
          setStatusTone("ok");
          setStatus(
            `Updated · ${result.data.leads.length} prospect${
              result.data.leads.length === 1 ? "" : "s"
            } · ${result.data.events.length} stand events`,
          );
        } else if (mode === "initial") {
          setStatus(null);
        }
      } else {
        setStatusTone("error");
        setStatus(result.error);
      }
    } catch (error) {
      setStatusTone("error");
      setStatus(
        error instanceof Error && /load failed|failed to fetch/i.test(error.message)
          ? "Could not reach the stand database. Tap Refresh."
          : error instanceof Error
            ? error.message
            : "Could not load the stand panel.",
      );
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void loadLeads("initial");

    const poll = window.setInterval(() => {
      if (cancelled || document.visibilityState === "hidden") return;
      void loadLeads("poll");
    }, 8000);

    function onVisible() {
      if (document.visibilityState === "visible") void loadLeads("poll");
    }
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [loadLeads]);

  async function updateRating(leadId: string, rating: number) {
    const nextRating = leads.find((lead) => lead.id === leadId)?.rating === rating ? null : rating;
    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId ? { ...lead, rating: nextRating } : lead,
      ),
    );

    try {
      const result = await updateLeadRating(leadId, nextRating);
      if (!result.ok) {
        setStatusTone("error");
        setStatus(result.error);
        void loadLeads("poll");
      }
    } catch {
      setStatusTone("error");
      setStatus("Could not save the rating. Tap Refresh.");
      void loadLeads("poll");
    }
  }

  async function saveNotes(leadId: string, notes: string) {
    const previous = leads.find((lead) => lead.id === leadId)?.notes ?? "";
    if (previous === notes) return;

    setLeads((current) =>
      current.map((lead) => (lead.id === leadId ? { ...lead, notes } : lead)),
    );

    try {
      const result = await updateLeadNotes(leadId, notes);
      if (!result.ok) {
        setStatusTone("error");
        setStatus(result.error);
        void loadLeads("poll");
      }
    } catch {
      setStatusTone("error");
      setStatus("Could not save the note. Tap Refresh.");
      void loadLeads("poll");
    }
  }

  async function exportExcel() {
    setExporting(true);
    try {
      const XLSX = await import("xlsx");
      const leadRows = leads.map((lead) => ({
        Name: lead.fullName,
        Company: lead.companyName,
        Email: lead.email,
        Phone: lead.phone,
        Profile: profileLabel(lead.profileType),
        Volume: volumeLabel(lead.purchaseVolume),
        Application: applicationLabel(lead.primaryApplication),
        Products: productLabels(lead.productsOfInterest),
        Rating: lead.rating ?? "",
        Notes: lead.notes,
        Captured: lead.createdAt ?? "",
        Source: lead.source ?? "",
      }));

      const summaryRows = [
        { Metric: "QR / link visits", Value: stats.visits },
        { Metric: "Unique phones / sessions", Value: stats.uniqueSessions },
        { Metric: "Registrations", Value: leads.length },
        { Metric: "Brochure downloads", Value: stats.brochureDownloads },
        { Metric: "Register form opens", Value: stats.registerOpens },
      ];

      const productRows =
        stats.productViews.length > 0
          ? stats.productViews.map((item, index) => ({
              Rank: index + 1,
              Product: getProductById(item.productId)?.shortName ?? item.productId,
              SpecTaps: item.count,
            }))
          : PRODUCTS.map((product) => ({
              Rank: "",
              Product: product.shortName,
              SpecTaps: 0,
            }));

      const workbook = XLSX.utils.book_new();
      const leadsSheet = XLSX.utils.json_to_sheet(
        leadRows.length > 0 ? leadRows : [{ Name: "" }],
      );
      leadsSheet["!cols"] = Object.keys(leadRows[0] ?? { Name: "" }).map(() => ({
        wch: 24,
      }));
      XLSX.utils.book_append_sheet(workbook, leadsSheet, "Leads");
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(summaryRows),
        "Traffic",
      );
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(productRows),
        "Product taps",
      );
      XLSX.writeFile(workbook, `Mancam-MikaZone-stand-${fileStamp()}.xlsx`);
      setStatusTone("ok");
      setStatus("Exported leads, traffic, and product taps to Excel.");
    } catch (error) {
      try {
        downloadCsvBackup(leads, stats);
        setStatusTone("ok");
        setStatus("Excel was blocked on this phone, so a CSV file was downloaded instead.");
      } catch {
        setStatusTone("error");
        setStatus(
          error instanceof Error && /load failed|failed to fetch/i.test(error.message)
            ? "Could not export on this phone. Try from a computer."
            : error instanceof Error
              ? error.message
              : "Could not export the Excel file.",
        );
      }
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-sand">
      <header className="sticky top-0 z-20 border-b border-usa/10 bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-4">
          <div className="flex items-center gap-3">
            <Image
              src={MIKAZONE_LOGO}
              alt="MikaZone USA"
              width={180}
              height={60}
              className="h-10 w-auto object-contain sm:h-11"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-mika">
                Mancam · MikaZone stand
              </p>
              <h1 className="font-display truncate text-xl leading-none tracking-tight text-usa sm:text-2xl">
                Commercial panel
              </h1>
            </div>
            <p className="ml-auto shrink-0 text-right text-xs font-semibold text-usa lg:hidden">
              <span className="tabular-nums">{leads.length}</span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-usa/45">
                prospects
              </span>
            </p>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <span
              aria-live="polite"
              className="inline-flex items-center gap-2 rounded-full bg-sand px-3 py-2 text-sm text-usa"
            >
              <Users className="size-4 text-mika" />
              <strong className="tabular-nums">{leads.length}</strong>
              live lead{leads.length === 1 ? "" : "s"}
            </span>
            <DashboardActions
              refreshing={refreshing}
              exporting={exporting}
              onRefresh={() => void loadLeads("manual")}
              onExport={() => void exportExcel()}
              onLock={onLock}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-5 pb-[calc(5.75rem+env(safe-area-inset-bottom))] sm:px-6 lg:pb-8">
        {status ? (
          <p
            className={`mb-4 rounded-2xl px-4 py-3 text-sm ${
              statusTone === "ok"
                ? "bg-mika/10 text-mika-dark"
                : "bg-red-50 text-red-800"
            }`}
          >
            {status}
          </p>
        ) : null}

        <div className="mb-5 grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-5">
          <StatCard
            icon={<QrCode className="size-4" />}
            label="QR visits"
            value={stats.visits}
          />
          <StatCard
            icon={<Users className="size-4" />}
            label="Unique phones"
            value={stats.uniqueSessions}
          />
          <StatCard
            icon={<Download className="size-4" />}
            label="Registrations"
            value={leads.length}
          />
          <StatCard
            icon={<Eye className="size-4" />}
            label="Catalog downloads"
            value={stats.brochureDownloads}
          />
          <StatCard
            icon={<Users className="size-4" />}
            label="Form opens"
            value={stats.registerOpens}
            className="col-span-2 xl:col-span-1"
          />
        </div>

        <div className="mb-5 overflow-hidden rounded-[24px] bg-white ring-1 ring-usa/10">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <h2 className="text-sm font-semibold text-usa">Grades opened</h2>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-usa/40">
              Spec taps
            </p>
          </div>
          {stats.productViews.length === 0 ? (
            <p className="px-4 pb-5 text-sm text-slate-500">
              Numbers appear as visitors open grades on the stand QR.
            </p>
          ) : (
            <ol className="divide-y divide-usa/10">
              {stats.productViews.slice(0, 8).map((item, index) => {
                const max = stats.productViews[0]?.count || 1;
                return (
                  <li
                    key={item.productId}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <span className="w-5 text-xs font-bold text-usa/35">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-usa">
                        {getProductById(item.productId)?.shortName ?? item.productId}
                      </p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sand">
                        <div
                          className="h-full rounded-full bg-mika"
                          style={{ width: `${Math.round((item.count / max) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="tabular-nums text-sm font-bold text-usa">
                      {item.count}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="overflow-hidden rounded-[24px] bg-white ring-1 ring-usa/10">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-sm font-semibold text-usa">Prospects</h2>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-usa/40">
              {leads.length} live
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-usa/50">
              <LoaderCircle className="size-5 animate-spin" />
              Loading prospects…
            </div>
          ) : leads.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-display text-2xl text-usa">No prospects yet</p>
              <p className="mt-2 text-sm text-slate-500">
                New stand registrations appear here automatically.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 p-3 lg:hidden">
                {leads.map((lead) => (
                  <LeadMobileCard
                    key={lead.id}
                    lead={lead}
                    onRate={(rating) => void updateRating(lead.id, rating)}
                    onSaveNotes={(notes) => void saveNotes(lead.id, notes)}
                    onDraftNotes={(notes) => {
                      notesDrafts.current[lead.id] = notes;
                    }}
                  />
                ))}
              </div>
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-[980px] w-full text-left text-sm">
                  <thead className="bg-sand text-xs font-bold uppercase tracking-wide text-usa/70">
                    <tr>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Volume</th>
                      <th className="px-4 py-3">Interest</th>
                      <th className="px-4 py-3">Rating</th>
                      <th className="px-4 py-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-t border-usa/10 align-top transition hover:bg-sand/60"
                      >
                        <td className="px-4 py-4">
                          <p className="font-semibold text-usa">{lead.fullName}</p>
                          <a
                            href={`mailto:${lead.email}`}
                            className="mt-1 block text-mika-dark hover:underline"
                          >
                            {lead.email}
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="mt-0.5 block text-mika-dark hover:underline"
                          >
                            {lead.phone}
                          </a>
                          <p className="mt-2 text-xs text-usa/40">
                            {formatCapturedAt(lead.createdAt)}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-usa">{lead.companyName}</p>
                          <p className="mt-1 text-slate-500">
                            {profileLabel(lead.profileType)}
                          </p>
                          <p className="mt-1 text-xs text-usa/40">
                            {applicationLabel(lead.primaryApplication)}
                          </p>
                        </td>
                        <td className="px-4 py-4 font-medium text-usa">
                          {volumeLabel(lead.purchaseVolume)}
                        </td>
                        <td className="px-4 py-4">
                          <ProductTags ids={lead.productsOfInterest} />
                        </td>
                        <td className="px-4 py-4">
                          <StarRating
                            value={lead.rating}
                            onChange={(rating) => void updateRating(lead.id, rating)}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <textarea
                            defaultValue={lead.notes}
                            rows={3}
                            placeholder="Conversation notes…"
                            className="w-56 resize-y rounded-xl border border-usa/10 bg-sand px-3 py-2 text-[16px] text-usa outline-none focus:border-mika lg:text-sm"
                            onChange={(event) => {
                              notesDrafts.current[lead.id] = event.target.value;
                            }}
                            onBlur={(event) => {
                              void saveNotes(lead.id, event.target.value.trim());
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-usa/10 bg-white/95 px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <DashboardActions
          refreshing={refreshing}
          exporting={exporting}
          onRefresh={() => void loadLeads("manual")}
          onExport={() => void exportExcel()}
          onLock={onLock}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  className = "",
}: {
  icon: ReactNode;
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div className={`rounded-[22px] bg-white px-4 py-3.5 ring-1 ring-usa/10 ${className}`}>
      <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-usa/45">
        <span className="text-mika">{icon}</span>
        {label}
      </p>
      <p className="mt-1.5 font-display text-[1.85rem] leading-none tabular-nums tracking-tight text-usa sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

function DashboardActions({
  refreshing,
  exporting,
  onRefresh,
  onExport,
  onLock,
}: {
  refreshing: boolean;
  exporting: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onLock: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-usa ring-1 ring-usa/10 disabled:opacity-60 lg:flex-none lg:px-4"
      >
        <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
        Refresh
      </button>
      <button
        type="button"
        onClick={onExport}
        disabled={exporting}
        className="inline-flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-mika px-4 text-sm font-bold text-white disabled:opacity-60 lg:flex-none"
      >
        {exporting ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="size-4" />
        )}
        Export Excel
      </button>
      <button
        type="button"
        onClick={onLock}
        className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-3 text-sm font-semibold text-usa ring-1 ring-usa/10 lg:px-4"
      >
        <Lock className="size-4" />
        Lock
      </button>
    </div>
  );
}

function LeadMobileCard({
  lead,
  onRate,
  onSaveNotes,
  onDraftNotes,
}: {
  lead: LeadRecord;
  onRate: (rating: number) => void;
  onSaveNotes: (notes: string) => void;
  onDraftNotes: (notes: string) => void;
}) {
  return (
    <article className="rounded-[22px] bg-sand/80 p-4 ring-1 ring-usa/10">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-usa">{lead.fullName}</p>
          <p className="truncate text-sm text-slate-600">{lead.companyName}</p>
        </div>
        <p className="shrink-0 text-[11px] text-usa/40">
          {formatCapturedAt(lead.createdAt)}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href={`tel:${lead.phone}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-usa text-sm font-semibold text-white"
        >
          <Phone className="size-4" />
          Call
        </a>
        <a
          href={`mailto:${lead.email}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-usa ring-1 ring-usa/10"
        >
          <Mail className="size-4" />
          Email
        </a>
      </div>

      <p className="mt-3 break-all text-[13px] text-usa/70">{lead.phone}</p>
      <p className="break-all text-[13px] text-usa/70">{lead.email}</p>

      <div className="mt-3">
        <ProductTags ids={lead.productsOfInterest} />
      </div>
      <div className="mt-3">
        <StarRating value={lead.rating} onChange={onRate} />
      </div>
      <textarea
        defaultValue={lead.notes}
        rows={2}
        placeholder="Conversation notes…"
        className="mt-3 w-full resize-y rounded-2xl border border-usa/10 bg-white px-3 py-3 text-[16px] text-usa outline-none focus:border-mika"
        onChange={(event) => onDraftNotes(event.target.value)}
        onBlur={(event) => onSaveNotes(event.target.value.trim())}
      />
    </article>
  );
}

function ProductTags({ ids }: { ids: readonly string[] }) {
  if (ids.length === 0) {
    return <span className="text-slate-400">—</span>;
  }

  return (
    <div className="flex max-w-full flex-wrap gap-1.5">
      {ids.map((id) => (
        <span
          key={id}
          className="inline-flex rounded-full bg-mika/10 px-2 py-0.5 text-[11px] font-semibold text-mika-dark"
        >
          {getProductById(id)?.shortName ?? id}
        </span>
      ))}
    </div>
  );
}

function StarRating({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Lead rating">
      {[1, 2, 3, 4, 5].map((rating) => {
        const active = (value ?? 0) >= rating;
        return (
          <button
            key={rating}
            type="button"
            aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
            aria-pressed={value === rating}
            onClick={() => onChange(rating)}
            className="flex size-11 items-center justify-center rounded-full hover:bg-mika/10 lg:size-8"
          >
            <Star
              className={`size-6 transition lg:size-5 ${
                active
                  ? "fill-mika text-mika"
                  : "text-usa/25 hover:text-mika"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
