"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import {
  Beaker,
  Boxes,
  Building2,
  Check,
  ClipboardList,
  Download,
  Factory,
  FileStack,
  FlaskConical,
  Hammer,
  LoaderCircle,
  Mail,
  MoreHorizontal,
  Package,
  Phone,
  Ship,
  Truck,
  UserRound,
  WifiOff,
  X,
} from "lucide-react";
import { submitLead } from "@/app/actions/leads";
import { PRODUCTS, getProductsByIds, type Product } from "@/data/products";
import {
  PRIMARY_APPLICATIONS,
  PRIMARY_APPLICATION_LABELS,
  PROFILE_TYPE_LABELS,
  PURCHASE_VOLUME_LABELS,
  leadSchema,
  type LeadInput,
} from "@/lib/lead";
import { downloadProductDatasheets } from "@/lib/datasheet-pdf";

const PENDING_LEADS_KEY = "mancam-mikazone:pending-leads";

const PROFILE_OPTIONS: ReadonlyArray<{
  id: LeadInput["profileType"];
  hint: string;
  icon: ReactNode;
}> = [
  { id: "formulator", hint: "Lab & formula design", icon: <FlaskConical className="size-4" /> },
  { id: "distributor", hint: "Regional supply", icon: <Truck className="size-4" /> },
  { id: "contractor", hint: "Jobsite application", icon: <Hammer className="size-4" /> },
  { id: "manufacturer", hint: "Dry-mix plant", icon: <Factory className="size-4" /> },
  { id: "purchasing", hint: "Procurement", icon: <ClipboardList className="size-4" /> },
  { id: "other", hint: "Another role", icon: <MoreHorizontal className="size-4" /> },
];

const VOLUME_OPTIONS: ReadonlyArray<{
  id: LeadInput["purchaseVolume"];
  hint: string;
  icon: ReactNode;
}> = [
  { id: "sample", hint: "Trial bags", icon: <Beaker className="size-4" /> },
  { id: "under_1mt", hint: "Pilot orders", icon: <Package className="size-4" /> },
  { id: "1_10mt", hint: "Growing line", icon: <Boxes className="size-4" /> },
  { id: "10_50mt", hint: "Plant scale", icon: <FileStack className="size-4" /> },
  { id: "over_50mt", hint: "Contract supply", icon: <Ship className="size-4" /> },
];

type LeadCaptureModalProps = {
  open: boolean;
  initialProductIds?: readonly string[];
  dossierMode?: boolean;
  onClose: () => void;
};

type FormState = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  profileType: LeadInput["profileType"] | "";
  productsOfInterest: string[];
  purchaseVolume: LeadInput["purchaseVolume"] | "";
  primaryApplication: LeadInput["primaryApplication"] | "";
};

type PendingLead = LeadInput & { queuedAt: string };

