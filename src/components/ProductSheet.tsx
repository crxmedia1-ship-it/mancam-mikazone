"use client";

import { useEffect, useId, useRef } from "react";
import { Download, UserRound, X } from "lucide-react";
import { PRODUCT_CATEGORIES, type Product } from "@/data/products";
import { downloadProductDatasheets } from "@/lib/datasheet-pdf";

type ProductSheetProps = {
  product: Product | null;
  onClose: () => void;
  onRegister: (product: Product) => void;
  onDownload: (product: Product) => void;
};

export function ProductSheet({
  product,
  onClose,
  onRegister,
  onDownload,
}: ProductSheetProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!product) return;
    const previous = document.activeElement;
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
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [product, onClose]);

  if (!product) return null;
  const openProduct = product;

  function handleDownload() {
    downloadProductDatasheets([openProduct]);
    onDownload(openProduct);
  }

  const specRows = [
    { label: "Dosage", value: product.recommendedDosage },
    { label: "Pack", value: product.packaging.primary },
    { label: "Appearance", value: product.specifications.appearance },
    product.specifications.viscosity
      ? { label: "Viscosity", value: product.specifications.viscosity }
      : null,
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close product details"
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]"
      >
        <div
          className="h-1 w-full"
          style={{ backgroundColor: product.accent }}
          aria-hidden="true"
        />
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {PRODUCT_CATEGORIES[product.category].label}
              <span className="mx-1.5 text-slate-300">·</span>
              {product.sku}
            </p>
            <h2
              id={titleId}
              className="mt-1.5 text-[1.35rem] font-semibold tracking-tight text-slate-900"
            >
              {product.shortName}
            </h2>
            <p className="mt-1 text-[13px] leading-5 text-slate-500">
              {product.chemicalName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          {product.packFront ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.packFront}
              alt=""
              className="mx-auto mb-5 h-40 w-auto object-contain drop-shadow-[0_16px_22px_rgba(15,23,42,0.16)]"
            />
          ) : null}

          <p className="text-[15px] leading-6 text-slate-600">{product.summary}</p>

          <dl className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            {specRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[5.5rem_1fr] gap-3 py-3"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  {row.label}
                </dt>
                <dd className="text-[13px] leading-5 font-medium text-slate-900">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Why plants specify it
            </p>
            <ul className="mt-3 space-y-2.5 text-[14px] leading-5 text-slate-700">
              {product.benefits.slice(0, 4).map((benefit) => (
                <li key={benefit} className="flex gap-3">
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: product.accent }}
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-2 border-t border-slate-200 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-4 text-sm font-bold text-slate-900"
          >
            <Download className="size-4" />
            Download datasheet
          </button>
          <button
            type="button"
            onClick={() => onRegister(openProduct)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(5,150,105,0.9)]"
          >
            <UserRound className="size-4" />
            Request a quote on this grade
          </button>
        </div>
      </div>
    </div>
  );
}
