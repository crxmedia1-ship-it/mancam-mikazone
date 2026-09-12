"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import {
  Building2,
  Check,
  LoaderCircle,
  Mail,
  Phone,
  UserRound,
  WifiOff,
  X,
} from "lucide-react";
import { submitLead } from "@/app/actions/leads";
import { PRODUCTS, type Product } from "@/data/products";
import { leadSchema, type LeadInput } from "@/lib/lead";
import confetti from "canvas-confetti";

const PENDING_LEADS_KEY = "mancam-mikazone:pending-leads";

type LeadCaptureModalProps = {
  open: boolean;
  initialProductIds?: readonly string[];
  onClose: () => void;
  onRegistered?: () => void;
};

type FormState = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  productsOfInterest: string[];
};

type PendingLead = LeadInput & { queuedAt: string };

const emptyForm: FormState = {
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  productsOfInterest: [],
};

function readPendingLeads(): PendingLead[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(PENDING_LEADS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PendingLead[]) : [];
  } catch {
    return [];
  }
}

function writePendingLeads(leads: PendingLead[]) {
  window.localStorage.setItem(PENDING_LEADS_KEY, JSON.stringify(leads));
}

function queueLead(lead: LeadInput) {
  const pending = readPendingLeads();
  pending.push({ ...lead, queuedAt: new Date().toISOString() });
  writePendingLeads(pending);
}

function firstError(
  fieldErrors: Record<string, string[]> | undefined,
  key: string,
): string | undefined {
  return fieldErrors?.[key]?.[0];
}

