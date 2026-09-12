"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type HTMLAttributes,
} from "react";
import {
  Check,
  CheckCircle2,
  LoaderCircle,
  WifiOff,
  X,
} from "lucide-react";
import { submitLead } from "@/app/actions/leads";
import {
  PRODUCTS,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_IDS,
  type Product,
} from "@/data/products";
import { leadSchema, type LeadInput } from "@/lib/lead";

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

const productGroups = PRODUCT_CATEGORY_IDS.map((id) => ({
  id,
  label: PRODUCT_CATEGORIES[id].label,
  products: PRODUCTS.filter((product) => product.category === id),
})).filter((group) => group.products.length > 0);

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

function revealField(element: HTMLElement) {
  window.setTimeout(() => {
    element.scrollIntoView({ block: "center", inline: "nearest" });
  }, 280);
}

function useViewportLock(active: boolean) {
  const shellRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!active) return;

    const shell = shellRef.current;
    const visualViewport = window.visualViewport;
    const html = document.documentElement;
    const body = document.body;
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
    };

    const sync = () => {
      if (!shell) return;
      const height = Math.round(visualViewport?.height ?? window.innerHeight);
      const offsetTop = Math.round(visualViewport?.offsetTop ?? 0);
      shell.style.height = `${height}px`;
      shell.style.top = `${offsetTop}px`;
      shell.style.left = "0";
      shell.style.right = "0";
      shell.style.bottom = "auto";
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";
    sync();

    visualViewport?.addEventListener("resize", sync);
    visualViewport?.addEventListener("scroll", sync);
    window.addEventListener("orientationchange", sync);

    return () => {
      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;
      html.style.overscrollBehavior = previous.htmlOverscroll;
      body.style.overscrollBehavior = previous.bodyOverscroll;
      visualViewport?.removeEventListener("resize", sync);
      visualViewport?.removeEventListener("scroll", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, [active]);

  return shellRef;
}

export function LeadCaptureModal({
  open,
  initialProductIds = [],
  onClose,
  onRegistered,
}: LeadCaptureModalProps) {
  const titleId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const shellRef = useViewportLock(open);
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
  const done = statusTone === "success" || statusTone === "offline";

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
    if (done || isPending) return;

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
      const firstKey = String(parsed.error.issues[0]?.path[0] ?? "");
      const target = formRef.current?.querySelector<HTMLElement>(
        `[data-field="${firstKey}"]`,
      );
      if (target) revealField(target);
      return;
    }

    startTransition(async () => {
      const result = await submitLead(parsed.data);

      if (result.ok) {
        setStatusTone("success");
        setStatusMessage(
          "You’re on the list. Our team will follow up after BuildExpo with pricing and samples.",
        );
        onRegistered?.();
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
    <div
      ref={shellRef}
      className="lead-sheet lead-sheet-enter fixed inset-x-0 top-0 z-[80] flex h-[100dvh] flex-col bg-[linear-gradient(180deg,#eaf4fb_0%,#f4f1ea_42%,#eef7f1_100%)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(30,120,200,0.28),transparent_68%)]"
      />
      <header className="relative shrink-0 overflow-hidden bg-sky pt-[env(safe-area-inset-top)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent_55%)]"
        />
        <div className="relative mx-auto flex w-full max-w-lg items-start justify-between gap-4 px-5 pt-4 pb-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85">
              MikaZone USA · BuildExpo
            </p>
            <h2
              id={titleId}
              className="font-display mt-1 text-[1.65rem] leading-none tracking-tight"
            >
              Leave your details
            </h2>
            <p className="mt-1.5 text-[13px] leading-5 text-white/80">
              Four fields. Optional grades. We’ll quote after the show.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-white/18 text-white ring-1 ring-white/30"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
      </header>

      {done ? (
        <SuccessState
          offline={statusTone === "offline"}
          message={statusMessage}
          onClose={onClose}
        />
      ) : (
        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="mx-auto min-h-0 w-full max-w-lg flex-1 overflow-y-auto overscroll-contain px-4 py-5">
            <section>
              <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky">
                Your details
              </p>
              <div className="glass-panel overflow-hidden rounded-[24px] ring-1 ring-white/70">
                <NativeField
                  label="Full name"
                  name="name"
                  autoComplete="name"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  value={form.fullName}
                  error={firstError(fieldErrors, "fullName")}
                  fieldKey="fullName"
                  onChange={(value) => updateField("fullName", value)}
                />
                <NativeField
                  label="Company"
                  name="organization"
                  autoComplete="organization"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  value={form.companyName}
                  error={firstError(fieldErrors, "companyName")}
                  fieldKey="companyName"
                  onChange={(value) => updateField("companyName", value)}
                />
                <NativeField
                  label="Work email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  inputMode="email"
                  enterKeyHint="next"
                  spellCheck={false}
                  value={form.email}
                  error={firstError(fieldErrors, "email")}
                  fieldKey="email"
                  onChange={(value) => updateField("email", value)}
                />
                <NativeField
                  label="Phone"
                  name="tel"
                  type="tel"
                  autoComplete="tel"
                  autoCapitalize="none"
                  inputMode="tel"
                  enterKeyHint="done"
                  spellCheck={false}
                  last
                  value={form.phone}
                  error={firstError(fieldErrors, "phone")}
                  fieldKey="phone"
                  onChange={(value) => updateField("phone", value)}
                />
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-2 flex items-end justify-between gap-3 px-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky">
                  Grades of interest
                </p>
                <p className="text-[11px] text-navy/35">Optional</p>
              </div>
              <div className="glass-panel space-y-4 rounded-[24px] px-3.5 py-3.5 ring-1 ring-white/70">
                {productGroups.map((group) => (
                  <div key={group.id}>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {group.label}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.products.map((product) => (
                        <ProductChip
                          key={product.id}
                          product={product}
                          selected={form.productsOfInterest.includes(product.id)}
                          onToggle={toggleProduct}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {statusMessage ? (
              <p className="mt-4 rounded-2xl bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
                {statusMessage}
              </p>
            ) : null}
          </div>

          <div className="shrink-0 border-t border-white/40 bg-white/45 px-4 pt-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
            <button
              type="submit"
              disabled={isPending}
              className="btn-shine btn-mika mx-auto flex h-[52px] w-full max-w-lg items-center justify-center gap-2 rounded-2xl text-[16px] font-semibold disabled:opacity-60"
            >
              {isPending ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : null}
              <span>{isPending ? "Saving…" : "Send details"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function SuccessState({
  offline,
  message,
  onClose,
}: {
  offline: boolean;
  message: string | null;
  onClose: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col px-6">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span
          className={`flex size-16 items-center justify-center rounded-full ${
            offline ? "bg-amber-50 text-amber-700" : "bg-mika/10 text-mika"
          }`}
        >
          {offline ? (
            <WifiOff className="size-7" />
          ) : (
            <CheckCircle2 className="size-7" />
          )}
        </span>
        <h3 className="font-display mt-5 text-3xl tracking-tight text-usa">
          {offline ? "Saved on this phone" : "Details received"}
        </h3>
        <p className="mt-3 max-w-sm text-[15px] leading-6 text-slate-600">
          {message}
        </p>
      </div>
      <div className="shrink-0 pb-[max(0.85rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onClose}
          className="btn-shine btn-mika flex h-[52px] w-full items-center justify-center rounded-2xl text-[16px] font-semibold"
        >
          <span>Done</span>
        </button>
      </div>
    </div>
  );
}

function ProductChip({
  product,
  selected,
  onToggle,
}: {
  product: Product;
  selected: boolean;
  onToggle: (productId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(product.id)}
      aria-pressed={selected}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold backdrop-blur-md transition ${
        selected
          ? "btn-shine btn-mika"
          : "bg-white/45 text-navy ring-1 ring-white/70"
      }`}
    >
      {selected ? <Check className="size-3.5" /> : null}
      {product.shortName}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="px-4 pb-2 text-[12px] text-red-700">{message}</p>;
}

function NativeField({
  label,
  value,
  onChange,
  error,
  fieldKey,
  last = false,
  type = "text",
  name,
  autoComplete,
  autoCapitalize,
  inputMode,
  enterKeyHint,
  spellCheck,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  fieldKey: string;
  last?: boolean;
  type?: string;
  name?: string;
  autoComplete?: string;
  autoCapitalize?: HTMLAttributes<HTMLInputElement>["autoCapitalize"];
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  enterKeyHint?: HTMLAttributes<HTMLInputElement>["enterKeyHint"];
  spellCheck?: boolean;
}) {
  const inputId = useId();

  return (
    <div
      data-field={fieldKey}
      className={last ? "" : "border-b border-navy/10"}
    >
      <label htmlFor={inputId} className="block px-4 pt-3 pb-2 focus-within:bg-white/35">
        <span className="block text-[12px] font-semibold text-sky">
          {label}
        </span>
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          autoCorrect="off"
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
          spellCheck={spellCheck}
          onChange={(event) => onChange(event.target.value)}
          onFocus={(event) => revealField(event.currentTarget)}
          className="mt-0.5 h-11 w-full bg-transparent text-[16px] tracking-tight text-navy outline-none placeholder:text-slate-300"
        />
      </label>
      <FieldError message={error} />
    </div>
  );
}