const emptyForm: FormState = {
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  profileType: "",
  productsOfInterest: [],
  purchaseVolume: "",
  primaryApplication: "",
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
  dossierMode = false,
  onClose,
}: LeadCaptureModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>(() => ({
    ...emptyForm,
    productsOfInterest: [...initialProductIds],
  }));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "offline" | "success">(
    "error",
  );
  const [isPending, startTransition] = useTransition();

  const selectedProducts = useMemo(
    () => getProductsByIds(form.productsOfInterest),
    [form.productsOfInterest],
  );

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
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
        const lead: LeadInput = {
          fullName: item.fullName,
          companyName: item.companyName,
          email: item.email,
          phone: item.phone,
          profileType: item.profileType,
          productsOfInterest: item.productsOfInterest,
          purchaseVolume: item.purchaseVolume,
          primaryApplication: item.primaryApplication,
        };
        const result = await submitLead(lead);
        if (!result.ok) {
          remaining.push(item);
        }
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

    const productsOfInterest =
      form.productsOfInterest.length > 0
        ? form.productsOfInterest
        : PRODUCTS.map((product) => product.id);

    const parsed = leadSchema.safeParse({ ...form, productsOfInterest });
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

    const productsForPdf = getProductsByIds(parsed.data.productsOfInterest);

    startTransition(async () => {
      const result = await submitLead(parsed.data);

      if (result.ok) {
        downloadProductDatasheets(productsForPdf);
        setStatusTone("success");
        setStatusMessage("Datasheet downloading. Our team will follow up.");
        window.setTimeout(onClose, 900);
        return;
      }

      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
        setStatusTone("error");
        setStatusMessage(result.error);
        return;
      }

      queueLead(parsed.data);
      downloadProductDatasheets(productsForPdf);
      setStatusTone("offline");
      setStatusMessage(
        "No connection right now. Your request was saved on this device and the PDF is downloading.",
      );
      window.setTimeout(onClose, 1400);
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close registration"
        className="absolute inset-0 bg-slate-900/75 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              BuildExpo South Florida 2026
            </p>
            <h2 id={titleId} className="mt-1 text-xl font-semibold text-slate-900">
              {dossierMode ? "Unlock the full technical dossier" : "Register to download specs"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {dossierMode
                ? "Leave your details. We will send all ten MikaZone grades in one PDF."
                : "One form unlocks the selected MikaZone technical datasheet for this stand visit."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-2 text-slate-500 transition hover:bg-white hover:text-slate-900"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                {dossierMode && selectedProducts.length === 0 ? (
                  <DossierSnapshot />
                ) : selectedProducts.length > 0 ? (
                  <ProductSnapshot products={selectedProducts} />
                ) : (
                  <DossierSnapshot />
                )}

                {dossierMode ? null : (
                  <fieldset className="mt-4">
                    <legend className="text-sm font-semibold text-slate-900">
                      Products of interest
                    </legend>
                    <p className="mt-1 text-xs text-slate-500">Select one or more grades.</p>
                    <ProductChips
                      selectedIds={form.productsOfInterest}
                      onToggle={toggleProduct}
                    />
                    <FieldError message={firstError(fieldErrors, "productsOfInterest")} />
                  </fieldset>
                )}
              </div>

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
                  label="Phone / WhatsApp"
                  type="tel"
                  icon={<Phone className="size-4" />}
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.phone}
                  error={firstError(fieldErrors, "phone")}
                  onChange={(value) => updateField("phone", value)}
                />
                <div className="sm:col-span-2">
                  <LabeledSelect
                    label="Primary application"
                    value={form.primaryApplication}
                    error={firstError(fieldErrors, "primaryApplication")}
                    onChange={(value) =>
                      updateField(
                        "primaryApplication",
                        value as FormState["primaryApplication"],
                      )
                    }
                  >
                    <option value="">Select application</option>
                    {PRIMARY_APPLICATIONS.map((application) => (
                      <option key={application} value={application}>
                        {PRIMARY_APPLICATION_LABELS[application]}
                      </option>
                    ))}
                  </LabeledSelect>
                </div>
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-semibold text-slate-900">Role</legend>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PROFILE_OPTIONS.map((option) => {
                  const selected = form.profileType === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => updateField("profileType", option.id)}
                      className={`rounded-sm border px-3 py-3 text-left transition ${
                        selected
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-400"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        {option.icon}
                        {PROFILE_TYPE_LABELS[option.id]}
                      </span>
                      <span
                        className={`mt-1 block text-xs ${selected ? "text-white/70" : "text-slate-500"}`}
                      >
                        {option.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
              <FieldError message={firstError(fieldErrors, "profileType")} />
            </fieldset>

            <fieldset className="mt-5">
              <legend className="text-sm font-semibold text-slate-900">Volume</legend>
              <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-5">
                {VOLUME_OPTIONS.map((option) => {
                  const selected = form.purchaseVolume === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => updateField("purchaseVolume", option.id)}
                      className={`rounded-sm border px-3 py-3 text-left transition ${
                        selected
                          ? "border-gold bg-gold text-slate-900"
                          : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-400"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        {option.icon}
                        {PURCHASE_VOLUME_LABELS[option.id]}
                      </span>
                      <span className="mt-1 block text-xs text-slate-600">{option.hint}</span>
                    </button>
                  );
                })}
              </div>
              <FieldError message={firstError(fieldErrors, "purchaseVolume")} />
            </fieldset>

            {statusMessage ? (
              <p
                className={`mt-4 flex items-start gap-2 rounded-sm px-3 py-2.5 text-sm ${
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

          <div className="border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
            <button
              type="submit"
              disabled={isPending}
              className="flex h-14 w-full items-center justify-center gap-2 bg-gold text-base font-bold text-slate-900 transition hover:bg-gold-dark disabled:opacity-60"
            >
              {isPending ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <Download className="size-5" />
              )}
              {isPending ? "Sending…" : "Register & Unlock PDF"}
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
    <div className="mt-3 flex flex-wrap gap-2">
      {PRODUCTS.map((product) => {
        const selected = selectedIds.includes(product.id);
        return (
          <button
            key={product.id}
            type="button"
            onClick={() => onToggle(product.id)}
            aria-pressed={selected}
            className={`rounded-sm border px-3 py-2 text-left text-sm transition ${
              selected
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-400"
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

function DossierSnapshot() {
  return (
    <section className="rounded-sm border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Full technical dossier
      </p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">
        All 10 MikaZone construction-chemical grades
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Cellulose ethers, MIKA VAE RPP, PCE, SHP, gypsum retarder, powder defoamer,
        calcium formate, and reinforcing fibers — one PDF after this form.
      </p>
    </section>
  );
}

function ProductSnapshot({ products }: { products: Product[] }) {
  const featured = products[0];

  return (
    <section className="rounded-sm border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        {featured.sku}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">{featured.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{featured.summary}</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
        <div className="bg-white px-3 py-2">
          <dt className="text-slate-500">Appearance</dt>
          <dd className="mt-0.5 font-medium text-slate-900">
            {featured.specifications.appearance}
          </dd>
        </div>
        <div className="bg-white px-3 py-2">
          <dt className="text-slate-500">Dosage</dt>
          <dd className="mt-0.5 font-medium text-slate-900">{featured.recommendedDosage}</dd>
        </div>
        <div className="bg-white px-3 py-2">
          <dt className="text-slate-500">Packaging</dt>
          <dd className="mt-0.5 font-medium text-slate-900">{featured.packaging.primary}</dd>
        </div>
      </dl>
      {products.length > 1 ? (
        <p className="mt-3 text-xs text-slate-500">
          Plus {products.length - 1} more selected grade
          {products.length - 1 === 1 ? "" : "s"} in the same PDF.
        </p>
      ) : null}
    </section>
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
    <label htmlFor={inputId} className="block text-sm font-medium text-slate-900">
      {label}
      <span className="mt-1.5 flex items-center gap-2 rounded-sm border border-slate-200 bg-white px-3 focus-within:border-slate-900">
        <span className="text-slate-400">{icon}</span>
        <input
          id={inputId}
          type={type}
          value={value}
          autoComplete={autoComplete}
          inputMode={inputMode}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full bg-transparent text-sm text-slate-900 outline-none"
        />
      </span>
      <FieldError message={error} />
    </label>
  );
}

function LabeledSelect({
  label,
  value,
  onChange,
  error,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  children: ReactNode;
}) {
  const selectId = useId();

  return (
    <label htmlFor={selectId} className="block text-sm font-medium text-slate-900">
      {label}
      <select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-11 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
      >
        {children}
      </select>
      <FieldError message={error} />
    </label>
  );
}