export function LeadCaptureModal({
  open,
  initialProductIds = [],
  onClose,
  onRegistered,
}: LeadCaptureModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>(() => ({
    ...emptyForm,
    productsOfInterest: [...new Set(initialProductIds)],
  }));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "offline" | "success">(
    "error",
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [open, onClose]);

  useEffect(() => {
    let cancelled = false;

    async function flushPendingLeads() {
      const pending = readPendingLeads();
      if (pending.length === 0) return;

      const remaining: PendingLead[] = [];
      for (const item of pending) {
        const result = await submitLead(item);
        if (!result.ok) remaining.push(item);
        if (cancelled) return;
      }
      writePendingLeads(remaining);
    }

    void flushPendingLeads();
    window.addEventListener("online", flushPendingLeads);
    return () => {
      cancelled = true;
      window.removeEventListener("online", flushPendingLeads);
    };
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function toggleProduct(productId: string) {
    updateField(
      "productsOfInterest",
      form.productsOfInterest.includes(productId)
        ? form.productsOfInterest.filter((id) => id !== productId)
        : [...form.productsOfInterest, productId],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);

    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        nextErrors[key] ??= [];
        nextErrors[key].push(issue.message);
      }
      setFieldErrors(nextErrors);
      setStatusTone("error");
      setStatusMessage("Please check the highlighted fields.");
      return;
    }

    startTransition(async () => {
      const result = await submitLead(parsed.data);

      if (result.ok) {
        setStatusTone("success");
        setStatusMessage(
          "Thanks. Our team will follow up after the show with pricing and samples.",
        );
        onRegistered?.();
        confetti({
          particleCount: 56,
          spread: 58,
          origin: { y: 0.42 },
          colors: ["#10B981", "#4DB8C9", "#C4A35A"],
          scalar: 0.75,
        });
        return;
      }

      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
        setStatusTone("error");
        setStatusMessage(result.error);
        return;
      }

      queueLead(parsed.data);
      setStatusTone("offline");
      setStatusMessage(
        "No connection right now. Your details were saved on this phone and will sync when the stand is back online.",
      );
      onRegistered?.();
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close registration"
        className="absolute inset-0 bg-slate-900/55"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="sheet-enter relative z-10 flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.45)] sm:max-h-[88vh] sm:rounded-[28px]"
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mika">
              30 seconds at the stand
            </p>
            <h2
              id={titleId}
              className="font-display mt-1 text-[1.7rem] leading-tight tracking-tight text-slate-900"
            >
              Leave your details
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Name, company, phone, email, and the grades you want. We quote
              after BuildExpo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <LabeledInput
                label="Full name"
                icon={<UserRound className="size-4" />}
                autoComplete="name"
                value={form.fullName}
                error={firstError(fieldErrors, "fullName")}
                onChange={(value) => updateField("fullName", value)}
              />
              <LabeledInput
                label="Company"
                icon={<Building2 className="size-4" />}
                autoComplete="organization"
                value={form.companyName}
                error={firstError(fieldErrors, "companyName")}
                onChange={(value) => updateField("companyName", value)}
              />
              <LabeledInput
                label="Work email"
                type="email"
                icon={<Mail className="size-4" />}
                autoComplete="email"
                inputMode="email"
                value={form.email}
                error={firstError(fieldErrors, "email")}
                onChange={(value) => updateField("email", value)}
              />
              <LabeledInput
                label="Phone"
                type="tel"
                icon={<Phone className="size-4" />}
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                error={firstError(fieldErrors, "phone")}
                onChange={(value) => updateField("phone", value)}
              />
            </div>

            <fieldset className="mt-7">
              <legend className="text-sm font-semibold text-slate-900">
                Grades of interest
              </legend>
              <p className="mt-1 text-xs text-slate-500">
                Tap every grade you want quoted or sampled.
              </p>
              <ProductChips
                selectedIds={form.productsOfInterest}
                onToggle={toggleProduct}
              />
              <FieldError message={firstError(fieldErrors, "productsOfInterest")} />
            </fieldset>

            {statusMessage ? (
              <p
                className={`mt-4 flex items-start gap-2 rounded-2xl px-3 py-2.5 text-sm ${
                  statusTone === "success"
                    ? "bg-emerald-50 text-emerald-800"
                    : statusTone === "offline"
                      ? "bg-amber-50 text-amber-900"
                      : "bg-red-50 text-red-800"
                }`}
              >
                {statusTone === "offline" ? (
                  <WifiOff className="mt-0.5 size-4 shrink-0" />
                ) : null}
                {statusMessage}
              </p>
            ) : null}
          </div>

          <div className="border-t border-slate-100 bg-white px-5 pt-4 pb-[max(1.1rem,env(safe-area-inset-bottom))]">
            <button
              type="submit"
              disabled={isPending || statusTone === "success"}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-base font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {isPending ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <UserRound className="size-5" />
              )}
              {isPending
                ? "Saving…"
                : statusTone === "success"
                  ? "Registered"
                  : "Leave my details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductChips({
  selectedIds,
  onToggle,
}: {
  selectedIds: readonly string[];
  onToggle: (productId: string) => void;
}) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {PRODUCTS.map((product: Product) => {
        const selected = selectedIds.includes(product.id);
        return (
          <button
            key={product.id}
            type="button"
            onClick={() => onToggle(product.id)}
            aria-pressed={selected}
            className={`min-h-11 rounded-2xl border px-3 py-2.5 text-left text-[13px] font-semibold transition ${
              selected
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-slate-50 text-slate-900"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              {selected ? <Check className="size-3.5" /> : null}
              {product.shortName}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-700">{message}</p>;
}

function LabeledInput({
  label,
  value,
  onChange,
  error,
  icon,
  type = "text",
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon: ReactNode;
  type?: string;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const inputId = useId();

  return (
    <label htmlFor={inputId} className="block text-[13px] font-semibold text-slate-900">
      {label}
      <span className="mt-1.5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 focus-within:border-slate-900 focus-within:bg-white">
        <span className="text-slate-400">{icon}</span>
        <input
          id={inputId}
          type={type}
          value={value}
          autoComplete={autoComplete}
          inputMode={inputMode}
          onChange={(event) => onChange(event.target.value)}
          className="h-13 min-h-12 w-full bg-transparent text-[15px] text-slate-900 outline-none"
        />
      </span>
      <FieldError message={error} />
    </label>
  );
}
