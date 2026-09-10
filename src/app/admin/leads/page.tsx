"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import {
  Download,
  LoaderCircle,
  Lock,
  RefreshCw,
  Star,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import { getProductById } from "@/data/products";
import {
  PRIMARY_APPLICATION_LABELS,
  PROFILE_TYPE_LABELS,
  PURCHASE_VOLUME_LABELS,
  normalizeLead,
  type LeadRecord,
} from "@/lib/lead";
import { createSupabaseClient } from "@/lib/supabase";

const ADMIN_UNLOCK_KEY = "mancam-mikazone:admin-unlocked";
const EVENT_PIN = process.env.NEXT_PUBLIC_EVENT_PIN ?? "";
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

  function evaluatePin(nextPin: string, force = false) {
    if (!EVENT_PIN) {
      setError("NEXT_PUBLIC_EVENT_PIN is not configured.");
      setPin("");
      return;
    }
    if (nextPin.length < expectedLength) {
      setPin(nextPin);
      if (force) setError("Enter the full event PIN.");
      return;
    }
    if (nextPin === EVENT_PIN) {
      onUnlock();
      return;
    }
    setError("Incorrect PIN.");
    setPin("");
  }

  function appendDigit(digit: string) {
    setError(null);
    if (pin.length >= expectedLength) return;
    evaluatePin(`${pin}${digit}`);
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Image
          src={MIKAZONE_LOGO}
          alt="MikaZone USA"
          width={240}
          height={80}
          priority
          className="mx-auto h-12 w-auto object-contain"
        />
        <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Stand team
        </p>
        <h1 className="mt-2 text-center text-2xl font-semibold text-slate-900">
          Commercial panel
        </h1>
        <p className="mt-2 text-center text-sm leading-6 text-slate-500">
          Enter the event PIN to see live prospects, rate conversations, and
          export Excel.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          {Array.from({ length: expectedLength }, (_, index) => (
            <span
              key={index}
              className={`size-3 rounded-full ${
                pin.length > index ? "bg-emerald-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => appendDigit(digit)}
              className="h-14 rounded-xl border border-slate-200 bg-slate-50 text-xl font-semibold text-slate-800 transition hover:border-emerald-200 hover:bg-emerald-50"
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
            className="h-14 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => appendDigit("0")}
            className="h-14 rounded-xl border border-slate-200 bg-slate-50 text-xl font-semibold text-slate-800"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => setPin((current) => current.slice(0, -1))}
            className="h-14 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500"
          >
            Delete
          </button>
        </div>

        <button
          type="button"
          onClick={() => evaluatePin(pin, true)}
          className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
        >
          Unlock panel
        </button>

        {error ? (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        ) : null}
      </div>
    </div>
  );
}

function LeadsDashboard({ onLock }: { onLock: () => void }) {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [live, setLive] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"ok" | "error">("ok");
  const notesDrafts = useRef<Record<string, string>>({});

  const loadLeads = useCallback(
    async (mode: "initial" | "manual" = "initial") => {
      if (mode === "manual") setRefreshing(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setStatusTone("error");
        setStatus(error.message);
      } else {
        const next = (data ?? [])
          .map((row) => normalizeLead(row as Record<string, unknown>))
          .filter((row): row is LeadRecord => row !== null);
        setLeads(next);
        if (mode === "manual") {
          setStatusTone("ok");
          setStatus(`Updated · ${next.length} prospect${next.length === 1 ? "" : "s"}`);
        }
      }

      setLoading(false);
      setRefreshing(false);
    },
    [supabase],
  );

  useEffect(() => {
    let cancelled = false;

    void supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;

        if (error) {
          setStatusTone("error");
          setStatus(error.message);
        } else {
          const next = (data ?? [])
            .map((row) => normalizeLead(row as Record<string, unknown>))
            .filter((row): row is LeadRecord => row !== null);
          setLeads(next);
        }

        setLoading(false);
      });

    const channel = supabase
      .channel("stand-leads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const incoming = normalizeLead(payload.new as Record<string, unknown>);
            if (!incoming) return;
            setLeads((current) =>
              current.some((lead) => lead.id === incoming.id)
                ? current
                : [incoming, ...current],
            );
          }

          if (payload.eventType === "UPDATE") {
            const incoming = normalizeLead(payload.new as Record<string, unknown>);
            if (!incoming) return;
            setLeads((current) =>
              current.map((lead) => (lead.id === incoming.id ? incoming : lead)),
            );
          }

          if (payload.eventType === "DELETE") {
            const removed = payload.old as { id?: string };
            if (!removed.id) return;
            setLeads((current) => current.filter((lead) => lead.id !== removed.id));
          }
        },
      )
      .subscribe((subscriptionStatus) => {
        setLive(subscriptionStatus === "SUBSCRIBED");
      });

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [supabase]);

  async function updateRating(leadId: string, rating: number) {
    const nextRating = leads.find((lead) => lead.id === leadId)?.rating === rating ? null : rating;
    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId ? { ...lead, rating: nextRating } : lead,
      ),
    );

    const { error } = await supabase
      .from("leads")
      .update({ rating: nextRating })
      .eq("id", leadId);

    if (error) {
      setStatusTone("error");
      setStatus(error.message);
      void loadLeads("initial");
    }
  }

  async function saveNotes(leadId: string, notes: string) {
    const previous = leads.find((lead) => lead.id === leadId)?.notes ?? "";
    if (previous === notes) return;

    setLeads((current) =>
      current.map((lead) => (lead.id === leadId ? { ...lead, notes } : lead)),
    );

    const { error } = await supabase.from("leads").update({ notes }).eq("id", leadId);
    if (error) {
      setStatusTone("error");
      setStatus(error.message);
      void loadLeads("initial");
    }
  }

  async function exportExcel() {
    setExporting(true);
    try {
      const XLSX = await import("xlsx");
      const rows = leads.map((lead) => ({
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

      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet["!cols"] = Object.keys(rows[0] ?? { Name: "" }).map(() => ({
        wch: 24,
      }));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
      XLSX.writeFile(workbook, `Mancam-MikaZone-leads-${fileStamp()}.xlsx`);
      setStatusTone("ok");
      setStatus(`Exported ${leads.length} row${leads.length === 1 ? "" : "s"} to Excel.`);
    } catch (error) {
      setStatusTone("error");
      setStatus(
        error instanceof Error ? error.message : "Could not export the Excel file.",
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-4">
            <Image
              src={MIKAZONE_LOGO}
              alt="MikaZone USA"
              width={180}
              height={60}
              className="mt-0.5 h-10 w-auto object-contain"
            />
            <div>
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                Mancam Global Supply LLC • MikaZone Official Partner
              </span>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                Commercial panel
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              aria-live="polite"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              <Users className="size-4 text-emerald-600" />
              <strong className="tabular-nums">{leads.length}</strong>
              live lead{leads.length === 1 ? "" : "s"}
              {live ? (
                <Wifi className="size-4 text-emerald-600" />
              ) : (
                <WifiOff className="size-4 text-slate-400" />
              )}
            </span>
            <button
              type="button"
              onClick={() => void loadLeads("manual")}
              disabled={refreshing}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => void exportExcel()}
              disabled={exporting || leads.length === 0}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {exporting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              Exportar a Excel (.xlsx)
            </button>
            <button
              type="button"
              onClick={onLock}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Lock className="size-4" />
              Lock
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6">
        {status ? (
          <p
            className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
              statusTone === "ok"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {status}
          </p>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-slate-500">
              <LoaderCircle className="size-5 animate-spin" />
              Loading prospects…
            </div>
          ) : leads.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <p className="text-lg font-semibold text-slate-900">No prospects yet</p>
              <p className="mt-2 text-sm text-slate-500">
                New stand registrations will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[980px] w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs font-bold uppercase tracking-wide text-slate-700">
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
                      className="border-t border-slate-200 align-top transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900">{lead.fullName}</p>
                        <a
                          href={`mailto:${lead.email}`}
                          className="mt-1 block text-slate-600 hover:text-emerald-700"
                        >
                          {lead.email}
                        </a>
                        <a
                          href={`tel:${lead.phone}`}
                          className="mt-0.5 block text-slate-600 hover:text-emerald-700"
                        >
                          {lead.phone}
                        </a>
                        <p className="mt-2 text-xs text-slate-400">
                          {formatCapturedAt(lead.createdAt)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{lead.companyName}</p>
                        <p className="mt-1 text-slate-500">
                          {profileLabel(lead.profileType)}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {applicationLabel(lead.primaryApplication)}
                        </p>
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-900">
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
                          className="w-56 resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500"
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
          )}
        </div>
      </main>
    </div>
  );
}

function ProductTags({ ids }: { ids: readonly string[] }) {
  if (ids.length === 0) {
    return <span className="text-slate-400">—</span>;
  }

  return (
    <div className="flex max-w-xs flex-wrap gap-1.5">
      {ids.map((id) => (
        <span
          key={id}
          className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"
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
            className="rounded-full p-0.5 hover:bg-emerald-50"
          >
            <Star
              className={`size-5 transition ${
                active
                  ? "fill-emerald-500 text-emerald-500"
                  : "text-slate-300 hover:text-emerald-400"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
